import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { userService } from '@/lib/supabase';
import { CreateUserRequest, UpdateUserRequest, UserResponse, UsersListResponse } from '@/types/user';

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest): Promise<NextResponse<UsersListResponse>> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - User not authenticated',
        },
        { status: 401 }
      );
    }
    
    // TODO: Add admin role check
    // For now, allow all authenticated users to fetch all users for development
    
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

// POST /api/users - Create a new user (for current authenticated user)
export async function POST(request: NextRequest): Promise<NextResponse<UserResponse>> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - User not authenticated',
        },
        { status: 401 }
      );
    }
    
    const body: CreateUserRequest = await request.json();
    
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
    
    // Check if user already exists
    const existingUser = await userService.getUserByClerkId(userId);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists',
        },
        { status: 409 }
      );
    }
    
    // Create user with authenticated user's ID
    const user = await userService.createUser({
      clerk_user_id: userId,
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