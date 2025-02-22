import Link from 'next/link'

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
