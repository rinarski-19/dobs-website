import Link from 'next/link'
import { getFooter } from '@/lib/sanity'
import { safeHref } from '@/lib/safeHref'

const FALLBACK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Our Schools', href: '/schools' },
  { label: 'Programs', href: '/programs' },
  { label: 'News', href: '/news' },
  { label: 'Enrollment', href: '/enrollment' },
  { label: 'Contact', href: '/contact' },
]

const FALLBACK = {
  organisationName: 'Diocese of Baguio Schools',
  tagline: 'The Catholic schools of the Diocese of Baguio, serving Baguio City and the province of Benguet.',
  quickLinksHeading: 'Quick Links',
  contactHeading: 'Contact',
  copyrightText: 'Diocese of Baguio Schools. All rights reserved.',
  officeAddress: '72 Fr. Carlu Street, Barangay Kabayanihan\n2600 Baguio City, Benguet, Philippines',
  email: 'dioceseofbaguio2004@gmail.com',
  phone: '(074) 442-3756',
}

export default async function Footer() {
  const { footer, contact } = await getFooter()

  const links = footer?.quickLinks?.length ? footer.quickLinks : FALLBACK_LINKS
  const address = contact?.officeAddress || FALLBACK.officeAddress
  const email = contact?.email || FALLBACK.email
  const phone = contact?.phone || FALLBACK.phone
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20" style={{ background: 'linear-gradient(135deg, #0c1c2e 0%, #16324F 60%, #294f72 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        <div>
          <h3 className="font-diocesan font-bold text-white mb-3 text-xl">
            {footer?.organisationName || FALLBACK.organisationName}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {footer?.tagline || FALLBACK.tagline}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gold-300 mb-3 text-sm uppercase tracking-widest">
            {footer?.quickLinksHeading || FALLBACK.quickLinksHeading}
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            {links.map(link => {
              const href = safeHref(link.href)
              return (
                <li key={link.href}>
                  {href ? (
                    <Link href={href} className="hover:text-white transition-colors">{link.label}</Link>
                  ) : (
                    <span>{link.label}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gold-300 mb-3 text-sm uppercase tracking-widest">
            {footer?.contactHeading || FALLBACK.contactHeading}
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            {/* The address is a single field, so line breaks the editor typed are kept. */}
            <li className="whitespace-pre-line leading-relaxed">{address}</li>
            <li>
              <a href={`mailto:${email}`} className="break-all hover:text-white transition-colors">{email}</a>
            </li>
            <li>
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/50">
        © {year} {footer?.copyrightText || FALLBACK.copyrightText}
      </div>
    </footer>
  )
}
