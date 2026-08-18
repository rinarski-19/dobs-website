import Hero from '@/components/Hero'

export default function AboutPage() {
  return (
    <>
      <Hero
        title="About DOBS"
        subtitle="Our Story"
        description="Learn about our mission, vision, core values, and the people who lead the Diocese of Baguio Schools network."
        image="/images/about.png"
        imagePlaceholder="Administration Building Photo"
      />

      <div className="page-wrapper">

        <section className="section grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="card-title">Mission</h2>
            <div className="placeholder-block mt-3">[ Mission statement — Sanity ]</div>
          </div>
          <div className="card">
            <h2 className="card-title">Vision</h2>
            <div className="placeholder-block mt-3">[ Vision statement — Sanity ]</div>
          </div>
        </section>

        <div className="divider" />

        <section className="section">
          <h2 className="section-heading">Core Values</h2>
          <div className="placeholder-block">[ Core values — Sanity ]</div>
        </section>

        <div className="divider" />

        <section className="section">
          <h2 className="section-heading">History</h2>
          <div className="placeholder-block">[ School network history — Sanity ]</div>
        </section>

        <div className="divider" />

        <section className="section">
          <h2 className="section-heading">Leadership &amp; Administration</h2>
          <div className="placeholder-block">[ Leadership profiles — Sanity ]</div>
        </section>

      </div>
    </>
  )
}
