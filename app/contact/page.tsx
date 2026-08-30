import Hero from '@/components/Hero'
import { getPageContent, imageUrlFor } from '@/lib/sanity'
import { ArrowUpRight, Clock3, Mail, MapPin, Phone, Send } from 'lucide-react'

export const dynamic = 'force-dynamic'

type ContactPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  heroImageAlt?: string
  officeAddress?: string
  phone?: string
  email?: string
  officeHours?: string
  messageHeading?: string
}

const fallbackPageContent = {
  heroTitle: 'Contact Us',
  heroSubtitle: 'Get in Touch',
  heroDescription: "Reach out to the Diocese of Baguio Schools office. We're happy to answer your questions.",
  officeAddress: '72 Fr. Carlu Street, Kabayanihan Barangay\nBaguio City, Benguet 2600, Philippines',
  phone: '+63 (74) 000-0000',
  email: 'info@dobsschools.edu.ph',
  officeHours: 'Mon–Fri, 8:00 AM – 5:00 PM',
  messageHeading: 'Send a Message',
}

export default async function ContactPage() {
  const content = await getPageContent<ContactPageContent>('contactPage')
  const phone = content?.phone || fallbackPageContent.phone
  const email = content?.email || fallbackPageContent.email
  const phoneHref = phone.replace(/[^\d+]/g, '')

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackPageContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackPageContent.heroSubtitle}
        description={content?.heroDescription || fallbackPageContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
        imageAlt={content?.heroImageAlt}
        imagePlaceholder="School Office Photo"
      />

      <section className="bg-parchment-50">
        <div className="page-wrapper py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow">Contact our office</span>
            <h2 className="mt-3 font-diocesan text-4xl font-bold text-primary-700 md:text-5xl">
              We&apos;re here to help
            </h2>
            <span className="gold-rule" />
            <p className="mt-5 leading-7 text-gray-600">
              Reach the Diocese of Baguio Schools office using the details below, or leave us a message through the inquiry form.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card">
                <div className="border-b border-primary-100 bg-primary-700 px-6 py-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">Diocese of Baguio Schools</p>
                  <h3 className="mt-1 font-diocesan text-3xl font-bold">Contact details</h3>
                </div>

                <div className="divide-y divide-gray-100 px-6">
                  <div className="flex gap-4 py-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                      <MapPin size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Office address</p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">
                        {content?.officeAddress || fallbackPageContent.officeAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 py-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                      <Phone size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Telephone</p>
                      <a href={`tel:${phoneHref}`} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-500 hover:underline">
                        {phone}<ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 py-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                      <Mail size={20} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Email address</p>
                      <a href={`mailto:${email.trim()}`} className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-sm font-semibold text-primary-700 transition-colors hover:text-primary-500 hover:underline">
                        {email}<ArrowUpRight className="shrink-0" size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 py-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                      <Clock3 size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Office hours</p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">{content?.officeHours || fallbackPageContent.officeHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white p-2 shadow-card">
              <iframe
                title="Map showing the Diocese of Baguio Schools office"
                src="https://www.google.com/maps?q=72%20Fr.%20Carlu%20Street%2C%20Kabayanihan%20Barangay%2C%20Baguio%20City%2C%20Philippines&output=embed"
                className="h-80 w-full rounded-xl border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

            <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-card md:p-8 lg:p-10">
              <span className="eyebrow">Send an inquiry</span>
              <h2 className="mt-2 font-diocesan text-4xl font-bold text-primary-700">
                {content?.messageHeading || fallbackPageContent.messageHeading}
              </h2>
              <p className="mb-8 mt-3 text-sm leading-6 text-gray-600">
                Complete the form and our office will respond as soon as possible during regular office hours.
              </p>

              <form className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="form-label">Full Name</label>
                  <input id="contact-name" name="name" type="text" className="form-input bg-parchment-50" placeholder="Juan dela Cruz" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="form-label">Email Address</label>
                  <input id="contact-email" name="email" type="email" className="form-input bg-parchment-50" placeholder="juan@email.com" />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="form-label">Subject</label>
                  <input id="contact-subject" name="subject" type="text" className="form-input bg-parchment-50" placeholder="e.g. Enrollment Inquiry" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="form-label">Message</label>
                  <textarea id="contact-message" name="message" className="form-textarea bg-parchment-50" rows={7} placeholder="How can we help you?" />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Send Message <Send size={17} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
