import { GraduationCap, Globe, BookOpen, Heart } from 'lucide-react'

const features = [
  {
    icon: GraduationCap,
    title: 'Quality Catholic Education',
    description: 'Rooted in faith and academic excellence, our schools provide a holistic formation for every student.',
  },
  {
    icon: Globe,
    title: 'Network of Schools',
    description: 'A united network of schools across Baguio City and the province of Benguet, serving diverse communities.',
  },
  {
    icon: Heart,
    title: 'Values-Based Formation',
    description: 'We develop students in mind, body, and spirit — guided by Catholic values and a love of service.',
  },
  {
    icon: BookOpen,
    title: 'Complete K–12 Programs',
    description: 'From Pre-School through Senior High School, our schools offer complete and accredited programs.',
  },
]

export default function Features() {
  return (
    <section className="py-16" style={{ background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-8 text-center shadow-sm flex flex-col items-center"
            >
              {/* Gradient icon box */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2e86d4] to-[#4a9eed] flex items-center justify-center mb-6 shadow-md">
                <Icon size={28} className="text-white" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
