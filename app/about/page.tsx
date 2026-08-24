import Hero from '@/components/Hero'
import { client, imageUrlFor } from '@/lib/sanity'
import { Award, Church, HeartHandshake, Quote, ShieldCheck, Sprout } from 'lucide-react'

export const revalidate = 60

type AboutPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  vision?: string
  mission?: string[]
  coreValues?: Array<{ _key?: string; name: string; description?: string }>
  history?: Array<{
    _key?: string
    _type: string
    style?: string
    children?: Array<{ _key?: string; text?: string }>
  }>
  leadership?: Array<{ _key?: string; name: string; role: string; photo?: any }>
}

const fallback: Required<Omit<AboutPageContent, 'heroImage'>> = {
  heroTitle: 'About DOBS',
  heroSubtitle: 'Our Story',
  heroDescription: 'Learn about the mission, vision, core values, and history of the Diocese of Baguio Schools network.',
  vision: 'We envision ourselves as caring Catholic school communities transforming lives and forming committed disciples of Jesus Christ.',
  mission: [
    'Set the schools as avenues for creative faith formation.',
    'Practice a Basic Ecclesial Community spirit of leadership and management.',
    'Promote academic and religious curricula for integral human development.',
    'Nurture the values of family, community, environment, respect, and dialogue with diverse cultures while addressing emerging concerns.',
    'Work toward educational communities that are stewardship-driven, sustainable, and committed to continuous improvement.',
  ],
  coreValues: [
    { name: 'Christian Character', description: 'Living according to the Gospel and demonstrating faith, integrity, compassion, and respect.' },
    { name: 'Excellence', description: 'Striving for high standards in education, formation, service, and personal development.' },
    { name: 'Servant Leadership', description: 'Leading with humility and using one’s abilities in service of others.' },
    { name: 'Stewardship', description: 'Responsibly caring for people, resources, the community, and the environment.' },
  ],
  history: [
    { _type: 'block', children: [{ text: 'The roots of Catholic education in Baguio and Benguet can be traced to the arrival of the Congregation of the Immaculate Heart of Mary, or CICM missionaries, in 1907. Alongside their work of evangelization, the missionaries established mission centers, schools, hospitals, and parishes throughout the Cordillera.' }] },
    { _type: 'block', children: [{ text: 'The Apostolic Prefecture of the Mountain Provinces was established on July 15, 1932. It was elevated to the Apostolic Vicariate of the Mountain Provinces in 1948 and renamed the Apostolic Vicariate of Baguio in 1992.' }] },
    { _type: 'block', children: [{ text: 'On June 24, 2004, it was formally elevated as the Diocese of Baguio, serving Baguio City and the Province of Benguet. The Diocese of Baguio Schools continues this Catholic educational mission through a network of schools committed to faith formation, academic excellence, cultural respect, servant leadership, and responsible stewardship.' }] },
  ],
  leadership: [
    { name: 'Most Rev. Rafael T. Cruz, D.D.', role: 'Bishop of the Diocese of Baguio' },
    { name: 'Rev. Fr. Marlon M. Urmaza', role: 'Superintendent, Diocese of Baguio Schools' },
  ],
}

async function getAboutPage(): Promise<AboutPageContent> {
  try {
    const content = await client.fetch<AboutPageContent | null>(`
      *[_type == "aboutPage"] | order(_updatedAt desc)[0] {
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroImage,
        vision,
        mission,
        coreValues,
        history,
        leadership[] {
          _key,
          name,
          role,
          photo
        }
      }
    `)
    return content ?? fallback
  } catch (error) {
    console.error('Unable to load About Page content from Sanity:', error)
    return fallback
  }
}

