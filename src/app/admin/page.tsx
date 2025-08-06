'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@/types/user'

export default function AdminDashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [userData, setUserData] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Fetch user data
        const userResponse = await fetch(`/api/users/${user.id}`)
        const userData = await userResponse.json()

        if (userData.success) {
          setUserData(userData.data)
        } else {
          setError(userData.error || 'Failed to fetch user data')
          return
        }

        // Fetch all users (admin only)
        const usersResponse = await fetch('/api/users')
        const usersData = await usersResponse.json()

        if (usersData.success) {
          setUsers(usersData.data || [])
        } else {
          console.error('Failed to fetch users:', usersData.error)
        }
      } catch {
        setError('Failed to fetch data')
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchData()
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

  // Count users by role
  const userStats = {
    total: users.length,
    talent: users.filter(u => u.role === 'talent').length,
    client: users.filter(u => u.role === 'client').length,
    admin: users.filter(u => u.role === 'admin').length,
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
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Admin Dashboard
            </h1>
            <p className="text-lg text-foreground/70">
              Manage users, monitor platform activity, and oversee marketplace operations.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Total Users</p>
                  <p className="text-2xl font-bold">{userStats.total}</p>
                </div>
                <div className="text-2xl">👥</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Talent Users</p>
                  <p className="text-2xl font-bold">{userStats.talent}</p>
                </div>
                <div className="text-2xl">🎭</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Client Users</p>
                  <p className="text-2xl font-bold">{userStats.client}</p>
                </div>
                <div className="text-2xl">🏢</div>
              </div>
            </div>
            <div className="card-ponte p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Admin Users</p>
                  <p className="text-2xl font-bold">{userStats.admin}</p>
                </div>
                <div className="text-2xl">⚙️</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">User Management</h3>
              <p className="text-foreground/70 mb-6">
                View, edit, and manage user accounts and roles.
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
                Monitor platform usage, bookings, and revenue metrics.
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

            <div className="card-ponte p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Support & Moderation</h3>
              <p className="text-foreground/70 mb-6">
                Handle support requests and moderate platform content.
              </p>
              <div className="space-y-3">
                <button className="block w-full btn-primary-ponte py-3 rounded-md font-medium">
                  Support Tickets
                </button>
                <button className="block w-full btn-secondary-ponte py-3 rounded-md font-medium">
                  Content Moderation
                </button>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="card-ponte p-8 rounded-lg mb-12">
            <h3 className="text-2xl font-bold mb-6">Recent Users</h3>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Joined</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map((user) => (
                      <tr key={user.id} className="border-b border-border/50">
                        <td className="py-3 px-4">{user.email || 'No email'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'talent' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground/60">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-primary hover:underline text-sm">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-foreground/60 mb-4">No users found</p>
                <p className="text-sm text-foreground/40">
                  Users will appear here as they sign up
                </p>
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="card-ponte p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">System Status</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Platform Services</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Authentication Service</span>
                    <span className="text-green-500">● Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Service</span>
                    <span className="text-green-500">● Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Gateway</span>
                    <span className="text-green-500">● Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>File Storage</span>
                    <span className="text-green-500">● Online</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-foreground/60 mb-4">No recent activity</p>
                  <p className="text-sm text-foreground/40">
                    Platform activity will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="mt-12 p-6 bg-secondary/20 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Admin Account Information</h4>
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