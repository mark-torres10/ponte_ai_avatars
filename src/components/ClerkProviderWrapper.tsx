'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

interface ClerkProviderWrapperProps {
  children: ReactNode
}

// Dynamic import of ClerkProvider only when needed
const ClerkProvider = dynamic(() => import("@clerk/nextjs").then(mod => ({ default: mod.ClerkProvider })), {
  ssr: false,
  loading: () => <div>Loading authentication...</div>
})

export default function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {children}
    </ClerkProvider>
  )
} 