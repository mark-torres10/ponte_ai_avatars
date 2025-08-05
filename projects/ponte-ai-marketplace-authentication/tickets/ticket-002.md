# Create Supabase users table and database schema

## Context & Motivation
The authentication system requires a Supabase database to store user role information and synchronize data with Clerk. This ticket establishes the database schema and user table that will support role-based access control and user management. The users table will store the essential user data that Clerk doesn't handle, specifically the role assignment and any additional user metadata.

Reference: `spec.md` - Section 7 Technical Notes (Database Schema)

## Detailed Description & Requirements

#### Functional Requirements:
- Create `users` table with the specified schema
- Implement proper database constraints and indexes
- Set up Supabase project and connection
- Create database migration files
- Implement user data synchronization triggers
- Add database connection utilities

#### Non-Functional Requirements:
- Use UUID primary keys for security
- Implement proper database indexes for performance
- Ensure data integrity with constraints
- Follow Supabase best practices
- Maintain data consistency between Clerk and Supabase

#### Validation & Error Handling:
- Handle database connection failures
- Validate user data before insertion
- Implement proper error logging
- Ensure data consistency in case of sync failures

## Success Criteria
- `users` table is created with correct schema
- Database indexes are properly configured for performance
- Supabase connection is established and tested
- Migration files are created and documented
- User data synchronization triggers are implemented
- Database utilities are available for the application
- TypeScript types are generated for the database schema

## Test Plan

### Prerequisites Setup
- [ ] **Environment Variables**: Set up `.env.local` with Supabase credentials
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
  - [ ] Credentials obtained from Supabase dashboard

- [ ] **Database Migration**: Run migration in Supabase SQL editor
  - [ ] Copy contents of `supabase/migrations/001_create_users_table.sql`
  - [ ] Execute migration successfully
  - [ ] Verify table appears in Table Editor

### Test 1: Database Schema Verification ✅
- [x] **Table Structure**: Verify `users` table exists with correct columns
  - [x] `id` (UUID, Primary Key, Default: gen_random_uuid())
  - [x] `clerk_user_id` (Text, Unique, Not Null)
  - [x] `email` (Text, Unique, Nullable)
  - [x] `role` (Enum: admin, client, talent)
  - [x] `created_at` (Timestamp, Default: NOW())
  - [x] `updated_at` (Timestamp, Default: NOW())

### Test 2: Database Indexes Verification ✅
- [x] **Performance Indexes**: Verify all indexes are created
  - [x] `idx_users_clerk_user_id` index exists
  - [x] `idx_users_email` index exists
  - [x] `idx_users_role` index exists
  - [x] `idx_users_created_at` index exists
  - [x] Run SQL query to verify indexes: `SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users' AND schemaname = 'public';`

### Test 3: Row Level Security (RLS) Verification ✅
- [x] **Security Policies**: Verify RLS is enabled and policies exist
  - [x] RLS enabled on `users` table
  - [x] Policy "Users can view own data" exists
  - [x] Policy "Users can update own data" exists
  - [x] Policy "Users can insert own data" exists
  - [x] Policy "Users can delete own data" exists

### Test 4: API Endpoints Testing
- [ ] **Prerequisites Setup**
  - [ ] Start dev server: `npm run dev`
  - [ ] Open browser to `http://localhost:3000`
  - [ ] Sign in with Clerk (Google/Microsoft/Email)
  - [ ] Get Clerk session token from browser dev tools
  - [ ] Verify Clerk authentication is working

- [ ] **Create User (POST /api/users)**
  - [ ] Run: `node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 4 --clerk-session-token <your_token>`
  - [ ] Verify response status: 200 for authenticated requests
  - [ ] Verify response contains user data with UUID
  - [ ] Verify user appears in Supabase dashboard
  - [ ] Test without token: `node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 4`
  - [ ] Verify response status: 401 for unauthenticated requests

- [ ] **Get User (GET /api/users/[clerkUserId])**
  - [ ] Test getting user by clerk_user_id
  - [ ] Verify response status: 200
  - [ ] Verify response contains correct user data

- [ ] **Update User (PUT /api/users/[clerkUserId])**
  - [ ] Test updating user email and role
  - [ ] Verify response status: 200
  - [ ] Verify data is updated in Supabase

- [ ] **Get All Users (GET /api/users)**
  - [ ] Test getting all users
  - [ ] Verify response status: 200
  - [ ] Verify response contains array of users

- [ ] **Delete User (DELETE /api/users/[clerkUserId])**
  - [ ] Test deleting user
  - [ ] Verify response status: 200
  - [ ] Verify user is removed from Supabase

### Test 5: Error Handling Testing
- [ ] **Missing Required Fields**
  - [ ] Run: `node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 5 --clerk-session-token <your_token>`
  - [ ] Test creating user without `role` field
  - [ ] Verify response status: 400
  - [ ] Verify error message mentions missing field

- [ ] **Invalid Role**
  - [ ] Test creating user with invalid role
  - [ ] Verify response status: 400
  - [ ] Verify error message mentions invalid role

- [ ] **Duplicate User**
  - [ ] Test creating duplicate user with same `clerk_user_id`
  - [ ] Verify first request: status 200
  - [ ] Verify second request: status 409
  - [ ] Verify error message mentions user already exists

- [ ] **Unauthenticated Requests**
  - [ ] Run: `node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 5`
  - [ ] Verify all requests return 401 status
  - [ ] Verify error message mentions "Unauthorized"

### Test 6: TypeScript Types Testing
- [ ] **Type Definitions**
  - [ ] Verify Database interface in `src/lib/supabase.ts`
  - [ ] Verify User, UserInsert, UserUpdate types exist
  - [ ] Verify no TypeScript errors in the file
  - [ ] Verify types match actual database schema

