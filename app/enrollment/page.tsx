import Hero from '@/components/Hero'
import { getPageContent, imageUrlFor } from '@/lib/sanity'
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Info,
  PhoneCall,
  School,
  UserCheck,
} from 'lucide-react'

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

const stepIcons = [School, PhoneCall, FileText, ClipboardCheck, UserCheck, BadgeCheck]

export default async function EnrollmentPage() {
  const content = await getPageContent<EnrollmentPageContent>('enrollmentPage')
  const enrollmentSteps = content?.steps?.length
    ? content.steps.map((item, index) => ({ step: index + 1, title: item.title, desc: item.description }))
    : steps
  const timelineSplit = Math.ceil(enrollmentSteps.length / 2)
  const timelineColumns = [
    enrollmentSteps.slice(0, timelineSplit),
    enrollmentSteps.slice(timelineSplit),
  ]

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

      <div>
        <section className="bg-white">
          <div className="page-wrapper py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow">Step-by-step guide</span>
            <h2 className="mt-3 font-diocesan text-4xl font-bold text-primary-700 md:text-5xl">
              {content?.processHeading || fallbackPageContent.processHeading}
            </h2>
            <span className="gold-rule" />
            <p className="mt-5 leading-7 text-gray-600">
              Follow these steps to complete the enrollment process with your chosen member school.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {timelineColumns.map((column, columnIndex) => (
              <div key={columnIndex}>
                {column.map(({ step, title, desc }, itemIndex) => {
                  const StepIcon = stepIcons[step - 1] || FileText
                  const isLastOverall = step === enrollmentSteps.length
                  const isLastInColumn = itemIndex === column.length - 1

                  return (
                    <div key={step} className="group relative flex gap-5 pb-8 md:pb-10">
                      {!isLastOverall && (
                        <span
                          className="absolute left-6 top-12 h-[calc(100%-2.25rem)] w-0.5 bg-primary-200 md:hidden"
                          aria-hidden="true"
                        />
                      )}
                      {!isLastInColumn && (
                        <span
                          className="absolute left-6 top-12 hidden h-[calc(100%-1.5rem)] w-0.5 bg-primary-200 md:block"
                          aria-hidden="true"
                        />
                      )}

                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-primary-100 bg-primary-700 text-base font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                        {step}
                      </div>

                      <article className="min-h-36 flex-1 rounded-2xl border border-primary-100 bg-white p-6 shadow-card transition-all group-hover:-translate-y-0.5 group-hover:border-primary-200 group-hover:shadow-md">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                          <StepIcon size={22} strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
                          Step {step}
                        </p>
                        <h3 className="font-diocesan text-2xl font-bold text-primary-700">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-600">{desc}</p>
                      </article>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="bg-parchment-100">
          <div className="page-wrapper py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow">What to prepare</span>
            <h2 className="mt-3 font-diocesan text-4xl font-bold text-primary-700 md:text-5xl">
              {content?.requirementsHeading || fallbackPageContent.requirementsHeading}
            </h2>
            <span className="gold-rule" />
            <p className="mt-5 leading-7 text-gray-600">
              Prepare these general documents before contacting your preferred member school.
            </p>
          </div>
          {content?.requirements?.length ? (
            <div className="overflow-hidden rounded-t-2xl border-2 border-primary-100 bg-white shadow-card">
              <div className="flex items-start gap-4 border-b border-primary-100 bg-primary-50 px-6 py-5 md:px-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-white shadow-sm">
                  <FileText size={24} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-diocesan text-2xl font-bold text-primary-700">General document checklist</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Gather the following documents in advance. Your selected school may request additional requirements.
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 gap-x-10 gap-y-4 px-6 py-7 text-gray-700 md:grid-cols-2 md:px-8 md:py-8">
                {content.requirements.map(requirement => (
                  <li key={requirement} className="flex items-start gap-3 text-sm leading-6">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-primary-600" size={20} strokeWidth={2} aria-hidden="true" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="placeholder-block">[ Requirements per grade level — Sanity ]</div>
          )}
          <aside className="-mt-0.5 flex items-start gap-4 rounded-b-2xl border-2 border-t-0 border-primary-200 bg-primary-100 px-6 py-5 text-primary-900 shadow-card md:px-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-700 text-white">
              <Info size={20} strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary-800">Important Notice</h3>
              <p className="mt-1 text-sm leading-6 text-primary-800">
                Requirements, schedules, assessments, and fees vary by member school. Contact the selected school before submitting an application.
              </p>
            </div>
          </aside>
          </div>
        </section>

        <section id="inquiry" className="scroll-mt-20 bg-white">
          <div className="page-wrapper py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow">Start your application</span>
            <h2 className="mt-3 font-diocesan text-4xl font-bold text-primary-700 md:text-5xl">
              {content?.inquiryHeading || fallbackPageContent.inquiryHeading}
            </h2>
            <span className="gold-rule" />
            <p className="mt-5 leading-7 text-gray-600">
              Tell us about the learner and your preferred school so we can guide you toward the next step.
            </p>
          </div>
          <form className="card max-w-2xl space-y-4">
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
          </div>
        </section>

      </div>
    </>
  )
}
