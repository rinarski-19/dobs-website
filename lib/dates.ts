/**
 * Dates on this site describe Philippine school activity, so they are always
 * formatted in Philippine time — never in whatever zone the server happens to
 * run in. Vercel runs in UTC, so a formatter without a time zone shows a 9:00 AM
 * Mass as 1:00 AM and rolls the date over eight hours early.
 *
 * Use these helpers rather than calling Intl or toLocaleDateString directly.
 */

export const PH_TIME_ZONE = 'Asia/Manila'
const PH_LOCALE = 'en-PH'

export function formatPHDate(
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(PH_LOCALE, { ...options, timeZone: PH_TIME_ZONE }).format(new Date(value))
}

/** Today in Philippine time as YYYY-MM-DD, so the day turns over at Manila midnight. */
export function phToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat(PH_LOCALE, {
    timeZone: PH_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

/**
 * A month label such as "September 2026" from a plain year and month.
 * Built and read in UTC: the input carries no time-of-day, so anchoring it to a
 * zone could nudge it into the neighbouring month.
 */
export function formatMonthLabel(year: number, month1to12: number): string {
  return new Intl.DateTimeFormat(PH_LOCALE, { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month1to12 - 1, 1)))
}

/**
 * Birthdays are stored and compared as MM-DD, never as a full date.
 *
 * A birthday only ever needs a month and a day: the homepage shows "14
 * September" and matches on the current day. Keeping the year would mean
 * holding a complete date of birth — an identity-verification factor for every
 * member of staff — in a dataset that is readable without authentication.
 *
 * Entries written before this rule are stored as YYYY-MM-DD, so the year is
 * tolerated on the way in and dropped. Nothing writes one back.
 */
const MONTH_DAY = /^(\d{2})-(\d{2})$/
const LEGACY_FULL_DATE = /^\d{4}-(\d{2})-(\d{2})$/

export function toMonthDay(value?: string | null): string | null {
  const raw = value?.trim()
  if (!raw) return null

  const monthDay = raw.match(MONTH_DAY) ?? raw.match(LEGACY_FULL_DATE)
  if (!monthDay) return null

  const [, month, day] = monthDay
  if (Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31) return null

  return `${month}-${day}`
}

/**
 * "14 September" from an MM-DD. Formatted in UTC against a leap year, so that
 * 02-29 is a real date and no time zone can nudge the day either way — the same
 * reasoning as formatMonthLabel above.
 */
const LEAP_YEAR = 2000

export function formatMonthDay(
  value?: string | null,
  options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' },
): string {
  const monthDay = toMonthDay(value)
  if (!monthDay) return ''

  const [month, day] = monthDay.split('-').map(Number)
  return new Intl.DateTimeFormat(PH_LOCALE, { ...options, timeZone: 'UTC' })
    .format(new Date(Date.UTC(LEAP_YEAR, month - 1, day)))
}
