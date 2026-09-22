import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/siteUrl'
import { fetchSanity } from '@/lib/sanity'
import { getSchools } from '@/lib/schools'

// Content changes through the CMS rather than through a deploy, so the sitemap
// is rebuilt hourly instead of being frozen at build time.
export const revalidate = 3600

type SlugRow = { slug: string; updatedAt?: string }

/**
 * Every page a visitor can reach, plus one entry per school, news post and
 * event. The Studio is left out deliberately — see app/robots.ts.
 *
 * A Sanity outage must not take the sitemap down with it: fetchSanity returns
 * null rather than throwing, and the fixed pages below are listed regardless.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixedPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/schools'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/programs'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/enrollment'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/news'), changeFrequency: 'daily', priority: 0.7 },
    { url: absoluteUrl('/events'), changeFrequency: 'daily', priority: 0.7 },
    { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const [schools, posts, events] = await Promise.all([
    getSchools().catch(() => []),
    fetchSanity<SlugRow[]>(
      `*[_type == "newsPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]{
        "slug": slug.current, "updatedAt": _updatedAt
      }`,
    ),
    fetchSanity<SlugRow[]>(
      `*[_type == "event" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`,
    ),
  ])

  const entries = (rows: SlugRow[] | null, prefix: string, priority: number): MetadataRoute.Sitemap =>
    (rows ?? []).map(({ slug, updatedAt }) => ({
      url: absoluteUrl(`${prefix}/${slug}`),
      lastModified: updatedAt ? new Date(updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority,
    }))

  return [
    ...fixedPages,
    ...schools.map(school => ({
      url: absoluteUrl(`/schools/${school.slug.current}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...entries(posts, '/news', 0.6),
    ...entries(events, '/events', 0.6),
  ]
}
