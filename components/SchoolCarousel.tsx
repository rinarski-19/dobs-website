'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export type HomeSchool = {
  _id: string
  name: string
  slug: string
  city?: string
  levels?: string[]
  imageUrl?: string
  enrollmentOpen?: boolean
}

export default function SchoolCarousel({ schools }: { schools: HomeSchool[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const scrollToSchool = (index: number) => {
    const track = trackRef.current
    const card = track?.children[index] as HTMLElement | undefined
    if (!track || !card) return

    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
    setActiveIndex(index)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.scrollLeft = 0
    setActiveIndex(0)

    const updateActiveIndex = () => {
      const cards = Array.from(track.children) as HTMLElement[]
      const closestIndex = cards.reduce((closest, card, index) => {
        const distance = Math.abs(card.offsetLeft - track.scrollLeft)
        const closestDistance = Math.abs(cards[closest]?.offsetLeft - track.scrollLeft)
        return distance < closestDistance ? index : closest
      }, 0)
      setActiveIndex(closestIndex)
    }

    track.addEventListener('scroll', updateActiveIndex, { passive: true })
    return () => track.removeEventListener('scroll', updateActiveIndex)
  }, [schools.length])

  useEffect(() => {
    if (schools.length < 2 || isPaused) return

    // Don't auto-advance for users who prefer reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      scrollToSchool((activeIndex + 1) % schools.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [activeIndex, isPaused, schools.length])

  if (schools.length === 0) {
    return (
      <div className="placeholder-block">
        No school profiles have been published yet.
      </div>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false)
      }}
    >
      <div
        ref={trackRef}
        className="school-carousel-track flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3"
        aria-label="School profiles"
      >
        {schools.map(school => (
          <Link
            key={school._id}
            href={`/schools/${school.slug}`}
            className="group relative flex h-auto basis-[86%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-parchment-200 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lg sm:basis-[48%] lg:basis-[31.5%]"
          >
            <div className="relative h-44 w-full overflow-hidden">
              {school.imageUrl ? (
                <Image
                  src={school.imageUrl}
                  alt={school.name}
                  fill
                  sizes="(max-width: 640px) 86vw, (max-width: 1024px) 48vw, 31vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-800 to-primary-500 text-5xl font-bold text-white/80">
                  {school.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-sans mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-700">
                {school.name}
              </h3>

              {school.city && (
                <p className="mb-3 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} /> {school.city}
                </p>
              )}

              <div className="flex min-h-6 flex-wrap gap-2">
                {school.levels?.slice(0, 2).map(level => (
                  <span key={level} className="badge">{level}</span>
                ))}
                {school.enrollmentOpen && (
                  <span className="inline-block rounded-full bg-forest-500/10 px-2.5 py-0.5 text-xs font-medium text-forest-600">
                    Enrolling
                  </span>
                )}
              </div>

              <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary-700">
                View school <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {schools.length > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="rounded-full bg-primary-50 px-4 py-2 text-base font-bold text-primary-800" aria-live="polite">
            {activeIndex + 1} of {schools.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollToSchool((activeIndex - 1 + schools.length) % schools.length)}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-200 text-primary-700 transition-colors hover:border-primary-700 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              aria-label="Previous school"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={() => scrollToSchool((activeIndex + 1) % schools.length)}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-200 text-primary-700 transition-colors hover:border-primary-700 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              aria-label="Next school"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
