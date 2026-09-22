'use client'

import { useEffect } from 'react'

/**
 * Catches what app/error.tsx cannot: a failure in the root layout itself, which
 * sits above that boundary. It replaces the whole document, so it has to supply
 * its own <html> and <body>.
 *
 * Global styles are deliberately not loaded here — if the layout is the thing
 * that broke, the stylesheet it pulls in may be exactly what is at fault. Hence
 * inline styles and no shared components: this file must be able to render when
 * everything around it has failed. The diocesan colours are repeated by hand
 * for that reason, not by oversight.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error('Unhandled error above the root layout:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#faf8f3', color: '#1f2937' }}>
        <title>Something went wrong · Diocese of Baguio Schools</title>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700, color: '#1e3a5f' }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: '1rem', maxWidth: '28rem', lineHeight: 1.6, color: '#4b5563' }}>
            The site could not be displayed just now. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#ffffff',
              background: '#1e3a5f',
              border: 0,
              borderRadius: '9999px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#9ca3af' }}>
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  )
}
