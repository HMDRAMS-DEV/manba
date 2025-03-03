import { type NextConfig } from "next"

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') ?? '',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default config
