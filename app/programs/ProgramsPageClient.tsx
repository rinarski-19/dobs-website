'use client'

import Hero from '@/components/Hero'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BookOpen, GraduationCap, Heart, School, Target, Users } from 'lucide-react'

export type Program = {
  _key?: string
  title: string
  grades?: string
  ages?: string
  learningFocus?: string
  faithFormation?: string
  availableSchools?: string
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
        <div className="programs-snap-section relative h-[calc(100svh-4rem)] min-h-[34rem] overflow-hidden">
          <Hero
            title={content.heroTitle}
            subtitle={content.heroSubtitle}
            description={content.heroDescription}
            image={content.heroImageUrl}
            imagePlaceholder="Students in Classroom Photo"
            viewport
          />

          <nav aria-label="Explore academic programs" className="absolute inset-x-0 bottom-5 z-20 px-4 md:bottom-8 md:px-8">
            <div className="mx-auto max-w-6xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300 drop-shadow-md">Explore Our Programs</p>
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
                {content.programs.slice(0, 4).map((program, index) => {
                  const label = ['Pre-School', 'Grade School', 'Junior High', 'Senior High'][index] || program.title

                  return (
                    <button
                      key={program._key ?? `${program.title}-hero-tab`}
                      type="button"
                      onClick={() => scrollTo(index + 1)}
                      className="group min-h-24 min-w-[13.5rem] snap-start rounded-xl border border-white/30 bg-primary-900/85 px-5 py-4 text-left text-white shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-gold-300 hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 md:min-w-0"
                    >
                      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
                        <BookOpen size={15} aria-hidden="true" /> Program {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-2 block font-diocesan text-xl font-semibold leading-tight md:text-2xl">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>
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
              className="programs-snap-section relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-gray-900 py-20"
              style={{
                backgroundImage: program.imageUrl ? `url(${program.imageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: i % 2 === 0 ? '65% center' : '35% center',
              }}
            >
              <div className="absolute inset-0 bg-primary-950/80" />
              <div className={`absolute inset-0 ${i % 2 === 0 ? 'bg-gradient-to-r from-black/80 via-primary-950/70 to-primary-950/45' : 'bg-gradient-to-l from-black/80 via-primary-950/70 to-primary-950/45'}`} />
              <span className={`absolute bottom-4 text-[18rem] font-black text-white/5 leading-none select-none pointer-events-none ${i % 2 === 0 ? 'right-12' : 'left-12'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className={`relative z-10 w-[calc(100%_-_2rem)] max-w-6xl rounded-3xl border border-white/25 bg-primary-950/80 p-6 text-white shadow-2xl backdrop-blur-sm md:p-8 lg:p-10 ${i % 2 === 0 ? 'mr-auto lg:ml-12' : 'ml-auto lg:mr-12'}`}>
                {(program.grades || program.ages) && (
                  <span className="mb-6 inline-block rounded-full border border-white/25 bg-primary-950 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white shadow-md">
                    <BookOpen size={12} className="mr-1.5 inline text-gold-300" />
                    {[program.grades, program.ages].filter(Boolean).join(' · ')}
                  </span>
                )}
                <h2 className="mb-5 text-5xl font-black leading-none tracking-tight md:text-7xl lg:text-8xl">{program.title}</h2>
                <p className="mb-7 max-w-3xl text-base font-medium leading-relaxed text-white/95 md:text-lg">{program.description}</p>

                <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {[
                    { label: 'Grade / Level', value: program.grades || 'Contact a member school', icon: GraduationCap },
                    { label: 'Typical Age', value: program.ages || 'Varies by learner', icon: Users },
                    { label: 'Learning Focus', value: program.learningFocus || 'Holistic academic formation', icon: Target },
                    { label: 'Faith Formation', value: program.faithFormation || 'Catholic values and prayer life', icon: Heart },
                    { label: 'Available Schools', value: program.availableSchools || 'Selected member schools', icon: School },
                  ].map(detail => {
                    const Icon = detail.icon
                    return (
                      <div key={detail.label} className="rounded-xl border border-white/30 bg-black/65 p-3.5 shadow-lg backdrop-blur-md">
                        <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 text-primary-950 shadow-sm">
                          <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-gold-300">{detail.label}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-white md:text-sm">{detail.value}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-wrap gap-4">
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
