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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-parchment-200 shadow-sm">
      <nav className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-2 font-diocesan font-bold tracking-tight">
          <span className="text-xl text-primary-700">DOBS</span>
          <span className="hidden sm:inline text-sm font-sans font-medium text-gray-500 group-hover:text-primary-700 transition-colors">
            Diocese of Baguio Schools
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {links.map(({ label, href }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-primary-700 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gold-500'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
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
          type="button"
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-md text-primary-700 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="lg:hidden border-t border-parchment-200 bg-white px-6 py-4 space-y-1">
          {links.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <div className="pt-2">
            <Link href="/enrollment" onClick={() => setOpen(false)} className="btn-primary w-full justify-center text-sm">
              Enroll Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
