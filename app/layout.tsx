import './globals.css'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { ReactNode } from 'react'
import { Analytics } from "@vercel/analytics/next"
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'


export const metadata = {
  title: 'Campus Drives Hub',
  description: 'Community-sourced on-campus drives & interview experiences'
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <Providers>
            <Navbar />
            <main className="max-w-7xl mx-auto p-4 min-h-svh">
              {children}
              <Analytics />
            </main>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
