import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div
      className="w-full py-2 px-4 text-center text-sm font-medium text-white"
      style={{ background: 'linear-gradient(90deg, #16324F 0%, #294f72 100%)' }}
    >
      Enrollment is now open for School Year 2026–2027.{' '}
      <Link
        href="/enrollment"
        className="font-semibold text-gold-300 underline underline-offset-2 hover:text-gold-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
      >
        Apply Now →
      </Link>
    </div>
  )
}
