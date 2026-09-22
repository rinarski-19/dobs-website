'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RotateCw } from 'lucide-react'

/**
 * The last line of defence for a page that threw.
 *
 * Most CMS trouble never reaches here: fetchSanity returns null on failure and
 * every page falls back to its own defaults, so a Sanity outage degrades rather
 * than breaking. This catches what is left — a malformed document, an unexpected
 * shape — and offers a retry, since those are often transient.
 *
 * The message itself is never shown. It can carry internal detail, and someone
 * looking for a Mass schedule has no use for a stack trace.
 *
 * retry() rather than reset(): reset only re-renders the same children, while
 * retry re-fetches them first. Nearly everything that fails on these pages is a
 * Sanity read, so re-rendering the same failed data would change nothing.
 */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error('Unhandled error while rendering a page:', error)
  }, [error])

  return (
    <div className="section flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-diocesan text-3xl font-bold text-primary-800 sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-gray-600">
        This page could not be displayed just now. Trying again often helps — if it does not,
        please let the diocesan office know.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => retry()} className="btn-primary justify-center">
          <RotateCw size={17} aria-hidden="true" />
          Try again
        </button>
        <Link href="/" className="btn-secondary justify-center">
          <Home size={17} aria-hidden="true" />
          Back to the homepage
        </Link>
      </div>

      {/* Lets someone reporting the problem quote the reference from the logs. */}
      {error.digest && (
        <p className="mt-8 text-xs text-gray-400">Reference: {error.digest}</p>
      )}
    </div>
  )
}
