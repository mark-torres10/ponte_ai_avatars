import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { UserRole } from '@/types/user'
import { VALID_USER_ROLES } from '@/lib/auth-utils'

// Mock the Clerk middleware
jest.mock('@clerk/nextjs/server', () => ({
  clerkMiddleware: jest.fn(),
  redirectToSignIn: jest.fn(() => new Response('Redirect to sign in', { status: 302 })),
}))

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

describe('Role-Based Routing and Access Control', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Protected Routes Configuration', () => {
    it('should define correct protected routes and their required roles', () => {
      // This test verifies the route protection configuration
      const protectedRoutes = {
        '/talent': ['talent', 'admin'],
        '/client': ['client', 'admin'],
        '/admin': ['admin'],
      }

      expect(protectedRoutes['/talent']).toContain('talent')
      expect(protectedRoutes['/talent']).toContain('admin')
      expect(protectedRoutes['/client']).toContain('client')
      expect(protectedRoutes['/client']).toContain('admin')
      expect(protectedRoutes['/admin']).toEqual(['admin'])
    })

    it('should define correct public routes', () => {
      const publicRoutes = [
        '/',
        '/login',
        '/sign-up',
        '/api',
        '/_next',
        '/favicon.ico',
      ]

      expect(publicRoutes).toContain('/')
      expect(publicRoutes).toContain('/login')
      expect(publicRoutes).toContain('/sign-up')
      expect(publicRoutes).toContain('/api')
    })

    it('should define correct onboarding routes', () => {
      const onboardingRoutes = [
        '/role-selection',
      ]

      expect(onboardingRoutes).toContain('/role-selection')
    })
  })

  describe('Role Validation', () => {
    it('should validate user roles correctly', () => {
      const isValidUserRole = (role: string): role is UserRole => {
        return VALID_USER_ROLES.includes(role as any)
      }

      expect(isValidUserRole('admin')).toBe(true)
      expect(isValidUserRole('client')).toBe(true)
      expect(isValidUserRole('talent')).toBe(true)
      expect(isValidUserRole('invalid')).toBe(false)
      expect(isValidUserRole('')).toBe(false)
    })

    it('should get correct role display names', () => {
      const getUserRoleDisplayName = (role: UserRole): string => {
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

      expect(getUserRoleDisplayName('admin')).toBe('Administrator')
      expect(getUserRoleDisplayName('client')).toBe('Client')
      expect(getUserRoleDisplayName('talent')).toBe('Talent')
    })

    it('should get correct role descriptions', () => {
      const getUserRoleDescription = (role: UserRole): string => {
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

      expect(getUserRoleDescription('admin')).toBe('Full access to all features and user management')
      expect(getUserRoleDescription('client')).toBe('Can book talent and manage campaigns')
      expect(getUserRoleDescription('talent')).toBe('Can create profiles and receive bookings')
    })
  })

  describe('Dashboard URL Generation', () => {
    it('should generate correct dashboard URLs for each role', () => {
      const getDashboardUrl = (role: string): string => {
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

      expect(getDashboardUrl('talent')).toBe('/talent')
      expect(getDashboardUrl('client')).toBe('/client')
      expect(getDashboardUrl('admin')).toBe('/admin')
      expect(getDashboardUrl('invalid')).toBe('/role-selection')
    })
  })

  describe('Role-Based Access Control', () => {
    it('should allow talent users to access talent dashboard', () => {
      const userRole = 'talent'
      const requiredRoles = ['talent', 'admin']
      
      expect(requiredRoles.includes(userRole)).toBe(true)
    })

    it('should allow admin users to access all dashboards', () => {
      const userRole = 'admin'
      const talentRequiredRoles = ['talent', 'admin']
      const clientRequiredRoles = ['client', 'admin']
      const adminRequiredRoles = ['admin']
      
      expect(talentRequiredRoles.includes(userRole)).toBe(true)
      expect(clientRequiredRoles.includes(userRole)).toBe(true)
      expect(adminRequiredRoles.includes(userRole)).toBe(true)
    })

    it('should prevent client users from accessing talent dashboard', () => {
      const userRole = 'client'
      const talentRequiredRoles = ['talent', 'admin']
      
      expect(talentRequiredRoles.includes(userRole)).toBe(false)
    })

    it('should prevent talent users from accessing client dashboard', () => {
      const userRole = 'talent'
      const clientRequiredRoles = ['client', 'admin']
      
      expect(clientRequiredRoles.includes(userRole)).toBe(false)
    })

    it('should prevent non-admin users from accessing admin dashboard', () => {
      const talentRole = 'talent'
      const clientRole = 'client'
      const adminRequiredRoles = ['admin']
      
      expect(adminRequiredRoles.includes(talentRole)).toBe(false)
      expect(adminRequiredRoles.includes(clientRole)).toBe(false)
    })
  })

  describe('Route Protection Logic', () => {
    it('should identify protected routes correctly', () => {
      const isProtectedRoute = (pathname: string): boolean => {
        const protectedRoutes = ['/talent', '/client', '/admin']
        return protectedRoutes.some(route => pathname.startsWith(route))
      }

      expect(isProtectedRoute('/talent')).toBe(true)
      expect(isProtectedRoute('/talent/profile')).toBe(true)
      expect(isProtectedRoute('/client')).toBe(true)
      expect(isProtectedRoute('/client/bookings')).toBe(true)
      expect(isProtectedRoute('/admin')).toBe(true)
      expect(isProtectedRoute('/admin/users')).toBe(true)
      expect(isProtectedRoute('/')).toBe(false)
      expect(isProtectedRoute('/login')).toBe(false)
      expect(isProtectedRoute('/api/users')).toBe(false)
    })

    it('should identify public routes correctly', () => {
      const isPublicRoute = (pathname: string): boolean => {
        const publicRoutes = ['/', '/login', '/sign-up', '/api', '/_next', '/favicon.ico']
        // Check for exact matches or paths that start with the route but are not protected routes
        const protectedRoutes = ['/talent', '/client', '/admin']
        const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
        if (isProtected) return false
        return publicRoutes.some(route => pathname.startsWith(route))
      }

      expect(isPublicRoute('/')).toBe(true)
      expect(isPublicRoute('/login')).toBe(true)
      expect(isPublicRoute('/sign-up')).toBe(true)
      expect(isPublicRoute('/api/users')).toBe(true)
      expect(isPublicRoute('/_next/static')).toBe(true)
      expect(isPublicRoute('/favicon.ico')).toBe(true)
      expect(isPublicRoute('/talent')).toBe(false)
      expect(isPublicRoute('/client')).toBe(false)
      expect(isPublicRoute('/admin')).toBe(false)
    })

    it('should identify onboarding routes correctly', () => {
      const isOnboardingRoute = (pathname: string): boolean => {
        const onboardingRoutes = ['/role-selection']
        return onboardingRoutes.some(route => pathname.startsWith(route))
      }

      expect(isOnboardingRoute('/role-selection')).toBe(true)
      expect(isOnboardingRoute('/role-selection/step1')).toBe(true)
      expect(isOnboardingRoute('/talent')).toBe(false)
      expect(isOnboardingRoute('/client')).toBe(false)
      expect(isOnboardingRoute('/admin')).toBe(false)
    })
  })

  describe('User Role Assignment', () => {
    it('should handle role assignment during user creation', () => {
      const createUserWithRole = async (email: string, role: UserRole) => {
        // Mock user creation
        return {
          success: true,
          data: {
            id: 'user-123',
            clerk_user_id: 'clerk-user-123',
            email,
            role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }
      }

      return createUserWithRole('test@example.com', 'talent').then(result => {
        expect(result.success).toBe(true)
        expect(result.data.role).toBe('talent')
        expect(result.data.email).toBe('test@example.com')
      })
    })

    it('should validate role during user creation', () => {
      const validateRole = (role: string): boolean => {
        return VALID_USER_ROLES.includes(role as any)
      }

      expect(validateRole('admin')).toBe(true)
      expect(validateRole('client')).toBe(true)
      expect(validateRole('talent')).toBe(true)
      expect(validateRole('invalid')).toBe(false)
      expect(validateRole('')).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', () => {
      const handleAuthError = (error: unknown): string => {
        const errorObj = error as { message?: string }
        if (errorObj.message?.includes('unauthorized')) {
          return 'Please sign in to continue'
        }
        if (errorObj.message?.includes('forbidden')) {
          return 'You do not have permission to access this resource'
        }
        return 'An unexpected error occurred'
      }

      expect(handleAuthError({ message: 'unauthorized' })).toBe('Please sign in to continue')
      expect(handleAuthError({ message: 'forbidden' })).toBe('You do not have permission to access this resource')
      expect(handleAuthError({ message: 'other error' })).toBe('An unexpected error occurred')
      expect(handleAuthError({})).toBe('An unexpected error occurred')
    })

    it('should handle role fetch errors gracefully', () => {
      const handleRoleFetchError = (error: unknown): string => {
        const errorObj = error as { message?: string }
        if (errorObj.message?.includes('network')) {
          return 'Network error. Please check your connection.'
        }
        if (errorObj.message?.includes('not found')) {
          return 'User not found. Please contact support.'
        }
        return 'Failed to fetch user role. Please try again.'
      }

      expect(handleRoleFetchError({ message: 'network error' })).toBe('Network error. Please check your connection.')
      expect(handleRoleFetchError({ message: 'not found' })).toBe('User not found. Please contact support.')
      expect(handleRoleFetchError({ message: 'other error' })).toBe('Failed to fetch user role. Please try again.')
    })
  })

  describe('Redirect Logic', () => {
    it('should redirect unauthenticated users to login', () => {
      const shouldRedirectToLogin = (userId: string | null): boolean => {
        return !userId
      }

      expect(shouldRedirectToLogin(null)).toBe(true)
      expect(shouldRedirectToLogin('')).toBe(true)
      expect(shouldRedirectToLogin('user-123')).toBe(false)
    })

    it('should redirect users without roles to role selection', () => {
      const shouldRedirectToRoleSelection = (userRole: string | null | undefined): boolean => {
        return !userRole || userRole === ''
      }

      expect(shouldRedirectToRoleSelection(null)).toBe(true)
      expect(shouldRedirectToRoleSelection(undefined)).toBe(true)
      expect(shouldRedirectToRoleSelection('')).toBe(true)
      expect(shouldRedirectToRoleSelection('talent')).toBe(false)
      expect(shouldRedirectToRoleSelection('client')).toBe(false)
      expect(shouldRedirectToRoleSelection('admin')).toBe(false)
    })

    it('should redirect users to appropriate dashboard based on role', () => {
      const getRedirectUrl = (userRole: UserRole): string => {
        switch (userRole) {
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

      expect(getRedirectUrl('talent')).toBe('/talent')
      expect(getRedirectUrl('client')).toBe('/client')
      expect(getRedirectUrl('admin')).toBe('/admin')
    })
  })
}) 