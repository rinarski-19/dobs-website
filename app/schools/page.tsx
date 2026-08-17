import Hero from '@/components/Hero'

export default function SchoolsPage() {
  return (
    <>
      <Hero
        title="Our Schools"
        subtitle="Member Schools"
        description="Browse all member schools under the Diocese of Baguio Schools network across Baguio City and Benguet."
        imagePlaceholder="Schools Network Photo"
      />

      <div className="page-wrapper">

        <div className="flex gap-3 mb-8 flex-wrap">
          <span className="badge">All</span>
          <span className="badge">Elementary</span>
          <span className="badge">High School</span>
          <span className="badge">Baguio City</span>
          <span className="badge">Benguet</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="placeholder-block mb-4">[ School Photo ]</div>
              <h3 className="card-title">School Name {i + 1}</h3>
              <p className="card-body mb-4">Location · Type</p>
              <span className="badge">Placeholder</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400 mt-8 text-center">
          School list will be populated once member schools are confirmed.
        </p>

      </div>
    </>
  )
}
