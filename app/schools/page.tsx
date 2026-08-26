import Hero from '@/components/Hero'
import { getPageContent, imageUrlFor, urlFor } from '@/lib/sanity'
import { getSchools } from '@/lib/schools'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, ExternalLink, Grid3X3, Map, MapPin, Search, SearchX, SlidersHorizontal } from 'lucide-react'

export const dynamic = 'force-dynamic'

type SchoolsPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  emptyStateText?: string
}

const fallbackPageContent = {
  heroTitle: 'Our Schools',
  heroSubtitle: 'Member Schools',
  heroDescription: 'Browse all member schools under the Diocese of Baguio Schools network across Baguio City and Benguet.',
  emptyStateText: 'No schools added yet. Add schools in the Sanity Studio.',
}

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; location?: string; level?: string; enrollment?: string; view?: string }>
}) {
  const [schools, content] = await Promise.all([
    getSchools(),
    getPageContent<SchoolsPageContent>('schoolsPage'),
  ])
  const resolvedSearchParams = await searchParams
  const selectedLocation = resolvedSearchParams?.location || 'all'
  const selectedLevel = resolvedSearchParams?.level || 'all'
  const selectedEnrollment = resolvedSearchParams?.enrollment || 'all'
  const searchQuery = resolvedSearchParams?.query?.trim() || ''
  const selectedView = resolvedSearchParams?.view === 'map' ? 'map' : 'grid'
  const normalizedSearchQuery = searchQuery.toLowerCase()
  const locations = Array.from(new Set(schools.map(school => school.city).filter((city): city is string => Boolean(city)))).sort()
  const levels = Array.from(new Set(schools.flatMap(school => school.levels || []))).sort()
  const filteredSchools = schools.filter(school => {
    const matchesSearch = !normalizedSearchQuery
      || school.name.toLowerCase().includes(normalizedSearchQuery)
      || school.city?.toLowerCase().includes(normalizedSearchQuery)
    const matchesLocation = selectedLocation === 'all' || school.city === selectedLocation
    const matchesLevel = selectedLevel === 'all' || school.levels?.includes(selectedLevel)
    const matchesEnrollment = selectedEnrollment === 'all'
      || (selectedEnrollment === 'open' ? school.enrollmentOpen : !school.enrollmentOpen)
    return matchesSearch && matchesLocation && matchesLevel && matchesEnrollment
  })
  const locationHref = (location: string) => {
    const params = new URLSearchParams()
    if (location !== 'all') params.set('location', location)
    if (selectedLevel !== 'all') params.set('level', selectedLevel)
    if (selectedEnrollment !== 'all') params.set('enrollment', selectedEnrollment)
    if (searchQuery) params.set('query', searchQuery)
    if (selectedView === 'map') params.set('view', 'map')
    return params.size ? `/schools?${params.toString()}` : '/schools'
  }
  const viewHref = (view: 'grid' | 'map') => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('query', searchQuery)
    if (selectedLocation !== 'all') params.set('location', selectedLocation)
    if (selectedLevel !== 'all') params.set('level', selectedLevel)
    if (selectedEnrollment !== 'all') params.set('enrollment', selectedEnrollment)
    if (view === 'map') params.set('view', 'map')
    return params.size ? `/schools?${params.toString()}` : '/schools'
  }

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackPageContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackPageContent.heroSubtitle}
        description={content?.heroDescription || fallbackPageContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
        imagePlaceholder="Schools Network Photo"
      />

      <section className="bg-parchment-100">
        <div className="page-wrapper">

        <div className="mb-10 max-w-3xl">
          <span className="eyebrow mb-3 text-gold-700">Our Network</span>
          <h2 className="font-diocesan text-4xl font-semibold leading-tight text-primary-900 md:text-5xl">Find a Member School</h2>
          <span className="gold-rule mt-5" />
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            Explore Catholic schools serving families across Baguio City and Benguet, and find the community, location, and educational level that best support your child.
          </p>
        </div>

        {schools.length > 0 && (
          <>
            <div className="mb-9 rounded-2xl border border-primary-100 bg-primary-50/60 p-5 md:p-6">
              <div className="mb-5 flex items-center gap-2 text-primary-900">
                <SlidersHorizontal size={20} aria-hidden="true" />
                <h3 className="font-sans text-base font-bold">Filter Member Schools</h3>
              </div>

              <nav aria-label="Filter schools by location" className="mb-5 flex flex-wrap gap-2.5">
                {['all', ...locations].map(location => {
                  const isActive = selectedLocation === location
                  return (
                    <Link
                      key={location}
                      href={locationHref(location)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`inline-flex min-h-10 items-center rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
                        isActive
                          ? 'border-primary-700 bg-primary-700 text-white shadow-sm'
                          : 'border-primary-500 bg-white text-primary-700 hover:border-primary-800 hover:bg-primary-50'
                      }`}
                    >
                      {location === 'all' ? `All Locations (${schools.length})` : location}
                    </Link>
                  )
                })}
              </nav>

              <form action="/schools" method="get" role="search" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(16rem,1.35fr)_1fr_1fr_auto_auto] lg:items-end">
                {selectedLocation !== 'all' && <input type="hidden" name="location" value={selectedLocation} />}
                {selectedView === 'map' && <input type="hidden" name="view" value="map" />}
                <div>
                  <label htmlFor="school-search" className="form-label">Search Schools</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-600" size={18} aria-hidden="true" />
                    <input
                      id="school-search"
                      name="query"
                      type="search"
                      defaultValue={searchQuery}
                      placeholder="Search by school name or location"
                      className="form-input bg-white pl-11"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="school-level" className="form-label">Education Level</label>
                  <select id="school-level" name="level" defaultValue={selectedLevel} className="form-input bg-white">
                    <option value="all">All education levels</option>
                    {levels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="school-enrollment" className="form-label">Enrollment Status</label>
                  <select id="school-enrollment" name="enrollment" defaultValue={selectedEnrollment} className="form-input bg-white">
                    <option value="all">All enrollment statuses</option>
                    <option value="open">Open for enrollment</option>
                    <option value="closed">Not marked open</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary">Apply Filters</button>
                <Link href="/schools" className="btn-secondary">Reset</Link>
              </form>
            </div>
          </>
        )}
        </div>
      </section>

      <section className="bg-white">
        <div className="page-wrapper">
        {schools.length === 0 ? (
          <div className="placeholder-block">
            {content?.emptyStateText || fallbackPageContent.emptyStateText}{' '}
            <Link href="/studio" className="text-primary-600 underline">Sanity Studio</Link>.
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <p className="text-base font-semibold text-primary-900" aria-live="polite">
                Showing {filteredSchools.length} member {filteredSchools.length === 1 ? 'school' : 'schools'}
                {filteredSchools.length !== schools.length && <span className="font-normal text-gray-500"> of {schools.length}</span>}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {(searchQuery || selectedLocation !== 'all' || selectedLevel !== 'all' || selectedEnrollment !== 'all') && (
                  <Link href={selectedView === 'map' ? '/schools?view=map' : '/schools'} className="text-sm font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                    Clear all filters
                  </Link>
                )}
                <div className="inline-flex rounded-lg border border-primary-200 bg-primary-50 p-1" aria-label="School directory view">
                  <Link
                    href={viewHref('grid')}
                    aria-current={selectedView === 'grid' ? 'page' : undefined}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${selectedView === 'grid' ? 'bg-primary-700 text-white shadow-sm' : 'text-primary-700 hover:bg-white'}`}
                  >
                    <Grid3X3 size={16} aria-hidden="true" /> Grid View
                  </Link>
                  <Link
                    href={viewHref('map')}
                    aria-current={selectedView === 'map' ? 'page' : undefined}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${selectedView === 'map' ? 'bg-primary-700 text-white shadow-sm' : 'text-primary-700 hover:bg-white'}`}
                  >
                    <Map size={16} aria-hidden="true" /> Map View
                  </Link>
                </div>
              </div>
            </div>

            {filteredSchools.length > 0 ? (
              selectedView === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSchools.map(school => (
                <Link
                  key={school._id}
                  href={`/schools/${school.slug.current}`}
                  aria-label={`View ${school.name}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-video overflow-visible bg-parchment-100">
                    <div className="absolute inset-0 overflow-hidden">
                      {school.coverPhoto ? (
                        <Image
                          src={urlFor(school.coverPhoto).width(1200).height(675).fit('crop').url()}
                          alt={`${school.name} campus`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-800 to-primary-600 text-sm font-medium text-white/75">School campus photo</div>
                      )}
                    </div>

                    <div className="absolute -bottom-7 left-5 z-10 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-white text-xl font-bold text-primary-800 shadow-md">
                      {school.logo ? (
                        <Image
                          src={urlFor(school.logo).width(160).height(160).fit('max').url()}
                          alt={`${school.name} logo`}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : school.name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-11">
                    <h3 className="font-diocesan text-2xl font-semibold leading-tight text-primary-950 transition-colors group-hover:text-primary-700 md:text-[1.7rem]">
                      {school.name}
                    </h3>

                    {(school.address || school.city) && (
                      <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-600">
                        <MapPin className="mt-1 shrink-0 text-primary-600" size={16} aria-hidden="true" />
                        <span>{[school.address, school.city].filter(Boolean).join(', ')}</span>
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {school.levels?.map(level => (
                        <span key={level} className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{level}</span>
                      ))}
                      {school.enrollmentOpen && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-white">
                          <BadgeCheck size={13} aria-hidden="true" /> Open for Enrollment
                        </span>
                      )}
                    </div>

                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary-700">
                      View School
                      <ArrowRight className="transition-transform group-hover:translate-x-1" size={17} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
              </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <div className="min-h-[30rem] overflow-hidden rounded-2xl border border-primary-200 bg-primary-50 shadow-card">
                    <iframe
                      title="Map of Diocese of Baguio member school area"
                      src="https://www.google.com/maps?q=Catholic%20schools%20Baguio%20City%20Benguet&output=embed"
                      className="h-full min-h-[30rem] w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                  <div className="space-y-3 lg:max-h-[38rem] lg:overflow-y-auto lg:pr-2">
                    {filteredSchools.map(school => {
                      const mapQuery = encodeURIComponent([school.name, school.address, school.city, 'Philippines'].filter(Boolean).join(', '))
                      return (
                        <div key={school._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="font-diocesan text-xl font-semibold text-primary-950">{school.name}</h3>
                          {(school.address || school.city) && (
                            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-gray-600">
                              <MapPin className="mt-1 shrink-0 text-primary-600" size={15} aria-hidden="true" />
                              {[school.address, school.city].filter(Boolean).join(', ')}
                            </p>
                          )}
                          <div className="mt-4 flex flex-wrap gap-3">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                            >
                              Open in Google Maps <ExternalLink size={14} aria-hidden="true" />
                            </a>
                            <Link href={`/schools/${school.slug.current}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                              View School <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            ) : (
              <div className="rounded-2xl border border-primary-200 bg-primary-50 px-6 py-14 text-center text-primary-900">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-700 shadow-sm">
                  <SearchX size={30} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-diocesan text-3xl font-semibold">No member schools found</h3>
                <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
                  No member schools match your search or selected filters. Try another school name, location, education level, or enrollment status.
                </p>
                <Link href="/schools" className="btn-primary mt-6">Clear Filters</Link>
              </div>
            )}
          </>
        )}

        </div>
      </section>

      <section className="bg-primary-800 text-white">
        <div className="page-wrapper py-16 text-center md:py-20">
          <span className="eyebrow mb-4 text-gold-300">Take the Next Step</span>
          <h2 className="mx-auto max-w-3xl font-diocesan text-4xl font-semibold leading-tight md:text-5xl">
            Find the right school for your child
          </h2>
          <span className="mx-auto my-6 block h-0.5 w-12 rounded-full bg-gold-500" />
          <p className="mx-auto max-w-2xl leading-7 text-primary-100">
            Review the enrollment process or speak with the Diocese of Baguio Schools office for guidance in choosing a member school.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/enrollment" className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-800 shadow-sm transition-all hover:bg-primary-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto">
              View Enrollment Guide
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} aria-hidden="true" />
            </Link>
            <Link href="/contact" className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-all hover:border-gold-400 hover:bg-gold-400 hover:text-primary-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto">
              Contact the DOBS Office
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
