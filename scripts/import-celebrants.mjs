/**
 * Imports birthday celebrants from a CSV file into the Home Page document,
 * so the list does not have to be typed into Studio one entry at a time.
 *
 * Setup:
 *   1. https://sanity.io/manage/project/3tjt9t85 -> API -> Tokens
 *   2. Create a token with "Editor" permissions
 *
 * Usage:
 *   SANITY_TOKEN=xxx node scripts/import-celebrants.mjs celebrants.csv --dry-run
 *   SANITY_TOKEN=xxx node scripts/import-celebrants.mjs celebrants.csv            # adds to the list
 *   SANITY_TOKEN=xxx node scripts/import-celebrants.mjs celebrants.csv --replace  # clears the list first
 *
 * CSV columns (header row required, order does not matter, case-insensitive):
 *   name      required — the celebrant's name
 *   birthday  required — 2026-09-14, or 09/14/2026, or 09-14 (day and month alone)
 *   role      optional — e.g. Teacher, School Head
 *   school    optional
 *   greeting  optional
 *   photo     optional — a file on this computer, or an https:// address
 *
 * See scripts/celebrants-template.csv for a starting point.
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { basename, extname } from 'node:path'

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const REPLACE = args.includes('--replace')
const csvPath = args.find(a => !a.startsWith('--'))

const HOME_PAGE_ID = 'c5eaa530-f8a9-4378-b919-68fb1dfb773b'

function fail(message) {
  console.error(`\n${message}\n`)
  process.exit(1)
}

if (!csvPath) fail('Give the CSV file to import, e.g.\n  node scripts/import-celebrants.mjs celebrants.csv --dry-run')
if (!existsSync(csvPath)) fail(`Cannot find the file: ${csvPath}`)
if (!process.env.SANITY_TOKEN && !DRY_RUN) fail('SANITY_TOKEN is not set. See the notes at the top of this file.')

const client = createClient({
  projectId: '3tjt9t85',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

/** Minimal CSV reader: handles quoted fields, commas and newlines inside quotes, and "" escapes. */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1 }
        else quoted = false
      } else field += char
      continue
    }

    if (char === '"') { quoted = true }
    else if (char === ',') { row.push(field); field = '' }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (char !== '\r') { field += char }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }

  return rows.filter(r => r.some(cell => cell.trim() !== ''))
}

const MONTH_DAY = /^(\d{1,2})[-/](\d{1,2})$/
const ISO = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
const US = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/

