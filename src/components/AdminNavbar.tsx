'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'

interface AdminNavbarProps {
  userEmail?: string
}

export default function AdminNavbar({ userEmail }: AdminNavbarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'avatar'>(
    pathname.includes('/generate-avatar') ? 'avatar' : 'dashboard'
  )

  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Ponte AI
            </Link>
            <span className="text-sm text-foreground/60">Admin Dashboard</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Client Dashboard
            </button>
            <button
              onClick={() => setActiveTab('avatar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'avatar'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Generate Avatar
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-foreground/60">
              Welcome, {userEmail}
            </span>
            <SignOutButton>
              <button className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8">
            <Link
              href="/admin"
              className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/20'
              }`}
            >
              Client Dashboard
            </Link>
            <Link
              href="/generate-avatar"
              className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                activeTab === 'avatar'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/20'
              }`}
            >
              Generate Avatar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 