### Test 7: Jest Tests Verification
- [ ] **Automated Testing**
  - [ ] Run: `npm test src/lib/__tests__/supabase.test.ts`
  - [ ] Run: `npm test src/app/api/users/__tests__/route.test.ts`
  - [ ] Verify all tests pass
  - [ ] Verify no test failures
  - [ ] Verify test coverage includes all user service methods

### Test 8: Database Constraints Testing
- [ ] **Data Integrity**
  - [ ] Test inserting user without `clerk_user_id` (should fail)
  - [ ] Test inserting user with invalid role (should fail)
  - [ ] Test inserting duplicate `clerk_user_id` (should fail)
  - [ ] Verify all invalid insertions fail with appropriate errors

### Test 9: Auto-update Trigger Testing
- [ ] **Updated At Timestamp**
  - [ ] Update user email via SQL
  - [ ] Check `updated_at` timestamp is automatically updated
  - [ ] Verify `updated_at` is different from `created_at`

### Test 10: Frontend Integration Testing
- [ ] **Browser Testing**
  - [ ] Start dev server: `npm run dev`
  - [ ] Open browser to `http://localhost:3000`
  - [ ] Open browser developer tools
  - [ ] Test API calls from browser console
  - [ ] Verify API calls work from browser
  - [ ] Verify responses are properly formatted
  - [ ] Verify no CORS errors

### Final Verification Checklist
- [ ] **Complete System Verification**
  - [ ] All database tables and constraints created correctly
  - [ ] All API endpoints respond as expected
  - [ ] Error handling works for invalid requests
  - [ ] TypeScript types properly defined
  - [ ] Jest tests pass
  - [ ] Database indexes created for performance
  - [ ] RLS policies in place
  - [ ] Auto-update triggers work
  - [ ] Frontend can successfully call API endpoints

📁 Test files: 
- `src/lib/__tests__/supabase.test.ts`
- `src/app/api/users/__tests__/route.test.ts`

## Dependencies
- Requires: Supabase project setup
- Requires: Supabase CLI installation
- Requires: Database access credentials
- Depends on: `ticket-001` (Clerk integration)
- Requires: TypeScript configuration

## Suggested Implementation Plan
1. Set up Supabase project and get connection details
2. Create database migration for users table
3. Implement database schema with proper constraints
4. Add database indexes for performance optimization
5. Create user data synchronization triggers
6. Set up Supabase client utilities
7. Generate TypeScript types for database schema
8. Test database operations and synchronization

## Effort Estimate
- Estimated effort: **2 hours**
- Assumes Supabase project is already set up
- Assumes Supabase CLI is installed
- Includes testing and validation time

## Priority & Impact
- Priority: **High**
- Rationale: Required for user data storage and role management, blocks role-based routing

## Acceptance Checklist
- [ ] Supabase project configured and accessible
- [ ] `users` table created with correct schema
- [ ] Database constraints (UNIQUE, NOT NULL) implemented
- [ ] Database indexes created for performance
- [ ] Migration files created and documented
- [ ] User synchronization triggers implemented
- [ ] Supabase client utilities created
- [ ] TypeScript types generated for database schema
- [ ] Database connection tested and working
- [ ] Jest tests written and passing
- [ ] Database operations validated

## Complete Testing Workflow

### Step 1: Environment Setup
1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Verify Clerk Integration**
   - Open browser to `http://localhost:3000`
   - Navigate to `/auth-test` page
   - Verify Clerk components are loading
   - Test sign-in/sign-up flow

### Step 2: Get Clerk Session Token
1. **Sign In Through Browser**
   - Go to `http://localhost:3000`
   - Click "Sign In" and complete authentication
   - Use Google, Microsoft, or email authentication

2. **Extract Session Token**
   - Open browser Developer Tools (F12)
   - Go to Application/Storage tab
   - Look for Clerk session storage
   - Find the session token (JWT format)
   - Copy the full token

### Step 3: Run API Tests
1. **Test Without Authentication (Should Return 401)**
   ```bash
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 4
   ```

2. **Test With Authentication (Should Return 200)**
   ```bash
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 4 --clerk-session-token <your_token>
   ```

3. **Run All Test Suites**
   ```bash
   # Test 4: API Endpoints
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 4 --clerk-session-token <your_token>
   
   # Test 5: Error Handling
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 5 --clerk-session-token <your_token>
   
   # Test 6: TypeScript Types
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 6
   
   # Test 7: Jest Tests
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 7
   
   # Test 8: Database Constraints
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 8 --clerk-session-token <your_token>
   
   # Test 9: Auto-update Triggers
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 9 --clerk-session-token <your_token>
   
   # Test 10: Frontend Integration
   node projects/ponte-ai-marketplace-authentication/ticket-002_tests.js --test 10 --clerk-session-token <your_token>
   ```

### Step 4: Verify Database Changes
1. **Check Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to Table Editor
   - Verify `users` table has new records
   - Check that `updated_at` timestamps are updating

2. **Verify RLS Policies**
   - Check that users can only access their own data
   - Verify admin policies are working correctly

### Expected Test Results
- **Without Token**: All API calls should return 401 Unauthorized
- **With Token**: API calls should return 200/201 for successful operations
- **Error Cases**: Should return appropriate 400/409 status codes
- **Database**: Users should be created/updated/deleted in Supabase

## Links & References
- Specification: `spec.md`
- Supabase Documentation: https://supabase.com/docs
- Database Schema: `spec.md` Section 7 Technical Notes
- Linear Project: `Ponte AI Marketplace Authentication System`
- Related tickets: `ticket-001` (Clerk integration), `ticket-003` (role-based routing) 