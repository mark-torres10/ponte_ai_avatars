'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@/types/user'

export default function ClientDashboardPage() {
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
        } else {
          setError(data.error || 'Failed to fetch user data')
        }
      } catch {
        setError('Failed to fetch user data')
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchUserData()
    }
  }, [user, isLoaded])

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
              <span className="text-sm text-foreground/60">Client Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground/60">
                Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                Sign Out
              </Link>
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
              Welcome to Your Client Dashboard
            </h1>
            <p className="text-lg text-foreground/70">
              Browse AI avatars, manage your campaigns, and create compelling marketing content.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
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
                  <p className="text-sm text-foreground/60">Total Bookings</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Total Spent</p>
                  <p className="text-2xl font-bold">$0</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Favorites</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="text-2xl">❤️</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Browse Avatars</h3>
              <p className="text-foreground/70 mb-6">
                Discover and book AI avatars from celebrities, athletes, and creators.
              </p>
              <div className="space-y-3">
                <Link
                  href="/request-talent"
                  className="block w-full btn-primary-ponte text-center py-3 rounded-md font-medium"
                >
                  Browse Marketplace
                </Link>
                <button className="block w-full btn-secondary-ponte py-3 rounded-md font-medium">
                  View Favorites
                </button>
              </div>
            </div>

            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Campaign Management</h3>
              <p className="text-foreground/70 mb-6">
                Create and manage your marketing campaigns with AI avatars.
              </p>
              <div className="space-y-3">
                <button className="block w-full btn-primary-ponte py-3 rounded-md font-medium">
                  Create Campaign
                </button>
                <button className="block w-full btn-secondary-ponte py-3 rounded-md font-medium">
                  View Campaigns
                </button>
              </div>
            </div>
          </div>

          {/* Featured Avatars */}
          <div className="card-ponte p-8 rounded-lg mb-12">
            <h3 className="text-2xl font-bold mb-6">Featured AI Avatars</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Alex Thompson', role: 'Tech Influencer', price: '$2,500 - $15,000' },
                { name: 'Sarah Martinez', role: 'Celebrity Chef', price: '$3,000 - $20,000' },
                { name: 'Marcus Johnson', role: 'Professional Athlete', price: '$5,000 - $35,000' }
              ].map((avatar, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-white font-semibold">{avatar.name}</span>
                  </div>
                  <h4 className="font-semibold mb-1">{avatar.name}</h4>
                  <p className="text-sm text-foreground/60 mb-2">{avatar.role}</p>
                  <p className="text-sm font-medium text-primary">{avatar.price}</p>
                  <Link
                    href={`/request-talent?avatar=${index + 1}`}
                    className="block w-full mt-3 btn-primary-ponte text-center py-2 rounded-md text-sm font-medium"
                  >
                    Book Avatar
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-ponte p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🏢</div>
              <p className="text-foreground/60 mb-4">No recent activity</p>
              <p className="text-sm text-foreground/40">
                Start browsing avatars to see your activity here
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