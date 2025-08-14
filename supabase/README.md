# Supabase Database Setup - Ponte AI Marketplace Authentication

This directory contains the database schema and migrations for the Ponte AI marketplace authentication system.

## Overview

The Supabase database is used to store user information synchronized with Clerk authentication. The main table is `users` which contains user roles and metadata.

## Database Schema

### Users Table

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Roles

The system supports three user roles:
- **admin**: Full access to all features and user management
- **client**: Can book talent and manage campaigns
- **talent**: Can create profiles and receive bookings

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Note down your project URL and anon key

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Migrations

Execute the migration file in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/migrations/001_create_users_table.sql
```

Or use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

### 4. Verify Setup

After running the migration, verify that:

1. The `users` table exists in your database
2. Row Level Security (RLS) is enabled
3. The RLS policies are in place
4. The `user_role` enum is created

## API Endpoints

The following API endpoints are available for user management:

### GET /api/users
- **Description**: Get all users (admin only)
- **Response**: Array of user objects

### POST /api/users
- **Description**: Create a new user
- **Body**: `{ clerk_user_id: string, email?: string, role: 'admin' | 'client' | 'talent' }`
- **Response**: Created user object

### GET /api/users/[clerkUserId]
- **Description**: Get user by Clerk user ID
- **Response**: User object

### PUT /api/users/[clerkUserId]
- **Description**: Update user by Clerk user ID
- **Body**: `{ email?: string, role?: 'admin' | 'client' | 'talent' }`
- **Response**: Updated user object

### DELETE /api/users/[clerkUserId]
- **Description**: Delete user by Clerk user ID
- **Response**: Deleted user object

## Security Features

### Row Level Security (RLS)

The `users` table has RLS enabled with the following policies:

- **Users can view own data**: Users can only read their own user record
- **Users can update own data**: Users can only update their own user record
- **Users can insert own data**: Users can only insert their own user record
- **Users can delete own data**: Users can only delete their own user record

### Indexes

The following indexes are created for performance:

- `idx_users_clerk_user_id`: Index on `clerk_user_id` for fast lookups
- `idx_users_email`: Index on `email` for fast lookups
- `idx_users_role`: Index on `role` for role-based queries
- `idx_users_created_at`: Index on `created_at` for sorting

## Testing

Run the tests to verify the database operations:

```bash
npm test src/lib/__tests__/supabase.test.ts
npm test src/app/api/users/__tests__/route.test.ts
```

## Integration with Clerk

The database is designed to work with Clerk authentication:

1. When a user signs up with Clerk, create a corresponding record in the `users` table
2. Use the Clerk user ID as the `clerk_user_id` field
3. The `clerk_user_id` field is unique and indexed for fast lookups
4. RLS policies ensure users can only access their own data

## Troubleshooting

### Common Issues

1. **Environment variables not set**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. **RLS blocking requests**: Check that the user is authenticated and the RLS policies are correct
3. **Migration errors**: Ensure the migration runs successfully in the Supabase SQL editor

### Debugging

1. Check the browser console for Supabase client errors
2. Verify the database connection in the Supabase dashboard
3. Test the API endpoints directly using tools like Postman or curl

## Next Steps

After setting up the database:

1. Integrate with Clerk authentication (PON-48)
2. Implement role-based routing (PON-50)
3. Integrate with existing onboarding components (PON-51)
4. Add comprehensive testing (PON-52) 