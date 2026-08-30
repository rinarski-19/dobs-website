import Hero from '@/components/Hero'
import Features from '@/components/Features'
import StatsCounter from '@/components/StatsCounter'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Blocks, BookOpen, GraduationCap, MapPin, School } from 'lucide-react'
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
import { fetchSanity, getPageContent, imageUrlFor } from '@/lib/sanity'
import { getSchools } from '@/lib/schools'

// News and events are time-sensitive and intentionally fetched without cache.
export const dynamic = 'force-dynamic'

type HomePageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  heroImageAlt?: string
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

// Used only when the Home Page document has no Statistics entries. The school
// count is the one figure derived from real data; the others are placeholders
// and should be replaced or removed in Studio.
const fallbackStats: Stat[] = [
  { value: 20, label: 'Diocesan Schools', icon: 'schools' },
  { value: 5000, suffix: '+', label: 'Students Enrolled', icon: 'students' },
  { value: 400, suffix: '+', label: 'Faculty & Staff', icon: 'faculty' },
  { value: 50, suffix: '+', label: 'Years of Service', icon: 'years' },
]

const fallbackContent = {
  heroTitle: 'Diocese of Baguio Schools',
  heroSubtitle: 'Catholic Schools of the Diocese',
  heroDescription: 'Forming young minds in faith, excellence, and service — serving Baguio City and the province of Benguet.',
  schoolsHeading: 'Our Schools',
  newsHeading: 'Latest News & Announcements',
  enrollmentHeading: 'Begin Your Journey With Us',
  enrollmentDescription: 'Every Diocese of Baguio school welcomes families seeking an education rooted in faith, character, and academic excellence. Find the school nearest you and begin.',
}

async function getHomeSchools(): Promise<HomeSchool[]> {
  try {
    const schools = await getSchools()

    return schools.map(({ slug, coverPhoto, logo, ...school }) => ({
      ...school,
      slug: slug.current,
      imageUrl: coverPhoto ? imageUrlFor(coverPhoto, 1000, 560) : logo ? imageUrlFor(logo, 800, 800) : '/images/schools.png',
    }))
  } catch (error) {
    console.error('Unable to load homepage schools from Sanity:', error)
    return []
  }
}

async function getHomeNews(): Promise<HomeNewsItem[]> {
  const posts = await fetchSanity<(Omit<HomeNewsItem, 'slug' | 'imageUrl'> & { slug: { current: string }; featuredImage?: any })[]>(`\
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
    `) ?? []

  return posts.map(({ slug, featuredImage, ...post }) => ({
    ...post,
    slug: slug.current,
    imageUrl: featuredImage ? imageUrlFor(featuredImage, 1000, 560) : undefined,
  }))
}

async function getHomeEvents(): Promise<HomeEventItem[]> {
  const eventItems = await fetchSanity<(Omit<HomeEventItem, 'imageUrl'> & { featuredImage?: any })[]>(`\
      *[_type == "event" && defined(startDate) && startDate >= now()] | order(startDate asc)[0...3] {
        _id,
        title,
        startDate,
        location,
        "schoolName": school->name,
        featuredImage
      }
    `) ?? []

  return eventItems.map(({ featuredImage, ...event }) => ({
    ...event,
    imageUrl: featuredImage ? imageUrlFor(featuredImage, 900, 675) : undefined,
  }))
}

