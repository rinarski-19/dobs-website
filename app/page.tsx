import Hero from '@/components/Hero'
import Features from '@/components/Features'
import StatsCounter from '@/components/StatsCounter'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Feature } from '@/components/Features'
import { Stat } from '@/components/StatsCounter'
import { getPageContent, imageUrlFor } from '@/lib/sanity'

type HomePageContent = {
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroImage?: any
  features?: Feature[]
  stats?: Stat[]
  schoolsHeading?: string
  newsHeading?: string
  enrollmentHeading?: string
  enrollmentDescription?: string
}

const fallbackContent = {
  heroTitle: 'Diocese of Baguio Schools',
  heroSubtitle: 'Catholic Education Network',
  heroDescription: 'Forming young minds in faith, excellence, and service — serving Baguio City and the province of Benguet.',
  schoolsHeading: 'Our Schools',
  newsHeading: 'Latest News & Announcements',
  enrollmentHeading: 'Now Enrolling',
  enrollmentDescription: 'Join the Diocese of Baguio Schools community. Find your school and start your enrollment process today.',
}

export default async function HomePage() {
  const content = await getPageContent<HomePageContent>('homePage')

  return (
    <>
      <Hero
        title={content?.heroTitle || fallbackContent.heroTitle}
        subtitle={content?.heroSubtitle || fallbackContent.heroSubtitle}
        description={content?.heroDescription || fallbackContent.heroDescription}
        image={imageUrlFor(content?.heroImage)}
        imagePlaceholder="School Campus Photo"
        cta={{ label: 'Enroll Now', href: '/enrollment' }}
        ctaSecondary={{ label: 'Our Schools', href: '/schools' }}
      />

      {/* Feature cards — right after hero */}
      <Features features={content?.features?.length ? content.features : undefined} />

      {/* Animated stats counter */}
      <StatsCounter stats={content?.stats?.length ? content.stats : undefined} />

      <div className="page-wrapper">

        <div className="divider" />

        {/* Featured Schools */}
        <section className="section">
          <h2 className="section-heading">{content?.schoolsHeading || fallbackContent.schoolsHeading}</h2>
          <div className="placeholder-block">[ School cards — waiting for full school list ]</div>
          <div className="mt-4">
            <Link href="/schools" className="btn-secondary">View All Schools <ArrowRight size={16} /></Link>
          </div>
        </section>

        <div className="divider" />

        {/* Latest News */}
        <section className="section">
          <h2 className="section-heading">{content?.newsHeading || fallbackContent.newsHeading}</h2>
          <div className="placeholder-block">[ Latest news from Sanity CMS ]</div>
          <div className="mt-4">
            <Link href="/news" className="btn-secondary">View All News <ArrowRight size={16} /></Link>
          </div>
        </section>

        <div className="divider" />

        {/* Enrollment CTA */}
        <section className="section card text-center max-w-2xl mx-auto">
          <h2 className="section-heading">{content?.enrollmentHeading || fallbackContent.enrollmentHeading}</h2>
          <p className="section-body mb-6">{content?.enrollmentDescription || fallbackContent.enrollmentDescription}</p>
          <Link href="/enrollment" className="btn-primary">Start Enrollment <ArrowRight size={16} /></Link>
        </section>

      </div>
    </>
  )
}
