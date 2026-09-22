/**
 * Rewrites stored celebrant birthdays from YYYY-MM-DD to MM-DD.
 *
 * Birthdays used to be stored as a full date. The homepage only ever needed the
 * month and day, and a complete date of birth for every member of staff sat in
 * a dataset that is readable without authentication, so the year was dropped —
 * see toMonthDay in lib/dates.ts.
 *
 * The site reads both spellings, so it keeps working either way. Studio does
 * not: the field now validates as mm-dd, so every row still holding a year
 * shows as invalid until this has run.
 *
 * Setup:
 *   1. https://sanity.io/manage/project/3tjt9t85 -> API -> Tokens
 *   2. Create a token with "Editor" permissions
 *
 * Usage:
 *   node scripts/fix-celebrant-birthdays.mjs                  # dry run, no token needed
 *   SANITY_TOKEN=xxx node scripts/fix-celebrant-birthdays.mjs --apply
 *   SANITY_TOKEN=xxx node scripts/fix-celebrant-birthdays.mjs --apply --clear
 *
 * --clear empties the list instead of converting it, for when the rows are only
 * placeholders. The homepage falls back to sample entries until a real list is
 * imported.
 */

import { createClient } from '@sanity/client'

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const CLEAR = args.includes('--clear')

const PROJECT_ID = '3tjt9t85'
const DATASET = 'production'
const HOME_PAGE_ID = 'c5eaa530-f8a9-4378-b919-68fb1dfb773b'

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

/** Same rule as toMonthDay in lib/dates.ts, which this file cannot import. */
const MONTH_DAY = /^(\d{2})-(\d{2})$/
const LEGACY_FULL_DATE = /^\d{4}-(\d{2})-(\d{2})$/

function toMonthDay(value) {
  const raw = value?.trim()
  if (!raw) return null

  const parts = raw.match(MONTH_DAY) ?? raw.match(LEGACY_FULL_DATE)
  if (!parts) return null

  const [, month, day] = parts
  if (Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31) return null

  return `${month}-${day}`
}

const celebrants = await client.fetch(
  `*[_id == $id][0].birthdayCelebrants[]{_key, name, birthday}`,
  { id: HOME_PAGE_ID },
)

if (!celebrants?.length) {
  console.log('\nThe Home Page has no birthday celebrants. Nothing to do.\n')
  process.exit(0)
}

if (CLEAR) {
  console.log(`\nWould remove all ${celebrants.length} celebrant${celebrants.length === 1 ? '' : 's'}:\n`)
  for (const c of celebrants) console.log(`  ${c.birthday ?? '(none)'}  ${c.name}`)

  if (!APPLY) {
    console.log('\nDry run — nothing was written. Re-run with --apply to clear the list.\n')
    process.exit(0)
  }

  await client.patch(HOME_PAGE_ID).set({ birthdayCelebrants: [] }).commit()
  console.log('\nCleared. The homepage will show sample entries until a real list is imported.\n')
  process.exit(0)
}

const changes = []
const unchanged = []
const problems = []

for (const c of celebrants) {
  const monthDay = toMonthDay(c.birthday)
  if (!monthDay) problems.push(c)
  else if (monthDay === c.birthday) unchanged.push(c)
  else changes.push({ ...c, monthDay })
}

console.log(`\n${celebrants.length} celebrant${celebrants.length === 1 ? '' : 's'} on the Home Page.\n`)

if (changes.length) {
  console.log(`To convert (${changes.length}):`)
  for (const c of changes) console.log(`  ${c.birthday}  ->  ${c.monthDay}   ${c.name}`)
  console.log('')
}

if (unchanged.length) {
  console.log(`Already month-and-day only (${unchanged.length}):`)
  for (const c of unchanged) console.log(`  ${c.birthday}       ${c.name}`)
  console.log('')
}

if (problems.length) {
  console.log(`Cannot read these — fix them in Studio by hand (${problems.length}):`)
  for (const c of problems) console.log(`  ${c.birthday ?? '(empty)'}  ${c.name}`)
  console.log('')
}

if (!changes.length) {
  console.log('Nothing to convert.\n')
  process.exit(0)
}

if (!APPLY) {
  console.log('Dry run — nothing was written. Re-run with --apply to convert.\n')
  process.exit(0)
}

// One patch for the whole list: each row is addressed by its own _key, so a row
// added between the read above and this write is left alone rather than being
// overwritten by a stale copy of the array.
let patch = client.patch(HOME_PAGE_ID)
for (const c of changes) {
  patch = patch.set({ [`birthdayCelebrants[_key=="${c._key}"].birthday`]: c.monthDay })
}
await patch.commit()

console.log(`Converted ${changes.length} birthday${changes.length === 1 ? '' : 's'}. No birth year remains in the dataset.\n`)
