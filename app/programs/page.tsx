'use client'

import Hero from '@/components/Hero'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const levels = [
  {
    label: 'Pre-School',
    grades: 'Nursery & Kindergarten',
    ages: 'Ages 3–5',
    description: 'A nurturing environment that develops foundational skills through play-based learning, creativity, and early childhood development principles.',
    image: '/programs/preschool.jpg',
    accent: 'bg-white/10 text-white/90',
    num: '01',
  },
  {
    label: 'Elementary',
    grades: 'Grades 1–6',
    ages: 'Ages 6–12',
    description: 'A strong academic foundation in core subjects — Mathematics, Science, Filipino, English, and Values Education — guided by the K–12 curriculum.',
    image: '/programs/elementary.jpg',
    accent: 'bg-white/10 text-white/90',
    num: '02',
  },
  {
    label: 'Junior High School',
    grades: 'Grades 7–10',
    ages: 'Ages 13–16',
    description: 'Deepening academic knowledge with a focus on critical thinking, character formation, and preparation for senior high school.',
    image: '/programs/junior.jpg',
    accent: 'bg-white/10 text-white/90',
    num: '03',
  },
  {
    label: 'Senior High School',
    grades: 'Grades 11–12',
    ages: 'Ages 17–18',
    description: 'Specialized tracks — Academic, Technical-Vocational, Sports, and Arts & Design — preparing students for college or the workforce.',
    image: '/programs/senior.jpg',
    accent: 'bg-white/10 text-white/90',
    num: '04',
  },
]

export default function ProgramsPage() {
  const [active, setActive] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-idx') ?? '0')
            setActive(idx)
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
    <>
      {/* Regular hero — same as all other pages */}
      <Hero
        title="Academic Programs"
        subtitle="Curriculum"
        description="Programs offered across the Diocese of Baguio Schools network, from Pre-School through Senior High School."
        imagePlaceholder="Students in Classroom Photo"
      />

      {/* Dot navigator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {levels.map((l, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            title={l.label}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              active === i ? 'bg-white scale-125 shadow-lg' : 'bg-gray-400/60 hover:bg-gray-600/80'
            }`}
          />
        ))}
      </div>

      {/* Scroll-snap program sections */}
      <div style={{ scrollSnapType: 'y mandatory', overflowY: 'scroll', height: '100vh', marginBottom: '-5rem' }}>
        {levels.map((level, i) => (
          <section
            key={level.label}
            ref={el => { sectionRefs.current[i] = el }}
            data-idx={i}
            className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900"
            style={{
              scrollSnapAlign: 'start',
              backgroundImage: `url(${level.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Large background number — opposite side from text */}
            <span className={`absolute bottom-4 text-[18rem] font-black text-white/5 leading-none select-none pointer-events-none ${i % 2 === 0 ? 'right-12' : 'left-12'}`}>
              {level.num}
            </span>

            <div className={`relative z-10 max-w-3xl px-8 text-white ${i % 2 === 0 ? 'mr-auto ml-16' : 'ml-auto mr-16'}`}>
              <span className={`inline-block text-xs font-semibold uppercase tracking-widest mb-6 px-3 py-1.5 rounded-full ${level.accent}`}>
                <BookOpen size={11} className="inline mr-1.5" />
                {level.grades} · {level.ages}
              </span>

              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight">
                {level.label}
              </h2>

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
          </section>
        ))}
      </div>
    </>
  )
}
