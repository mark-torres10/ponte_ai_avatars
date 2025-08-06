'use client'

import { useEffect, useState } from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@/types/user'

export default function AdminDashboardPage() {
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
              <span className="text-sm text-foreground/60">Admin Dashboard</span>
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
              Welcome to Admin Dashboard
            </h1>
            <p className="text-lg text-foreground/70">
              Manage the platform, monitor user activity, and handle support requests.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Total Users</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="text-2xl">👥</div>
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
                  <p className="text-sm text-foreground/60">Support Tickets</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="text-2xl">🎫</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Platform Revenue</p>
                  <p className="text-2xl font-bold">$0</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">User Management</h3>
              <p className="text-foreground/70 mb-6">
                Manage user accounts, roles, and permissions across the platform.
              </p>
              <div className="space-y-3">
                <button className="block w-full btn-primary-ponte py-3 rounded-md font-medium">
                  View All Users
                </button>
                <button className="block w-full btn-secondary-ponte py-3 rounded-md font-medium">
                  Manage Roles
                </button>
              </div>
            </div>

            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Platform Analytics</h3>
              <p className="text-foreground/70 mb-6">
                Monitor platform performance, user engagement, and business metrics.
              </p>
              <div className="space-y-3">
                <button className="block w-full btn-primary-ponte py-3 rounded-md font-medium">
                  View Analytics
                </button>
                <button className="block w-full btn-secondary-ponte py-3 rounded-md font-medium">
                  Generate Reports
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-ponte p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⚙️</div>
              <p className="text-foreground/60 mb-4">No recent activity</p>
              <p className="text-sm text-foreground/40">
                Platform activity will appear here as users join and interact
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