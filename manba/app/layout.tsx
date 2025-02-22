import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import { Header } from "@/components/layout/header"
import "./globals.css"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Manba | منبع - Empowering Syrian Entrepreneurs",
  description: "A micro-crowdfunding platform connecting Syrian entrepreneurs with global supporters",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        {/* Add Noto Sans Arabic from Google Fonts CDN */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className={`${notoSans.className} antialiased min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50`}
        style={{ 
          '--font-arabic': '"Noto Sans Arabic", sans-serif',
        } as React.CSSProperties}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
