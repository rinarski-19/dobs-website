import Hero from '@/components/Hero'

const levels = [
  { label: 'Pre-School', desc: 'Nursery and Kindergarten' },
  { label: 'Elementary', desc: 'Grades 1–6' },
  { label: 'Junior High School', desc: 'Grades 7–10' },
  { label: 'Senior High School', desc: 'Grades 11–12' },
]

export default function ProgramsPage() {
  return (
    <>
      <Hero
        title="Academic Programs"
        subtitle="Curriculum"
        description="Programs offered across the Diocese of Baguio Schools network, from Pre-School through Senior High School."
        imagePlaceholder="Students in Classroom Photo"
      />

      <div className="page-wrapper">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {levels.map(({ label, desc }) => (
            <div key={label} className="card">
              <h2 className="card-title">{label}</h2>
              <p className="card-body mb-4">{desc}</p>
              <div className="placeholder-block">[ Program details — Sanity ]</div>
            </div>
          ))}
        </div>

        <div className="divider" />

        <section className="section">
          <h2 className="section-heading">Special Programs</h2>
          <div className="placeholder-block">[ Special programs — Sanity ]</div>
        </section>

      </div>
    </>
  )
}
