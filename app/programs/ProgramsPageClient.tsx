'use client'

import Hero from '@/components/Hero'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export type Program = {
  _key?: string
  title: string
  grades?: string
  ages?: string
  description: string
  imageUrl?: string
  imageAlt?: string
}

export type ProgramsPageContent = {
  heroTitle: string
  heroSubtitle?: string
  heroDescription?: string
  heroImageUrl?: string
  programs: Program[]
  primaryButton?: { label?: string; href?: string }
  secondaryButton?: { label?: string; href?: string }
}

export default function ProgramsPageClient({ content }: { content: ProgramsPageContent }) {
  const [active, setActive] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const overviewRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.documentElement.classList.add('programs-scroll-page')
    return () => document.documentElement.classList.remove('programs-scroll-page')
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(parseInt(entry.target.getAttribute('data-idx') ?? '0'))
      })
    }, { threshold: 0.5 })
    if (overviewRef.current) observer.observe(overviewRef.current)
    sectionRefs.current.forEach(ref => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [content.programs])

  const scrollTo = (idx: number) => {
    if (idx === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    sectionRefs.current[idx - 1]?.scrollIntoView({ behavior: 'smooth' })
  }

  const navigationItems = [
    { label: 'Overview' },
    ...content.programs.map((program, index) => ({
      label: ['Pre-School', 'Grade School', 'Junior High', 'Senior High'][index] || program.title,
    })),
  ]

  return (
    <>
      <div className="relative">
        <div ref={overviewRef} data-idx="0" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100svh-4rem)]" />
        <div className="programs-snap-section sticky top-16 z-0 h-[calc(100svh-4rem)]">
          <Hero
            title={content.heroTitle}
            subtitle={content.heroSubtitle}
            description={content.heroDescription}
            image={content.heroImageUrl}
            imagePlaceholder="Students in Classroom Photo"
            viewport
            parallax
          />
        </div>

        <nav aria-label="Programs sections" className="fixed right-3 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-1 md:right-6">
          {navigationItems.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to ${item.label}`}
              aria-current={active === i ? 'true' : undefined}
              className="group flex min-h-11 items-center justify-end gap-3 rounded-full px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              <span className={`pointer-events-none whitespace-nowrap rounded-md bg-primary-900/95 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 ${
                active === i
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'
              }`}>
                {item.label}
              </span>
              <span className={`h-3 w-3 shrink-0 rounded-full border-2 transition-all duration-300 ${
                active === i
                  ? 'scale-125 border-gold-300 bg-gold-300 shadow-lg'
                  : 'border-white/80 bg-primary-800/80 group-hover:scale-110 group-hover:bg-white'
              }`} aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className="relative z-10">
          {content.programs.map((program, i) => (
            <section
              key={program._key ?? `${program.title}-${i}`}
              ref={el => { sectionRefs.current[i] = el }}
              data-idx={i + 1}
              className="programs-snap-section relative h-[calc(100svh-4rem)] min-h-[28rem] flex items-center justify-center overflow-hidden bg-gray-900"
              style={{ backgroundImage: program.imageUrl ? `url(${program.imageUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-black/55" />
              <span className={`absolute bottom-4 text-[18rem] font-black text-white/5 leading-none select-none pointer-events-none ${i % 2 === 0 ? 'right-12' : 'left-12'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className={`relative z-10 max-w-3xl px-8 text-white ${i % 2 === 0 ? 'mr-auto ml-16' : 'ml-auto mr-16'}`}>
                {(program.grades || program.ages) && (
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-6 px-3 py-1.5 rounded-full bg-white/10 text-white/90">
                    <BookOpen size={11} className="inline mr-1.5" />
                    {[program.grades, program.ages].filter(Boolean).join(' · ')}
                  </span>
                )}
                <h2 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight">{program.title}</h2>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mb-10">{program.description}</p>
                <div className="flex gap-4">
                  {content.primaryButton?.label && content.primaryButton.href && (
                    <Link href={content.primaryButton.href} className="btn-primary">{content.primaryButton.label}</Link>
                  )}
                  {content.secondaryButton?.label && content.secondaryButton.href && (
                    <Link href={content.secondaryButton.href} className="btn-secondary border-white/40 text-white hover:bg-white/10">{content.secondaryButton.label}</Link>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
