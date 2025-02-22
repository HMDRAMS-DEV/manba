import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-4">
            Thank You for Your Support!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your pledge will help Syrian entrepreneurs build a stronger future. This is a prototype, so no actual payment was processed.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore More Projects
            </Link>

            <Link
              href="/auth/entrepreneur"
              className="block text-blue-600 hover:text-blue-700"
            >
              Have a project idea? Create your account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
