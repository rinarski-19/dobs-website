import Hero from '@/components/Hero'
import { getPageContent, imageUrlFor } from '@/lib/sanity'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Info,
  Mail,
  PhoneCall,
  School,
  Send,
  UserCheck,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

type EnrollmentPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  heroImageAlt?: string
  processHeading?: string
  steps?: Array<{ title: string; description: string }>
  requirementsHeading?: string
  requirements?: string[]
  inquiryHeading?: string
}

const steps = [
  { step: 1, title: 'Choose a School', desc: 'Browse the schools and find one near you.' },
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
        imageAlt={content?.heroImageAlt}
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
              Follow these steps to complete the enrollment process with your chosen school.
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
              Prepare these general documents before contacting the school you are applying to.
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
                Requirements, schedules, assessments, and fees vary by school. Contact the selected school before submitting an application.
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
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            <div className="overflow-hidden rounded-2xl border border-primary-100 bg-primary-700 text-white shadow-card">
              <div className="border-b border-white/10 px-6 py-7 md:px-8">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Before you submit</span>
                <h3 className="mt-2 font-diocesan text-3xl font-bold md:text-4xl">Enrollment guidance</h3>
                <p className="mt-3 text-sm leading-6 text-primary-100">
                  An inquiry helps us direct you to the appropriate school. Final admission requirements and schedules are confirmed by the selected school.
                </p>
              </div>

              <div className="divide-y divide-white/10 px-6 md:px-8">
                <div className="flex gap-4 py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-300">
                    <School size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">Choose a preferred school</p>
                    <p className="mt-1 text-sm leading-6 text-primary-100">Review the school directory before completing the form.</p>
                  </div>
                </div>
                <div className="flex gap-4 py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-300">
                    <Clock3 size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">Response during office hours</p>
                    <p className="mt-1 text-sm leading-6 text-primary-100">Monday–Friday, 8:00 AM–5:00 PM, excluding public holidays.</p>
                  </div>
                </div>
                <div className="flex gap-4 py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold-300">
                    <PhoneCall size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">Contact the DOBS office</p>
                    <a href="tel:+63744423756" className="mt-1 block text-sm text-primary-100 transition-colors hover:text-white hover:underline">(074) 442-3756</a>
                    <a href="mailto:dioceseofbaguio2004@gmail.com" className="mt-1 flex items-center gap-2 break-all text-sm text-primary-100 transition-colors hover:text-white hover:underline">
                      <Mail size={15} className="shrink-0" aria-hidden="true" />
                      dioceseofbaguio2004@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

          <form className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card md:p-8 lg:p-10">
            <div className="mb-7">
              <span className="eyebrow">Enrollment Inquiry</span>
              <h3 className="mt-2 font-diocesan text-3xl font-bold text-primary-700">Complete the inquiry form</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Provide your contact details and enrollment preferences below.</p>
            </div>
            <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guardian-name" className="form-label">Parent / Guardian Name</label>
                <input id="guardian-name" name="guardianName" type="text" className="form-input bg-parchment-50" placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label htmlFor="guardian-phone" className="form-label">Contact Number</label>
                <input id="guardian-phone" name="phone" type="tel" className="form-input bg-parchment-50" placeholder="+63 900 000 0000" />
              </div>
            </div>
            <div>
              <label htmlFor="guardian-email" className="form-label">Email Address</label>
              <input id="guardian-email" name="email" type="email" className="form-input bg-parchment-50" placeholder="juan@email.com" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="learner-name" className="form-label">Child&apos;s Name</label>
                <input id="learner-name" name="learnerName" type="text" className="form-input bg-parchment-50" placeholder="Maria dela Cruz" />
              </div>
              <div>
                <label htmlFor="grade-level" className="form-label">Grade Level</label>
                <select id="grade-level" name="gradeLevel" className="form-input bg-parchment-50">
                  <option value="">Select grade level</option>
                  {['Nursery','Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'].map(g => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="preferred-school" className="form-label">Preferred School</label>
              <select id="preferred-school" name="preferredSchool" className="form-input bg-parchment-50">
                <option value="">Select a school</option>
                <option>[ Schools will be listed here ]</option>
              </select>
            </div>
            <div>
              <label htmlFor="inquiry-message" className="form-label">Message (optional)</label>
              <textarea id="inquiry-message" name="message" className="form-textarea bg-parchment-50" rows={5} placeholder="Any questions or additional information..." />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Submit Inquiry <Send size={17} aria-hidden="true" />
            </button>
            </div>
          </form>
          </div>
          </div>
        </section>

        <section className="bg-primary-700 text-white">
          <div className="page-wrapper py-16 text-center md:py-20">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">Take the next step</span>
            <h2 className="mx-auto mt-3 max-w-3xl font-diocesan text-4xl font-bold md:text-5xl">
              Ready to find the right school?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-primary-100">
              Browse the schools or contact the Diocese of Baguio Schools office for enrollment guidance.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/schools" className="btn-accent w-full sm:w-auto">
                Browse Our Schools <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-white/70 px-5 py-2.5 font-semibold text-white transition-all hover:border-white hover:bg-white hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 sm:w-auto"
              >
                Contact the DOBS Office <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
