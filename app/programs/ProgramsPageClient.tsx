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
  programs: Program[]
  primaryButton?: { label?: string; href?: string }
  secondaryButton?: { label?: string; href?: string }
}

export default function ProgramsPageClient({ content }: { content: ProgramsPageContent }) {
  const [active, setActive] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(parseInt(entry.target.getAttribute('data-idx') ?? '0'))
      })
    }, { threshold: 0.5 })
    sectionRefs.current.forEach(ref => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [content.programs])

  const scrollTo = (idx: number) => sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <Hero title={content.heroTitle} subtitle={content.heroSubtitle} description={content.heroDescription} imagePlaceholder="Students in Classroom Photo" />

      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {content.programs.map((program, i) => (
          <button
            key={program._key ?? `${program.title}-${i}`}
            onClick={() => scrollTo(i)}
            title={program.title}
            aria-label={`Go to ${program.title}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${active === i ? 'bg-white scale-125 shadow-lg' : 'bg-gray-400/60 hover:bg-gray-600/80'}`}
          />
        ))}
      </div>

      <div style={{ scrollSnapType: 'y mandatory', overflowY: 'scroll', height: '100vh', marginBottom: '-5rem' }}>
        {content.programs.map((program, i) => (
          <section
            key={program._key ?? `${program.title}-${i}`}
            ref={el => { sectionRefs.current[i] = el }}
            data-idx={i}
            className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900"
            style={{ scrollSnapAlign: 'start', backgroundImage: program.imageUrl ? `url(${program.imageUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
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
                  <Link href={content.primaryButton.href} className="btn-primary bg-white text-blue-800 hover:bg-white/90">{content.primaryButton.label}</Link>
                )}
                {content.secondaryButton?.label && content.secondaryButton.href && (
                  <Link href={content.secondaryButton.href} className="btn-secondary border-white/40 text-white hover:bg-white/10">{content.secondaryButton.label}</Link>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
