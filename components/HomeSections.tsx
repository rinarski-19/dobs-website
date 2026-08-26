import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, CakeSlice, CalendarDays, Gift, MapPin, Newspaper, Quote, Sparkles } from 'lucide-react'

export type HomeNewsItem = {
  _id: string
  title: string
  slug: string
  category?: string
  excerpt?: string
  publishedAt?: string
  imageUrl?: string
  schoolName?: string
}

export type HomeEventItem = {
  _id: string
  title: string
  startDate: string
  location?: string
  schoolName?: string
  description?: string
}

export type Testimonial = {
  _key?: string
  quote: string
  name: string
  role?: string
  school?: string
}

export type BirthdayCelebrant = {
  _key?: string
  name: string
  role?: string
  school?: string
  birthday?: string
  greeting?: string
  imageUrl?: string
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-PH', options).format(new Date(value))
}

export function LatestNewsSection({ items, heading }: { items: HomeNewsItem[]; heading: string }) {
  if (items.length === 0) return null

  return (
    <section className="section">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow mb-2">Newsroom</span>
          <h2 className="section-heading mb-0">{heading}</h2>
          <span className="gold-rule" />
        </div>
        <Link href="/news" className="hidden items-center gap-1 text-sm font-semibold text-primary-700 hover:text-gold-600 transition-colors sm:inline-flex">
          View all <ArrowRight size={15} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div>
          <div className="rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/70 px-6 py-10 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-700 shadow-sm">
              <Newspaper size={30} aria-hidden="true" />
            </span>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-primary-900">New stories and announcements from our member schools are coming soon.</p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" aria-hidden="true">
            {[1, 2, 3].map(item => (
              <div key={item} className="overflow-hidden rounded-2xl border border-parchment-200 bg-white shadow-sm">
                <div className="aspect-video animate-pulse bg-parchment-100" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 rounded bg-primary-100" />
                  <div className="h-5 w-4/5 rounded bg-gray-100" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map(item => (
            <Link key={item._id} href={`/news/${item.slug}`} className="card group overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="relative h-44 w-full overflow-hidden">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-800 to-primary-500 text-sm text-white/80">DOBS News</div>
                )}
              </div>
              <div className="p-6">
                {item.category && <span className="badge mb-3">{item.category}</span>}
                <h3 className="card-title transition-colors group-hover:text-primary-700">{item.title}</h3>
                {item.excerpt && <p className="card-body mt-2 line-clamp-3">{item.excerpt}</p>}
                {item.publishedAt && <p className="mt-4 text-xs text-gray-400">{formatDate(item.publishedAt, { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link href="/news" className="btn-secondary mt-5 sm:hidden">View All News <ArrowRight size={16} /></Link>
    </section>
  )
}

export function UpcomingEventsSection({ items, heading }: { items: HomeEventItem[]; heading: string }) {
  return (
    <section className="section">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow mb-2">Calendar</span>
          <h2 className="section-heading mb-0">{heading}</h2>
          <span className="gold-rule" />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-primary-200 bg-primary-50 px-6 py-10 text-center text-primary-950">
          <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
            <span className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-primary-700 text-white">
              <span className="text-[10px] font-bold uppercase text-gold-300">Date</span>
              <span className="text-xl font-bold leading-none">—</span>
            </span>
            <CalendarDays size={34} className="text-primary-700" aria-hidden="true" />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7">There are no upcoming events currently listed. Please check again for new activities and important dates.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {items.map(item => (
            <div key={item._id} className="flex h-full flex-col gap-5 rounded-2xl border border-parchment-200 bg-white p-5 shadow-card transition-shadow hover:shadow-md">
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-700 text-white">
                <span className="text-xs font-bold uppercase text-gold-300">{formatDate(item.startDate, { month: 'short' })}</span>
                <span className="text-3xl font-bold leading-none">{formatDate(item.startDate, { day: 'numeric' })}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-sans text-lg font-bold text-gray-900">{item.title}</h3>
                <div className="mt-2 flex flex-col gap-1.5 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {formatDate(item.startDate, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {formatDate(item.startDate, { hour: 'numeric', minute: '2-digit' })}</span>
                  {item.location && <span className="inline-flex items-center gap-1"><MapPin size={14} /> {item.location}</span>}
                  {item.schoolName && <span>{item.schoolName}</span>}
                </div>
                {item.description && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/events" className="btn-secondary mt-5">View Events Calendar <ArrowRight size={16} /></Link>
    </section>
  )
}

export function TestimonialsSection({ items, heading }: { items: Testimonial[]; heading: string }) {
  if (items.length === 0) return null

  return (
    <section className="section">
      <div className="mb-6">
        <span className="eyebrow mb-2">Our Community</span>
        <h2 className="section-heading mb-0">{heading}</h2>
        <span className="gold-rule" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <figure key={item._key ?? `${item.name}-${index}`} className="card relative border-parchment-200 bg-parchment-50">
            <Quote className="absolute right-5 top-5 text-gold-300" size={32} />
            <blockquote className="pr-8 text-gray-700 leading-relaxed">“{item.quote}”</blockquote>
            <figcaption className="mt-6 border-t border-parchment-200 pt-4">
              <div className="font-semibold text-primary-800">{item.name}</div>
              {(item.role || item.school) && <div className="text-sm text-gray-500">{[item.role, item.school].filter(Boolean).join(' · ')}</div>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function BirthdaySection({ title, message, celebrants }: { title: string; message?: string; celebrants: BirthdayCelebrant[] }) {
  return (
    <section className="section">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1c2e] via-[#285943] to-[#16324F] p-8 text-white md:p-10">
        <Sparkles className="absolute right-8 top-7 text-gold-300/30" size={38} aria-hidden="true" />
        <Gift className="absolute bottom-8 right-20 rotate-12 text-gold-300/20" size={32} aria-hidden="true" />
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300"><CakeSlice size={17} aria-hidden="true" /> A special celebration</p>
          <h2 className="font-diocesan text-3xl font-semibold md:text-4xl">{title}</h2>
          <p className="mt-3 text-white/75">{message || 'Birthday celebrants from our school community will be featured here.'}</p>
        </div>
        {celebrants.length === 0 ? (
          <div className="rounded-2xl bg-white/10 p-6 text-center text-white/75 backdrop-blur-sm">
            No birthday celebrants are listed this week. Please check again soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {celebrants.map((celebrant, index) => (
              <div key={celebrant._key ?? `${celebrant.name}-${index}`} className="flex items-center gap-5 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                {celebrant.imageUrl ? (
                  <Image src={celebrant.imageUrl} alt={celebrant.name} width={80} height={80} className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-gold-300/50" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/15 text-2xl font-bold text-white/80">{celebrant.name.charAt(0)}</div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{celebrant.name}</h3>
                  {(celebrant.role || celebrant.school) && <p className="mt-1 text-sm text-white/65">{[celebrant.role, celebrant.school].filter(Boolean).join(' · ')}</p>}
                  {celebrant.birthday && <p className="mt-1 text-sm font-semibold text-gold-300">{formatDate(celebrant.birthday, { month: 'long', day: 'numeric' })}</p>}
                  {celebrant.greeting && <p className="mt-3 text-sm leading-relaxed text-white/80">{celebrant.greeting}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

type LocationSchool = { _id: string; name: string; slug?: string; city?: string }

export function SchoolLocationsSection({ schools, heading }: { schools: LocationSchool[]; heading: string }) {
  const locations = Array.from(
    schools.reduce((groups, school) => {
      const city = school.city || 'Baguio and Benguet'
      const current = groups.get(city) ?? []
      current.push(school)
      groups.set(city, current)
      return groups
    }, new Map<string, LocationSchool[]>())
  )

  if (locations.length === 0) return null

  return (
    <section className="section">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow mb-2">Where We Serve</span>
          <h2 className="section-heading mb-0">{heading}</h2>
          <span className="gold-rule" />
          <p className="section-body mt-3">Find a Diocese of Baguio school serving your community.</p>
        </div>
        <Link href="/schools" className="hidden items-center gap-1 text-sm font-semibold text-primary-700 hover:text-gold-600 transition-colors sm:inline-flex">Browse schools <ArrowRight size={15} /></Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter schools by municipality">
        {locations.slice(0, 6).map(([city, citySchools]) => (
          <Link key={city} href={`/schools?location=${encodeURIComponent(city)}`} className="rounded-full border-2 border-primary-300 bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:border-primary-700 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
            {city} ({citySchools.length})
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="min-h-80 overflow-hidden rounded-2xl border border-primary-200 bg-primary-50 shadow-card">
          <iframe title="Map of Diocese of Baguio school communities" src="https://www.google.com/maps?q=Catholic%20schools%20Baguio%20City%20Benguet&output=embed" className="h-full min-h-80 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
        {locations.slice(0, 4).map(([city, citySchools]) => (
          <div
            key={city}
            className="flex flex-col rounded-2xl border border-parchment-200 bg-white p-5 shadow-card transition-all hover:border-primary-300 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <MapPin size={18} />
                </span>
                <div>
                  <h3 className="font-sans font-semibold leading-tight text-gray-900">{city}</h3>
                  <p className="text-xs text-gray-500">{citySchools.length} {citySchools.length === 1 ? 'school' : 'schools'}</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city}, Philippines`)}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${city} on Google Maps`}
                className="-mr-1 -mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <ArrowUpRight size={22} strokeWidth={2.25} />
              </a>
            </div>

            <Link href={`/schools?location=${encodeURIComponent(city)}`} className="mt-auto inline-flex items-center gap-2 border-t border-parchment-200 pt-4 text-sm font-semibold text-primary-700 hover:text-primary-900">View Schools in This Area <ArrowRight size={14} /></Link>
          </div>
        ))}
        </div>
      </div>
      {locations.length > 4 && <div className="mt-6 text-center"><Link href="/schools" className="btn-secondary">View All Locations <ArrowRight size={16} /></Link></div>}
    </section>
  )
}
