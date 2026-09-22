import Link from 'next/link'
import { Home, Search } from 'lucide-react'

/**
 * Shown for an address that does not exist — usually a mistyped URL or a school
 * or article that has since been removed. Sends people to the two places most
 * likely to hold what they were after rather than leaving them at a dead end.
 */
export default function NotFound() {
  return (
    <div className="section flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-diocesan text-6xl font-bold text-primary-200">404</p>
      <h1 className="mt-4 font-diocesan text-3xl font-bold text-primary-800 sm:text-4xl">
        We couldn&rsquo;t find that page
      </h1>
      <p className="mt-4 max-w-md text-gray-600">
        The address may have changed, or the page may no longer be available.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary justify-center">
          <Home size={17} aria-hidden="true" />
          Back to the homepage
        </Link>
        <Link href="/schools" className="btn-secondary justify-center">
          <Search size={17} aria-hidden="true" />
          Browse our schools
        </Link>
      </div>
    </div>
  )
}
