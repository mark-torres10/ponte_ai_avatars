'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { User, UserRole } from '@/types/user'

interface UseUserRoleReturn {
  userData: User | null
  isLoading: boolean
  error: string | null
  role: UserRole | null
  isAdmin: boolean
  isTalent: boolean
  isClient: boolean
  hasRole: boolean
  refetch: () => Promise<void>
}

export function useUserRole(): UseUserRoleReturn {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    const fetchUserData = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

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
  }, [user])

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData()
    } else if (isLoaded) {
      setIsLoading(false)
    }
  }, [user, isLoaded, fetchUserData])

  const role = userData?.role || null
  const isAdmin = role === 'admin'
  const isTalent = role === 'talent'
  const isClient = role === 'client'
  const hasRole = !!role

  return {
    userData,
    isLoading,
    error,
    role,
    isAdmin,
    isTalent,
    isClient,
    hasRole,
    refetch: fetchUserData,
  }
}

// Hook for checking if user has access to a specific route
export function useRouteAccess(requiredRoles: UserRole[]): {
  hasAccess: boolean
  isLoading: boolean
  error: string | null
} {
  const { role, isLoading, error } = useUserRole()

  const hasAccess = role ? requiredRoles.includes(role) : false

  return {
    hasAccess,
    isLoading,
    error,
  }
}

// Hook for role-based redirect logic
export function useRoleRedirect() {
  const { role, isLoading } = useUserRole()

  const getDashboardUrl = (): string => {
    if (!role) return '/role-selection'
    
    switch (role) {
      case 'talent':
        return '/talent'
      case 'client':
        return '/client'
      case 'admin':
        return '/admin'
      default:
        return '/role-selection'
    }
  }

  const shouldRedirectToRoleSelection = (): boolean => {
    return !isLoading && !role
  }

  const shouldRedirectToDashboard = (): boolean => {
    return !isLoading && !!role
  }

  return {
    getDashboardUrl,
    shouldRedirectToRoleSelection,
    shouldRedirectToDashboard,
    role,
    isLoading,
  }
}

// Hook for role assignment
export function useRoleAssignment() {
  const { user } = useUser()
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignmentError, setAssignmentError] = useState<string | null>(null)

  const assignRole = async (role: UserRole, email?: string) => {
    if (!user) {
      setAssignmentError('User not authenticated')
      return false
    }

    try {
      setIsAssigning(true)
      setAssignmentError(null)

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || user.emailAddresses[0]?.emailAddress,
          role,
        }),
      })

      const data = await response.json()

      if (data.success) {
        return true
      } else {
        setAssignmentError(data.error || 'Failed to assign role')
        return false
      }
    } catch {
      setAssignmentError('Failed to assign role. Please try again.')
      return false
    } finally {
      setIsAssigning(false)
    }
  }

  return {
    assignRole,
    isAssigning,
    assignmentError,
  }
}

// Hook for role validation
export function useRoleValidation() {
  const validateRole = (role: string): role is UserRole => {
    return ['admin', 'client', 'talent'].includes(role)
  }

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Administrator'
      case 'client':
        return 'Client'
      case 'talent':
        return 'Talent'
      default:
        return 'Unknown'
    }
  }

  const getRoleDescription = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Full access to all features and user management'
      case 'client':
        return 'Can book talent and manage campaigns'
      case 'talent':
        return 'Can create profiles and receive bookings'
      default:
        return 'Unknown role'
    }
  }

  const getRolePermissions = (role: UserRole): string[] => {
    switch (role) {
      case 'admin':
        return [
          'Manage all users',
          'Access all dashboards',
          'View platform analytics',
          'Handle support requests',
          'Configure platform settings',
        ]
      case 'client':
        return [
          'Browse AI avatars',
          'Book talent',
          'Manage campaigns',
          'View booking history',
          'Access client dashboard',
        ]
      case 'talent':
        return [
          'Create AI avatar profile',
          'Set pricing and availability',
          'Receive booking requests',
          'Manage profile settings',
          'Access talent dashboard',
        ]
      default:
        return []
    }
  }

  return {
    validateRole,
    getRoleDisplayName,
    getRoleDescription,
    getRolePermissions,
  }
} 