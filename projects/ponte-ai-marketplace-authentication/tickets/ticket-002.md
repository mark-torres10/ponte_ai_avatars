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
- **Frontend API routes proxy to backend correctly**
- **Backend handles all Supabase operations**
- **No direct Supabase access from frontend**
- **Proper separation of concerns maintained**

## Current Architecture (Updated)

### Frontend (Next.js - Port 3000)
- **Clerk Authentication**: Handles user sign-in/sign-up
- **API Routes**: Proxy requests to backend (no direct Supabase access)
- **UI Components**: React components for user interface
- **Middleware**: Clerk middleware for route protection

### Backend (Express - Port 3001)
- **User Management**: Full CRUD operations for users
- **Supabase Integration**: Direct database access with service role key
- **Authentication**: Receives Clerk user ID from frontend
- **CORS**: Configured to allow frontend requests

### Data Flow
1. **User Authentication**: Clerk handles sign-in/sign-up
2. **Frontend API Call**: Frontend calls `/api/users` routes
3. **Frontend Proxy**: Frontend routes proxy to `http://localhost:3001/api/users`
4. **Backend Processing**: Backend validates and processes request
5. **Database Operation**: Backend performs Supabase operations
6. **Response**: Backend returns data to frontend

### Security Model
- **Frontend**: No database credentials, only UI and authentication
- **Backend**: Has Supabase service role key for database operations
- **Authentication**: Clerk user ID passed via Authorization header
- **CORS**: Backend configured to accept frontend requests

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

### Test 4: API Endpoints Testing (Updated Architecture)
- [ ] **Prerequisites Setup**
  - [ ] Start frontend dev server: `npm run dev`
  - [ ] Start backend dev server: `cd backend && npm run dev`
  - [ ] Open browser to `http://localhost:3000`
  - [ ] Sign in with Clerk (Google/Microsoft/Email)
  - [ ] Get Clerk session token from browser dev tools
  - [ ] Verify Clerk authentication is working

- [ ] **Frontend API Proxy Testing**
  - [ ] Test frontend API routes proxy to backend correctly
  - [ ] Verify frontend `/api/users` routes work without direct Supabase access
  - [ ] Check browser network tab for requests to backend

- [ ] **Backend User Routes Testing**
  - [ ] Test backend directly: `curl http://localhost:3001/api/users`
  - [ ] Verify backend responds with proper CORS headers
  - [ ] Test backend authentication with Clerk user ID

- [ ] **Create User (POST /api/users)**
  - [ ] Test through frontend proxy: `POST http://localhost:3000/api/users`
  - [ ] Test backend directly: `POST http://localhost:3001/api/users`
  - [ ] Verify response status: 200 for authenticated requests
  - [ ] Verify response contains user data with UUID
  - [ ] Verify user appears in Supabase dashboard
  - [ ] Test without authentication: verify 401 response

- [ ] **Get User (GET /api/users/[clerkUserId])**
  - [ ] Test through frontend proxy: `GET http://localhost:3000/api/users/[clerkUserId]`
  - [ ] Test backend directly: `GET http://localhost:3001/api/users/[clerkUserId]`
  - [ ] Verify response status: 200
  - [ ] Verify response contains correct user data

- [ ] **Update User (PUT /api/users/[clerkUserId])**
  - [ ] Test through frontend proxy: `PUT http://localhost:3000/api/users/[clerkUserId]`
  - [ ] Test backend directly: `PUT http://localhost:3001/api/users/[clerkUserId]`
  - [ ] Verify response status: 200
  - [ ] Verify data is updated in Supabase

- [ ] **Get All Users (GET /api/users)**
  - [ ] Test through frontend proxy: `GET http://localhost:3000/api/users`
  - [ ] Test backend directly: `GET http://localhost:3001/api/users`
  - [ ] Verify response status: 200
  - [ ] Verify response contains array of users

- [ ] **Delete User (DELETE /api/users/[clerkUserId])**
  - [ ] Test through frontend proxy: `DELETE http://localhost:3000/api/users/[clerkUserId]`
  - [ ] Test backend directly: `DELETE http://localhost:3001/api/users/[clerkUserId]`
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

## Complete Testing Workflow (Updated Architecture)

### Step 1: Environment Setup
1. **Start Both Servers**
   ```bash
   # Terminal 1: Start Frontend
   npm run dev
   
   # Terminal 2: Start Backend
   cd backend && npm run dev
   ```

