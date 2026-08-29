import Hero from '@/components/Hero'
import { getPageContent, imageUrlFor } from '@/lib/sanity'
import { getSchools } from '@/lib/schools'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Building2, Church, HeartHandshake, Network, Quote, ShieldCheck, Sprout, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

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
  leadership?: Array<{ _key?: string; name: string; role: string; photo?: any; biography?: string }>
}

const fallback: Required<Omit<AboutPageContent, 'heroImage'>> = {
  heroTitle: 'About DOBS',
  heroSubtitle: 'Our Story',
  heroDescription: 'Learn about the mission, vision, core values, and history of the schools of the Diocese of Baguio.',
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
    { _type: 'block', children: [{ text: 'On June 24, 2004, it was formally elevated as the Diocese of Baguio, serving Baguio City and the Province of Benguet. The Diocese of Baguio Schools continues this Catholic educational mission through schools committed to faith formation, academic excellence, cultural respect, servant leadership, and responsible stewardship.' }] },
  ],
  leadership: [
    { name: 'Most Rev. Rafael T. Cruz, D.D.', role: 'Bishop of the Diocese of Baguio' },
    { name: 'Rev. Fr. Marlon M. Urmaza', role: 'Superintendent, Diocese of Baguio Schools' },
  ],
}

async function getAboutPage(): Promise<AboutPageContent> {
  return await getPageContent<AboutPageContent>('aboutPage') ?? fallback
}

