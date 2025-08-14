import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClerkRootWrapper from "@/components/ClerkRootWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ponte AI - AI Avatar Marketplace",
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
        <ClerkRootWrapper>
          {children}
        </ClerkRootWrapper>
      </body>
    </html>
  )
}
