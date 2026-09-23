/**
 * Rewrites the abbreviation DOBS to DOB-S in CMS content.
 *
 * The strings in the repo are literals and were changed with the code. These
 * are different: they live in documents an editor has already saved, and the
 * schema's initialValue only ever applies to a document being created, so
 * existing ones keep whatever was stored.
 *
 * Setup:
 *   1. https://sanity.io/manage/project/3tjt9t85 -> API -> Tokens
 *   2. Create a token with "Editor" permissions
 *
 * Usage:
 *   node scripts/rename-dobs.mjs                   # dry run, no token needed
 *   SANITY_TOKEN=xxx node scripts/rename-dobs.mjs --apply
 *
 * Only whole-word DOBS is matched, and only in plain string fields at the top
 * level of a document. Anything nested — inside an array, a Portable Text block
 * or an object — is reported for a human to change in Studio rather than
 * rewritten from here, because editing rich text blind is how formatting gets
 * quietly destroyed.
 */

import { createClient } from '@sanity/client'

const APPLY = process.argv.slice(2).includes('--apply')

const PROJECT_ID = '3tjt9t85'
const DATASET = 'production'
const FROM = /\bDOBS\b/g
const TO = 'DOB-S'

function fail(message) {
  console.error(`\n${message}\n`)
  process.exit(1)
}

if (APPLY && !process.env.SANITY_TOKEN) {
  fail('SANITY_TOKEN is not set. See the notes at the top of this file.\nWithout --apply this script only reads, and needs no token.')
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const docs = await client.fetch('*[!(_id in path("drafts.**"))]')

const edits = []
const byHand = []

/** Walks past the top level only to report what it finds, never to rewrite it. */
function findNested(value, path, doc) {
  if (typeof value === 'string') {
    if (FROM.test(value)) byHand.push({ doc, path, value })
    FROM.lastIndex = 0
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => findNested(item, `${path}[${i}]`, doc))
  } else if (value && typeof value === 'object') {
    for (const [key, inner] of Object.entries(value)) {
      if (!key.startsWith('_')) findNested(inner, `${path}.${key}`, doc)
    }
  }
}

for (const doc of docs) {
  for (const [field, value] of Object.entries(doc)) {
    if (field.startsWith('_')) continue

    if (typeof value === 'string') {
      FROM.lastIndex = 0
      if (FROM.test(value)) {
        FROM.lastIndex = 0
        edits.push({ id: doc._id, type: doc._type, field, before: value, after: value.replace(FROM, TO) })
      }
      FROM.lastIndex = 0
    } else {
      findNested(value, field, `${doc._type} (${doc._id})`)
    }
  }
}

if (!edits.length && !byHand.length) {
  console.log('\nNo DOBS left in the CMS. Nothing to do.\n')
  process.exit(0)
}

if (edits.length) {
  console.log(`\n${edits.length} field${edits.length === 1 ? '' : 's'} to change:\n`)
  for (const e of edits) {
    console.log(`  ${e.type}.${e.field}`)
    console.log(`    -  ${e.before}`)
    console.log(`    +  ${e.after}`)
  }
  console.log('')
}

if (byHand.length) {
  console.log(`Nested — change these in Studio by hand (${byHand.length}):\n`)
  for (const b of byHand) console.log(`  ${b.doc}  ${b.path}\n    ${b.value.slice(0, 100)}`)
  console.log('')
}

if (!edits.length) process.exit(0)

if (!APPLY) {
  console.log('Dry run — nothing was written. Re-run with --apply to change them.\n')
  process.exit(0)
}

// Grouped per document so each one takes a single patch rather than one per field.
const byDoc = new Map()
for (const e of edits) {
  if (!byDoc.has(e.id)) byDoc.set(e.id, {})
  byDoc.get(e.id)[e.field] = e.after
}

let changed = 0
for (const [id, fields] of byDoc) {
  try {
    await client.patch(id).set(fields).commit()
    console.log(`  patched  ${id}  (${Object.keys(fields).join(', ')})`)
    changed += 1
  } catch (error) {
    console.log(`  FAILED   ${id} — ${error.message}`)
  }
}

console.log(`\nUpdated ${changed} document${changed === 1 ? '' : 's'}.\n`)
