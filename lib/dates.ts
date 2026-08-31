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
