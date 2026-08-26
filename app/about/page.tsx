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
  return await getPageContent<AboutPageContent>('aboutPage') ?? fallback
}

export default async function AboutPage() {
  const [content, schools] = await Promise.all([getAboutPage(), getSchools()])
  const mission = content.mission?.length ? content.mission : fallback.mission
  const cleanMissionItem = (item: string) => item.replace(/^\s*\d+\s*[.)\-:]\s*/, '').trim()
  const coreValues = content.coreValues?.length ? content.coreValues : fallback.coreValues
  const history = content.history?.length ? content.history : fallback.history
  const leadership = content.leadership?.length ? content.leadership : fallback.leadership
  const valueIcons = [ShieldCheck, Award, HeartHandshake, Sprout]
  const communities = Array.from(new Set(schools.map(school => school.city).filter(Boolean)))
  const educationLevels = Array.from(new Set(schools.flatMap(school => school.levels || [])))
  const networkStats = [
    { value: '2004', label: 'Diocese established' },
    { value: schools.length.toString(), label: 'Member schools' },
    { value: communities.length.toString(), label: 'Communities served' },
    { value: educationLevels.length.toString(), label: 'Educational levels' },
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
        <section className="py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">Who We Are</span>
              <h2 className="mt-3 font-diocesan text-4xl font-bold leading-tight text-[#16324F] md:text-5xl">One Catholic school community</h2>
              <div className="mt-5 h-px w-20 bg-[#C7A24B]" />
              <p className="mt-6 text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                The Diocese of Baguio Schools is a network of Catholic educational communities serving families across Baguio City and the Province of Benguet. Guided by the Diocese and united in faith, its member schools provide formation and learning from early childhood through secondary education.
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
          <p className="mt-3 text-center text-xs leading-5 text-slate-500">Network counts are generated from currently published member-school records.</p>
        </section>

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
              <ol className="space-y-5 text-base leading-7 text-slate-600">
                {mission.map((item, index) => (
                  <li key={`${index}-${item}`} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#155896] text-sm font-semibold text-white">{index + 1}</span>
                    <span>{cleanMissionItem(item)}</span>
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
            <p className="max-w-lg text-base leading-7 text-slate-600">The values that guide learning, leadership, service, and community life throughout the Diocese of Baguio Schools.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length]
              return (
                <article key={value._key ?? value.name} className="group rounded-2xl border border-[#D8CEB8] bg-[#FFFDF7] p-7 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#155896] text-[#F4D98C]">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>
                  <h3 className="font-diocesan text-2xl font-bold text-[#16324F] mb-2">{value.name}</h3>
                  {value.description && <p className="text-base leading-7 text-slate-600">{value.description}</p>}
                </article>
              )
            })}
          </div>
        </section>

        <section className="py-16 border-t border-[#DED5C4]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.6fr] overflow-hidden rounded-3xl border border-[#D8CEB8] bg-white shadow-sm">
            <div className="bg-[#155896] p-8 md:p-10 text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F4D98C]">Our journey</span>
              <h2 className="font-diocesan text-4xl md:text-5xl font-bold mt-3">A Heritage of Faith and Mission</h2>
              <p className="mt-5 text-base leading-7 text-white/80">Rooted in the Cordillera and formed through generations of Catholic evangelization and education.</p>
              <div className="mt-8 h-px w-20 bg-[#F4D98C]" />
            </div>
            <div className="p-8 md:p-10">
              <div className="space-y-6 border-l border-[#C7A24B] pl-7 text-base leading-7 text-slate-600">
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

        <section className="border-t border-[#DED5C4] py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8F3A3A]">How We Are Organized</span>
            <h2 className="mt-2 font-diocesan text-4xl font-bold text-[#16324F] md:text-5xl">Our Institutional Structure</h2>
            <div className="mx-auto mt-4 h-px w-20 bg-[#C7A24B]" />
            <p className="mt-5 text-base leading-7 text-slate-600">The Diocese provides pastoral direction, while the schools office supports coordination and each member school serves its own educational community.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Church, title: 'Diocese of Baguio', text: 'Provides the Catholic identity, pastoral mission, and overall ecclesial direction of the school network.' },
              { icon: Network, title: 'DOBS Office', text: 'Coordinates the network and supports shared formation, standards, communication, and school development.' },
              { icon: Building2, title: 'Member Schools', text: 'Deliver Catholic education in their communities while responding to local learners and families.' },
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
                  <p className="text-base font-medium leading-7 text-[#155896]">{person.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        </div>
      </div>

      <section className="bg-primary-800 text-white">
        <div className="page-wrapper py-16 text-center md:py-20">
          <span className="eyebrow mb-4 text-gold-300">Explore Our Network</span>
          <h2 className="mx-auto max-w-3xl font-diocesan text-4xl font-semibold leading-tight md:text-5xl">Discover our Catholic school community</h2>
          <span className="mx-auto my-6 block h-0.5 w-12 rounded-full bg-gold-500" />
          <p className="mx-auto max-w-2xl text-base leading-7 text-primary-100">Find a member school for your family or contact the Diocese of Baguio Schools office for assistance.</p>
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
