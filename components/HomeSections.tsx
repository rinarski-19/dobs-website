import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Building2, CakeSlice, CalendarDays, Clock3, Gift, MapPin, Newspaper, Quote, Sparkles } from 'lucide-react'

export type HomeNewsItem = {
  _id: string
  title: string
  slug: string
  category?: string
  excerpt?: string
  publishedAt?: string
  imageUrl?: string
  schoolName?: string
  externalUrl?: string
  sample?: boolean
}

export type HomeEventItem = {
  _id: string
  title: string
  startDate: string
  location?: string
  schoolName?: string
  description?: string
  imageUrl?: string
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
            <Link key={item._id} href={item.externalUrl || (item.sample ? '/news' : `/news/${item.slug}`)} target={item.externalUrl ? '_blank' : undefined} rel={item.externalUrl ? 'noopener noreferrer' : undefined} className="card group overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-md">
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
                {item.schoolName && <p className="mt-3 text-sm font-medium text-primary-700">{item.schoolName}</p>}
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
            <article key={item._id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 p-5 text-white">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title.replace(/^Sample:\s*/, '')}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <CalendarDays className="absolute -bottom-5 -right-3 text-white/10" size={112} strokeWidth={1.2} aria-hidden="true" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-900/20 to-transparent" />
                <div className="relative z-10 flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner backdrop-blur-sm">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300">{formatDate(item.startDate, { month: 'short' })}</span>
                  <span className="font-diocesan text-4xl font-bold leading-none">{formatDate(item.startDate, { day: 'numeric' })}</span>
                  <span className="mt-1 text-xs text-white/70">{formatDate(item.startDate, { year: 'numeric' })}</span>
                </div>
                <span className="absolute right-5 top-5 z-10 rounded-full border border-gold-300/40 bg-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-950">
                  {item.title.startsWith('Sample:') ? 'Sample Event' : 'Upcoming'}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-diocesan text-2xl font-bold leading-tight text-primary-950 transition-colors group-hover:text-primary-700">{item.title.replace(/^Sample:\s*/, '')}</h3>
                <div className="mt-4 flex flex-col gap-2 text-sm leading-5 text-gray-500">
                  <span className="inline-flex items-start gap-2"><Clock3 className="mt-0.5 shrink-0 text-primary-600" size={15} /> {formatDate(item.startDate, { weekday: 'long', hour: 'numeric', minute: '2-digit' })}</span>
                  {item.schoolName && <span className="inline-flex items-start gap-2"><Building2 className="mt-0.5 shrink-0 text-primary-600" size={15} /> {item.schoolName}</span>}
                  {item.location && <span className="inline-flex items-start gap-2"><MapPin className="mt-0.5 shrink-0 text-primary-600" size={15} /> {item.location}</span>}
                </div>
                {item.description && <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">{item.description}</p>}
                <Link href="/events" className="mt-auto inline-flex items-center gap-2 border-t border-gray-100 pt-5 text-sm font-semibold text-primary-700">
                  View Event <ArrowRight className="transition-transform group-hover:translate-x-1" size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
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
  const hasManyCelebrants = celebrants.length > 4

  return (
    <section className="section">
      <div className="relative overflow-hidden rounded-3xl border border-gold-200 bg-gradient-to-br from-gold-50 via-white to-primary-50 p-6 text-primary-900 shadow-card sm:p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(217,188,114,0.34),transparent_24%),radial-gradient(circle_at_12%_88%,rgba(58,102,144,0.12),transparent_28%)]" />
        <Sparkles className="absolute right-8 top-7 text-gold-400/45" size={38} aria-hidden="true" />
        <Gift className="absolute bottom-8 right-20 rotate-12 text-gold-400/35" size={32} aria-hidden="true" />

        <div className="relative z-10 mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600"><CakeSlice size={17} aria-hidden="true" /> A special celebration</p>
            <h2 className="font-diocesan text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
            <p className="mt-3 max-w-3xl text-primary-700">{message || 'Birthday celebrants from our school community will be featured here.'}</p>
          </div>

          {celebrants.length > 0 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-300 bg-white/80 px-4 py-2 text-sm font-semibold text-gold-700 shadow-sm backdrop-blur-sm">
              <CakeSlice size={16} aria-hidden="true" />
              {celebrants.length} {celebrants.length === 1 ? 'celebrant' : 'celebrants'}
            </div>
          )}
        </div>

        {celebrants.length === 0 ? (
          <div className="relative z-10 rounded-2xl border border-dashed border-gold-300 bg-white/75 p-6 text-center text-primary-700 backdrop-blur-sm">
            No birthday celebrants are listed this week. Please check again soon.
          </div>
        ) : (
          <div className={`relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 ${hasManyCelebrants ? 'max-h-[34rem] overflow-y-auto pr-1 xl:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {celebrants.map((celebrant, index) => (
              <div key={celebrant._key ?? `${celebrant.name}-${index}`} className="flex h-full flex-col gap-4 rounded-2xl border border-gold-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-card sm:flex-row sm:items-center sm:p-5">
                {celebrant.imageUrl ? (
                  <Image src={celebrant.imageUrl} alt={celebrant.name} width={88} height={88} className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-gold-300 sm:h-[5.5rem] sm:w-[5.5rem]" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-700 text-2xl font-bold text-white ring-2 ring-gold-300 sm:h-[5.5rem] sm:w-[5.5rem]">{celebrant.name.charAt(0)}</div>
                )}
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{celebrant.name}</h3>
                  {(celebrant.role || celebrant.school) && <p className="mt-1 text-sm text-primary-600">{[celebrant.role, celebrant.school].filter(Boolean).join(' · ')}</p>}
                  {celebrant.birthday && <p className="mt-1 text-sm font-semibold text-gold-700">{formatDate(celebrant.birthday, { month: 'long', day: 'numeric' })}</p>}
                  {celebrant.greeting && <p className="mt-3 text-sm leading-relaxed text-primary-700">{celebrant.greeting}</p>}
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
