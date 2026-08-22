import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type HeroProps = {
  title: string
  subtitle?: string
  description?: string
  image?: string
  imagePlaceholder?: string
  cta?: {
    label: string
    href: string
  }
  ctaSecondary?: {
    label: string
    href: string
  }
}

export default function Hero({
  title,
  subtitle,
  description,
  image,
  imagePlaceholder = 'Hero Image',
  cta,
  ctaSecondary,
}: HeroProps) {
  return (
    <section
      className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden"
      style={
        image
          ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: 'linear-gradient(135deg, #16324F 0%, #285943 100%)' }
      }
    >
      {/* Overlay — only shown when there's a real image */}
      {image && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Placeholder visual when no image */}
      {!image && (
        <div className="absolute inset-0 border-2 border-dashed border-gray-300 m-6 rounded-2xl flex items-center justify-end pr-12">
          <span className="text-gray-400 text-sm">[ {imagePlaceholder} ]</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full text-white">
        {subtitle && (
          <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
            {subtitle}
          </span>
        )}
        <h1 className="font-diocesan text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl text-white/80">
            {description}
          </p>
        )}
        {(cta || ctaSecondary) && (
          <div className="flex flex-wrap gap-3">
            {cta && (
              <Link href={cta.href} className="btn-primary">
                {cta.label} <ArrowRight size={16} />
              </Link>
            )}
            {ctaSecondary && (
              <Link href={ctaSecondary.href} className={`btn-secondary ${image ? 'bg-white/10 border-white/40 text-white hover:bg-white/20' : ''}`}>
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
