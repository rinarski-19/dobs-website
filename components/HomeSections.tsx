import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPHDate } from '@/lib/dates'
import { ArrowRight, ArrowUpRight, Balloon, Building2, Cake, CakeSlice, CalendarDays, Clock3, Gift, Heart, MapPin, Newspaper, PartyPopper, Quote, Sparkle, Sparkles, Star, Sun } from 'lucide-react'

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
  return formatPHDate(value, options)
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
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-primary-900">New stories and announcements from the schools are coming soon.</p>
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

export function BirthdaySection({ title, message, emptyText, celebrants }: { title: string; message?: string; emptyText?: string; celebrants: BirthdayCelebrant[] }) {
  const count = celebrants.length
  // Only cap the height once the list is long enough that the section would run
  // away; five or six celebrants should simply be visible, not behind a scrollbar.
  const useScroll = count > 6

  // Flex-wrap rather than a grid, so a lone celebrant sits centred.
  const rowClass = `relative z-10 flex flex-wrap justify-center gap-4${useScroll ? ' max-h-[34rem] overflow-y-auto pr-1' : ''}`

  // Every card is the same width; the shape of the rows comes from where the
  // line breaks, not from resizing cards.
  const cardWidth = count > 4
    ? 'w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-0.667rem)]'
    : 'w-full sm:w-[calc(50%-0.5rem)]'

  // Three to a row on wide screens leaves the last row short unless the count
  // divides by three, so the remainder is taken as a short row of two at the
  // top: five reads as two then three, seven as two rows of two then three.
  // The breaks are zero-height full-width spacers, with a negative margin that
  // cancels the extra flex gap they would otherwise introduce.
  const breakAfter = new Set<number>(
    count > 4 ? ({ 0: [], 1: [1, 3], 2: [1] } as Record<number, number[]>)[count % 3] : [],
  )

  return (
    // Not `.section` (py-12): the Academic Programs section that follows is also
    // white, so its py-20 top padding stacks with a bottom padding here into one
    // oversized gap, while the navy stats band above contributes none. Matching
    // the top padding to the next section's and dropping the bottom leaves equal
    // white space on both sides of the card.
    <section className="pt-16 pb-0 md:pt-20">
      <div className="relative overflow-hidden rounded-3xl border border-morning-breeze/75 bg-gradient-to-br from-cloud-puff via-white to-morning-breeze/45 p-6 text-primary-900 shadow-card sm:p-8 md:p-10 xl:px-20">
        {/* Radiant blobs — outer wrapper wanders, inner blob pulses its glow.
            The static opacity on each blob is the reduced-motion resting state. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-16 -top-20 h-72 w-72 motion-safe:animate-blob-drift">
            <div className="h-full w-full rounded-full bg-sunwashed opacity-60 blur-3xl motion-safe:animate-radiate" />
          </div>
          <div className="absolute -bottom-24 -left-16 h-80 w-80 motion-safe:animate-blob-drift [animation-delay:6s]">
            <div className="h-full w-full rounded-full bg-morning-breeze opacity-50 blur-3xl motion-safe:animate-radiate [animation-delay:2.3s]" />
          </div>
          <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 motion-safe:animate-blob-drift [animation-delay:11s]">
            <div className="h-full w-full rounded-full bg-buttercup-sky opacity-55 blur-3xl motion-safe:animate-radiate [animation-delay:4.6s]" />
          </div>
          <div className="absolute -right-10 bottom-0 h-56 w-56 motion-safe:animate-blob-drift [animation-delay:3s]">
            <div className="h-full w-full rounded-full bg-cloud-puff opacity-70 blur-3xl motion-safe:animate-radiate [animation-delay:5.8s]" />
          </div>
        </div>

        {/* Decorative iconography. The pastels are only legible on a navy
            disc, and nothing may sit over text or over the celebrant-count
            badge — so apart from one corner piece everything lives in the
            xl:px-20 gutters, spread evenly down both edges so a short section
            (one or two celebrants) does not bunch them together.
            Hidden below lg, where the heading wraps full-width. */}

        {/* Top-right corner — the only piece inside the header band */}
        <span className="pointer-events-none absolute right-7 top-6 hidden h-12 w-12 items-center justify-center rounded-full bg-primary-700 text-buttercup-sky shadow-card motion-safe:animate-twinkle lg:flex" aria-hidden="true">
          <Sparkles size={22} />
        </span>

        {/* Left gutter */}
        <span className="pointer-events-none absolute left-4 top-[18%] hidden h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-sunwashed shadow-card motion-safe:animate-twinkle [animation-delay:1.4s] xl:flex" aria-hidden="true">
          <Star size={17} />
        </span>
        <span className="pointer-events-none absolute left-4 top-[40%] hidden h-11 w-11 items-center justify-center rounded-full bg-primary-700 text-cloud-puff shadow-card motion-safe:animate-float [animation-delay:2s] xl:flex" aria-hidden="true">
          <Cake size={19} />
        </span>
        <span className="pointer-events-none absolute left-4 top-[62%] hidden h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sunwashed shadow-card motion-safe:animate-drift [animation-delay:4.2s] xl:flex" aria-hidden="true">
          <Sun size={16} />
        </span>
        <span className="pointer-events-none absolute left-4 top-[84%] hidden h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-buttercup-sky shadow-card motion-safe:animate-twinkle [animation-delay:2.6s] xl:flex" aria-hidden="true">
          <Balloon size={16} />
        </span>

        {/* Right gutter — starts below the badge so the two never crowd */}
        <span className="pointer-events-none absolute right-4 top-[38%] hidden h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sunwashed shadow-card motion-safe:animate-float xl:flex" aria-hidden="true">
          <PartyPopper size={18} />
        </span>
        <span className="pointer-events-none absolute right-4 top-[60%] hidden h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-buttercup-sky shadow-card motion-safe:animate-twinkle [animation-delay:3.4s] xl:flex" aria-hidden="true">
          <Sparkle size={14} />
        </span>
        <span className="pointer-events-none absolute right-4 top-[82%] hidden h-11 w-11 rotate-12 items-center justify-center rounded-full bg-primary-700 text-cloud-puff shadow-card motion-safe:animate-drift xl:flex" aria-hidden="true">
          <Gift size={19} />
        </span>

        <div className="relative z-10 mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {/* Buttercup on navy — 11:1, the one place the pale yellow works as type */}
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-buttercup-sky shadow-sm">
              <CakeSlice size={15} aria-hidden="true" /> A special celebration
            </p>
            <h2 className="font-diocesan text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
            <p className="mt-3 max-w-3xl text-primary-700">{message || 'Birthday celebrants from our school community will be featured here.'}</p>
          </div>

          {celebrants.length > 0 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-700 px-4 py-2 text-sm font-semibold text-sunwashed shadow-sm">
              <PartyPopper size={16} aria-hidden="true" />
              {celebrants.length} {celebrants.length === 1 ? 'celebrant' : 'celebrants'}
            </div>
          )}
        </div>

        {celebrants.length === 0 ? (
          <div className="relative z-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sunwashed bg-cloud-puff/80 p-8 text-center text-primary-700 backdrop-blur-sm">
            <Cake className="text-primary-600" size={30} aria-hidden="true" />
            {emptyText || 'No birthday celebrants today. Check back tomorrow!'}
          </div>
        ) : (
          <div className={rowClass}>
            {celebrants.map((celebrant, index) => (
              <Fragment key={celebrant._key ?? `${celebrant.name}-${index}`}>
              <div
                className={`group flex flex-col gap-4 rounded-2xl border border-morning-breeze/50 bg-white/85 p-4 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-sunwashed hover:shadow-card motion-safe:animate-rise-in sm:flex-row sm:items-center sm:p-5 ${count === 1 ? 'w-full max-w-2xl' : cardWidth}`}
                style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
              >
                <div className="relative shrink-0">
                  {celebrant.imageUrl ? (
                    <Image src={celebrant.imageUrl} alt={celebrant.name} width={88} height={88} className="h-20 w-20 rounded-full object-cover ring-2 ring-sunwashed sm:h-[5.5rem] sm:w-[5.5rem]" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-700 text-2xl font-bold text-buttercup-sky ring-2 ring-sunwashed sm:h-[5.5rem] sm:w-[5.5rem]">{celebrant.name.charAt(0)}</div>
                  )}
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-700 text-buttercup-sky shadow-sm transition-transform group-hover:scale-110">
                    <CakeSlice size={14} aria-hidden="true" />
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{celebrant.name}</h3>
                  {(celebrant.role || celebrant.school) && <p className="mt-1 text-sm text-primary-600">{[celebrant.role, celebrant.school].filter(Boolean).join(' · ')}</p>}
                  {celebrant.birthday && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-sunwashed bg-buttercup-sky/60 px-2.5 py-1 text-xs font-semibold text-primary-800">
                      <Cake size={13} aria-hidden="true" />
                      {formatDate(celebrant.birthday, { month: 'long', day: 'numeric' })}
                    </p>
                  )}
                  {celebrant.greeting && (
                    <p className="mt-3 flex gap-2 text-sm leading-relaxed text-primary-700">
                      <Heart size={14} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
                      <span>{celebrant.greeting}</span>
                    </p>
                  )}
                </div>
              </div>
              {breakAfter.has(index) && <div className="hidden h-0 w-full -mt-4 xl:block" aria-hidden="true" />}
              </Fragment>
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
