'use client'

import { ReactNode } from 'react'
import { LocalTestingProvider } from "@/lib/local-testing-context"
import dynamic from "next/dynamic"

interface ClerkRootWrapperProps {
  children: ReactNode
}

// Check if Clerk environment variables are available
const hasClerkConfig = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Dynamic import of ClerkProvider only when needed
const ClerkProvider = hasClerkConfig 
  ? dynamic(() => import("@clerk/nextjs").then(mod => ({ default: mod.ClerkProvider })), {
      ssr: false,
      loading: () => <div>Loading authentication...</div>
    })
  : null

export default function ClerkRootWrapper({ children }: ClerkRootWrapperProps) {
  return (
    <>
      {hasClerkConfig && ClerkProvider ? (
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
          <LocalTestingProvider>
            {children}
          </LocalTestingProvider>
        </ClerkProvider>
      ) : (
        <LocalTestingProvider>
          {children}
        </LocalTestingProvider>
      )}
    </>
  )
} 