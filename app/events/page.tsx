import Hero from '@/components/Hero'
import FeaturedEvent from '@/components/FeaturedEvent'
import EventViewSwitcher from '@/components/EventViewSwitcher'
import { getPageContent, imageUrlFor } from '@/lib/sanity'
import Link from 'next/link'
import { ArrowRight, Building2, CalendarDays, ChevronLeft, ChevronRight, MapPin, RotateCcw, Search, School, Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

type EventsPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  latestEventHeading?: string
  allEventsHeading?: string
}

const fallbackPageContent = {
  heroTitle: 'Events',
  heroSubtitle: 'School Calendar',
  heroDescription: 'Upcoming events, activities, and important dates across the Diocese of Baguio Schools network.',
  latestEventHeading: 'Latest Event',
  allEventsHeading: 'All Events',
}

const upcomingEvent = {
  title: '[ Featured Event Title from Sanity ]',
  category: 'School Event',
  description: '[ Event description from Sanity. A brief summary of what the event is about, who it is for, and what attendees can expect. ]',
  date: new Date('2026-09-15T08:00:00'),
  registerHref: '#',
}

const events = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Event Title ${i + 1}`,
  category: i % 2 === 0 ? 'Free' : 'School Event',
  description: '[ Short event description from Sanity. ]',
  date: { day: '01', month: 'Sep', year: '2026' },
  school: '[ School Name ]',
  location: '[ Event Location ]',
}))

export default async function EventsPage() {
  const content = await getPageContent<EventsPageContent>('eventsPage')

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackPageContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackPageContent.heroSubtitle}
        description={content?.heroDescription || fallbackPageContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
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
          <FeaturedEvent {...upcomingEvent} />
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
              Explore upcoming activities, celebrations, academic programs, and important dates across the Diocese of Baguio Schools network.
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
                  <option value="school-event">School Event</option>
                  <option value="academic">Academic</option>
                  <option value="faith-formation">Faith Formation</option>
                  <option value="community">Community</option>
                  <option value="sports">Sports</option>
                </select>
              </label>

              <label className="relative block">
                <span className="form-label">Member school</span>
                <Building2 className="pointer-events-none absolute bottom-3 left-3.5 text-primary-500" size={18} aria-hidden="true" />
                <select name="school" className="form-input bg-white pl-11">
                  <option value="">All member schools</option>
                  <option value="school-name">[ School Name ]</option>
                </select>
              </label>

              <div className="flex items-end">
                <button type="reset" className="btn-secondary w-full whitespace-nowrap xl:w-auto">
                  <RotateCcw size={17} aria-hidden="true" /> All Events
                </button>
              </div>
            </div>
          </form>

          <EventViewSwitcher events={events}>
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
            {events.map(({ id, title, category, description, date, school, location }) => (
              <article
                key={id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-primary-100 bg-primary-50">
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
                    href="#"
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
            <p className="text-sm font-medium text-gray-600">Showing 1–6 of 18 events</p>

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
              Have an event to share?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-primary-100">
              Contact the Diocese of Baguio Schools office to share information about an upcoming school activity or community event.
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
