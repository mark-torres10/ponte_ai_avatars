'use client'

import { useAuth } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ClerkWrapperProps {
  children: ReactNode
}

export function ClerkWrapper({ children }: ClerkWrapperProps) {
  const { isLoaded } = useAuth()

  // If Clerk is not loaded or not configured, show a fallback
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