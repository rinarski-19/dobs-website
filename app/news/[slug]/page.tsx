import Hero from '@/components/Hero'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, School, Clock } from 'lucide-react'

export default function NewsPostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      {/* Hero with featured image */}
      <Hero
        title="[ Post Title from Sanity ]"
        subtitle="Announcements"
        imagePlaceholder="Post Featured Image"
      />

      <div className="page-wrapper">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to News
          </Link>

          {/* Post header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              [ Post Title from Sanity ]
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                August 1, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Tag size={14} />
                <span className="badge">Announcements</span>
              </span>
              <span className="flex items-center gap-1.5">
                <School size={14} />
                Diocese of Baguio Schools
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                3 min read
              </span>
            </div>
          </div>

          <div className="divider" />

          {/* Article layout — body + sidebar */}
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Article body */}
            <article className="flex-1 min-w-0">

              {/* Lead / excerpt */}
              <p className="text-lg text-gray-600 leading-relaxed font-medium mb-8 border-l-4 border-primary-500 pl-5">
                [ Post excerpt or lead paragraph from Sanity — displayed as a pull quote ]
              </p>

              {/* Body content */}
              <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
                <div className="placeholder-block">[ Post body — rich text from Sanity Portable Text ]</div>

                {/* Inline image placeholder */}
                <div className="placeholder-block">[ Inline image ]</div>

                <div className="placeholder-block">[ Continuation of post body ]</div>
              </div>

              <div className="divider" />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="text-sm text-gray-500 mr-2">Tags:</span>
                {['Announcement', 'School News', 'Diocese of Baguio'].map(tag => (
                  <span key={tag} className="badge">{tag}</span>
                ))}
              </div>

            </article>

            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0 space-y-6">

              {/* About the school */}
              <div className="card">
                <h3 className="card-title mb-3">Posted by</h3>
                <div className="placeholder-block mb-3">[ School Logo ]</div>
                <p className="text-sm font-medium text-gray-800">Diocese of Baguio Schools</p>
                <p className="text-xs text-gray-500 mt-1">Baguio City, Benguet</p>
                <Link href="/schools" className="btn-secondary text-xs mt-4 w-full justify-center">
                  View School
                </Link>
              </div>

              {/* Related posts */}
              <div className="card">
                <h3 className="card-title mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="placeholder-block w-16 h-14 shrink-0 text-xs flex items-center justify-center rounded-lg">
                        Img
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                          Related post title {i + 1}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Aug 1, 2026</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </aside>

          </div>

          <div className="divider" />

          {/* More News */}
          <section className="section">
            <h2 className="section-heading">More News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="placeholder-block mb-4">[ Post Image ]</div>
                  <span className="badge mb-2 block w-fit">Category</span>
                  <h3 className="card-title">News Post {i + 1}</h3>
                  <p className="card-body mt-1">August 1, 2026</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
