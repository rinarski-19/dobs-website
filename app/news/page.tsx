import Hero from '@/components/Hero'
import { getPageHeroImage } from '@/lib/sanity'

export default async function NewsPage() {
  const heroImage = await getPageHeroImage('news')

  return (
    <>
      <Hero
        title="News & Announcements"
        subtitle="Latest Updates"
        description="Stay updated with news, announcements, and stories from across the Diocese of Baguio Schools network."
        image={heroImage}
        imagePlaceholder="School Events Photo"
      />

      <div className="page-wrapper">

        <div className="flex gap-3 mb-8 flex-wrap">
          <span className="badge">All</span>
          <span className="badge">Announcements</span>
          <span className="badge">Events</span>
          <span className="badge">School News</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="placeholder-block mb-4">[ Post Image ]</div>
              <span className="badge mb-2 block w-fit">Category</span>
              <h3 className="card-title">News Post Title {i + 1}</h3>
              <p className="card-body mt-1">August 1, 2026</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400 mt-8 text-center">
          News posts will be pulled from Sanity CMS.
        </p>

      </div>
    </>
  )
}
