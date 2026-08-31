/**
 * Reading a birthday-celebrant list out of a CSV file.
 *
 * The same rules are implemented in scripts/import-celebrants.mjs for the
 * command-line importer; that script is plain Node and cannot import this
 * TypeScript module, so the two are deliberately kept in step by hand.
 */

export type CelebrantRow = {
  _key: string
  _type: 'object'
  name: string
  birthday: string
  role?: string
  school?: string
  greeting?: string
  photoUrl?: string
}

export type ParseResult =
  | { ok: true; celebrants: CelebrantRow[] }
  | { ok: false; error: string }

/** Handles quoted fields, commas and newlines inside quotes, and "" escapes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
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

    if (char === '"') quoted = true
    else if (char === ',') { row.push(field); field = '' }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (char !== '\r') field += char
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }

  return rows.filter(r => r.some(cell => cell.trim() !== ''))
}

const ISO = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
const US = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
const MONTH_DAY = /^(\d{1,2})[-/](\d{1,2})$/

const pad = (n: string | number) => String(n).padStart(2, '0')

/** The page shows only day and month, so a year left off is filled with this one. */
export function normaliseDate(value: string): string | null {
  const raw = value.trim()

  let m = raw.match(ISO)
  if (m) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`

  m = raw.match(US)
  if (m) return `${m[3]}-${pad(m[1])}-${pad(m[2])}`

  m = raw.match(MONTH_DAY)
  if (m) return `${new Date().getFullYear()}-${pad(m[1])}-${pad(m[2])}`

  return null
}

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'celebrant'

export function celebrantsFromCsv(text: string): ParseResult {
  const rows = parseCsv(text)
  if (rows.length < 2) return { ok: false, error: 'The file needs a header row and at least one celebrant.' }

  const headers = rows[0].map(h => h.trim().toLowerCase())
  const missing = ['name', 'birthday'].filter(h => !headers.includes(h))
  if (missing.length) {
    return { ok: false, error: `Missing column${missing.length > 1 ? 's' : ''}: ${missing.join(' and ')}. Found: ${headers.join(', ')}.` }
  }

  const at = (name: string) => headers.indexOf(name)
  const celebrants: CelebrantRow[] = []

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i]
    const rowNumber = i + 1
    const get = (name: string) => (at(name) === -1 ? '' : (row[at(name)] ?? '').trim())

    const name = get('name')
    if (!name) return { ok: false, error: `Row ${rowNumber}: the name is empty.` }

    const birthday = normaliseDate(get('birthday'))
    if (!birthday) {
      return { ok: false, error: `Row ${rowNumber}: "${get('birthday')}" is not a date I recognise. Use 2026-09-14, or 09/14/2026, or 09-14.` }
    }

    const entry: CelebrantRow = {
      _key: `${slug(name)}-${Date.now().toString(36)}-${i}`,
      _type: 'object',
      name,
      birthday,
    }
    const role = get('role'); if (role) entry.role = role
    const school = get('school'); if (school) entry.school = school
    const greeting = get('greeting'); if (greeting) entry.greeting = greeting
    const photo = get('photo'); if (photo) entry.photoUrl = photo

    celebrants.push(entry)
  }

  return { ok: true, celebrants }
}
