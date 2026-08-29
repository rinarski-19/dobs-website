'use client'

import { useEffect, useRef } from 'react'
import { Building2, History, UserRoundCheck, UsersRound } from 'lucide-react'

export type Stat = {
  _key?: string
  value: number
  suffix?: string
  label: string
  icon?: 'schools' | 'students' | 'faculty' | 'years'
}

const statIcons = { schools: Building2, students: UsersRound, faculty: UserRoundCheck, years: History }

const COUNT_DURATION = 1800
const VISIBLE_THRESHOLD = 0.35

/**
 * Counts from zero to `target` whenever the figure scrolls into view, and resets
 * to zero on the way out so the next pass — scrolling up or down — counts again.
 *
 * The running number is written straight to the DOM rather than held in state:
 * it avoids re-rendering four stats sixty times a second, and it lets the reset
 * happen synchronously while the band is still off-screen, so the figure is
 * never seen snapping back to zero.
 */
function CountUp({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Both fall back to the real figure, already rendered server-side.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    const format = (n: number) => `${n.toLocaleString()}${suffix ?? ''}`
    let frame = 0

    const run = () => {
      cancelAnimationFrame(frame)
      const began = performance.now()

      const tick = (now: number) => {
        const progress = Math.min((now - began) / COUNT_DURATION, 1)
        // easeOutQuart — quick off the mark, settling onto the final figure
        const eased = 1 - Math.pow(1 - progress, 4)
        node.textContent = format(Math.round(target * eased))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }

      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
          } else {
            // Off-screen: stop and rewind, ready for the next approach.
            cancelAnimationFrame(frame)
            node.textContent = format(0)
          }
        }
      },
      { threshold: VISIBLE_THRESHOLD },
    )

    observer.observe(node)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [target, suffix])

  // Server-rendered value: correct with JS disabled, and the starting point
  // before the observer reports where the band actually sits.
  return <span ref={ref}>{`${target.toLocaleString()}${suffix ?? ''}`}</span>
}

export default function StatsCounter({ stats = [] }: { stats?: Stat[] }) {
  if (stats.length === 0) return null

  return (
    <section
      className="py-11 md:py-12"
      style={{ background: 'linear-gradient(120deg, #0c1c2e 0%, #16324F 55%, #294f72 100%)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className={`grid gap-x-6 gap-y-10 divide-gold-500/20 ${stats.length === 1 ? 'mx-auto max-w-sm grid-cols-1' : 'grid-cols-2 lg:grid-cols-4 lg:divide-x'}`}>
          {stats.map(stat => (
            <div key={stat.label} className="text-center lg:px-4">
              {stat.icon && (() => { const Icon = statIcons[stat.icon]; return <Icon className="mx-auto mb-3 text-gold-300/80" size={24} aria-hidden="true" /> })()}
              <div className="font-diocesan text-4xl md:text-5xl font-bold text-gold-300 mb-2 tabular-nums">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
