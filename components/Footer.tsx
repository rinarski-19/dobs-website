import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-20" style={{ background: 'linear-gradient(135deg, #0c1c2e 0%, #16324F 60%, #294f72 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        <div>
          <h3 className="font-diocesan font-bold text-white mb-3 text-xl">Diocese of Baguio Schools</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            The Catholic schools of the Diocese of Baguio, serving Baguio City and the province of Benguet.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gold-300 mb-3 text-sm uppercase tracking-widest">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              ['About', '/about'],
              ['Our Schools', '/schools'],
              ['Programs', '/programs'],
              ['News', '/news'],
              ['Enrollment', '/enrollment'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gold-300 mb-3 text-sm uppercase tracking-widest">Contact</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="leading-relaxed">
              72 Fr. Carlu Street, Barangay Kabayanihan<br />
              2600 Baguio City, Benguet, Philippines
            </li>
            <li>
              <a href="mailto:dioceseofbaguio2004@gmail.com" className="hover:text-white transition-colors">
                dioceseofbaguio2004@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+63744423756" className="hover:text-white transition-colors">
                (074) 442-3756
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Diocese of Baguio Schools. All rights reserved.
      </div>
    </footer>
  )
}
