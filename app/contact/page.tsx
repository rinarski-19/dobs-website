import Hero from '@/components/Hero'
import { getPageContent, imageUrlFor } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

type ContactPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
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
        imagePlaceholder="School Office Photo"
      />

      <div className="page-wrapper">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          <div className="space-y-6">
            <div className="card">
              <h3 className="card-title mb-3">Office Address</h3>
              <p className="section-body whitespace-pre-line">{content?.officeAddress || fallbackPageContent.officeAddress}</p>
            </div>
            <div className="card">
              <h3 className="card-title mb-3">Contact Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <span className="font-medium">Phone:</span>{' '}
                  <a href={`tel:${phoneHref}`} className="text-primary-700 transition-colors hover:text-primary-500 hover:underline">
                    {phone}
                  </a>
                </li>
                <li>
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${email.trim()}`} className="break-all text-primary-700 transition-colors hover:text-primary-500 hover:underline">
                    {email}
                  </a>
                </li>
                <li><span className="font-medium">Office Hours:</span> {content?.officeHours || fallbackPageContent.officeHours}</li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <iframe
                title="Map showing the Diocese of Baguio Schools office"
                src="https://www.google.com/maps?q=72%20Fr.%20Carlu%20Street%2C%20Kabayanihan%20Barangay%2C%20Baguio%20City%2C%20Philippines&output=embed"
                className="h-80 w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div>
            <h2 className="section-heading">{content?.messageHeading || fallbackPageContent.messageHeading}</h2>
            <form className="card space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="juan@email.com" />
              </div>
              <div>
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" placeholder="e.g. Enrollment Inquiry" />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea className="form-textarea" rows={5} placeholder="Your message..." />
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>

        </div>

      </div>
    </>
  )
}
