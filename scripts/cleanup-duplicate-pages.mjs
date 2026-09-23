/**
 * Removes the stale twin of each single-page document.
 *
 * Every page type ended up with two documents: the one the sidebar opens and
 * the site reads by id (see lib/singletons.ts), and a copy named after the type.
 * Nothing reads the copy — it is left over from before Studio stopped offering
 * "create" for these types — but it sits in the dataset looking authoritative,
 * and an editor who finds it will make changes that never reach the site.
 *
 * Setup:
 *   1. https://sanity.io/manage/project/3tjt9t85 -> API -> Tokens
 *   2. Create a token with "Editor" permissions
 *
 * Usage:
 *   node scripts/cleanup-duplicate-pages.mjs                   # dry run, no token needed
 *   SANITY_TOKEN=xxx node scripts/cleanup-duplicate-pages.mjs --apply
 *   SANITY_TOKEN=xxx node scripts/cleanup-duplicate-pages.mjs --apply --force
 *
 * A twin holding more content than the keeper is refused rather than deleted:
 * that is the shape of someone having edited the wrong document, and the edits
 * are worth more than the tidiness. --force overrides, and prints what is being
 * discarded. Nothing is ever deleted while another document still refers to it.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const FORCE = args.includes('--force')

const PROJECT_ID = '3tjt9t85'
const DATASET = 'production'

function fail(message) {
  console.error(`\n${message}\n`)
  process.exit(1)
}

if (APPLY && !process.env.SANITY_TOKEN) {
  fail('SANITY_TOKEN is not set. See the notes at the top of this file.\nWithout --apply this script only reads, and needs no token.')
}

// Read the ids straight out of lib/singletons.ts rather than repeating them, so
// this cannot drift from what the website actually reads.
const source = readFileSync(new URL('../lib/singletons.ts', import.meta.url), 'utf8')
const block = source.match(/SINGLETON_IDS:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\}/)
if (!block) fail('Could not read SINGLETON_IDS out of lib/singletons.ts.')

const KEEPER_ID = {}
for (const [, type, id] of block[1].matchAll(/(\w+):\s*'([^']+)'/g)) KEEPER_ID[type] = id

const types = Object.keys(KEEPER_ID)
if (!types.length) fail('No singleton ids found in lib/singletons.ts.')

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const docs = await client.fetch(`*[_type in $types]`, { types })

/** Fields an editor filled in, ignoring the bookkeeping Sanity adds itself. */
const contentKeys = doc => Object.keys(doc).filter(k => !k.startsWith('_'))

/** Rough measure of how much is actually in a document, for the safety check. */
const weight = doc => JSON.stringify(Object.fromEntries(contentKeys(doc).map(k => [k, doc[k]]))).length

const plan = []
const problems = []

for (const type of types) {
  const ofType = docs.filter(d => d._type === type)
  const keeper = ofType.find(d => d._id === KEEPER_ID[type])
  const twins = ofType.filter(d => d._id !== KEEPER_ID[type])

  if (!keeper) {
    if (ofType.length) problems.push(`${type}: the document the site reads (${KEEPER_ID[type]}) does not exist, but ${ofType.length} other(s) of this type do. Left alone.`)
    continue
  }
  for (const twin of twins) plan.push({ type, keeper, twin })
}

if (problems.length) {
  console.log('\nNeeds a look by hand:')
  for (const p of problems) console.log(`  ${p}`)
}

if (!plan.length) {
  console.log('\nNo duplicate page documents. Nothing to do.\n')
  process.exit(0)
}

console.log(`\n${plan.length} duplicate page document${plan.length === 1 ? '' : 's'}:\n`)

const richer = []
for (const { type, keeper, twin } of plan) {
  const keeperWeight = weight(keeper)
  const twinWeight = weight(twin)
  const twinIsRicher = twinWeight > keeperWeight

  console.log(`  ${type}`)
  console.log(`    keep    ${keeper._id}`)
  console.log(`            ${contentKeys(keeper).length} fields, ${keeperWeight} bytes, updated ${keeper._updatedAt}`)
  console.log(`    delete  ${twin._id}`)
  console.log(`            ${contentKeys(twin).length} fields, ${twinWeight} bytes, updated ${twin._updatedAt}`)
  if (twinIsRicher) {
    console.log(`    ^^ the copy holds MORE than the one the site reads — someone may have edited the wrong document`)
    richer.push({ type, twin, keeper })
  }
  console.log('')
}

// Nothing may be deleted while another document still points at it.
const ids = plan.map(p => p.twin._id)
const referenced = await client.fetch(
  `*[references($ids) && !(_id in $ids)]{_id, _type}`,
  { ids },
)
if (referenced.length) {
  console.log('Referenced by other documents, so they cannot be deleted until those are repointed:')
  for (const r of referenced) console.log(`  ${r._type}  ${r._id}`)
  console.log('')
}

if (richer.length && !FORCE) {
  console.log(`Refusing to delete: ${richer.length} cop${richer.length === 1 ? 'y holds' : 'ies hold'} more content than the document the site reads.`)
  console.log('Open both in Studio and move anything worth keeping across first, or re-run with --force to delete anyway.\n')
  process.exit(1)
}

if (!APPLY) {
  console.log('Dry run — nothing was written. Re-run with --apply to delete the copies.\n')
  process.exit(0)
}

let deleted = 0
for (const { type, twin } of plan) {
  try {
    await client.delete(twin._id)
    console.log(`  deleted  ${twin._id}  (${type})`)
    deleted += 1
  } catch (error) {
    console.log(`  FAILED   ${twin._id}  (${type}) — ${error.message}`)
  }
}

console.log(`\nDeleted ${deleted} of ${plan.length}.\n`)
