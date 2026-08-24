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

export default function StatsCounter({ stats = fallbackStats }: { stats?: Stat[] }) {
  return (
    <section
      className="py-16 md:py-20"
      style={{ background: 'linear-gradient(120deg, #0c1c2e 0%, #16324F 55%, #294f72 100%)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 divide-gold-500/20 lg:divide-x">
          {stats.map(stat => (
            <div key={stat.label} className="text-center lg:px-4">
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
