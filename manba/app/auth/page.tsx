"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="flex justify-center items-center gap-2 text-3xl font-bold">
            <span>Manba</span>
            <span lang="ar">منبع</span>
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              className="flex-1 text-center py-3 border-b-2 border-blue-600 text-blue-600 font-medium"
            >
              Support Projects
            </button>
            <button
              type="button"
              onClick={() => router.push('/auth/entrepreneur')}
              className="flex-1 text-center py-3 text-gray-500 hover:text-gray-700 font-medium"
            >
              Create Projects
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Support Syrian Entrepreneurs</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                No account needed. Just enter your information to support a project.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <hr className="flex-1 border-gray-200" />
              <span className="text-sm text-gray-500">or</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <div className="text-center">
              <Link
                href="/auth/entrepreneur"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create an account to launch your project →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
