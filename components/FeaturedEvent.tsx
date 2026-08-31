'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatPHDate } from '@/lib/dates'

type FeaturedEventProps = {
  title: string
  category?: string
  description?: string
  image?: string
  imagePlaceholder?: string
  date: Date
  registerHref?: string
}

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return timeLeft
}

function Pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function FeaturedEvent({
  title,
  category = 'School Event',
  description,
  image,
  imagePlaceholder = 'Event Photo',
  date,
  registerHref = '#',
}: FeaturedEventProps) {
  const { days, hours, minutes, seconds } = useCountdown(date)

  const day   = formatPHDate(date, { day: '2-digit' })
  const month = formatPHDate(date, { month: 'short' })

  return (
    <div className="flex flex-col lg:flex-row gap-0 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

      {/* Left — Image */}
      <div className="relative lg:w-[45%] min-h-[340px] bg-gray-100 shrink-0">
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300 m-4 rounded-xl text-gray-400 text-sm">
            [ {imagePlaceholder} ]
          </div>
        )}

        {/* Date badge */}
        <div className="absolute top-4 left-4 bg-white rounded-xl px-4 py-2 text-center shadow-md min-w-[60px]">
          <div className="text-2xl font-bold text-gray-900 leading-none">{day}</div>
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-0.5">{month}</div>
        </div>
      </div>

      {/* Right — Content */}
      <div className="flex-1 px-10 py-12 flex flex-col justify-center">

        {/* Category */}
        <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4">
          {category}
        </p>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-gray-500 leading-relaxed mb-8 max-w-xl">
            {description}
          </p>
        )}

        {/* Countdown */}
        <div className="flex items-end gap-6 mb-8">
          {[
            { value: days,    label: 'days' },
            { value: hours,   label: 'hours' },
            { value: minutes, label: 'minutes' },
            { value: seconds, label: 'seconds' },
          ].map(({ value, label }, i) => (
            <div key={label} className="flex items-end gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 tabular-nums leading-none">
                  {Pad(value)}
                </div>
                <div className="text-xs text-gray-400 mt-2 tracking-wide">{label}</div>
              </div>
              {i < 3 && (
                <div className="text-4xl font-bold text-gray-300 mb-4">:</div>
              )}
            </div>
          ))}
        </div>

        {/* Register button */}
        <Link
          href={registerHref}
          className="btn-primary justify-center px-10 py-4 uppercase tracking-widest text-sm w-full max-w-sm"
        >
          Register
        </Link>

      </div>
    </div>
  )
}
