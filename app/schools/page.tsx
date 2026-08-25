import Hero from '@/components/Hero'
import { getPageContent, imageUrlFor, urlFor } from '@/lib/sanity'
import { getSchools } from '@/lib/schools'
import Link from 'next/link'
import { MapPin, Search, SlidersHorizontal } from 'lucide-react'

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
  searchParams?: Promise<{ query?: string; location?: string; level?: string; enrollment?: string }>
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

      <div className="page-wrapper">

        <div className="mb-10 max-w-3xl">
          <span className="eyebrow mb-3 text-gold-700">Our Network</span>
          <h2 className="font-diocesan text-4xl font-semibold leading-tight text-primary-900 md:text-5xl">Find a Member School</h2>
          <span className="gold-rule mt-5" />
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            Explore Catholic schools serving families across Baguio City and Benguet, and find the community, location, and educational level that best support your child.
          </p>
        </div>

        {schools.length === 0 ? (
          <div className="placeholder-block">
            {content?.emptyStateText || fallbackPageContent.emptyStateText}{' '}
            <Link href="/studio" className="text-primary-600 underline">Sanity Studio</Link>.
          </div>
        ) : (
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

            <p className="mb-5 text-sm font-medium text-gray-600">
              Showing {filteredSchools.length} of {schools.length} member schools
            </p>

            {filteredSchools.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSchools.map(school => (
                <Link
                  key={school._id}
                  href={`/schools/${school.slug.current}`}
                  className="card hover:shadow-md transition-shadow group"
                >
                  {/* Cover photo */}
                  {school.coverPhoto ? (
                    <img
                      src={urlFor(school.coverPhoto).width(600).height(300).fit('crop').url()}
                      alt={school.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="placeholder-block mb-4 h-40">[ School Photo ]</div>
                  )}

                  <h3 className="card-title group-hover:text-primary-600 transition-colors">
                    {school.name}
                  </h3>

                  {school.city && (
                    <p className="card-body flex items-center gap-1 mb-3">
                      <MapPin size={13} /> {school.city}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {school.levels?.map(level => (
                      <span key={level} className="badge">{level}</span>
                    ))}
                    {school.enrollmentOpen && (
                      <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">
                        Enrolling
                      </span>
                    )}
                  </div>
                </Link>
              ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-primary-200 bg-primary-50 px-6 py-12 text-center text-primary-900">
                No member schools match your search or selected filters. Try another school name, location, level, or enrollment status.
              </div>
            )}
          </>
        )}

      </div>
    </>
  )
}