/** The site shows only the day and month, but the field is a date, so a missing year is filled in. */
function normaliseDate(value, rowNumber) {
  const raw = value.trim()
  const pad = n => String(n).padStart(2, '0')

  let m = raw.match(ISO)
  if (m) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`

  m = raw.match(US)
  if (m) return `${m[3]}-${pad(m[1])}-${pad(m[2])}`

  m = raw.match(MONTH_DAY)
  if (m) return `${new Date().getFullYear()}-${pad(m[1])}-${pad(m[2])}`

  fail(`Row ${rowNumber}: "${raw}" is not a date I recognise.\nUse 2026-09-14, or 09/14/2026, or 09-14.`)
}

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' }

async function uploadPhoto(source, rowNumber) {
  let buffer
  let filename

  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source)
    if (!response.ok) fail(`Row ${rowNumber}: could not download the photo (${response.status}) — ${source}`)
    buffer = Buffer.from(await response.arrayBuffer())
    filename = basename(new URL(source).pathname) || 'photo.jpg'
  } else {
    if (!existsSync(source)) fail(`Row ${rowNumber}: cannot find the photo file — ${source}`)
    buffer = readFileSync(source)
    filename = basename(source)
  }

  const contentType = MIME[extname(filename).toLowerCase()]
  if (!contentType) fail(`Row ${rowNumber}: "${filename}" is not a supported image (use jpg, png, webp or gif).`)

  const asset = await client.assets.upload('image', buffer, { filename, contentType })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'celebrant'

async function run() {
  const rows = parseCsv(readFileSync(csvPath, 'utf8'))
  if (rows.length < 2) fail('The CSV needs a header row and at least one celebrant.')

  const headers = rows[0].map(h => h.trim().toLowerCase())

  // Spreadsheets come back with whatever the person typed, so the common
  // variants are accepted. Kept in step with lib/celebrantsCsv.ts.
  const COLUMN_ALIASES = {
    name: ['name', 'full name', 'fullname', 'celebrant', 'celebrant name', 'employee', 'employee name'],
    birthday: ['birthday', 'birthdays', 'birthdate', 'birth date', 'date of birth', 'dob', 'bday', 'date'],
    role: ['role', 'roles', 'position', 'designation', 'title', 'job title'],
    school: ['school', 'schools', 'campus', 'station', 'assignment'],
    greeting: ['greeting', 'greetings', 'message', 'messages', 'note', 'remarks'],
    photo: ['photo', 'photos', 'photo url', 'image', 'image url', 'picture'],
  }

  const columnOf = {}
  const claimed = new Set()
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const index = headers.findIndex((h, i) => !claimed.has(i) && aliases.includes(h))
    if (index !== -1) { columnOf[field] = index; claimed.add(index) }
  }

  const missing = ['name', 'birthday'].filter(f => columnOf[f] === undefined)
  if (missing.length) fail(`The CSV is missing these columns: ${missing.join(', ')}\nFound: ${headers.join(', ')}`)

  const ignored = headers.filter((h, i) => !claimed.has(i) && h !== '')
  if (ignored.length) console.log(`\nIgnoring unrecognised column${ignored.length > 1 ? 's' : ''}: ${ignored.join(', ')}`)

  const at = name => (columnOf[name] === undefined ? -1 : columnOf[name])
  const entries = []

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i]
    const rowNumber = i + 1
    const get = name => (at(name) === -1 ? '' : (row[at(name)] ?? '').trim())

    const name = get('name')
    if (!name) fail(`Row ${rowNumber}: the name is empty.`)

    const entry = {
      _key: `${slug(name)}-${i}`,
      _type: 'object',
      name,
      birthday: normaliseDate(get('birthday'), rowNumber),
    }
    for (const field of ['role', 'school', 'greeting']) {
      const value = get(field)
      if (value) entry[field] = value
    }

    const photo = get('photo')
    if (photo) {
      if (DRY_RUN) console.log(`  row ${rowNumber}: would upload photo ${photo}`)
      else entry.photo = await uploadPhoto(photo, rowNumber)
    }

    entries.push(entry)
  }

  console.log(`\nRead ${entries.length} celebrant${entries.length === 1 ? '' : 's'} from ${csvPath}:`)
  for (const e of entries) {
    const extra = [e.role, e.school].filter(Boolean).join(', ')
    console.log(`  ${e.birthday}  ${e.name}${extra ? `  (${extra})` : ''}${e.photo ? '  [photo]' : ''}`)
  }

  const existing = await client.fetch('*[_id == $id][0].birthdayCelebrants', { id: HOME_PAGE_ID })
  const currentCount = Array.isArray(existing) ? existing.length : 0

  console.log(
    REPLACE
      ? `\nThis will REPLACE the ${currentCount} celebrant${currentCount === 1 ? '' : 's'} currently on the Home Page.`
      : `\nThis will ADD to the ${currentCount} celebrant${currentCount === 1 ? '' : 's'} already on the Home Page (${currentCount + entries.length} in total).`,
  )

  if (DRY_RUN) { console.log('\nDry run — nothing was written.\n'); return }

  if (REPLACE) {
    await client.patch(HOME_PAGE_ID).set({ birthdayCelebrants: entries }).commit()
  } else {
    await client.patch(HOME_PAGE_ID).setIfMissing({ birthdayCelebrants: [] }).append('birthdayCelebrants', entries).commit()
  }

  console.log('\nDone. Open Studio to review, then check the homepage.\n')
}

run().catch(error => fail(`Failed: ${error.message}`))
