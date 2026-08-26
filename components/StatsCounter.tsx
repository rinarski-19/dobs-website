import { Building2, History, UserRoundCheck, UsersRound } from 'lucide-react'

export type Stat = {
  _key?: string
  value: number
  suffix?: string
  label: string
  icon?: 'schools' | 'students' | 'faculty' | 'years'
}

const statIcons = { schools: Building2, students: UsersRound, faculty: UserRoundCheck, years: History }

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
                {stat.value.toLocaleString()}{stat.suffix ?? ''}
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
