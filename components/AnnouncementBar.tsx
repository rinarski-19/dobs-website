import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div
      className="w-full py-2 px-4 text-center text-sm font-medium text-white"
      style={{ background: 'linear-gradient(90deg, #155896 0%, #1a6db8 50%, #2e86d4 100%)' }}
    >
      Enrollment is now open for School Year 2026–2027.{' '}
      <Link href="/enrollment" className="underline underline-offset-2 hover:text-blue-200 transition-colors">
        Apply Now →
      </Link>
    </div>
  )
}
