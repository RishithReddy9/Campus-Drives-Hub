import './globals.css'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { ReactNode } from 'react'
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'Campus Drives Hub',
  description: 'Community-sourced on-campus drives & interview experiences'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="max-w-4xl mx-auto p-6">
            {children}
            <Analytics />
          </main>
        </Providers>
      </body>
    </html>
  )
}
