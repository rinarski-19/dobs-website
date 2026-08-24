import Hero from '@/components/Hero'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { MapPin, Phone, Mail, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

type School = {
  _id: string
  name: string
  slug: { current: string }
  logo?: any
  coverPhoto?: any
  address?: string
  city?: string
  phone?: string
  email?: string
  levels?: string[]
  description?: any[]
  principalName?: string
  principalTitle?: string
  principalPhoto?: any
  principalMessage?: any[]
  enrollmentOpen?: boolean
}

async function getSchool(slug: string): Promise<School | null> {
  return client.fetch(
    `*[_type == "school" && slug.current == $slug][0] {
      _id, name, slug, logo, coverPhoto,
      address, city, phone, email,
      levels, description, enrollmentOpen,
      principalName, principalTitle, principalPhoto, principalMessage
    }`,
    { slug }
  )
}

export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const school = await getSchool(slug)
  if (!school) notFound()

  const coverUrl = school.coverPhoto
    ? urlFor(school.coverPhoto).width(1400).height(500).fit('crop').url()
    : undefined

  return (
    <>
      <Hero
        title={school.name}
        subtitle="Member School"
        description={school.city ? `${school.address ?? ''} ${school.city}`.trim() : undefined}
        image={coverUrl}
        imagePlaceholder="School Cover Photo"
        ctaSecondary={school.enrollmentOpen ? { label: 'Enroll Now', href: '/enrollment' } : undefined}
      />

      <div className="page-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="md:col-span-2 space-y-8">

            {school.description && school.description.length > 0 && (
              <section className="section">
                <h2 className="section-heading">About This School</h2>
                <div className="prose prose-gray max-w-none">
                  {school.description.map((block: any, i: number) => {
                    if (block._type === 'block' && block.children) {
                      const text = block.children.map((c: any) => c.text).join('')
                      const style = block.style || 'normal'
                      if (style === 'h2') return <h2 key={i} className="section-heading">{text}</h2>
                      if (style === 'h3') return <h3 key={i} className="font-semibold text-gray-800 mb-2">{text}</h3>
                      return <p key={i} className="card-body mb-3">{text}</p>
                    }
                    return null
                  })}
                </div>
              </section>
            )}

            {school.principalName && (
              <section className="section">
                <span className="eyebrow mb-2">Leadership</span>
                <h2 className="section-heading mb-0">Message from the Principal</h2>
                <span className="gold-rule mb-6" />
                <div className="flex flex-col gap-6 rounded-2xl border border-parchment-200 bg-white p-6 shadow-card sm:flex-row sm:items-start">
                  {school.principalPhoto ? (
                    <Image
                      src={urlFor(school.principalPhoto).width(320).height(320).fit('crop').url()}
                      alt={school.principalName}
                      width={128}
                      height={128}
                      className="h-32 w-32 shrink-0 rounded-2xl object-cover ring-1 ring-parchment-200"
                    />
                  ) : (
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-4xl font-bold text-white/90">
                      {school.principalName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-sans text-lg font-bold text-primary-800">{school.principalName}</h3>
                    {school.principalTitle && (
                      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-600">{school.principalTitle}</p>
                    )}
                    {school.principalMessage && school.principalMessage.length > 0 && (
                      <div className="prose prose-gray max-w-none">
                        {school.principalMessage.map((block: any, i: number) => {
                          if (block._type === 'block' && block.children) {
                            const text = block.children.map((c: any) => c.text).join('')
                            return <p key={i} className="card-body mb-3">{text}</p>
                          }
                          return null
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {school.levels && school.levels.length > 0 && (
              <section className="section">
                <h2 className="section-heading">Programs Offered</h2>
                <div className="flex flex-wrap gap-3">
                  {school.levels.map(level => (
                    <span key={level} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                      <BookOpen size={14} /> {level}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {school.logo && (
              <div className="card flex items-center justify-center p-6">
                <img
                  src={urlFor(school.logo).width(200).url()}
                  alt={`${school.name} logo`}
                  className="max-h-24 object-contain"
                />
              </div>
            )}

            <div className="card">
              <h3 className="card-title mb-4">School Info</h3>
              <ul className="space-y-3 text-sm">
                {school.address && (
                  <li className="flex items-start gap-2 text-gray-600">
                    <MapPin size={14} className="mt-0.5 text-primary-500 shrink-0" />
                    <span>{school.address}{school.city ? `, ${school.city}` : ''}</span>
                  </li>
                )}
                {school.phone && (
                  <li className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} className="text-primary-500 shrink-0" />
                    <a href={`tel:${school.phone}`} className="hover:text-primary-600">{school.phone}</a>
                  </li>
                )}
                {school.email && (
                  <li className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} className="text-primary-500 shrink-0" />
                    <a href={`mailto:${school.email}`} className="hover:text-primary-600 break-all">{school.email}</a>
                  </li>
                )}
                {school.levels && school.levels.length > 0 && (
                  <li className="flex items-start gap-2 text-gray-600">
                    <BookOpen size={14} className="mt-0.5 text-primary-500 shrink-0" />
                    <span>{school.levels.join(', ')}</span>
                  </li>
                )}
              </ul>
            </div>

            {school.enrollmentOpen && (
              <Link href="/enrollment" className="btn-primary w-full justify-center">
                Enroll Here
              </Link>
            )}

            <Link href="/schools" className="btn-secondary w-full justify-center">
              ← Back to Schools
            </Link>
          </aside>

        </div>
      </div>
    </>
  )
}
