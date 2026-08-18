import Hero from '@/components/Hero'
import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

type School = {
  _id: string
  name: string
  slug: { current: string }
  city?: string
  levels?: string[]
  coverPhoto?: any
  enrollmentOpen?: boolean
}

async function getSchools(): Promise<School[]> {
  return client.fetch(`
    *[_type == "school"] | order(name asc) {
      _id,
      name,
      slug,
      city,
      levels,
      coverPhoto,
      enrollmentOpen
    }
  `)
}

export default async function SchoolsPage() {
  const schools = await getSchools()

  return (
    <>
      <Hero
        title="Our Schools"
        subtitle="Member Schools"
        description="Browse all member schools under the Diocese of Baguio Schools network across Baguio City and Benguet."
        imagePlaceholder="Schools Network Photo"
      />

      <div className="page-wrapper">

        {schools.length === 0 ? (
          <div className="placeholder-block">
            No schools added yet. Add schools in the{' '}
            <a href="/studio" className="text-primary-600 underline">Sanity Studio</a>.
          </div>
        ) : (
          <>
            {/* Filter tabs — will be interactive once we know all cities/levels */}
            <div className="flex gap-3 mb-8 flex-wrap">
              <span className="badge">All ({schools.length})</span>
              {Array.from(new Set(schools.map(s => s.city).filter(Boolean))).map(city => (
                <span key={city} className="badge">{city}</span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map(school => (
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
          </>
        )}

      </div>
    </>
  )
}
