import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const response = NextResponse.redirect(new URL('/', requestUrl.origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.headers
            .get('cookie')
            ?.split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            httpOnly: true
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
            sameSite: 'lax',
            httpOnly: true
          })
        },
      },
    }
  )

  // Sign out on server
  await supabase.auth.signOut()

  // Clear all auth-related cookies
  const authCookies = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
    '__stripe_mid',
    '__stripe_sid'
  ]

  authCookies.forEach(name => {
    response.cookies.set({
      name,
      value: '',
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
      httpOnly: true
    })
  })

  return response
}
