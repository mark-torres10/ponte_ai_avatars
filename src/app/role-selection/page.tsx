'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { UserRole } from '@/types/user'
import Link from 'next/link'

export default function RoleSelectionPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingRole, setIsCheckingRole] = useState(true)

  // Check if user already has a role assigned
  useEffect(() => {
    console.log('🔍 useEffect triggered - isLoaded:', isLoaded, 'user:', !!user)
    
    const checkExistingRole = async () => {
      if (!isLoaded || !user) {
        console.log('🔍 Early return - isLoaded:', isLoaded, 'user:', !!user)
        return
      }

      console.log('🔍 Checking existing role for user:', user.id)
      console.log('🔍 User email:', user.emailAddresses[0]?.emailAddress)

      try {
        console.log('🔍 Making API call to:', `/api/users/${user.id}`)
        const response = await fetch(`/api/users/${user.id}`, {
          // Remove Authorization header - Clerk will handle authentication automatically
          headers: {
            'Content-Type': 'application/json',
          },
          // Add cache: 'no-store' to ensure fresh data
          cache: 'no-store'
        })

        console.log('🔍 API Response status:', response.status)
        console.log('🔍 API Response ok:', response.ok)
        console.log('🔍 API Response headers:', Object.fromEntries(response.headers.entries()))

        if (response.ok) {
          const userData = await response.json()
          console.log('🔍 User data received:', userData)
          const userRole = userData.data?.role

          if (userRole) {
            console.log('🔍 User has role:', userRole, '- redirecting to dashboard')
            // User already has a role, redirect to appropriate dashboard
            switch (userRole) {
              case 'talent':
                router.replace('/talent') // Use replace instead of push to avoid back button issues
                break
              case 'client':
                router.replace('/client')
                break
              case 'admin':
                router.replace('/admin')
                break
            }
            return
          } else {
            console.log('🔍 User exists but has no role assigned')
          }
        } else {
          const errorData = await response.json()
          console.log('🔍 API Error:', errorData)
        }
      } catch (error) {
        console.error('🔍 Error checking user role:', error)
      } finally {
        console.log('🔍 Setting isCheckingRole to false')
        setIsCheckingRole(false)
      }
    }

    // Add a small delay to prevent rapid re-renders
    const timeoutId = setTimeout(checkExistingRole, 100)
    
    return () => clearTimeout(timeoutId)
  }, [isLoaded, user, router])

  if (!isLoaded || isCheckingRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Checking your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const handleRoleSelection = async (role: UserRole) => {
    setSelectedRole(role)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.emailAddresses[0]?.emailAddress,
          role: role,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to appropriate dashboard
        switch (role) {
          case 'talent':
            router.push('/talent')
            break
          case 'client':
            router.push('/client')
            break
          case 'admin':
            router.push('/admin')
            break
        }
      } else {
        setError(data.error || 'Failed to assign role')
      }
    } catch {
      setError('Failed to assign role. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const roles = [
    {
      id: 'talent' as UserRole,
      title: 'Talent & Creators',
      description: 'I want to license my voice, likeness, and personality to brands worldwide.',
      features: [
        'Create and manage your AI avatar profile',
        'Set your own pricing and availability',
        'Receive booking requests from brands',
        'Earn passive income from your likeness',
        'Maintain full control over usage rights'
      ],
      icon: '🎭',
      color: 'from-ponte-pink-500 to-ponte-pink-600'
    },
    {
      id: 'client' as UserRole,
      title: 'Brands & Agencies',
      description: 'I want to book AI avatars for marketing campaigns and content creation.',
      features: [
        'Browse and book premium AI avatars',
        'Access celebrity and creator endorsements',
        'Create compelling marketing campaigns',
        'Scale your content creation',
        'Ethical AI avatar licensing'
      ],
      icon: '🏢',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrator',
      description: 'I need administrative access to manage the platform and users.',
      features: [
        'Manage all users and their roles',
        'Monitor platform activity and analytics',
        'Handle support requests and disputes',
        'Configure platform settings',
        'Full system access and control'
      ],
      icon: '⚙️',
      color: 'from-gray-500 to-gray-600'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Ponte AI
            </Link>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Choose Your Role
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Select how you&apos;ll use Ponte AI. This will determine your dashboard and available features.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`relative p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  selectedRole === role.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => !isLoading && handleRoleSelection(role.id)}
              >
                {isLoading && selectedRole === role.id && (
                  <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center text-2xl mb-4`}>
                  {role.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2">{role.title}</h3>

                {/* Description */}
                <p className="text-foreground/70 text-sm mb-4">{role.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-foreground/80">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  className={`w-full mt-6 py-2 px-4 rounded-md font-medium transition-colors ${
                    selectedRole === role.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading && selectedRole === role.id ? 'Setting up...' : 'Select Role'}
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-foreground/60">
            <p>
              You can change your role later by contacting support.
          </p>
          </div>
        </div>
      </div>
    </div>
  )
} 