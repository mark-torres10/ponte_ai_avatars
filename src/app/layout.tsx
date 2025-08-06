import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LocalTestingProvider } from "@/lib/local-testing-context"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ponte AI - Production App",
  description: "Professional AI avatar booking platform for Ponte AI clients and investors",
  keywords: ["AI avatars", "celebrity licensing", "marketing campaigns", "Ponte AI"],
  authors: [{ name: "Ponte AI" }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
        >
          <LocalTestingProvider>
            {children}
          </LocalTestingProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
