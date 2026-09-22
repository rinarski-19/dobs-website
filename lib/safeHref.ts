/**
 * Link targets that reach an href from the CMS are checked here first.
 *
 * React and next/link both pass an href straight through to the DOM, so a value
 * such as `javascript:…` stored on a document would run when a visitor clicks
 * it. Editors are trusted to write copy, not to supply arbitrary URL schemes, so
 * anything outside the list below is treated as not-a-link and the label is
 * rendered as plain text instead — nothing disappears, it just stops being
 * clickable.
 */

const SAFE_SCHEME = /^(https?:|mailto:|tel:)/i

export function safeHref(value?: string | null): string | undefined {
  // Browsers treat a backslash as a forward slash in the authority position, so
  // `/\example.com` and `\\example.com` both resolve to `//example.com` and leave
  // the site. Folding them first means the protocol-relative check below sees
  // every spelling of the same thing.
  const href = value?.trim().replace(/\\/g, '/')
  if (!href) return undefined

  // Protocol-relative (//example.com) silently leaves the site.
  if (href.startsWith('//')) return undefined

  // Site-relative paths, anchors and query strings.
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) return href

  // No colon at all means it cannot carry a scheme, so it is a relative path.
  if (!href.includes(':')) return href

  return SAFE_SCHEME.test(href) ? href : undefined
}
