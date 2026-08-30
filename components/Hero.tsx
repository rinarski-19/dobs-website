import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

type HeroProps = {
  title: string
  subtitle?: string
  description?: string
  image?: string
  imageAlt?: string
  imagePlaceholder?: string
  cta?: {
    label: string
    href: string
  }
  ctaSecondary?: {
    label: string
    href: string
  }
  viewport?: boolean
  parallax?: boolean
  compactText?: boolean
  homeHero?: boolean
}

export default function Hero({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  imagePlaceholder = 'Hero Image',
  cta,
  ctaSecondary,
  viewport = false,
  parallax = false,
  compactText = false,
  homeHero = false,
}: HeroProps) {
  // Parallax pages keep the CSS fixed-background technique (next/image can't do
  // background-attachment: fixed); every other hero uses an optimized next/image.
  const useCssBackground = parallax && !!image

  return (
    <section
      className={`relative w-full ${homeHero ? 'h-[80svh] min-h-[30rem]' : viewport ? 'h-[calc(100svh-4rem)] min-h-[28rem]' : 'h-[70vh] min-h-[26rem]'} ${parallax ? 'hero-parallax' : ''} flex items-center justify-center overflow-hidden`}
      style={
        useCssBackground
          ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : image
            ? undefined
            : { background: 'linear-gradient(135deg, #16324F 0%, #285943 100%)' }
      }
    >
      {/* Real, optimized hero image (non-parallax heroes) */}
      {image && !useCssBackground && (
        <Image
          src={image}
          alt={imageAlt ?? ''}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Navy gradient scrim — guarantees text contrast over any photo */}
      {image && (
        <div
          className="absolute inset-0"
          style={{
            background:
              compactText
                ? 'linear-gradient(90deg, rgba(12,28,46,0.92) 0%, rgba(12,28,46,0.76) 34%, rgba(12,28,46,0.32) 66%, rgba(12,28,46,0.12) 100%)'
                : 'linear-gradient(90deg, rgba(12,28,46,0.82) 0%, rgba(12,28,46,0.55) 45%, rgba(12,28,46,0.25) 100%)',
          }}
        />
      )}

      {/* Placeholder visual when no image */}
      {!image && (
        <div className="absolute inset-0 border-2 border-dashed border-white/25 m-6 rounded-2xl flex items-center justify-end pr-12">
          <span className="text-white/50 text-sm">[ {imagePlaceholder} ]</span>
        </div>
      )}

      {/* Soft fade into the page surface below */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 md:h-64 z-[5]"
        style={{
          background:
            'linear-gradient(to top, #F7F3EA 0%, rgba(247,243,234,0.92) 14%, rgba(247,243,234,0.75) 30%, rgba(247,243,234,0.5) 48%, rgba(247,243,234,0.28) 66%, rgba(247,243,234,0.12) 82%, rgba(247,243,234,0) 100%)',
        }}
      />

      {/* Content */}
      <div className={`relative z-10 max-w-[1400px] mx-auto px-6 w-full text-white ${compactText || homeHero ? '-translate-y-8 md:-translate-y-12' : ''}`}>
        {subtitle && (
          <span className="eyebrow mb-4 px-3 py-1 rounded-full bg-gold-500 text-primary-900">
            {subtitle}
          </span>
        )}
        <h1 className={`font-diocesan text-4xl font-bold leading-tight mb-4 mt-4 ${homeHero ? 'max-w-4xl md:text-6xl lg:text-7xl' : `md:text-5xl lg:text-6xl ${compactText ? 'max-w-2xl' : 'max-w-3xl'}`}`}>
          {title}
        </h1>
        {description && (
          <p className={`text-lg md:text-xl leading-relaxed mb-8 text-white/90 ${compactText ? 'max-w-xl' : 'max-w-2xl'}`}>
            {description}
          </p>
        )}
        {(cta || ctaSecondary) && (
          <div className="flex flex-wrap gap-3">
            {cta && (
              <Link href={cta.href} className="btn-accent">
                {cta.label} <ArrowRight size={16} />
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-white/50 bg-white/10 text-white font-semibold backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
