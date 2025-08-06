'use client'

import { ReactNode } from 'react'
import { LocalTestingProvider } from "@/lib/local-testing-context"
import dynamic from "next/dynamic"

interface ClerkRootWrapperProps {
  children: ReactNode
}

// Dynamic import of ClerkProvider
const ClerkProvider = dynamic(() => import("@clerk/nextjs").then(mod => ({ default: mod.ClerkProvider })), {
  ssr: false,
  loading: () => <div>Loading authentication...</div>
})

export default function ClerkRootWrapper({ children }: ClerkRootWrapperProps) {
  // Check if Clerk is configured and validate the key
  const hasClerkConfig = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (hasClerkConfig && publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        <LocalTestingProvider>
          {children}
        </LocalTestingProvider>
      </ClerkProvider>
    )
  }

  return (
    <LocalTestingProvider>
      {children}
    </LocalTestingProvider>
  )
} 