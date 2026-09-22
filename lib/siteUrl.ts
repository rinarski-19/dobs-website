/**
 * The site's own public address, for the places that need an absolute URL:
 * robots.txt, the sitemap, and the metadataBase that turns relative Open Graph
 * image paths into absolute ones.
 *
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the production domain on every
 * deployment, including preview builds, so a preview still points search
 * engines and social cards at production rather than at its own throwaway URL.
 * Set NEXT_PUBLIC_SITE_URL once a custom domain replaces the vercel.app one.
 */
const FALLBACK = 'https://dobs-website.vercel.app'

function resolve(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/+$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`

  return FALLBACK
}

export const SITE_URL = resolve()

/** An absolute URL for a site-relative path, with exactly one slash between. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}/${path.replace(/^\/+/, '')}`.replace(/\/$/, '') || SITE_URL
}
