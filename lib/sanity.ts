import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import { SINGLETON_IDS } from './singletons'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '3tjt9t85',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

// Keep WebP compression efficient without introducing visible softness in photos.
const WEBP_QUALITY = 90

export function urlFor(source: any) {
  return builder.image(source).format('webp').quality(WEBP_QUALITY)
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number | boolean> = {},
): Promise<T | null> {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await client.fetch<T>(query, params, { cache: 'no-store' })
    } catch (error) {
      lastError = error
    }
  }

  console.warn('Unable to load content from Sanity after retrying:', lastError)
  return null
}

/**
 * Reads a single-page document by its id — the same document Studio edits.
 *
 * The dataset holds a stale twin of every page type, so ordering by _updatedAt
 * would sometimes return the wrong one and silently ignore an editor's change.
 * The type query remains only as a fallback for a type with no id registered.
 */
export async function getPageContent<T>(pageType: string): Promise<T | null> {
  const id = SINGLETON_IDS[pageType]

  if (id) {
    const byId = await fetchSanity<T>(`*[_id == $id][0]`, { id })
    if (byId) return byId
  }

  return fetchSanity<T>(
    `*[_type == $pageType] | order(_updatedAt desc)[0]`,
    { pageType },
  )
}

export function imageUrlFor(source: any, width = 1800, height = 900): string | undefined {
  if (!source) return undefined
  return urlFor(source).width(width).height(height).fit('crop').url()
}

export type SiteSettings = {
  officeCtaLabel?: string
}

export type FooterContent = {
  organisationName?: string
  tagline?: string
  quickLinksHeading?: string
  quickLinks?: { _key?: string; label: string; href: string }[]
  contactHeading?: string
  copyrightText?: string
}

export type FooterContact = {
  officeAddress?: string
  email?: string
  phone?: string
}

/**
 * Wording shared across pages. Returns null on failure so callers keep their own
 * defaults. Cached for a minute rather than fetched no-store: the footer renders
 * on every route including the static 404, and a no-store fetch there forces the
 * whole page to be dynamic.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch<SiteSettings>(
      `*[_id == "siteSettings"][0]{ officeCtaLabel }`,
      {},
      { next: { revalidate: 60 } },
    )
  } catch (error) {
    console.warn('Unable to load site settings from Sanity:', error)
    return null
  }
}

/**
 * Footer content, plus the office details it shows. Those come from the Contact
 * Page document rather than being stored twice, so the address, email and phone
 * cannot drift apart between the footer and the contact page.
 *
 * Cached for a minute rather than fetched no-store: the footer renders on every
 * route including the static 404, which a no-store fetch would force to be dynamic.
 */
export async function getFooter(): Promise<{ footer: FooterContent | null; contact: FooterContact | null }> {
  try {
    const [footer, contact] = await Promise.all([
      client.fetch<FooterContent>(
        `*[_id == "footer"][0]{ organisationName, tagline, quickLinksHeading, quickLinks, contactHeading, copyrightText }`,
        {},
        { next: { revalidate: 60 } },
      ),
      client.fetch<FooterContact>(
        `*[_id == $id][0]{ officeAddress, email, phone }`,
        { id: SINGLETON_IDS.contactPage },
        { next: { revalidate: 60 } },
      ),
    ])
    return { footer, contact }
  } catch (error) {
    console.warn('Unable to load footer content from Sanity:', error)
    return { footer: null, contact: null }
  }
}
