import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

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
    
    const response = await fetch(`${BACKEND_URL}/api/users/${clerkUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching user:', error);
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
    
    const body = await request.json();
    
    // Validate role if provided
    if (body.role && !['admin', 'client', 'talent'].includes(body.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid role. Must be admin, client, or talent',
        },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/users/${clerkUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating user:', error);
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
    
    const response = await fetch(`${BACKEND_URL}/api/users/${clerkUserId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user',
      },
      { status: 500 }
    );
  }
} 