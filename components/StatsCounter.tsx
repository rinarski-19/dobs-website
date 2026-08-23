'use client'

import { useEffect, useRef, useState } from 'react'

const fallbackStats = [
  { value: 12,   suffix: '+', label: 'Member Schools' },
  { value: 5000, suffix: '+', label: 'Students Enrolled' },
  { value: 400,  suffix: '+', label: 'Faculty & Staff' },
  { value: 50,   suffix: '+', label: 'Years of Service' },
]

export type Stat = {
  _key?: string
  value: number
  suffix?: string
  label: string
}

function useCountUp(target: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return count
}

function StatItem({ value, suffix = '', label, started }: Stat & { started: boolean }) {
  const count = useCountUp(value, 1800, started)
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-white mb-2 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sky-200 text-sm font-medium uppercase tracking-widest">{label}</div>
    </div>
  )
}

export default function StatsCounter({ stats = fallbackStats }: { stats?: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="bg-gradient-to-r from-[#155896] to-[#2e86d4] py-16"
    >
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map(stat => (
            <StatItem key={stat.label} {...stat} started={started} />
          ))}
        </div>
      </div>
    </section>
  )
}
