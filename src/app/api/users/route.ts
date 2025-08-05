import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Try to get user ID from Clerk session first
    let userId: string | null = null;
    
    try {
      const authResult = await auth();
      userId = authResult.userId;
      console.log('Clerk auth result:', { userId, hasUserId: !!userId });
    } catch (authError) {
      console.log('Clerk auth error:', authError);
    }
    
    // If Clerk auth didn't provide a userId, try Authorization header
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        userId = authHeader.replace('Bearer ', '');
        console.log('Using Authorization header, userId:', userId);
      }
    }
    
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
    console.error('Error fetching users:', error);
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
    // Try to get user ID from Clerk session first
    let userId: string | null = null;
    
    try {
      const authResult = await auth();
      userId = authResult.userId;
      console.log('Clerk auth result:', { userId, hasUserId: !!userId });
    } catch (authError) {
      console.log('Clerk auth error:', authError);
    }
    
    // If Clerk auth didn't provide a userId, try Authorization header
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        userId = authHeader.replace('Bearer ', '');
        console.log('Using Authorization header, userId:', userId);
      }
    }
    
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
    
    // Validate role
    if (!['admin', 'client', 'talent'].includes(body.role)) {
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
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
      },
      { status: 500 }
    );
  }
} 