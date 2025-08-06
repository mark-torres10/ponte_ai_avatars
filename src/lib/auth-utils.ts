import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { logger } from './logger'

/**
 * Centralized authentication utility for API routes
 * Handles Clerk session and Authorization header checks
 */
export async function authenticateRequest(request: NextRequest): Promise<string | null> {
  try {
    // Try to get user ID from Clerk session first
    const authResult = await auth()
    const userId = authResult.userId
    
    if (userId) {
      logger.auth('Clerk session', userId, true)
      return userId
    }
  } catch (authError) {
    logger.warn('Clerk authentication failed', { error: authError })
  }
  
  // If Clerk auth didn't provide a userId, try Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    
    // Basic validation - ensure token is not empty
    if (token && token.trim().length > 0) {
      logger.auth('Authorization header', token, true)
      return token
    }
  }
  
  logger.warn('No valid authentication found')
  return null
}

/**
 * Validates if a user has the required role
 */
export function validateUserRole(userRole: string | null | undefined): userRole is string {
  return !!userRole && ['admin', 'client', 'talent'].includes(userRole)
}

/**
 * Checks if a user has access to a specific role-based route
 */
export function hasRouteAccess(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
} 