export default async function HomePage() {
  // Keep Sanity reads sequential. Concurrent SDK requests can cross response
  // streams in the Next.js development runtime and surface invalid JSON.
  const content = await getPageContent<HomePageContent>('homePage')
  const schools = await getHomeSchools()
  const news = await getHomeNews()
  const events = await getHomeEvents()
  const displayedNews: HomeNewsItem[] = news.length ? news : [
    {
      _id: 'sample-ceap-car-leadership-academy',
      title: 'CEAP-CAR School Heads Convene for 2026 Leadership Academy',
      slug: 'sample-ceap-car-leadership-academy',
      category: 'Catholic Education',
      excerpt: 'Catholic school leaders, including participants from the Diocese of Baguio, gathered in Baguio City for formation focused on resilient, competent, and servant leadership.',
      publishedAt: '2026-05-04',
      schoolName: 'CEAP-CAR · Diocese of Baguio participants',
      imageUrl: '/images/news.png',
      externalUrl: 'https://www.slu.edu.ph/2026/05/04/ceap-car-school-heads-convene-for-2026-leadership-academy/',
    },
    {
      _id: 'sample-enrollment-announcement',
      title: 'Sample: Enrollment Information for School Year 2026–2027',
      slug: 'sample-enrollment-announcement',
      category: 'Enrollment',
      excerpt: 'This sample shows how a school can share application schedules, required documents, available levels, and admissions contact information.',
      publishedAt: '2026-08-20',
      schoolName: 'Sample School',
      imageUrl: '/images/enrollment.png',
      sample: true,
    },
    {
      _id: 'sample-campus-life-story',
      title: 'Sample: Students Put Faith into Action through Community Service',
      slug: 'sample-campus-life-story',
      category: 'Campus Life',
      excerpt: 'This sample story demonstrates how schools can feature student formation, outreach activities, achievements, and service to local communities.',
      publishedAt: '2026-08-18',
      schoolName: 'Sample School',
      imageUrl: '/images/classroom-discussion-1280x720.png',
      sample: true,
    },
  ]
  const displayedEvents: HomeEventItem[] = events.length ? events : [
    {
      _id: 'sample-dobs-community-event',
      title: 'Sample: DOBS Community Mass and Fellowship',
      startDate: '2026-09-15T09:00:00+08:00',
      location: 'Diocese of Baguio Schools Office, Baguio City',
      schoolName: 'Diocese of Baguio Schools',
      description: 'Sample event for layout preview only. Replace this with a confirmed activity published through Sanity.',
      imageUrl: '/images/events.png',
    },
    {
      _id: 'sample-parent-orientation',
      title: 'Sample: Parent and Learner Orientation',
      startDate: '2026-09-22T13:30:00+08:00',
      location: 'School Auditorium',
      schoolName: 'Sample School',
      description: 'A sample orientation entry showing how schedules, venues, and participating schools appear on the homepage.',
      imageUrl: '/images/classroom-discussion-1280x720.png',
    },
    {
      _id: 'sample-faith-formation-day',
      title: 'Sample: Catholic Schools Faith Formation Day',
      startDate: '2026-10-03T08:00:00+08:00',
      location: 'Baguio City, Benguet',
      schoolName: 'Diocese of Baguio Schools',
      description: 'A sample activity for demonstrating the three-card upcoming-events layout.',
      imageUrl: '/images/enrollment.png',
    },
  ]

  const birthdayCelebrants = content?.birthdayCelebrants?.map(({ photo, ...celebrant }) => ({
    ...celebrant,
    imageUrl: photo ? imageUrlFor(photo, 240, 240) : undefined,
  })) ?? []
  const displayedCelebrants = birthdayCelebrants.length ? birthdayCelebrants : [{
    _key: 'sample-jane-doe',
    name: 'Jane Doe',
    school: 'DOBS School Community',
    birthday: '2026-08-26',
    greeting: 'Sample celebrant — replace this entry with current birthday information in Sanity.',
    imageUrl: '/images/enrollment.png',
  }]
  const featuredSchool = schools[0]
  const programPreviews = [
    { name: 'Pre-School', icon: Blocks, description: 'Early learning through play, discovery, faith, and care.' },
    { name: 'Grade School', icon: BookOpen, description: 'Strong foundations in literacy, numeracy, character, and faith.' },
    { name: 'Junior High School', icon: School, description: 'Deeper academic learning, formation, and responsible service.' },
    { name: 'Senior High School', icon: GraduationCap, description: 'College, career, and vocation preparation rooted in Gospel values.' },
  ]

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackContent.heroSubtitle}
        description={content?.heroDescription || fallbackContent.heroDescription}
        image={imageUrlFor(content?.heroImage) || '/images/home.png'}
        imageAlt={content?.heroImageAlt}
        imagePlaceholder="School Campus Photo"
        cta={{ label: 'Enroll Now', href: '/enrollment' }}
        ctaSecondary={{ label: 'Our Schools', href: '/schools' }}
        homeHero
      />

      {/* Welcome — a gentle transition from the hero */}
      <section className="bg-parchment-100">
        <div className="page-wrapper grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-14 md:py-20">
          <div>
            <span className="eyebrow mb-3 text-gold-700">Welcome to DOBS</span>
            <h2 className="font-diocesan text-4xl font-semibold leading-tight text-primary-900 md:text-5xl">Forming minds, hearts, and communities</h2>
            <span className="gold-rule mt-5" />
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 md:text-lg md:leading-8">
              The Diocese of Baguio Schools brings together Catholic educational communities across Baguio City and Benguet. Our schools unite academic formation, Gospel values, cultural respect, and service to help every learner grow with purpose.
            </p>
            <Link href="/about" className="btn-primary mt-7">Learn About Us <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-parchment-300 bg-white shadow-card">
            <Image src="/images/classroom-discussion-1280x720.png" alt="Students learning together in a Diocese of Baguio school classroom" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Why our schools — parchment */}
      <Features
        features={content?.features?.length ? content.features : undefined}
        heading={content?.whyChooseHeading || 'Formed in Faith and Learning'}
        description={content?.whyChooseDescription}
      />

      {/* Community at a glance — navy band */}
      <StatsCounter stats={content?.stats?.length ? content.stats : fallbackStats} />

      {/* Birthday celebrants — white */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <BirthdaySection
            title={content?.birthdayTitle || 'Celebrating Our Birthday Celebrants'}
            message={content?.birthdayMessage}
            celebrants={displayedCelebrants}
          />
        </div>
      </div>

      {/* Academic Programs preview */}
      <section className="bg-white">
        <div className="page-wrapper py-16 md:py-20">
          <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow mb-2">Learning Pathways</span>
              <h2 className="section-heading mb-0">Academic Programs</h2>
              <span className="gold-rule" />
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">Explore a continuous Catholic educational journey from early childhood through Senior High School.</p>
            </div>
            <Link href="/programs" className="btn-secondary shrink-0">View Programs <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {programPreviews.map(({ name, icon: Icon, description }) => (
              <Link key={name} href="/programs" className="group h-full rounded-2xl border border-primary-100 bg-primary-50/50 p-6 transition-all hover:-translate-y-1 hover:border-gold-500 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700 text-gold-300"><Icon size={24} aria-hidden="true" /></span>
                <h3 className="mt-5 font-diocesan text-2xl font-bold text-primary-900">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">Explore Program <ArrowRight className="transition-transform group-hover:translate-x-1" size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Schools — parchment */}
      <div className="bg-parchment-100">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <section className="section">
            <span className="eyebrow mb-2">Our Schools</span>
            <h2 className="section-heading mb-0">{content?.schoolsHeading || fallbackContent.schoolsHeading}</h2>
            <span className="gold-rule mb-6" />
            {featuredSchool && (
              <article className="mb-9 grid overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-card lg:grid-cols-[1.25fr_1fr]">
                <div className="relative min-h-72 bg-primary-800 lg:min-h-80">
                  {featuredSchool.imageUrl ? (
                    <Image src={featuredSchool.imageUrl} alt={`${featuredSchool.name} campus`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full min-h-72 items-center justify-center text-white/70">Featured school campus photo</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-950/20" />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <span className="eyebrow mb-3 text-gold-700">Featured Diocesan School</span>
                  <h3 className="font-diocesan text-3xl font-bold leading-tight text-primary-900 md:text-4xl">{featuredSchool.name}</h3>
                  {featuredSchool.city && <p className="mt-4 flex items-center gap-2 text-base text-gray-600"><MapPin size={17} className="text-primary-600" aria-hidden="true" /> {featuredSchool.city}</p>}
                  {featuredSchool.levels?.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">{featuredSchool.levels.map(level => <span key={level} className="badge">{level}</span>)}</div>
                  ) : null}
                  <Link href={`/schools/${featuredSchool.slug}`} className="btn-primary mt-7 w-fit">View School <ArrowRight size={17} aria-hidden="true" /></Link>
                </div>
              </article>
            )}
            <SchoolCarousel schools={schools} />
            <div className="mt-6">
              <Link href="/schools" className="btn-secondary">View All Schools <ArrowRight size={16} /></Link>
            </div>
          </section>
        </div>
      </div>

      {/* Early enrollment callout */}
      <section className="bg-primary-800 text-white">
        <div className="page-wrapper flex flex-col items-start justify-between gap-7 py-12 md:flex-row md:items-center md:py-14">
          <div>
            <span className="eyebrow mb-2 text-gold-300">Admissions</span>
            <h2 className="font-diocesan text-3xl font-semibold md:text-4xl">Enrollment is now open</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-primary-100">Browse the schools and contact the admissions team for school-specific schedules, requirements, and available levels.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/schools" className="btn-accent w-full sm:w-auto">Browse Schools <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/enrollment" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-white px-5 py-2.5 font-semibold text-white transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-primary-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto">Send an Enrollment Inquiry <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* Latest News — white */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <LatestNewsSection
            items={displayedNews}
            heading={content?.newsHeading || fallbackContent.newsHeading}
          />
        </div>
      </div>

      {/* Upcoming Events — parchment */}
      <div className="bg-parchment-100">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <UpcomingEventsSection
            items={displayedEvents}
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
        <Image src="/images/enrollment.png" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-800/90 to-primary-900/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center text-white">
          <span className="eyebrow mb-3 text-gold-300">Come and See</span>
          <h2 className="font-diocesan text-3xl md:text-4xl font-semibold mb-4">
            {content?.enrollmentHeading || fallbackContent.enrollmentHeading}
          </h2>
          <span className="mx-auto mb-6 block h-0.5 w-12 rounded-full bg-gold-500" />
          <p className="mx-auto mb-8 max-w-xl leading-relaxed text-white/80">
            {content?.enrollmentDescription || fallbackContent.enrollmentDescription}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/enrollment" className="btn-accent">Begin Enrollment <ArrowRight size={16} /></Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-white px-5 py-2.5 font-semibold text-white transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-primary-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800">Contact the DOBS Office <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
