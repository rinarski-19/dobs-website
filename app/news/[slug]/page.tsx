import Hero from '@/components/Hero'
import PortableText, { toPlainText, type Block } from '@/components/PortableText'
import { fetchSanity, getPageContent, imageUrlFor, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, School, Tag } from 'lucide-react'

export const revalidate = 60

type NewsPost = {
  _id: string
  title: string
  category?: string
  excerpt?: string
  body?: Block[]
  publishedAt?: string
  featuredImage?: any
  school?: { name?: string; city?: string; slug?: string; logo?: any }
}

type RelatedPost = {
  _id: string
  title: string
  slug?: string
  category?: string
  publishedAt?: string
  featuredImage?: any
}

type NewsPageContent = { heroImage?: any }

// School events and announcements are Philippine-dated regardless of where the
// server runs, so the timezone is pinned rather than inherited.
const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat('en-PH', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila',
      }).format(new Date(value))
    : null

async function getPost(slug: string) {
  return fetchSanity<NewsPost | null>(
    `*[_type == "newsPost" && slug.current == $slug][0] {
      _id, title, category, excerpt, body, publishedAt, featuredImage,
      school->{ name, city, logo, "slug": slug.current }
    }`,
    { slug },
  )
}

async function getRelated(slug: string) {
  return fetchSanity<RelatedPost[]>(
    `*[_type == "newsPost" && defined(slug.current) && slug.current != $slug]
      | order(publishedAt desc)[0...3] {
        _id, title, "slug": slug.current, category, publishedAt, featuredImage
      }`,
    { slug },
  )
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, related, newsPage] = await Promise.all([
    getPost(slug),
    getRelated(slug),
    getPageContent<NewsPageContent>('newsPage'),
  ])

  if (!post) notFound()

  const featuredImage = post.featuredImage
    ? urlFor(post.featuredImage).width(1800).height(900).fit('crop').url()
    : imageUrlFor(newsPage?.heroImage)

  const publishedOn = formatDate(post.publishedAt)
  const schoolName = post.school?.name || 'Diocese of Baguio Schools'
  const schoolLogo = post.school?.logo ? urlFor(post.school.logo).width(160).height(160).fit('crop').url() : null
  // Roughly 200 words a minute, floored at a minute so it never reads "0 min".
  const readingMinutes = Math.max(1, Math.round(toPlainText(post.body).split(/\s+/).filter(Boolean).length / 200))

  return (
    <>
      <Hero
        title={post.title}
        subtitle={post.category || 'News & Announcements'}
        image={featuredImage}
        imagePlaceholder="Post Featured Image"
      />

      <div className="page-wrapper">
        <div className="mx-auto max-w-4xl">
          <Link href="/news" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary-700">
            <ArrowLeft size={15} aria-hidden="true" /> Back to News
          </Link>

          <div className="mb-10">
            <h1 className="font-diocesan text-3xl font-bold leading-tight text-primary-800 md:text-4xl">{post.title}</h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
              {publishedOn && (
                <span className="flex items-center gap-1.5"><Calendar size={15} aria-hidden="true" /> {publishedOn}</span>
              )}
              {post.category && (
                <span className="flex items-center gap-1.5"><Tag size={15} aria-hidden="true" /> <span className="badge">{post.category}</span></span>
              )}
              <span className="flex items-center gap-1.5"><School size={15} aria-hidden="true" /> {schoolName}</span>
              {post.body?.length ? <span>{readingMinutes} min read</span> : null}
            </div>
          </div>

          <div className="divider" />

          <div className="flex flex-col gap-12 lg:flex-row">
            <article className="min-w-0 flex-1">
              {post.excerpt && (
                <p className="mb-8 border-l-4 border-primary-500 pl-5 text-lg font-medium leading-relaxed text-gray-600">
                  {post.excerpt}
                </p>
              )}

              {post.body?.length ? (
                <PortableText value={post.body} />
              ) : (
                <p className="rounded-2xl border border-dashed border-primary-200 bg-primary-50 px-5 py-4 text-sm font-medium text-primary-700">
                  This announcement has no article body yet.
                </p>
              )}
            </article>

            <aside className="shrink-0 space-y-6 lg:w-72">
              <div className="card">
                <h3 className="card-title mb-3">Posted by</h3>
                {schoolLogo ? (
                  <Image src={schoolLogo} alt={`${schoolName} logo`} width={64} height={64} className="mb-3 h-16 w-16 rounded-full object-cover ring-1 ring-parchment-200" />
                ) : null}
                <p className="text-sm font-semibold text-gray-800">{schoolName}</p>
                {post.school?.city && <p className="mt-1 text-xs text-gray-500">{post.school.city}</p>}
                <Link
                  href={post.school?.slug ? `/schools/${post.school.slug}` : '/schools'}
                  className="btn-secondary mt-4 w-full justify-center text-xs"
                >
                  {post.school?.slug ? 'View School' : 'Browse Schools'}
                </Link>
              </div>
            </aside>
          </div>

          {related && related.length > 0 && (
            <>
              <div className="divider" />
              <section className="section">
                <h2 className="section-heading">More News</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {related.map(item => (
                    <Link
                      key={item._id}
                      href={`/news/${item.slug}`}
                      className="group card transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-primary-50">
                        <Image
                          src={imageUrlFor(item.featuredImage, 600, 450) || '/images/news.png'}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      {item.category && <span className="badge mb-2 block w-fit">{item.category}</span>}
                      <h3 className="card-title leading-snug">{item.title}</h3>
                      {formatDate(item.publishedAt) && (
                        <p className="card-body mt-1">{formatDate(item.publishedAt)}</p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700">
                        Read <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  )
}