export default async function AboutPage() {
  const content = await getAboutPage()
  const mission = content.mission?.length ? content.mission : fallback.mission
  const coreValues = content.coreValues?.length ? content.coreValues : fallback.coreValues
  const history = content.history?.length ? content.history : fallback.history
  const leadership = content.leadership?.length ? content.leadership : fallback.leadership
  const valueIcons = [ShieldCheck, Award, HeartHandshake, Sprout]

  return (
    <>
      <Hero
        title={content.heroTitle || fallback.heroTitle}
        subtitle={content.heroSubtitle || fallback.heroSubtitle}
        description={content.heroDescription || fallback.heroDescription}
        image={imageUrlFor(content.heroImage) || '/images/about.png'}
        imagePlaceholder="Administration Building Photo"
      />

      <div className="bg-[#F7F3EA]">
        <div className="page-wrapper">
        <section className="py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">Faith in action</span>
            <h2 className="font-diocesan text-4xl md:text-5xl font-bold text-[#16324F] mt-3">Our Guiding Purpose</h2>
            <div className="mx-auto mt-4 h-px w-20 bg-[#C7A24B]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 overflow-hidden rounded-3xl border border-[#D8CEB8] bg-white shadow-sm">
            <div className="lg:col-span-3 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Church className="text-[#C7A24B]" size={24} strokeWidth={1.7} />
                <h3 className="font-diocesan text-3xl font-bold text-[#16324F]">Our Mission</h3>
              </div>
              <ol className="space-y-4 text-slate-600 leading-relaxed">
                {mission.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#285943] text-xs font-semibold text-white">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative lg:col-span-2 bg-[#16324F] p-8 md:p-10 text-white flex flex-col justify-center">
              <Quote className="absolute right-8 top-8 text-[#C7A24B]/30" size={72} strokeWidth={1.2} />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D9BC72] mb-4">Our Vision</span>
              <p className="font-diocesan text-3xl md:text-4xl font-semibold leading-tight text-[#FFFDF7] relative z-10">
                {content.vision || fallback.vision}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-[#DED5C4]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-9">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">What shapes us</span>
              <h2 className="font-diocesan text-4xl md:text-5xl font-bold text-[#16324F] mt-2">Core Values</h2>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-slate-600">The values that guide learning, leadership, service, and community life throughout the Diocese of Baguio Schools.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length]
              return (
                <article key={value._key ?? value.name} className="group rounded-2xl border border-[#D8CEB8] bg-[#FFFDF7] p-7 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#285943] text-[#F4D98C]">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>
                  <h3 className="font-diocesan text-2xl font-bold text-[#16324F] mb-2">{value.name}</h3>
                  {value.description && <p className="text-sm leading-relaxed text-slate-600">{value.description}</p>}
                </article>
              )
            })}
          </div>
        </section>

        <section className="py-16 border-t border-[#DED5C4]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.6fr] overflow-hidden rounded-3xl border border-[#D8CEB8] bg-white shadow-sm">
            <div className="bg-[#285943] p-8 md:p-10 text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F4D98C]">Our journey</span>
              <h2 className="font-diocesan text-4xl md:text-5xl font-bold mt-3">A Heritage of Faith and Mission</h2>
              <p className="mt-5 text-sm leading-relaxed text-white/75">Rooted in the Cordillera and formed through generations of Catholic evangelization and education.</p>
              <div className="mt-8 h-px w-20 bg-[#F4D98C]" />
            </div>
            <div className="p-8 md:p-10">
              <div className="space-y-6 text-slate-600 leading-relaxed border-l border-[#C7A24B] pl-7">
            {history.map((block, index) => {
              const text = block.children?.map(child => child.text ?? '').join('')
              if (!text) return null
              if (block.style === 'h2') return <h2 key={block._key ?? index} className="font-diocesan text-3xl font-bold text-[#16324F]">{text}</h2>
              if (block.style === 'h3') return <h3 key={block._key ?? index} className="font-diocesan text-2xl font-bold text-[#16324F]">{text}</h3>
              return <p key={block._key ?? index} className="relative before:absolute before:-left-[2.08rem] before:top-2 before:h-3 before:w-3 before:rounded-full before:border-2 before:border-[#C7A24B] before:bg-white">{text}</p>
            })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-[#DED5C4]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">Called to serve</span>
            <h2 className="font-diocesan text-4xl md:text-5xl font-bold text-[#16324F] mt-2">Leadership &amp; Administration</h2>
            <div className="mx-auto mt-4 h-px w-20 bg-[#C7A24B]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {leadership.map(person => (
              <article key={person._key ?? person.name} className="rounded-2xl border border-[#D8CEB8] bg-[#FFFDF7] p-7 shadow-sm flex items-center gap-5">
                {person.photo ? (
                  <img src={imageUrlFor(person.photo, 200, 200)} alt={person.name} className="h-20 w-20 rounded-full object-cover shrink-0 ring-2 ring-[#C7A24B] ring-offset-4 ring-offset-[#FFFDF7]" />
                ) : (
                  <div className="font-diocesan h-20 w-20 rounded-full bg-[#16324F] text-[#F4D98C] ring-2 ring-[#C7A24B] ring-offset-4 ring-offset-[#FFFDF7] flex items-center justify-center text-2xl font-bold shrink-0" aria-hidden="true">
                    {person.name.split(' ').filter(word => /^[A-Z]/.test(word)).slice(0, 2).map(word => word[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="font-diocesan text-2xl font-bold text-[#16324F] mb-1">{person.name}</h3>
                  <p className="text-sm font-medium leading-relaxed text-[#285943]">{person.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        </div>
      </div>
    </>
  )
}
