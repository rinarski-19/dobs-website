import Hero from '@/components/Hero'
import { client, getPageContent, imageUrlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, School, Search } from 'lucide-react'

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
  emptyStateText: 'No news articles are currently available.',
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

const demoNewsPosts: NewsPost[] = Array.from({ length: 13 }, (_, index) => ({
  id: `demo-news-${index + 1}`,
  title: `News Post Title ${index + 1}`,
  slug: '',
  category: ['Announcements', 'Achievements', 'Campus Life', 'Pastoral Activities', 'Enrollment'][index % 5],
  excerpt: 'Add a short two- or three-line summary explaining the announcement, school story, achievement, or important update.',
  publishedAt: `2026-${String(8 - (index % 6)).padStart(2, '0')}-01T08:00:00+08:00`,
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
  searchParams?: Promise<{ category?: string; query?: string; archive?: string; page?: string }>
}) {
  const content = await getPageContent<NewsPageContent>('newsPage')
  const posts = await getNewsPosts()
  const displayPosts = posts.length > 0 ? posts : demoNewsPosts
  const featuredPost = displayPosts[0]
  const archivePosts = displayPosts.slice(1)
  const resolvedSearchParams = await searchParams
  const selectedCategory = resolvedSearchParams?.category || 'all'
  const searchQuery = resolvedSearchParams?.query?.trim() || ''
  const selectedArchive = resolvedSearchParams?.archive || 'all'
  const archiveOptions = Array.from(new Set(
    archivePosts
      .map(post => post.publishedAt?.slice(0, 7))
      .filter((value): value is string => Boolean(value)),
  )).sort((a, b) => b.localeCompare(a))
  const datedArchivePosts = selectedArchive === 'all'
    ? archivePosts
    : archivePosts.filter(post => post.publishedAt?.startsWith(selectedArchive))
  const categoryPosts = selectedCategory === 'all'
    ? datedArchivePosts
    : datedArchivePosts.filter(post => normalizeCategory(post.category) === selectedCategory)
  const normalizedSearchQuery = searchQuery.toLowerCase()
  const filteredPosts = normalizedSearchQuery
    ? categoryPosts.filter(post => [post.title, post.excerpt, post.school, post.category]
        .some(value => value.toLowerCase().includes(normalizedSearchQuery)))
    : categoryPosts
  const storiesPerPage = 6
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / storiesPerPage))
  const requestedPage = Number.parseInt(resolvedSearchParams?.page || '1', 10)
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * storiesPerPage, currentPage * storiesPerPage)
  const paginationHref = (page: number) => {
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (searchQuery) params.set('query', searchQuery)
    if (selectedArchive !== 'all') params.set('archive', selectedArchive)
    if (page > 1) params.set('page', String(page))
    return params.size ? `/news?${params.toString()}#news-articles` : '/news#news-articles'
  }

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackPageContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackPageContent.heroSubtitle}
        description={content?.heroDescription || fallbackPageContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
        imagePlaceholder="School Events Photo"
      />

      <section className="bg-parchment-100">
        <div className="page-wrapper">
          <div className="mb-9 max-w-3xl">
            <span className="eyebrow mb-3 text-gold-700">Featured</span>
            <h2 className="font-diocesan text-4xl font-semibold leading-tight text-primary-900 md:text-5xl">Featured Story</h2>
            <span className="gold-rule mt-5" />
          </div>

          {featuredPost && (
            <Link
              href={featuredPost.slug ? `/news/${featuredPost.slug}` : '#latest-stories'}
              aria-label={featuredPost.isDemo ? `Sample layout for ${featuredPost.title}` : `Read ${featuredPost.title}`}
              className="group grid overflow-hidden rounded-3xl border border-parchment-300 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 lg:grid-cols-[1.15fr_1fr]"
            >
              <div className="relative aspect-video min-h-full border-b-2 border-dashed border-parchment-300 bg-parchment-50 lg:border-b-0 lg:border-r-2">
                {featuredPost.image && (
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <span className="mb-4 inline-flex w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  {featuredPost.category}
                </span>
                <h3 className="font-diocesan text-3xl font-semibold leading-tight text-primary-900 md:text-4xl">{featuredPost.title}</h3>
                <p className="mt-4 line-clamp-3 leading-7 text-gray-600">{featuredPost.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                  <span className="flex items-center gap-2"><School className="text-primary-600" size={16} aria-hidden="true" />{featuredPost.school}</span>
                  <span className="flex items-center gap-2"><CalendarDays className="text-primary-600" size={16} aria-hidden="true" />
                    {featuredPost.publishedAt
                      ? new Date(featuredPost.publishedAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
                      : 'Publication date to be announced'}
                  </span>
                </div>
                <span className="mt-7 inline-flex items-center gap-2 font-semibold text-primary-700 transition-colors group-hover:text-primary-500">
                  Read Featured Story <ArrowRight size={18} aria-hidden="true" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section id="latest-stories" className="bg-white">
        <div className="page-wrapper">
          <div className="mb-9 max-w-3xl">
            <span className="eyebrow mb-3 text-gold-700">Latest Stories</span>
            <h2 className="font-diocesan text-4xl font-semibold leading-tight text-primary-900 md:text-5xl">News Archive</h2>
            <span className="gold-rule mt-5" />
            <p className="mt-5 max-w-2xl leading-7 text-gray-600">Browse announcements, achievements, campus stories, pastoral activities, and enrollment updates from our school community.</p>
          </div>

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Filter news by category" className="flex flex-wrap gap-3">
            {newsCategories.map(category => {
              const isActive = selectedCategory === category.value
              const categoryParams = new URLSearchParams()
              if (category.value !== 'all') categoryParams.set('category', category.value)
              if (searchQuery) categoryParams.set('query', searchQuery)
              if (selectedArchive !== 'all') categoryParams.set('archive', selectedArchive)
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

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <form action="/news" method="get" role="search" className="w-full lg:w-80">
              {selectedCategory !== 'all' && <input type="hidden" name="category" value={selectedCategory} />}
              {selectedArchive !== 'all' && <input type="hidden" name="archive" value={selectedArchive} />}
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

            <form action="/news" method="get" className="flex gap-2">
              {selectedCategory !== 'all' && <input type="hidden" name="category" value={selectedCategory} />}
              {searchQuery && <input type="hidden" name="query" value={searchQuery} />}
              <label htmlFor="news-archive" className="sr-only">News Archive</label>
              <select
                id="news-archive"
                name="archive"
                defaultValue={selectedArchive}
                className="min-h-12 min-w-44 rounded-full border-2 border-primary-300 bg-white px-4 text-sm font-semibold text-primary-800 shadow-sm outline-none transition hover:border-primary-500 focus:border-primary-700 focus:ring-2 focus:ring-primary-200"
              >
                <option value="all">News Archive</option>
                {archiveOptions.map(value => {
                  const [year, month] = value.split('-').map(Number)
                  const label = new Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
                  return <option key={value} value={value}>{label}</option>
                })}
              </select>
              <button type="submit" className="min-h-12 rounded-full bg-primary-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2">
                View
              </button>
            </form>
          </div>
        </div>

        <div id="news-articles" className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map(post => (
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

        {filteredPosts.length > storiesPerPage && (
          <nav aria-label="News archive pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={paginationHref(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
                currentPage === 1
                  ? 'pointer-events-none border-gray-200 bg-gray-50 text-gray-400'
                  : 'border-primary-300 bg-white text-primary-700 hover:border-primary-700 hover:bg-primary-50'
              }`}
            >
              <ChevronLeft size={17} aria-hidden="true" /> Previous
            </Link>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <Link
                key={page}
                href={paginationHref(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Go to news page ${page}`}
                className={`inline-flex h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
                  page === currentPage
                    ? 'border-primary-700 bg-primary-700 text-white'
                    : 'border-primary-300 bg-white text-primary-700 hover:border-primary-700 hover:bg-primary-50'
                }`}
              >
                {page}
              </Link>
            ))}

            <Link
              href={paginationHref(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
                currentPage === totalPages
                  ? 'pointer-events-none border-gray-200 bg-gray-50 text-gray-400'
                  : 'border-primary-300 bg-white text-primary-700 hover:border-primary-700 hover:bg-primary-50'
              }`}
            >
              Next <ChevronRight size={17} aria-hidden="true" />
            </Link>
          </nav>
        )}

        {filteredPosts.length === 0 && (
          <div className="rounded-2xl border border-primary-200 bg-primary-50 px-6 py-12 text-center text-primary-900">
            {searchQuery
              ? `No news posts match “${searchQuery}”.`
              : 'No news posts are currently available in this category.'}
          </div>
        )}

        {posts.length === 0 && (
          <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50 px-5 py-4 text-center text-sm leading-6 text-primary-800">
            <strong>No news articles are currently available.</strong>{' '}
            These sample cards show the information to add in Sanity. Published News Posts will replace them automatically.
          </div>
        )}

        </div>
      </section>
    </>
  )
}
