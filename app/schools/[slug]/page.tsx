export default function SchoolDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="page-wrapper">
      <span className="badge mb-4 block w-fit">Member School</span>
      <h1 className="page-title">[ School Name ]</h1>
      <p className="page-subtitle">[ Location ] · [ School Type ]</p>

      <div className="divider" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">

          <section className="section">
            <div className="placeholder-block">[ School hero image ]</div>
          </section>

          <section className="section">
            <h2 className="section-heading">About This School</h2>
            <div className="placeholder-block">[ School description from Sanity ]</div>
          </section>

          <section className="section">
            <h2 className="section-heading">Programs Offered</h2>
            <div className="placeholder-block">[ Programs list from Sanity ]</div>
          </section>

          <section className="section">
            <h2 className="section-heading">Facilities</h2>
            <div className="placeholder-block">[ Facilities from Sanity ]</div>
          </section>

        </div>

        {/* Sidebar info */}
        <aside className="space-y-4">
          <div className="card">
            <h3 className="card-title mb-3">School Info</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="font-medium text-gray-700">Type:</span> [ Elementary / High School ]</li>
              <li><span className="font-medium text-gray-700">Location:</span> [ Address ]</li>
              <li><span className="font-medium text-gray-700">Contact:</span> [ Phone ]</li>
              <li><span className="font-medium text-gray-700">Email:</span> [ Email ]</li>
            </ul>
          </div>
          <a href="/enrollment" className="btn-primary w-full justify-center">Enroll Here</a>
        </aside>
      </div>
    </div>
  )
}
