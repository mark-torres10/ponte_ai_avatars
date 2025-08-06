'use client'

import { ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'

interface ClerkAuthWrapperProps {
  children: ReactNode
}

export default function ClerkAuthWrapper({ children }: ClerkAuthWrapperProps) {
  const { isLoaded } = useAuth()

  // If Clerk is not loaded, show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Authentication Loading
          </h1>
          <p className="text-muted-foreground">
            Please wait while we set up authentication...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 