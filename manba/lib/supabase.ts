import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof window === 'undefined') return undefined
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
          if (!cookie) return undefined
          // Properly decode the cookie value
          const value = cookie.split('=')[1]
          return decodeURIComponent(value)
        },
        set(name: string, value: string, options: any) {
          if (typeof window === 'undefined') return
          const cookieOptions = {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            ...options
          }
          // Properly encode the cookie value
          const encodedValue = encodeURIComponent(value)
          const cookieString = Object.entries(cookieOptions)
            .reduce((acc, [key, val]) => {
              if (typeof val === 'boolean') {
                return val ? `${acc}; ${key}` : acc
              }
              return `${acc}; ${key}=${val}`
            }, `${name}=${encodedValue}`)
          document.cookie = cookieString
        },
        remove(name: string, options: any) {
          if (typeof window === 'undefined') return
          const cookieOptions = {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            ...options
          }
          const cookieString = Object.entries(cookieOptions)
            .reduce((acc, [key, val]) => {
              if (typeof val === 'boolean') {
                return val ? `${acc}; ${key}` : acc
              }
              return `${acc}; ${key}=${val}`
            }, `${name}=`)
          document.cookie = cookieString
        },
      },
    }
  )
}
