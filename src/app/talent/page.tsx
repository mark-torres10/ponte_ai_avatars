'use client'

import { useEffect, useState } from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@/types/user'

export default function TalentDashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/users/${user.id}`)
        const data = await response.json()

        if (data.success) {
          setUserData(data.data)
          
          // Check if user has the correct role for this page
          if (data.data?.role && data.data.role !== 'talent') {
            // User doesn't have talent role, redirect to appropriate dashboard
            switch (data.data.role) {
              case 'admin':
                router.push('/admin')
                break
              case 'client':
                router.push('/client')
                break
              default:
                router.push('/role-selection')
                break
            }
            return
          }
        } else {
          // User doesn't exist or has no role, redirect to role selection
          router.push('/role-selection')
          return
        }
      } catch {
        // Error fetching user data, redirect to role selection
        router.push('/role-selection')
        return
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchUserData()
    }
  }, [user, isLoaded, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">⚠️</div>
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                Ponte AI
              </Link>
              <span className="text-sm text-foreground/60">Talent Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground/60">
                Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <SignOutButton>
                <button className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Your Talent Dashboard
            </h1>
            <p className="text-lg text-foreground/70">
              Manage your AI avatar profile, track bookings, and grow your brand partnerships.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Total Bookings</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Active Campaigns</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="text-2xl">🎬</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Total Earnings</p>
                  <p className="text-2xl font-bold">$0</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Profile Views</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="text-2xl">👁️</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Profile Management</h3>
              <p className="text-foreground/70 mb-6">
                Update your AI avatar profile, set pricing, and manage your availability.
              </p>
              <div className="space-y-3">
                <Link
                  href="/onboard-talent"
                  className="block w-full btn-primary-ponte text-center py-3 rounded-md font-medium"
                >
                  Complete Profile Setup
                </Link>
                <button className="block w-full btn-secondary-ponte py-3 rounded-md font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Booking Management</h3>
              <p className="text-foreground/70 mb-6">
                View and manage incoming booking requests from brands and agencies.
              </p>
              <div className="space-y-3">
                <button className="block w-full btn-primary-ponte py-3 rounded-md font-medium">
                  View Bookings
                </button>
                <button className="block w-full btn-secondary-ponte py-3 rounded-md font-medium">
                  Set Availability
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-ponte p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎭</div>
              <p className="text-foreground/60 mb-4">No recent activity</p>
              <p className="text-sm text-foreground/40">
                Complete your profile setup to start receiving booking requests
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-12 p-6 bg-secondary/20 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Account Information</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-foreground/60">Email:</span>
                <span className="ml-2">{user.emailAddresses[0]?.emailAddress}</span>
              </div>
              <div>
                <span className="text-foreground/60">Role:</span>
                <span className="ml-2 capitalize">{userData?.role || 'Not assigned'}</span>
              </div>
              <div>
                <span className="text-foreground/60">Member Since:</span>
                <span className="ml-2">
                  {userData?.created_at 
                    ? new Date(userData.created_at).toLocaleDateString()
                    : 'Unknown'
                  }
                </span>
              </div>
              <div>
                <span className="text-foreground/60">Status:</span>
                <span className="ml-2 text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 