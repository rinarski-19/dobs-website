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

export default function Features({ features = fallbackFeatures }: { features?: Feature[] }) {
  return (
    <section className="py-16" style={{ background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon = 'graduation-cap', title, description }, index) => {
            const Icon = icons[icon as keyof typeof icons] ?? Object.values(icons)[index % Object.values(icons).length]
            return (
            <div
              key={title + index}
              className="bg-white rounded-2xl p-8 text-center shadow-sm flex flex-col items-center"
            >
              {/* Gradient icon box */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2e86d4] to-[#4a9eed] flex items-center justify-center mb-6 shadow-md">
                <Icon size={28} className="text-white" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