export default async function AboutPage() {
  const [content, schools] = await Promise.all([getAboutPage(), getSchools()])
  const mission = content.mission?.length ? content.mission : fallback.mission
  const cleanMissionItem = (item: string) => item.replace(/^\s*\d+\s*[.)\-:]\s*/, '').trim()
  const coreValues = content.coreValues?.length ? content.coreValues : fallback.coreValues
  const leadership = content.leadership?.length ? content.leadership : fallback.leadership
  const valueIcons = [ShieldCheck, Award, HeartHandshake, Sprout]
  const leadershipPhoto = (person: (typeof leadership)[number]) => {
    if (person.photo) return imageUrlFor(person.photo, 800, 1000)
    if (/rafael/i.test(person.name)) return '/images/Rev. Rafael.png'
    if (/marlon/i.test(person.name)) return '/images/Fr. Marlon.png'
    return undefined
  }
  const communities = Array.from(new Set(schools.map(school => school.city).filter(Boolean)))
  const educationLevels = Array.from(new Set(schools.flatMap(school => school.levels || [])))
  const networkStats = [
    { value: '2004', label: 'Diocese established' },
    { value: schools.length.toString(), label: 'Diocesan schools' },
    { value: communities.length.toString(), label: 'Communities served' },
    { value: educationLevels.length.toString(), label: 'Educational levels' },
  ]
  const historyMilestones = [
    { year: '1907', text: 'CICM missionaries arrived and began establishing mission centers, schools, hospitals, and parishes throughout the Cordillera.' },
    { year: '1932', text: 'The Apostolic Prefecture of the Mountain Provinces was established.' },
    { year: '1948', text: 'The ecclesiastical territory was elevated to the Apostolic Vicariate of the Mountain Provinces.' },
    { year: '1992', text: 'It was renamed the Apostolic Vicariate of Baguio.' },
    { year: '2004', text: 'The Diocese of Baguio was formally established, serving Baguio City and the Province of Benguet.' },
  ]

  return (
    <>
      <Hero
        title={content.heroTitle || fallback.heroTitle}
        subtitle={content.heroSubtitle || fallback.heroSubtitle}
        description={content.heroDescription || fallback.heroDescription}
        image={imageUrlFor(content.heroImage) || '/images/about.jpeg'}
        imagePlaceholder="Administration Building Photo"
        compactText
      />

      <div className="bg-[#F7F3EA]">
        <div className="page-wrapper">
        <section className="pb-6 pt-16 md:pb-8 md:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">Who We Are</span>
              <h2 className="mt-3 font-diocesan text-4xl font-bold leading-tight text-[#16324F] md:text-5xl">One Catholic school community</h2>
              <div className="mt-5 h-px w-20 bg-[#C7A24B]" />
              <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                The Diocese of Baguio Schools is the system of Catholic schools under the administration of the Diocese, serving families across Baguio City and the Province of Benguet. Its schools provide formation and learning from early childhood through secondary education.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Each school responds to the needs of its local community while sharing a commitment to Gospel values, academic excellence, service, cultural respect, and responsible stewardship.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#D8CEB8] bg-white shadow-sm">
              <Image src="/images/classroom-discussion-1280x720.png" alt="Students learning together in a Catholic school community" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16324F]/45 via-transparent to-transparent" />
            </div>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-2xl border border-[#2A6191] bg-[#16324F] sm:grid-cols-2 lg:grid-cols-4">
            {networkStats.map((stat, index) => (
              <div key={stat.label} className={`px-6 py-7 text-center ${index > 0 ? 'border-t border-white/15 sm:border-l sm:border-t-0' : ''} ${index === 2 ? 'sm:border-l-0 lg:border-l' : ''}`}>
                <strong className="block font-diocesan text-4xl font-bold text-[#F4D98C] md:text-5xl">{stat.value}</strong>
                <span className="mt-1 block text-sm font-semibold uppercase tracking-[0.12em] text-white/85">{stat.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs leading-5 text-slate-500">Counts are generated from currently published school records.</p>
        </section>

        <section className="pb-16 pt-6 md:pt-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">Faith in action</span>
            <h2 className="font-diocesan text-4xl md:text-5xl font-bold text-[#16324F] mt-3">Our Guiding Purpose</h2>
            <div className="mx-auto mt-4 h-px w-20 bg-[#C7A24B]" />
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-[#D8CEB8] bg-white shadow-sm lg:grid-cols-2">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Church className="text-[#C7A24B]" size={24} strokeWidth={1.7} />
                <h3 className="font-diocesan text-3xl font-bold text-[#16324F]">Our Mission</h3>
              </div>
              <ol className="space-y-5 text-base leading-7 text-slate-600">
                {mission.map((item, index) => (
                  <li key={`${index}-${item}`} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#155896] text-sm font-semibold text-white">{index + 1}</span>
                    <span>{cleanMissionItem(item)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative flex flex-col justify-center border-t-2 border-[#C7A24B] bg-[#16324F] p-8 text-white md:p-10 lg:border-l-2 lg:border-t-0">
              <Quote className="absolute right-8 top-8 text-[#C7A24B]/30" size={72} strokeWidth={1.2} />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D9BC72] mb-4">Our Vision</span>
              <p className="font-diocesan text-3xl md:text-4xl font-semibold leading-tight text-[#FFFDF7] relative z-10">
                {content.vision || fallback.vision}
              </p>
            </div>
          </div>
        </section>

        <section className="relative left-1/2 w-screen -translate-x-1/2 border-t border-[#DED5C4] bg-white">
          <div className="page-wrapper py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-9">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">What shapes us</span>
              <h2 className="font-diocesan text-4xl md:text-5xl font-bold text-[#16324F] mt-2">Core Values</h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-slate-600">The values that guide learning, leadership, service, and community life throughout the Diocese of Baguio Schools.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {coreValues.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length]
              return (
                <article key={value._key ?? value.name} className="group h-full rounded-2xl border border-[#D8CEB8] bg-[#FFFDF7] p-7 transition-all hover:-translate-y-1 hover:border-[#C7A24B] hover:shadow-md focus-within:border-[#C7A24B]">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#155896] text-[#F4D98C]">
                    <Icon size={28} strokeWidth={1.7} />
                  </div>
                  <h3 className="font-diocesan text-2xl font-bold text-[#16324F] mb-2">{value.name}</h3>
                  {value.description && <p className="text-base leading-7 text-slate-600">{value.description}</p>}
                </article>
              )
            })}
          </div>
          </div>
        </section>

        <section className="relative left-1/2 w-screen -translate-x-1/2 border-t border-[#C9DCEB] bg-[#EEF5FA]">
          <div className="page-wrapper py-16">
          <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-[#B9D0E2] bg-white shadow-sm lg:grid-cols-[0.85fr_1.5fr]">
            <div className="relative min-h-[26rem] overflow-hidden bg-[#155896] text-white">
              <Image src="/images/about.jpeg" alt="Archival view of Diocese of Baguio clergy and leadership" fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover object-center opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16324F] via-[#16324F]/65 to-[#16324F]/25" />
              <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F4D98C]">Our journey</span>
              <h2 className="font-diocesan text-4xl md:text-5xl font-bold mt-3">A Heritage of Faith and Mission</h2>
              <p className="mt-5 text-base leading-7 text-white/80">Rooted in the Cordillera and formed through generations of Catholic evangelization and education.</p>
              <div className="mt-8 h-px w-20 bg-[#F4D98C]" />
              </div>
            </div>
            <div className="p-8 md:p-10">
              <div className="space-y-7 border-l-2 border-[#C7A24B] pl-8 text-base leading-7 text-slate-600">
                {historyMilestones.map(milestone => (
                  <div key={milestone.year} className="relative before:absolute before:-left-[2.72rem] before:top-1 before:h-5 before:w-5 before:rounded-full before:border-[3px] before:border-[#C7A24B] before:bg-white">
                    <strong className="font-diocesan text-2xl font-bold text-[#155896]">{milestone.year}</strong>
                    <p className="mt-1">{milestone.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>

        <section className="border-t border-[#DED5C4] py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">How We Are Organized</span>
            <h2 className="mt-2 font-diocesan text-4xl font-bold text-[#16324F] md:text-5xl">Our Institutional Structure</h2>
            <div className="mx-auto mt-4 h-px w-20 bg-[#C7A24B]" />
            <p className="mt-5 text-base leading-7 text-slate-600">The Diocese provides pastoral direction, while the schools office supports coordination and each school serves its own educational community.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Church, title: 'Diocese of Baguio', text: 'Provides the Catholic identity, pastoral mission, and overall ecclesial direction of the diocesan schools.' },
              { icon: Network, title: 'DOBS Office', text: 'Coordinates the schools and supports shared formation, standards, communication, and school development.' },
              { icon: Building2, title: 'Diocesan Schools', text: 'Deliver Catholic education in their communities while responding to local learners and families.' },
              { icon: Users, title: 'Leadership', text: 'The Bishop provides diocesan oversight, supported by the superintendent in the educational mission.' },
            ].map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="relative rounded-2xl border border-[#D8CEB8] bg-[#FFFDF7] p-6 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#155896] text-[#F4D98C]"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
                <span className="mt-4 block text-xs font-bold uppercase tracking-[0.16em] text-[#8F3A3A]">Level {index + 1}</span>
                <h3 className="mt-2 font-diocesan text-2xl font-bold text-[#16324F]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{text}</p>
                {index < 3 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-[#C7A24B] lg:block" size={28} aria-hidden="true" />}
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 border-t border-[#DED5C4]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">Called to serve</span>
            <h2 className="font-diocesan text-4xl md:text-5xl font-bold text-[#16324F] mt-2">Leadership &amp; Administration</h2>
            <div className="mx-auto mt-4 h-px w-20 bg-[#C7A24B]" />
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-7 md:grid-cols-2">
            {leadership.map(person => (
              <article key={person._key ?? person.name} className="flex h-full flex-col items-center rounded-3xl border border-[#D8CEB8] bg-[#FFFDF7] p-8 text-center shadow-sm transition-all hover:border-[#C7A24B] hover:shadow-md sm:flex-row sm:text-left">
                {leadershipPhoto(person) ? (
                  <img src={leadershipPhoto(person)} alt={person.name} className="h-40 w-32 shrink-0 rounded-2xl object-cover object-top ring-2 ring-[#C7A24B] ring-offset-4 ring-offset-[#FFFDF7]" />
                ) : (
                  <div className="font-diocesan flex h-40 w-32 shrink-0 items-center justify-center rounded-2xl bg-[#16324F] text-3xl font-bold text-[#F4D98C] ring-2 ring-[#C7A24B] ring-offset-4 ring-offset-[#FFFDF7]" aria-hidden="true">
                    {person.name.split(' ').filter(word => /^[A-Z]/.test(word)).slice(0, 2).map(word => word[0]).join('')}
                  </div>
                )}
                <div className="mt-7 sm:ml-8 sm:mt-0">
                  <h3 className="mb-2 font-diocesan text-3xl font-bold leading-tight text-[#16324F]">{person.name}</h3>
                  <p className="text-base font-semibold leading-7 text-[#155896]">{person.role}</p>
                  {person.biography && <p className="mt-3 text-base leading-7 text-slate-600">{person.biography}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
        </div>
      </div>

      <section className="bg-primary-800 text-white">
        <div className="page-wrapper py-16 text-center md:py-20">
          <span className="eyebrow mb-4 text-gold-300">Our Schools</span>
          <h2 className="mx-auto max-w-3xl font-diocesan text-4xl font-semibold leading-tight md:text-5xl">Discover our Catholic school community</h2>
          <span className="mx-auto my-6 block h-0.5 w-12 rounded-full bg-gold-500" />
          <p className="mx-auto max-w-2xl text-base leading-7 text-primary-100">Find a school for your family or contact the Diocese of Baguio Schools office for assistance.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/schools" className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-800 shadow-sm transition-all hover:bg-primary-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto">
              Browse Our Schools <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} aria-hidden="true" />
            </Link>
            <Link href="/contact" className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-all hover:border-gold-400 hover:bg-gold-400 hover:text-primary-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto">
              Contact the DOBS Office <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
