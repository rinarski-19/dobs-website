import Hero from '@/components/Hero'
import FeaturedEvent from '@/components/FeaturedEvent'
import { getPageContent, imageUrlFor } from '@/lib/sanity'
import { ArrowRight, Building2, CalendarDays, MapPin, RotateCcw, Search, School, Tag } from 'lucide-react'

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
  date: { day: '01', month: 'Sep' },
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

      <div className="page-wrapper space-y-12">

        {/* Featured latest event */}
        <section>
          <h2 className="section-heading mb-6">{content?.latestEventHeading || fallbackPageContent.latestEventHeading}</h2>
          <FeaturedEvent {...upcomingEvent} />
        </section>

        <div className="divider" />

        {/* All events list */}
        <section>
          <h2 className="section-heading mb-6">{content?.allEventsHeading || fallbackPageContent.allEventsHeading}</h2>
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

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
            {events.map(({ id, title, category, description, date, school, location }) => (
              <article
                key={id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-primary-100 bg-primary-50">
                  <div className="absolute left-4 top-4 min-w-16 rounded-xl border border-white/70 bg-white px-3 py-2 text-center shadow-lg">
                    <div className="text-2xl font-bold leading-none text-primary-700">{date.day}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold-700">{date.month}</div>
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
          <div className="flex items-center justify-center gap-2 mt-10">
            {[1, 2, 3].map(p => (
              <button
                key={p}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === 1
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
