'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, BookOpen } from 'lucide-react'

const levels = [
  {
    label: 'Pre-School',
    grades: 'Nursery & Kindergarten',
    ages: 'Ages 3–5',
    description: 'A nurturing environment that develops foundational skills through play-based learning, creativity, and early childhood development principles.',
    bg: 'from-sky-500 to-blue-700',
    accent: 'bg-sky-400/20 text-sky-100',
    num: '01',
  },
  {
    label: 'Elementary',
    grades: 'Grades 1–6',
    ages: 'Ages 6–12',
    description: 'A strong academic foundation in core subjects — Mathematics, Science, Filipino, English, and Values Education — guided by the K–12 curriculum.',
    bg: 'from-blue-600 to-indigo-800',
    accent: 'bg-blue-400/20 text-blue-100',
    num: '02',
  },
  {
    label: 'Junior High School',
    grades: 'Grades 7–10',
    ages: 'Ages 13–16',
    description: 'Deepening academic knowledge with a focus on critical thinking, character formation, and preparation for senior high school.',
    bg: 'from-indigo-600 to-violet-800',
    accent: 'bg-indigo-400/20 text-indigo-100',
    num: '03',
  },
  {
    label: 'Senior High School',
    grades: 'Grades 11–12',
    ages: 'Ages 17–18',
    description: 'Specialized tracks — Academic, Technical-Vocational, Sports, and Arts & Design — preparing students for college or the workforce.',
    bg: 'from-violet-600 to-purple-900',
    accent: 'bg-violet-400/20 text-violet-100',
    num: '04',
  },
]

export default function ProgramsPage() {
  const [active, setActive] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLElement)
            if (idx !== -1) setActive(idx)
          }
        })
      },
      { threshold: 0.5 }
    )
    sectionRefs.current.forEach(ref => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* Dot navigator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {levels.map((l, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            title={l.label}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              active === i ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {levels.map((level, i) => (
        <section
          key={level.label}
          ref={el => { sectionRefs.current[i] = el }}
          className={`relative h-screen flex items-center justify-center bg-gradient-to-br ${level.bg} overflow-hidden`}
          style={{ scrollSnapAlign: 'start' }}
        >
          {/* Large background number */}
          <span className="absolute right-12 bottom-8 text-[20rem] font-black text-white/5 leading-none select-none pointer-events-none">
            {level.num}
          </span>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto px-8 text-white">
            <span className={`inline-block text-xs font-semibold uppercase tracking-widest mb-6 px-3 py-1.5 rounded-full ${level.accent}`}>
              <BookOpen size={11} className="inline mr-1.5" />
              {level.grades} · {level.ages}
            </span>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight">
              {level.label}
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mb-10">
              {level.description}
            </p>

            <div className="flex gap-4">
              <Link href="/schools" className="btn-primary bg-white text-blue-800 hover:bg-white/90">
                Find a School
              </Link>
              <Link href="/enrollment" className="btn-secondary border-white/40 text-white hover:bg-white/10">
                Enroll Now
              </Link>
            </div>
          </div>

          {/* Scroll hint on first section */}
          {i === 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 text-xs animate-bounce">
              <span>Scroll</span>
              <ArrowDown size={14} />
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
