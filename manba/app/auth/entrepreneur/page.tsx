"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function EntrepreneurSignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    location: '',
    signInEmail: '',
    signInPassword: ''
  })
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            location: formData.location,
            role: 'entrepreneur'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // Show success message
      setError('Please check your email to verify your account.')
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        location: '',
        signInEmail: '',
        signInPassword: ''
      })
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

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
              onClick={() => router.push('/auth')}
              className="flex-1 text-center py-3 text-gray-500 hover:text-gray-700 font-medium"
            >
              Support Projects
            </button>
            <button
              type="button"
              className="flex-1 text-center py-3 border-b-2 border-blue-600 text-blue-600 font-medium"
            >
              Create Projects
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Create Your Account</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Join our community of Syrian entrepreneurs
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
                <p className="text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location in Syria</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                />
              </div>

              {error && (
                <div className={`p-3 rounded-md ${
                  error.includes('check your email')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <h3 className="text-lg font-medium">Already have an account?</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Sign in to access your entrepreneur dashboard
                </p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                setIsLoading(true)
                setError(null)

                try {
                  const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: formData.signInEmail,
                    password: formData.signInPassword,
                  })

                  if (signInError) {
                    throw signInError
                  }

                  router.push('/dashboard')
                } catch (error) {
                  setError(error instanceof Error ? error.message : 'Failed to sign in')
                } finally {
                  setIsLoading(false)
                }
              }} className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signInEmail">Email</Label>
                  <Input
                    id="signInEmail"
                    name="signInEmail"
                    type="email"
                    value={formData.signInEmail || ''}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signInPassword">Password</Label>
                  <Input
                    id="signInPassword"
                    name="signInPassword"
                    type="password"
                    value={formData.signInPassword || ''}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
