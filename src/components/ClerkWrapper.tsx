'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

interface ClerkWrapperProps {
  children: ReactNode
}

// Check if Clerk is configured
const hasClerkConfig = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Dynamic import of Clerk components only when needed
const ClerkAuthWrapper = hasClerkConfig 
  ? dynamic(() => import('./ClerkAuthWrapper'), {
      ssr: false,
      loading: () => <ClerkLoadingFallback />
    })
  : null

// Loading fallback component
function ClerkLoadingFallback() {
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

// Not configured fallback component
function ClerkNotConfiguredFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Authentication Not Configured
        </h1>
        <p className="text-muted-foreground mb-6">
          Clerk authentication is not configured for this environment. 
          Please set up your Clerk publishable key to enable authentication features.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-secondary/20 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Setup Required:</h3>
            <ul className="text-sm text-foreground/70 space-y-1">
              <li>• Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to environment</li>
              <li>• Configure Clerk application settings</li>
              <li>• Set up authentication routes</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            For development, you can continue using the app without authentication.
          </p>
        </div>
      </div>
    </div>
  )
}

export function ClerkWrapper({ children }: ClerkWrapperProps) {
  // If Clerk is not configured, show fallback
  if (!hasClerkConfig) {
    return <ClerkNotConfiguredFallback />
  }

  // If Clerk is configured but component failed to load, show fallback
  if (!ClerkAuthWrapper) {
    return <ClerkNotConfiguredFallback />
  }

  // Use the dynamic Clerk wrapper
  return <ClerkAuthWrapper>{children}</ClerkAuthWrapper>
} 