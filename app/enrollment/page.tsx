import Hero from '@/components/Hero'
import { getPageContent, imageUrlFor } from '@/lib/sanity'
import { Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

type EnrollmentPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  processHeading?: string
  steps?: Array<{ title: string; description: string }>
  requirementsHeading?: string
  requirements?: string[]
  inquiryHeading?: string
}

const steps = [
  { step: 1, title: 'Choose a School', desc: 'Browse our member schools and find one near you.' },
  { step: 2, title: 'Check Requirements', desc: 'Review the enrollment requirements for the grade level you are applying for.' },
  { step: 3, title: 'Submit an Inquiry', desc: 'Fill out the inquiry form below and we will get back to you.' },
  { step: 4, title: 'Visit the School', desc: 'Come in for an interview or assessment if required.' },
  { step: 5, title: 'Complete Enrollment', desc: 'Submit required documents and complete enrollment at the school.' },
]

const fallbackPageContent = {
  heroTitle: 'Enrollment',
  heroSubtitle: 'Now Enrolling',
  heroDescription: "Join the Diocese of Baguio Schools community. Here's everything you need to know to get started.",
  processHeading: 'Enrollment Process',
  requirementsHeading: 'Requirements',
  inquiryHeading: 'Send an Inquiry',
}

export default async function EnrollmentPage() {
  const content = await getPageContent<EnrollmentPageContent>('enrollmentPage')
  const enrollmentSteps = content?.steps?.length
    ? content.steps.map((item, index) => ({ step: index + 1, title: item.title, desc: item.description }))
    : steps

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackPageContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackPageContent.heroSubtitle}
        description={content?.heroDescription || fallbackPageContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
        imagePlaceholder="Students Photo"
        cta={{ label: 'Send an Inquiry', href: '#inquiry' }}
      />

      <div className="page-wrapper">

        <section className="section">
          <h2 className="section-heading">{content?.processHeading || fallbackPageContent.processHeading}</h2>
          <div className="space-y-4">
            {enrollmentSteps.map(({ step, title, desc }) => (
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
          <h2 className="section-heading">{content?.requirementsHeading || fallbackPageContent.requirementsHeading}</h2>
          {content?.requirements?.length ? (
            <ul className="card space-y-3 text-gray-600 list-disc list-inside">
              {content.requirements.map(requirement => <li key={requirement}>{requirement}</li>)}
            </ul>
          ) : (
            <div className="placeholder-block">[ Requirements per grade level — Sanity ]</div>
          )}
          <aside className="mt-5 flex items-start gap-3 rounded-xl border border-primary-700/20 bg-primary-50 px-5 py-4 text-primary-800">
            <Info className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
            <p className="text-sm leading-relaxed">
              Requirements, schedules, assessments, and fees vary by member school. Contact the selected school before submitting an application.
            </p>
          </aside>
        </section>

        <div className="divider" />

        <section id="inquiry" className="section max-w-2xl">
          <h2 className="section-heading">{content?.inquiryHeading || fallbackPageContent.inquiryHeading}</h2>
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
