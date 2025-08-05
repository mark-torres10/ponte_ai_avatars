import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/supabase';
import { CreateUserRequest, UpdateUserRequest, UserResponse, UsersListResponse } from '@/types/user';

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest): Promise<NextResponse<UsersListResponse>> {
  try {
    // TODO: Add admin role check when Clerk is integrated
    // For now, allow all requests for development
    
    const users = await userService.getAllUsers();
    
    return NextResponse.json({
      success: true,
      data: users,
    });
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

// POST /api/users - Create a new user
export async function POST(request: NextRequest): Promise<NextResponse<UserResponse>> {
  try {
    const body: CreateUserRequest = await request.json();
    
    // Validate required fields
    if (!body.clerk_user_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'clerk_user_id is required',
        },
        { status: 400 }
      );
    }
    
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
    
    // Check if user already exists
    const existingUser = await userService.getUserByClerkId(body.clerk_user_id);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists',
        },
        { status: 409 }
      );
    }
    
    // Create user
    const user = await userService.createUser({
      clerk_user_id: body.clerk_user_id,
      email: body.email || null,
      role: body.role,
    });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create user',
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
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