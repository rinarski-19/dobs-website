'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Home',        href: '/' },
  { label: 'About',       href: '/about' },
  { label: 'Our Schools', href: '/schools' },
  { label: 'Programs',    href: '/programs' },
  { label: 'News',        href: '/news' },
  { label: 'Events',      href: '/events' },
  { label: 'Enrollment',  href: '/enrollment' },
  { label: 'Contact',     href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-blue-100"
      style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%, #e0efff 100%)' }}
    >
      <nav className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="font-bold text-lg tracking-tight"
          style={{ background: 'linear-gradient(135deg, #155896, #4a9eed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          DOBS · Diocese of Baguio Schools
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {links.map(({ label, href }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Enroll CTA */}
        <Link href="/enrollment" className="hidden lg:inline-flex btn-primary text-sm">
          Enroll Now
        </Link>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-md text-primary-600 hover:bg-primary-50"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-blue-100 bg-white px-6 py-4 space-y-1">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/enrollment" className="btn-primary w-full justify-center text-sm">
              Enroll Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
