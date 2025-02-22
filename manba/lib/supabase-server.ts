import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

export function createServerSupabaseClient() {
  const cookieStore = cookies() as unknown as RequestCookies

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({
            name,
            value,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            ...options,
          })
        },
        remove(name: string, options: any) {
          cookieStore.delete(name)
        }
      }
    }
  )
}
