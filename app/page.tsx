import Hero from '@/components/Hero'
import Features from '@/components/Features'
import StatsCounter from '@/components/StatsCounter'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Feature } from '@/components/Features'
import { Stat } from '@/components/StatsCounter'
import SchoolCarousel, { HomeSchool } from '@/components/SchoolCarousel'
import {
  BirthdaySection,
  BirthdayCelebrant,
  HomeEventItem,
  HomeNewsItem,
  LatestNewsSection,
  SchoolLocationsSection,
  Testimonial,
  TestimonialsSection,
  UpcomingEventsSection,
} from '@/components/HomeSections'
import { client, getPageContent, imageUrlFor } from '@/lib/sanity'
import { getSchools } from '@/lib/schools'

// News and events are time-sensitive and intentionally fetched without cache.
export const dynamic = 'force-dynamic'

type HomePageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  features?: Feature[]
  stats?: Stat[]
  whyChooseHeading?: string
  whyChooseDescription?: string
  testimonials?: Testimonial[]
  birthdayTitle?: string
  birthdayMessage?: string
  birthdayCelebrants?: (Omit<BirthdayCelebrant, 'imageUrl'> & { photo?: any })[]
  schoolsHeading?: string
  newsHeading?: string
  eventsHeading?: string
  testimonialsHeading?: string
  locationsHeading?: string
  enrollmentHeading?: string
  enrollmentDescription?: string
}

const fallbackContent = {
  heroTitle: 'Diocese of Baguio Schools',
  heroSubtitle: 'Catholic Education Network',
  heroDescription: 'Forming young minds in faith, excellence, and service — serving Baguio City and the province of Benguet.',
  schoolsHeading: 'Our Schools',
  newsHeading: 'Latest News & Announcements',
  enrollmentHeading: 'Join Our Community',
  enrollmentDescription: 'Every Diocese of Baguio school welcomes families seeking an education rooted in faith, character, and academic excellence. Find the school nearest you and begin.',
}

async function getHomeSchools(): Promise<HomeSchool[]> {
  try {
    const schools = await getSchools()

    return schools.map(({ slug, coverPhoto, ...school }) => ({
      ...school,
      slug: slug.current,
      imageUrl: coverPhoto ? imageUrlFor(coverPhoto, 1000, 560) : undefined,
    }))
  } catch (error) {
    console.error('Unable to load homepage schools from Sanity:', error)
    return []
  }
}

async function getHomeNews(): Promise<HomeNewsItem[]> {
  try {
    const posts = await client.fetch<(Omit<HomeNewsItem, 'slug' | 'imageUrl'> & { slug: { current: string }; featuredImage?: any })[]>(`\
      *[_type == "newsPost" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc)[0...3] {
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

    return posts.map(({ slug, featuredImage, ...post }) => ({
      ...post,
      slug: slug.current,
      imageUrl: featuredImage ? imageUrlFor(featuredImage, 1000, 560) : undefined,
    }))
  } catch (error) {
    console.error('Unable to load homepage news from Sanity:', error)
    return []
  }
}

async function getHomeEvents(): Promise<HomeEventItem[]> {
  try {
    return await client.fetch<HomeEventItem[]>(`\
      *[_type == "event" && defined(startDate) && startDate >= now()] | order(startDate asc)[0...3] {
        _id,
        title,
        startDate,
        location,
        "schoolName": school->name
      }
    `, {}, { cache: 'no-store' })
  } catch (error) {
    console.error('Unable to load homepage events from Sanity:', error)
    return []
  }
}

export default async function HomePage() {
  // Keep Sanity reads sequential. Concurrent SDK requests can cross response
  // streams in the Next.js development runtime and surface invalid JSON.
  const content = await getPageContent<HomePageContent>('homePage')
  const schools = await getHomeSchools()
  const news = await getHomeNews()
  const events = await getHomeEvents()

  const birthdayCelebrants = content?.birthdayCelebrants?.map(({ photo, ...celebrant }) => ({
    ...celebrant,
    imageUrl: photo ? imageUrlFor(photo, 240, 240) : undefined,
  })) ?? []

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackContent.heroSubtitle}
        description={content?.heroDescription || fallbackContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
        imagePlaceholder="School Campus Photo"
        cta={{ label: 'Enroll Now', href: '/enrollment' }}
        ctaSecondary={{ label: 'Our Schools', href: '/schools' }}
        homeHero
      />

      {/* Why our schools — parchment */}
      <Features
        features={content?.features?.length ? content.features : undefined}
        heading={content?.whyChooseHeading || 'Formed in Faith and Learning'}
        description={content?.whyChooseDescription}
      />

      {/* Community at a glance — navy band */}
      <StatsCounter
        stats={[
          { value: schools.length, label: 'Member Schools' },
          { value: 5000, suffix: '+', label: 'Students Enrolled' },
          { value: 400, suffix: '+', label: 'Faculty & Staff' },
          { value: 50, suffix: '+', label: 'Years of Service' },
        ]}
      />

      {/* Birthday celebrants — white */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <BirthdaySection
            title={content?.birthdayTitle || 'Celebrating Our Birthday Celebrants'}
            message={content?.birthdayMessage}
            celebrants={birthdayCelebrants}
          />
        </div>
      </div>

      {/* Featured Schools — parchment */}
      <div className="bg-parchment-100">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <section className="section">
            <span className="eyebrow mb-2">Our Network</span>
            <h2 className="section-heading mb-0">{content?.schoolsHeading || fallbackContent.schoolsHeading}</h2>
            <span className="gold-rule mb-6" />
            <SchoolCarousel schools={schools} />
            <div className="mt-6">
              <Link href="/schools" className="btn-secondary">View All Schools <ArrowRight size={16} /></Link>
            </div>
          </section>
        </div>
      </div>

      {/* Latest News — white */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <LatestNewsSection
            items={news}
            heading={content?.newsHeading || fallbackContent.newsHeading}
          />
        </div>
      </div>

      {/* Upcoming Events — parchment */}
      <div className="bg-parchment-100">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <UpcomingEventsSection
            items={events}
            heading={content?.eventsHeading || 'Upcoming Events'}
          />
        </div>
      </div>

      {/* Testimonials — white (renders nothing when empty) */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <TestimonialsSection
            items={content?.testimonials || []}
            heading={content?.testimonialsHeading || 'Stories from Our Community'}
          />
        </div>
      </div>

      {/* School Locations — parchment */}
      <div className="bg-parchment-100">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <SchoolLocationsSection
            schools={schools}
            heading={content?.locationsHeading || 'Find a School Near You'}
          />
        </div>
      </div>

      {/* Closing invitation — navy band */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(120deg, #0c1c2e 0%, #16324F 60%, #294f72 100%)' }}
      >
        <div className="mx-auto max-w-3xl px-6 py-20 text-center text-white">
          <span className="eyebrow mb-3 text-gold-300">Come and See</span>
          <h2 className="font-diocesan text-3xl md:text-4xl font-semibold mb-4">
            {content?.enrollmentHeading || fallbackContent.enrollmentHeading}
          </h2>
          <span className="mx-auto mb-6 block h-0.5 w-12 rounded-full bg-gold-500" />
          <p className="mx-auto mb-8 max-w-xl leading-relaxed text-white/80">
            {content?.enrollmentDescription || fallbackContent.enrollmentDescription}
          </p>
          <Link href="/enrollment" className="btn-accent">Begin Enrollment <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  )
}