2. **Verify Both Servers Are Running**
   - Frontend: `http://localhost:3000` (Next.js)
   - Backend: `http://localhost:3001` (Express)
   - Check both servers start without errors

3. **Verify Clerk Integration**
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

### Step 3: Test Backend Directly
1. **Test Backend Health**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Backend User Routes (Without Auth)**
   ```bash
   # Should return 401 Unauthorized
   curl http://localhost:3001/api/users
   curl http://localhost:3001/api/users/test-user-id
   ```

3. **Test Backend User Routes (With Auth)**
   ```bash
   # Replace <clerk_user_id> with actual Clerk user ID
   curl -H "Authorization: Bearer <clerk_user_id>" http://localhost:3001/api/users
   curl -H "Authorization: Bearer <clerk_user_id>" http://localhost:3001/api/users/<clerk_user_id>
   ```

### Step 4: Test Frontend Proxy
1. **Test Frontend API Routes**
   ```bash
   # These should proxy to backend
   curl http://localhost:3000/api/users
   curl http://localhost:3000/api/users/<clerk_user_id>
   ```

2. **Verify Proxy in Browser**
   - Open browser Developer Tools (F12)
   - Go to Network tab
   - Make API calls from frontend
   - Verify requests go to backend

### Step 5: Test Complete Flow
1. **Create User Through Frontend**
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <clerk_user_id>" \
     -d '{"role": "client", "email": "test@example.com"}'
   ```

2. **Get User Through Frontend**
   ```bash
   curl http://localhost:3000/api/users/<clerk_user_id>
   ```

3. **Update User Through Frontend**
   ```bash
   curl -X PUT http://localhost:3000/api/users/<clerk_user_id> \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <clerk_user_id>" \
     -d '{"role": "talent"}'
   ```

### Step 6: Browser Testing
1. **Test Clerk Components**
   - Go to `http://localhost:3000`
   - Test sign-in/sign-up flow
   - Verify Clerk components work correctly

2. **Test API Calls from Browser Console**
   ```javascript
   // Get current user ID from Clerk
   const userId = 'your_clerk_user_id';
   
   // Test API calls
   fetch('/api/users', {
     headers: { 'Authorization': `Bearer ${userId}` }
   }).then(r => r.json()).then(console.log);
   
   fetch(`/api/users/${userId}`, {
     headers: { 'Authorization': `Bearer ${userId}` }
   }).then(r => r.json()).then(console.log);
   ```

### Step 7: Verify Database Changes
1. **Check Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to Table Editor
   - Verify `users` table has new records
   - Check that `updated_at` timestamps are updating

2. **Verify RLS Policies**
   - Check that users can only access their own data
   - Verify admin policies are working correctly

### Expected Test Results
- **Backend Direct**: API calls work with proper authentication
- **Frontend Proxy**: API calls proxy to backend correctly
- **Without Auth**: All API calls return 401 Unauthorized
- **With Auth**: API calls return 200/201 for successful operations
- **Error Cases**: Return appropriate 400/409 status codes
- **Database**: Users created/updated/deleted in Supabase
- **Clerk Integration**: Authentication works seamlessly

## Quick Testing Summary

### 🚀 Start Both Servers
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend  
cd backend && npm run dev
```

### 🔐 Get Clerk User ID
1. Go to `http://localhost:3000`
2. Sign in with Clerk
3. Open browser dev tools → Application → Clerk session
4. Copy the user ID (not the JWT token)

### 🧪 Test Backend Directly
```bash
# Test health
curl http://localhost:3001/health

# Test without auth (should return 401)
curl http://localhost:3001/api/users

# Test with auth (should return 200)
curl -H "Authorization: Bearer YOUR_CLERK_USER_ID" http://localhost:3001/api/users
```

### 🌐 Test Frontend Proxy
```bash
# These proxy to backend
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users/YOUR_CLERK_USER_ID
```

### 📊 Verify in Supabase
- Go to Supabase Dashboard → Table Editor
- Check `users` table for new records
- Verify `updated_at` timestamps update

### ✅ Success Indicators
- Both servers start without errors
- Backend responds to direct API calls
- Frontend proxies requests to backend
- Users created/updated in Supabase
- Clerk authentication works in browser

## Links & References
- Specification: `spec.md`
- Supabase Documentation: https://supabase.com/docs
- Database Schema: `spec.md` Section 7 Technical Notes
- Linear Project: `Ponte AI Marketplace Authentication System`
- Related tickets: `ticket-001` (Clerk integration), `ticket-003` (role-based routing) 