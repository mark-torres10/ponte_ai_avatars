import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, validateUserRole } from '@/lib/auth-utils';
import { logger } from '@/lib/logger';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await authenticateRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - User not authenticated',
        },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`, // Pass the user ID for backend auth
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error('Error fetching users', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (for current authenticated user)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await authenticateRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - User not authenticated',
        },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.role) {
      return NextResponse.json(
        {
          success: false,
          error: 'role is required',
        },
        { status: 400 }
      );
    }
    
    // Validate role using centralized validation utility
    if (!validateUserRole(body.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role. Must be admin, client, or talent',
        },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`, // Pass the user ID for backend auth
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    logger.error('Error creating user', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
      },
      { status: 500 }
    );
  }
} 