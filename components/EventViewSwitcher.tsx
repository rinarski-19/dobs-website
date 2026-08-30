'use client'

import { useState, type ReactNode } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'

type CalendarEvent = {
  id: string
  title: string
  category: string
  date: {
    day: string
    month: string
    year: string
  }
}

type EventViewSwitcherProps = {
  events: CalendarEvent[]
  children: ReactNode
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const calendarDays = [null, null, 1, ...Array.from({ length: 29 }, (_, index) => index + 2)]

export default function EventViewSwitcher({ events, children }: EventViewSwitcherProps) {
  const [view, setView] = useState<'cards' | 'calendar'>('cards')

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3" role="group" aria-label="Choose events view">
        <button
          type="button"
          onClick={() => setView('cards')}
          aria-pressed={view === 'cards'}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
            view === 'cards'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'border border-primary-200 bg-white text-primary-700 hover:bg-primary-50'
          }`}
        >
          <LayoutGrid size={18} aria-hidden="true" /> Card View
        </button>
        <button
          type="button"
          onClick={() => setView('calendar')}
          aria-pressed={view === 'calendar'}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
            view === 'calendar'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'border border-primary-200 bg-white text-primary-700 hover:bg-primary-50'
          }`}
        >
          <CalendarDays size={18} aria-hidden="true" /> Calendar View
        </button>
      </div>

      {view === 'cards' ? (
        children
      ) : (
        <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-primary-100 bg-primary-50 px-5 py-4 md:px-6">
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary-200 bg-white text-primary-700 hover:bg-primary-100" aria-label="Previous month">
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <h3 className="font-diocesan text-2xl font-bold text-primary-700 md:text-3xl">September 2026</h3>
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary-200 bg-white text-primary-700 hover:bg-primary-100" aria-label="Next month">
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-7 border-b border-gray-100 bg-parchment-50">
                {weekDays.map(day => (
                  <div key={day} className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-primary-700">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const dayEvents = day === 1 ? events : []

                  return (
                    <div key={index} className="min-h-32 border-b border-r border-gray-100 p-2.5 last:border-r-0">
                      {day && <span className="text-sm font-semibold text-gray-700">{day}</span>}
                      <div className="mt-2 space-y-1.5">
                        {dayEvents.slice(0, 2).map(event => (
                          <div key={event.id} className="rounded-md bg-primary-700 px-2 py-1.5 text-xs font-medium leading-4 text-white">
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="px-1 text-xs font-semibold text-primary-700">+{dayEvents.length - 2} more events</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
