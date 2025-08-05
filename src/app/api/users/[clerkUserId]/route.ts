import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/supabase';
import { UpdateUserRequest, UserResponse } from '@/types/user';

// GET /api/users/[clerkUserId] - Get user by Clerk user ID
export async function GET(
  request: NextRequest,
  { params }: { params: { clerkUserId: string } }
): Promise<NextResponse<UserResponse>> {
  try {
    const { clerkUserId } = params;
    
    if (!clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'clerkUserId is required',
        },
        { status: 400 }
      );
    }
    
    const user = await userService.getUserByClerkId(clerkUserId);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
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
  { params }: { params: { clerkUserId: string } }
): Promise<NextResponse<UserResponse>> {
  try {
    const { clerkUserId } = params;
    const body: UpdateUserRequest = await request.json();
    
    if (!clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'clerkUserId is required',
        },
        { status: 400 }
      );
    }
    
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
    
    // Check if user exists
    const existingUser = await userService.getUserByClerkId(clerkUserId);
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }
    
    // Update user
    const updatedUser = await userService.updateUser(clerkUserId, body);
    
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update user',
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
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
  { params }: { params: { clerkUserId: string } }
): Promise<NextResponse<UserResponse>> {
  try {
    const { clerkUserId } = params;
    
    if (!clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'clerkUserId is required',
        },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await userService.getUserByClerkId(clerkUserId);
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }
    
    // Delete user
    const success = await userService.deleteUser(clerkUserId);
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete user',
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: existingUser, // Return the deleted user data
    });
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