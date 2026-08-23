import Hero from '@/components/Hero'
import Features from '@/components/Features'
import StatsCounter from '@/components/StatsCounter'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPageHeroImage } from '@/lib/sanity'

export default async function HomePage() {
  const heroImage = await getPageHeroImage('home')

  return (
    <>
      <Hero
        title="Diocese of Baguio Schools"
        subtitle="Catholic Education Network"
        description="Forming young minds in faith, excellence, and service — serving Baguio City and the province of Benguet."
        image={heroImage}
        imagePlaceholder="School Campus Photo"
        cta={{ label: 'Enroll Now', href: '/enrollment' }}
        ctaSecondary={{ label: 'Our Schools', href: '/schools' }}
      />

      {/* Feature cards — right after hero */}
      <Features />

      {/* Animated stats counter */}
      <StatsCounter />

      <div className="page-wrapper">

        <div className="divider" />

        {/* Featured Schools */}
        <section className="section">
          <h2 className="section-heading">Our Schools</h2>
          <div className="placeholder-block">[ School cards — waiting for full school list ]</div>
          <div className="mt-4">
            <Link href="/schools" className="btn-secondary">View All Schools <ArrowRight size={16} /></Link>
          </div>
        </section>

        <div className="divider" />

        {/* Latest News */}
        <section className="section">
          <h2 className="section-heading">Latest News &amp; Announcements</h2>
          <div className="placeholder-block">[ Latest news from Sanity CMS ]</div>
          <div className="mt-4">
            <Link href="/news" className="btn-secondary">View All News <ArrowRight size={16} /></Link>
          </div>
        </section>

        <div className="divider" />

        {/* Enrollment CTA */}
        <section className="section card text-center max-w-2xl mx-auto">
          <h2 className="section-heading">Now Enrolling</h2>
          <p className="section-body mb-6">
            Join the Diocese of Baguio Schools community. Find your school and start your enrollment process today.
          </p>
          <Link href="/enrollment" className="btn-primary">Start Enrollment <ArrowRight size={16} /></Link>
        </section>

      </div>
    </>
  )
}
