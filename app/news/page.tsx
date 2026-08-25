import Hero from '@/components/Hero'
import { client, getPageContent, imageUrlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, School, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

type NewsPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  emptyStateText?: string
}

const fallbackPageContent = {
  heroTitle: 'News & Announcements',
  heroSubtitle: 'Latest Updates',
  heroDescription: 'Stay updated with news, announcements, and stories from across the Diocese of Baguio Schools network.',
  emptyStateText: 'News posts will be pulled from Sanity CMS.',
}

type NewsPost = {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  publishedAt?: string
  school: string
  image?: string
  isDemo?: boolean
}

const demoNewsPosts: NewsPost[] = Array.from({ length: 6 }, (_, index) => ({
  id: `demo-news-${index + 1}`,
  title: `News Post Title ${index + 1}`,
  slug: '',
  category: ['Announcements', 'Achievements', 'Campus Life', 'Pastoral Activities', 'Enrollment'][index % 5],
  excerpt: 'Add a short two- or three-line summary explaining the announcement, school story, achievement, or important update.',
  publishedAt: '2026-08-01T08:00:00+08:00',
  school: index % 2 === 0 ? 'Diocese of Baguio Schools' : '[ Publishing School Name ]',
  isDemo: true,
}))

async function getNewsPosts(): Promise<NewsPost[]> {
  try {
    const posts = await client.fetch<Array<{
      _id: string
      title: string
      slug: { current: string }
      category?: string
      excerpt?: string
      publishedAt?: string
      schoolName?: string
      featuredImage?: any
    }>>(`
      *[_type == "newsPost" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        category,
        excerpt,
        publishedAt,
        "schoolName": school->name,
        featuredImage
      }
    `, {}, { cache: 'no-store' })

    return posts.map(post => ({
      id: post._id,
      title: post.title,
      slug: post.slug.current,
      category: post.category || 'General',
      excerpt: post.excerpt || 'Read the latest update from the Diocese of Baguio Schools community.',
      publishedAt: post.publishedAt,
      school: post.schoolName || 'Diocese of Baguio Schools',
      image: imageUrlFor(post.featuredImage, 1200, 675),
    }))
  } catch (error) {
    console.warn('Unable to load News page posts from Sanity:', error)
    return []
  }
}

const newsCategories = [
  { label: 'All News', value: 'all' },
  { label: 'Announcements', value: 'announcements' },
  { label: 'Achievements', value: 'achievements' },
  { label: 'Campus Life', value: 'campus-life' },
  { label: 'Pastoral Activities', value: 'pastoral-activities' },
  { label: 'Enrollment', value: 'enrollment' },
]

const normalizeCategory = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; query?: string }>
}) {
  const content = await getPageContent<NewsPageContent>('newsPage')
  const posts = await getNewsPosts()
  const displayPosts = posts.length > 0 ? posts : demoNewsPosts
  const resolvedSearchParams = await searchParams
  const selectedCategory = resolvedSearchParams?.category || 'all'
  const searchQuery = resolvedSearchParams?.query?.trim() || ''
  const categoryPosts = selectedCategory === 'all'
    ? displayPosts
    : displayPosts.filter(post => normalizeCategory(post.category) === selectedCategory)
  const normalizedSearchQuery = searchQuery.toLowerCase()
  const filteredPosts = normalizedSearchQuery
    ? categoryPosts.filter(post => [post.title, post.excerpt, post.school, post.category]
        .some(value => value.toLowerCase().includes(normalizedSearchQuery)))
    : categoryPosts

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackPageContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackPageContent.heroSubtitle}
        description={content?.heroDescription || fallbackPageContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
        imagePlaceholder="School Events Photo"
      />

      <div className="page-wrapper">

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Filter news by category" className="flex flex-wrap gap-3">
            {newsCategories.map(category => {
              const isActive = selectedCategory === category.value
              const categoryParams = new URLSearchParams()
              if (category.value !== 'all') categoryParams.set('category', category.value)
              if (searchQuery) categoryParams.set('query', searchQuery)
              const categoryHref = categoryParams.size ? `/news?${categoryParams.toString()}#news-articles` : '/news#news-articles'

              return (
                <Link
                  key={category.value}
                  href={categoryHref}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'border-primary-700 bg-primary-700 text-white shadow-sm'
                      : 'border-primary-600 bg-white text-primary-700 hover:border-primary-800 hover:bg-primary-50 hover:text-primary-900'
                  }`}
                >
                  {category.label}
                </Link>
              )
            })}
          </nav>

          <form action="/news" method="get" role="search" className="w-full lg:max-w-sm">
            {selectedCategory !== 'all' && <input type="hidden" name="category" value={selectedCategory} />}
            <label htmlFor="news-search" className="sr-only">Search news and announcements</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" size={20} aria-hidden="true" />
              <input
                id="news-search"
                name="query"
                type="search"
                defaultValue={searchQuery}
                placeholder="Search news and announcements"
                className="min-h-12 w-full rounded-full border-2 border-primary-300 bg-white py-3 pl-12 pr-5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-500 hover:border-primary-500 focus:border-primary-700 focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </form>
        </div>

        <div id="news-articles" className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <Link
                key={post.id}
                href={post.slug ? `/news/${post.slug}` : '#news-articles'}
                aria-label={post.isDemo ? `Sample layout for ${post.title}` : `Read ${post.title}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-dashed border-parchment-300 bg-parchment-100">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col pt-5">
                  <span className="mb-3 inline-flex w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                    {post.category}
                  </span>
                  <h3 className="font-sans text-2xl font-bold leading-[1.35] text-gray-900 md:text-[1.7rem]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>

                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                    <p className="flex items-center gap-2">
                      <School className="shrink-0 text-primary-600" size={15} aria-hidden="true" />
                      <span>{post.school}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="shrink-0 text-primary-600" size={15} aria-hidden="true" />
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Publication date to be announced'}
                      </span>
                    </p>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors group-hover:text-primary-500">
                    Read More <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        {filteredPosts.length === 0 && (
          <div className="rounded-2xl border border-primary-200 bg-primary-50 px-6 py-12 text-center text-primary-900">
            {searchQuery
              ? `No news posts match “${searchQuery}”.`
              : 'No news posts are currently available in this category.'}
          </div>
        )}

        {posts.length === 0 && (
          <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50 px-5 py-4 text-center text-sm leading-6 text-primary-800">
            These are sample cards showing the information to add in Sanity. Published News Posts will replace them automatically.
          </div>
        )}

      </div>
    </>
  )
}
