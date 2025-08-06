"use client"

import Link from "next/link"

interface NavigationProps {
  hasClerkConfig?: boolean
}

// Basic navigation component that works without Clerk
const Navigation = ({ hasClerkConfig = false }: NavigationProps) => {
  
  // If Clerk is not available, render basic navigation
  if (!hasClerkConfig) {
    return (
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-ponte rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gradient">Ponte AI</span>
            </Link>
            
            {/* Basic navigation without auth */}
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="btn-primary-ponte text-sm px-4 py-2 rounded-md font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }
  
  // If Clerk is available, render auth navigation
  // This will only be executed when Clerk is properly configured
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-ponte rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gradient">Ponte AI</span>
          </Link>
          
          {/* Basic navigation without auth - will be enhanced by Clerk when available */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="btn-primary-ponte text-sm px-4 py-2 rounded-md font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 