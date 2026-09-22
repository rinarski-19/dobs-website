import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/siteUrl'

/**
 * Keeps the Studio out of search results. It is an authenticated admin surface
 * and has no business appearing in a search for the diocese, quite apart from
 * not wanting to advertise where the CMS lives.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
