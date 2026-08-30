import Hero from '@/components/Hero'
import PortableText, { type Block } from '@/components/PortableText'
import { fetchSanity, getPageContent, imageUrlFor, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, School, Tag } from 'lucide-react'

export const revalidate = 60

type EventDetail = {
  _id: string
  title: string
  category?: string
  startDate: string
  endDate?: string
  location?: string
  registrationLink?: string
  description?: Block[]
  featuredImage?: any
  school?: { name?: string; city?: string; slug?: string }
}

type EventsPageContent = { heroImage?: any }

const MANILA = 'Asia/Manila'
const fmt = (value: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-PH', { ...options, timeZone: MANILA }).format(new Date(value))

async function getEvent(slug: string) {
  return fetchSanity<EventDetail | null>(
    `*[_type == "event" && slug.current == $slug][0] {
      _id, title, category, startDate, endDate, location, registrationLink,
      description, featuredImage, school->{ name, city, "slug": slug.current }
    }`,
    { slug },
  )
}

async function getOtherEvents(slug: string) {
  return fetchSanity<Array<{ _id: string; title: string; slug?: string; startDate: string }>>(
    `*[_type == "event" && defined(slug.current) && slug.current != $slug]
      | order(startDate asc)[0...3] { _id, title, "slug": slug.current, startDate }`,
    { slug },
  )
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [event, others, eventsPage] = await Promise.all([
    getEvent(slug),
    getOtherEvents(slug),
    getPageContent<EventsPageContent>('eventsPage'),
  ])

  if (!event) notFound()

  const image = event.featuredImage
    ? urlFor(event.featuredImage).width(1800).height(900).fit('crop').url()
    : imageUrlFor(eventsPage?.heroImage)

  const dateLabel = fmt(event.startDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const startTime = fmt(event.startDate, { hour: 'numeric', minute: '2-digit' })
  const endTime = event.endDate ? fmt(event.endDate, { hour: 'numeric', minute: '2-digit' }) : null
  const sameDay = event.endDate
    ? fmt(event.endDate, { year: 'numeric', month: 'long', day: 'numeric' }) ===
      fmt(event.startDate, { year: 'numeric', month: 'long', day: 'numeric' })
    : true

  const details = [
    { icon: CalendarDays, label: 'Date', value: sameDay ? dateLabel : `${dateLabel} — ${fmt(event.endDate as string, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` },
    { icon: Clock3, label: 'Time', value: endTime && sameDay ? `${startTime} – ${endTime}` : startTime },
    { icon: MapPin, label: 'Location', value: event.location || 'To be announced' },
    { icon: School, label: 'Organised by', value: event.school?.name || 'Diocese of Baguio Schools' },
  ]

  return (
    <>
      <Hero
        title={event.title}
        subtitle={event.category || 'School Calendar'}
        image={image}
        imagePlaceholder="Event Photo"
      />

      <div className="page-wrapper">
        <div className="mx-auto max-w-4xl">
          <Link href="/events" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary-700">
            <ArrowLeft size={15} aria-hidden="true" /> Back to Events
          </Link>

          <h1 className="font-diocesan text-3xl font-bold leading-tight text-primary-800 md:text-4xl">{event.title}</h1>
          {event.category && (
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-gray-500">
              <Tag size={15} aria-hidden="true" /> <span className="badge">{event.category}</span>
            </span>
          )}

          <dl className="mt-8 grid gap-4 rounded-2xl border border-primary-100 bg-primary-50 p-6 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 shrink-0 text-primary-600" size={18} aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">{label}</dt>
                  <dd className="mt-1 text-sm font-medium text-primary-900">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {event.registrationLink && (
            <a href={event.registrationLink} className="btn-primary mt-7 w-fit" rel="noopener noreferrer" target="_blank">
              Register for this Event <ArrowRight size={17} aria-hidden="true" />
            </a>
          )}

          <div className="divider" />

          {event.description?.length ? (
            <article className="min-w-0"><PortableText value={event.description} /></article>
          ) : (
            <p className="rounded-2xl border border-dashed border-primary-200 bg-primary-50 px-5 py-4 text-sm font-medium text-primary-700">
              No further details have been published for this event yet.
            </p>
          )}

          {others && others.length > 0 && (
            <>
              <div className="divider" />
              <section className="section">
                <h2 className="section-heading">Other Events</h2>
                <ul className="space-y-3">
                  {others.map(other => (
                    <li key={other._id}>
                      <Link href={`/events/${other.slug}`} className="group flex items-center justify-between gap-4 rounded-xl border border-primary-100 bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card">
                        <span>
                          <span className="block font-semibold text-primary-800">{other.title}</span>
                          <span className="mt-0.5 block text-sm text-gray-500">
                            {fmt(other.startDate, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </span>
                        <ArrowRight size={17} className="shrink-0 text-primary-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  )
}
