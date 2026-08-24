import { GraduationCap, Globe, BookOpen, Heart } from 'lucide-react'

const fallbackFeatures = [
  {
    icon: 'graduation-cap',
    title: 'Quality Catholic Education',
    description: 'Rooted in faith and academic excellence, our schools provide a holistic formation for every student.',
  },
  {
    icon: 'globe',
    title: 'Network of Schools',
    description: 'A united network of schools across Baguio City and the province of Benguet, serving diverse communities.',
  },
  {
    icon: 'heart',
    title: 'Values-Based Formation',
    description: 'We develop students in mind, body, and spirit — guided by Catholic values and a love of service.',
  },
  {
    icon: 'book-open',
    title: 'Complete K–12 Programs',
    description: 'From Pre-School through Senior High School, our schools offer complete and accredited programs.',
  },
]

export type Feature = {
  _key?: string
  icon?: string
  title: string
  description: string
}

const icons = { GraduationCap, Globe, Heart, BookOpen }

export default function Features({
  features = fallbackFeatures,
  heading = 'Formed in Faith and Learning',
  description,
}: {
  features?: Feature[]
  heading?: string
  description?: string
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-parchment-100 to-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="eyebrow mb-3">Our Mission</span>
          <h2 className="section-heading mb-0">{heading}</h2>
          <span className="gold-rule mx-auto" />
          {description && <p className="section-body mt-4">{description}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon = 'graduation-cap', title, description }, index) => {
            const Icon = icons[icon as keyof typeof icons] ?? Object.values(icons)[index % Object.values(icons).length]
            return (
              <div
                key={title + index}
                className="group rounded-2xl border border-parchment-200 bg-white p-8 text-center shadow-card flex flex-col items-center transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Navy icon tile with gold accent ring */}
                <div className="w-16 h-16 rounded-2xl bg-primary-700 ring-4 ring-gold-500/15 flex items-center justify-center mb-6 shadow-md transition-colors group-hover:bg-primary-800">
                  <Icon size={28} className="text-white" />
                </div>

                <h3 className="font-sans text-lg font-bold text-primary-800 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
