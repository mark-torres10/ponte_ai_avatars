-- Create users table for Ponte AI marketplace authentication
-- This table stores user information synchronized with Clerk authentication

-- Create enum for user roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'client', 'talent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON public.users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only read their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid()::text = clerk_user_id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid()::text = clerk_user_id);

-- Only authenticated users can insert their own data
CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = clerk_user_id);

-- Only authenticated users can delete their own data
CREATE POLICY "Users can delete own data" ON public.users
    FOR DELETE USING (auth.uid()::text = clerk_user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.users IS 'Stores user information synchronized with Clerk authentication';
COMMENT ON COLUMN public.users.id IS 'Primary key UUID';
COMMENT ON COLUMN public.users.clerk_user_id IS 'Clerk user ID for authentication synchronization';
COMMENT ON COLUMN public.users.email IS 'User email address (optional, can be null)';
COMMENT ON COLUMN public.users.role IS 'User role: admin, client, or talent';
COMMENT ON COLUMN public.users.created_at IS 'Timestamp when user was created';
COMMENT ON COLUMN public.users.updated_at IS 'Timestamp when user was last updated'; 