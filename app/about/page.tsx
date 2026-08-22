import Hero from '@/components/Hero'
import { client } from '@/lib/sanity'

export const revalidate = 60

type AboutPageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImageUrl?: string
  vision?: string
  mission?: string[]
  coreValues?: Array<{ _key?: string; name: string; description?: string }>
  history?: Array<{
    _key?: string
    _type: string
    style?: string
    children?: Array<{ _key?: string; text?: string }>
  }>
}

const fallback: Required<Omit<AboutPageContent, 'heroImageUrl'>> = {
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
}

async function getAboutPage(): Promise<AboutPageContent> {
  try {
    const content = await client.fetch<AboutPageContent | null>(`
      *[_type == "aboutPage"][0] {
        heroTitle,
        heroSubtitle,
        heroDescription,
        "heroImageUrl": heroImage.asset->url,
        vision,
        mission,
        coreValues,
        history
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

  return (
    <>
      <Hero
        title={content.heroTitle || fallback.heroTitle}
        subtitle={content.heroSubtitle || fallback.heroSubtitle}
        description={content.heroDescription || fallback.heroDescription}
        image={content.heroImageUrl || '/images/about.png'}
        imagePlaceholder="Administration Building Photo"
      />

      <div className="page-wrapper">
        <section className="section grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="card-title mb-4">Mission</h2>
            <ol className="space-y-3 text-gray-600 leading-relaxed list-decimal pl-5">
              {mission.map(item => <li key={item}>{item}</li>)}
            </ol>
          </div>
          <div className="card">
            <h2 className="card-title mb-4">Vision</h2>
            <p className="text-gray-600 leading-relaxed">{content.vision || fallback.vision}</p>
          </div>
        </section>

        <div className="divider" />

        <section className="section">
          <h2 className="section-heading">Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map(value => (
              <article key={value._key ?? value.name} className="card">
                <h3 className="card-title mb-2">{value.name}</h3>
                {value.description && <p className="card-body">{value.description}</p>}
              </article>
            ))}
          </div>
        </section>

        <div className="divider" />

        <section className="section max-w-4xl">
          <h2 className="section-heading">History</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            {history.map((block, index) => {
              const text = block.children?.map(child => child.text ?? '').join('')
              if (!text) return null
              if (block.style === 'h2') return <h2 key={block._key ?? index} className="text-2xl font-bold text-gray-900">{text}</h2>
              if (block.style === 'h3') return <h3 key={block._key ?? index} className="text-xl font-semibold text-gray-900">{text}</h3>
              return <p key={block._key ?? index}>{text}</p>
            })}
          </div>
        </section>
      </div>
    </>
  )
}
