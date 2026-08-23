import Hero from '@/components/Hero'
import { getPageHeroImage } from '@/lib/sanity'

const steps = [
  { step: 1, title: 'Choose a School', desc: 'Browse our member schools and find one near you.' },
  { step: 2, title: 'Check Requirements', desc: 'Review the enrollment requirements for the grade level you are applying for.' },
  { step: 3, title: 'Submit an Inquiry', desc: 'Fill out the inquiry form below and we will get back to you.' },
  { step: 4, title: 'Visit the School', desc: 'Come in for an interview or assessment if required.' },
  { step: 5, title: 'Complete Enrollment', desc: 'Submit required documents and complete enrollment at the school.' },
]

export default async function EnrollmentPage() {
  const heroImage = await getPageHeroImage('enrollment')

  return (
    <>
      <Hero
        title="Enrollment"
        subtitle="Now Enrolling"
        description="Join the Diocese of Baguio Schools community. Here's everything you need to know to get started."
        image={heroImage}
        imagePlaceholder="Students Photo"
        cta={{ label: 'Send an Inquiry', href: '#inquiry' }}
      />

      <div className="page-wrapper">

        <section className="section">
          <h2 className="section-heading">Enrollment Process</h2>
          <div className="space-y-4">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="card flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="card-title">{title}</h3>
                  <p className="card-body">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        <section className="section">
          <h2 className="section-heading">Requirements</h2>
          <div className="placeholder-block">[ Requirements per grade level — Sanity ]</div>
        </section>

        <div className="divider" />

        <section id="inquiry" className="section max-w-2xl">
          <h2 className="section-heading">Send an Inquiry</h2>
          <form className="card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Parent / Guardian Name</label>
                <input type="text" className="form-input" placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label className="form-label">Contact Number</label>
                <input type="tel" className="form-input" placeholder="+63 900 000 0000" />
              </div>
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="juan@email.com" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Child&apos;s Name</label>
                <input type="text" className="form-input" placeholder="Maria dela Cruz" />
              </div>
              <div>
                <label className="form-label">Grade Level</label>
                <select className="form-input">
                  <option value="">Select grade level</option>
                  {['Nursery','Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'].map(g => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Preferred School</label>
              <select className="form-input">
                <option value="">Select a school</option>
                <option>[ Schools will be listed here ]</option>
              </select>
            </div>
            <div>
              <label className="form-label">Message (optional)</label>
              <textarea className="form-textarea" rows={4} placeholder="Any questions or additional information..." />
            </div>
            <button type="submit" className="btn-primary">Submit Inquiry</button>
          </form>
        </section>

      </div>
    </>
  )
}
