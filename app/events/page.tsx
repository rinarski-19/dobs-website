import Hero from '@/components/Hero'
import FeaturedEvent from '@/components/FeaturedEvent'
import { getPageHeroImage } from '@/lib/sanity'

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
}))

export default async function EventsPage() {
  const heroImage = await getPageHeroImage('events')

  return (
    <>
      <Hero
        title="Events"
        subtitle="School Calendar"
        description="Upcoming events, activities, and important dates across the Diocese of Baguio Schools network."
        image={heroImage}
        imagePlaceholder="School Event Photo"
      />

      <div className="page-wrapper space-y-12">

        {/* Featured latest event */}
        <section>
          <h2 className="section-heading mb-6">Latest Event</h2>
          <FeaturedEvent {...upcomingEvent} />
        </section>

        <div className="divider" />

        {/* All events list */}
        <section>
          <h2 className="section-heading mb-6">All Events</h2>
          <div className="space-y-5">
            {events.map(({ id, title, category, description, date, school }) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row gap-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image with date badge */}
                <div className="relative sm:w-48 min-h-[160px] bg-gray-100 shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300 m-3 rounded-xl text-gray-300 text-xs">
                    [ Photo ]
                  </div>
                  {/* Date badge */}
                  <div className="absolute top-3 left-3 bg-white rounded-lg px-3 py-1.5 text-center shadow min-w-[48px]">
                    <div className="text-lg font-bold text-gray-900 leading-none">{date.day}</div>
                    <div className="text-xs font-medium text-gray-400 uppercase">{date.month}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-8 py-6 flex flex-col justify-center">
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">
                    {category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{description}</p>
                  <p className="text-xs text-gray-400">{school}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center px-8 py-6 shrink-0">
                  <a
                    href="#"
                    className="btn-primary text-sm whitespace-nowrap"
                  >
                    Learn More
                  </a>
                </div>
              </div>
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
