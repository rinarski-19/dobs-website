import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSiteSettings } from '@/lib/sanity'

const FALLBACK_TITLE = 'Diocese of Baguio Schools'
const FALLBACK_DESCRIPTION =
  'The Catholic schools of the Diocese of Baguio, serving Baguio City and the province of Benguet — forming young minds in faith, excellence, and service.'

/** Browser-tab title and search-engine description, editable in Site Settings. */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.siteTitle || FALLBACK_TITLE

  return {
    title: { default: title, template: `%s · ${title}` },
    description: settings?.siteDescription || FALLBACK_DESCRIPTION,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-parchment-50 text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
