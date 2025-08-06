import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/user';
import { logger } from '@/lib/logger';
import { VALID_USER_ROLES } from '@/lib/auth-utils';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Bearer token validation regex - allows alphanumeric, dots, underscores, and hyphens
const BEARER_TOKEN_REGEX = /^[a-zA-Z0-9._-]+$/;

/**
 * Authenticates the request using Clerk session or Authorization header
 * @param request - The NextRequest object
 * @returns The authenticated user ID or null if not authenticated
 */
import { auth } from '@clerk/nextjs/server';

async function authenticateRequest(request: NextRequest): Promise<string | null> {
  try {
    // Try to get user ID from Clerk session
    const authResult = await auth();
    const clerkUserId = authResult.userId;
    
    if (clerkUserId) {
      logger.auth('Clerk session', clerkUserId, true);
      return clerkUserId;
    }
  } catch (authError) {
    logger.warn('Clerk authentication failed', { error: authError });
  }
  
  // If Clerk auth didn't provide a userId, try Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    
    // Validate Bearer token format
    if (!BEARER_TOKEN_REGEX.test(token)) {
      logger.error('Invalid Bearer token format', { token: token.substring(0, 10) + '...' });
      return null;
    }
    
    logger.auth('Authorization header', token, true);
    return token;
  }
  
  logger.warn('No valid authentication found');
  return null;
}

/**
 * Validates user role against allowed values
 * @param role - The role to validate
 * @returns True if role is valid, false otherwise
 */
function validateRole(role: string): role is UserRole {
  return VALID_USER_ROLES.includes(role as any);
}

// GET /api/users/[clerkUserId] - Get user by Clerk user ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerkUserId: string }> }
): Promise<NextResponse> {
  const { clerkUserId } = await params;
  
  try {
    if (!clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'clerkUserId is required',
        },
        { status: 400 }
      );
    }
    
    // No authentication required for this endpoint - backend is public
    const response = await fetch(`${BACKEND_URL}/api/users/${clerkUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error('Failed to fetch user', { error, clerkUserId });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[clerkUserId] - Update user by Clerk user ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clerkUserId: string }> }
): Promise<NextResponse> {
  const { clerkUserId } = await params;
  
  try {
    if (!clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'clerkUserId is required',
        },
        { status: 400 }
      );
    }
    
    // Authenticate the request
    const authenticatedUserId = await authenticateRequest(request);
    
    if (!authenticatedUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - User not authenticated',
        },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate role if provided with improved error messaging
    if (body.role && !validateRole(body.role)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid role '${body.role}'. Role must be one of the following valid values: ${VALID_USER_ROLES.join(', ')}. Please provide a valid role or omit this field.`,
        },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/users/${clerkUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticatedUserId}`,
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error('Failed to update user', { error, clerkUserId });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[clerkUserId] - Delete user by Clerk user ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clerkUserId: string }> }
): Promise<NextResponse> {
  const { clerkUserId } = await params;
  
  try {
    if (!clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'clerkUserId is required',
        },
        { status: 400 }
      );
    }
    
    // Authenticate the request
    const authenticatedUserId = await authenticateRequest(request);
    
    if (!authenticatedUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - User not authenticated',
        },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/users/${clerkUserId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticatedUserId}`,
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error('Failed to delete user', { error, clerkUserId });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user',
      },
      { status: 500 }
    );
  }
} 