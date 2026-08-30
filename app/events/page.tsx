import Hero from '@/components/Hero'
import FeaturedEvent from '@/components/FeaturedEvent'
import EventViewSwitcher from '@/components/EventViewSwitcher'
import { fetchSanity, getPageContent, imageUrlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Building2, CalendarDays, ChevronLeft, ChevronRight, MapPin, RotateCcw, Search, School, Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

type EventsPageContent = {
  listIntro?: string
  ctaHeading?: string
  ctaText?: string
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  heroImageAlt?: string
  latestEventHeading?: string
  allEventsHeading?: string
  emptyStateText?: string
}

const fallbackPageContent = {
  listIntro: 'Explore upcoming activities, celebrations, academic programs, and important dates across the schools of the Diocese of Baguio.',
  ctaHeading: 'Have an event to share?',
  ctaText: 'Contact the Diocese of Baguio Schools office to share information about an upcoming school activity or community event.',
  heroTitle: 'Events',
  heroSubtitle: 'School Calendar',
  heroDescription: 'Upcoming events, activities, and important dates across the schools of the Diocese of Baguio.',
  latestEventHeading: 'Latest Event',
  allEventsHeading: 'All Events',
  emptyStateText: 'No upcoming events at this time.',
}

const sampleFeaturedEvent = {
  title: 'Sample: DOBS Community Mass and Fellowship',
  category: 'Sample Event',
  description: 'Sample event for layout preview only. Replace this with a confirmed Diocese of Baguio Schools activity published through Sanity.',
  date: new Date('2026-09-15T09:00:00+08:00'),
  image: '/images/events.png',
  registerHref: '#',
}

const sampleEvents: DisplayEvent[] = [
  { id: 'sample-1', title: 'DOBS Community Mass and Fellowship', category: 'Sample Event', description: 'Sample event for layout preview only. Replace this with a confirmed activity published through Sanity.', date: { day: '15', month: 'Sep', year: '2026' }, school: 'Diocese of Baguio Schools', location: 'DOBS Office, Baguio City', image: '/images/events.png', href: '#' },
  { id: 'sample-2', title: 'Parent and Learner Orientation', category: 'Sample Event', description: 'A sample orientation entry showing how schedules, venues, and participating schools appear on the Events page.', date: { day: '22', month: 'Sep', year: '2026' }, school: 'Sample School', location: 'School Auditorium', image: '/images/classroom-discussion-1280x720.png', href: '#' },
  { id: 'sample-3', title: 'Catholic Schools Faith Formation Day', category: 'Sample Event', description: 'A sample activity demonstrating the card layout for an upcoming faith-formation gathering.', date: { day: '03', month: 'Oct', year: '2026' }, school: 'Diocese of Baguio Schools', location: 'Baguio City, Benguet', image: '/images/enrollment.png', href: '#' },
]

type SanityEvent = {
  _id: string
  title: string
  slug?: string
  category?: string
  startDate: string
  endDate?: string
  location?: string
  schoolName?: string
  description?: Array<{ _type?: string; children?: Array<{ text?: string }> }>
  featuredImage?: unknown
  registrationLink?: string
}

type DisplayEvent = {
  id: string
  title: string
  category: string
  description: string
  date: { day: string; month: string; year: string }
  school: string
  location: string
  image: string
  href: string
  startDate?: Date
  registerHref?: string
}

// Every date on this page is a Philippine school event, so it is formatted in
// Philippine time regardless of where the server happens to run.
const EVENT_CATEGORIES = ['School Event', 'Academic', 'Faith Formation', 'Community', 'Sports']

const MANILA = 'Asia/Manila'
const datePart = (value: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-PH', { ...options, timeZone: MANILA }).format(value)

function blocksToText(blocks?: SanityEvent['description']): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter(block => block?._type === 'block' && Array.isArray(block.children))
    .map(block => (block.children ?? []).map(child => child?.text ?? '').join(''))
    .join(' ')
    .trim()
}

async function getEvents(): Promise<{ events: DisplayEvent[]; nextUp?: DisplayEvent }> {
  const rows = await fetchSanity<SanityEvent[]>(`\
      *[_type == "event" && defined(startDate)] | order(startDate asc) {
        _id, title, "slug": slug.current, category, startDate, endDate, location,
        "schoolName": school->name, description, featuredImage, registrationLink
      }`)

  const events = (rows ?? []).map(event => {
    const start = new Date(event.startDate)
    return {
      id: event._id,
      title: event.title,
      category: event.category || 'School Event',
      description: blocksToText(event.description),
      date: {
        day: datePart(start, { day: '2-digit' }),
        month: datePart(start, { month: 'short' }),
        year: datePart(start, { year: 'numeric' }),
      },
      school: event.schoolName || 'Diocese of Baguio Schools',
      location: event.location || 'To be announced',
      image: imageUrlFor(event.featuredImage, 800, 600) || '/images/events.png',
      href: event.slug ? `/events/${event.slug}` : '#',
      startDate: start,
      registerHref: event.registrationLink,
    }
  })

  const now = Date.now()
  const nextUp = events.find(event => (event.startDate?.getTime() ?? 0) >= now) ?? events[0]

  return { events, nextUp }
}

export default async function EventsPage() {
  const [content, { events: sanityEvents, nextUp }] = await Promise.all([
    getPageContent<EventsPageContent>('eventsPage'),
    getEvents(),
  ])

  // Published events take over completely; the samples below are only a layout
  // preview for an empty dataset.
  const usingSamples = sanityEvents.length === 0
  const displayedEvents: DisplayEvent[] = usingSamples ? sampleEvents : sanityEvents

  const featured = nextUp
    ? {
        title: nextUp.title,
        category: nextUp.category,
        description: nextUp.description,
        image: nextUp.image,
        date: nextUp.startDate as Date,
        registerHref: nextUp.registerHref || nextUp.href,
      }
    : sampleFeaturedEvent

  const schoolOptions = Array.from(new Set(displayedEvents.map(event => event.school))).sort()

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackPageContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackPageContent.heroSubtitle}
        description={content?.heroDescription || fallbackPageContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
        imageAlt={content?.heroImageAlt}
        imagePlaceholder="School Event Photo"
      />

      <div>

        {/* Featured latest event */}
        <section className="bg-parchment-100">
          <div className="page-wrapper py-16 md:py-20">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">Featured</span>
            <h2 className="mt-3 font-diocesan text-4xl font-bold text-primary-700 md:text-5xl">
              {content?.latestEventHeading || fallbackPageContent.latestEventHeading}
            </h2>
            <span className="gold-rule" />
          </div>
          <FeaturedEvent {...featured} />
          </div>
        </section>

        {/* All events list */}
        <section className="bg-white">
          <div className="page-wrapper py-16 md:py-20">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">Calendar</span>
            <h2 className="mt-3 font-diocesan text-4xl font-bold text-primary-700 md:text-5xl">
              {content?.allEventsHeading || fallbackPageContent.allEventsHeading}
            </h2>
            <span className="gold-rule" />
            <p className="mt-5 leading-7 text-gray-600">
              {content?.listIntro || fallbackPageContent.listIntro}
            </p>
          </div>
          <form className="mb-8 rounded-2xl border border-primary-100 bg-primary-50 p-5 shadow-card md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.2fr_auto]">
              <label className="relative block">
                <span className="form-label">Search events</span>
                <Search className="pointer-events-none absolute bottom-3 left-3.5 text-primary-500" size={18} aria-hidden="true" />
                <input
                  type="search"
                  name="search"
                  className="form-input bg-white pl-11"
                  placeholder="Search by event title"
                />
              </label>

              <label className="relative block">
                <span className="form-label">Month</span>
                <CalendarDays className="pointer-events-none absolute bottom-3 left-3.5 text-primary-500" size={18} aria-hidden="true" />
                <select name="month" className="form-input bg-white pl-11">
                  <option value="">All months</option>
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map(month => (
                    <option key={month} value={month.toLowerCase()}>{month}</option>
                  ))}
                </select>
              </label>

              <label className="relative block">
                <span className="form-label">Category</span>
                <Tag className="pointer-events-none absolute bottom-3 left-3.5 text-primary-500" size={18} aria-hidden="true" />
                <select name="category" className="form-input bg-white pl-11">
                  <option value="">All categories</option>
                  {EVENT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="relative block">
                <span className="form-label">School</span>
                <Building2 className="pointer-events-none absolute bottom-3 left-3.5 text-primary-500" size={18} aria-hidden="true" />
                <select name="school" className="form-input bg-white pl-11">
                  <option value="">All schools</option>
                  {schoolOptions.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </label>

              <div className="flex items-end">
                <button type="reset" className="btn-secondary w-full whitespace-nowrap xl:w-auto">
                  <RotateCcw size={17} aria-hidden="true" /> All Events
                </button>
              </div>
            </div>
          </form>

          {usingSamples && (
            <p className="mb-6 rounded-2xl border border-dashed border-primary-200 bg-primary-50 px-5 py-4 text-sm font-medium text-primary-700">
              {content?.emptyStateText || fallbackPageContent.emptyStateText} The entries below are layout samples.
            </p>
          )}

          <EventViewSwitcher events={displayedEvents}>
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
            {displayedEvents.map(({ id, title, category, description, date, school, location, image, href }) => (
              <article
                key={id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-primary-100 bg-primary-50">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/45 via-primary-900/10 to-transparent" />
                  <div className="absolute left-4 top-4 min-w-20 rounded-xl border border-white/30 bg-primary-700 px-4 py-3 text-center text-white shadow-lg">
                    <div className="text-3xl font-bold leading-none">{date.day}</div>
                    <div className="mt-1.5 text-sm font-bold uppercase tracking-[0.14em]">{date.month}</div>
                    <div className="mt-1 border-t border-white/25 pt-1 text-[11px] font-medium tracking-wider text-white/85">{date.year}</div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold-700">
                    {category}
                  </span>
                  <h3 className="font-diocesan text-2xl font-bold leading-tight text-primary-700">{title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{description}</p>

                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                    <p className="flex items-start gap-2">
                      <School className="mt-0.5 shrink-0 text-primary-600" size={16} aria-hidden="true" />
                      <span>{school}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 shrink-0 text-primary-600" size={16} aria-hidden="true" />
                      <span>{location}</span>
                    </p>
                  </div>

                  <a
                    href={href}
                    className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary-700 transition-colors hover:text-primary-500"
                  >
                    View Event <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-gray-100 pt-8 sm:flex-row">
            <p className="text-sm font-medium text-gray-600">
              {usingSamples
                ? `Showing ${displayedEvents.length} sample ${displayedEvents.length === 1 ? 'event' : 'events'}`
                : `Showing ${displayedEvents.length} ${displayedEvents.length === 1 ? 'event' : 'events'}`}
            </p>

            <nav className="flex items-center gap-3" aria-label="Events pagination">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous page"
                disabled
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>

              {[1, 2, 3].map(p => (
                <button
                  key={p}
                  type="button"
                  aria-label={`Go to page ${p}`}
                  aria-current={p === 1 ? 'page' : undefined}
                  className={`h-11 min-w-11 rounded-lg px-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
                    p === 1
                      ? 'bg-primary-700 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-primary-700 hover:border-primary-200 hover:bg-primary-50'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary-200 bg-white text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                aria-label="Next page"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </nav>
          </div>
          </EventViewSwitcher>
          </div>
        </section>

        <section className="bg-primary-700 text-white">
          <div className="page-wrapper py-16 text-center md:py-20">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">Community calendar</span>
            <h2 className="mx-auto mt-3 max-w-3xl font-diocesan text-4xl font-bold md:text-5xl">
              {content?.ctaHeading || fallbackPageContent.ctaHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-primary-100">
              {content?.ctaText || fallbackPageContent.ctaText}
            </p>
            <div className="mt-8 flex items-center justify-center">
              <Link href="/contact" className="btn-accent w-full sm:w-auto">
                Contact the DOBS Office <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
