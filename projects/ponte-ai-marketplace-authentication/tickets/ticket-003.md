# Implement role-based routing and access control

## Context & Motivation
The marketplace app needs to enforce role-based access control where users can only access their designated sections (/talent, /client, /admin). This ticket implements the routing logic and middleware that will redirect users to appropriate dashboards based on their role and prevent unauthorized access to other sections. This is essential for maintaining proper user segmentation and security.

Reference: `spec.md` - Section 3 In Scope (Role-based route protection)

## Detailed Description & Requirements

#### Functional Requirements:
- Implement role-based route protection for `/talent`, `/client`, `/admin`
- Create role-based redirect logic for authenticated users
- Implement middleware for route access control
- Create "Hello World" dashboard pages for each role
- Handle unauthenticated user redirects to `/login`
- Implement role validation and assignment logic

#### Non-Functional Requirements:
- Ensure route protection is enforced at middleware level
- Maintain fast routing performance
- Implement proper error handling for unauthorized access
- Follow Next.js App Router patterns
- Ensure type safety for role management

#### Validation & Error Handling:
- Handle cases where user role is not assigned
- Implement proper error pages for unauthorized access
- Handle edge cases in role assignment
- Ensure graceful fallbacks for missing user data

## Success Criteria
- Role-based route protection is implemented and working
- Users are redirected to appropriate dashboards based on role
- Unauthorized access attempts are blocked
- "Hello World" dashboard pages are created for each role
- Middleware properly validates user roles
- Role assignment logic works correctly
- Error handling is comprehensive and user-friendly

## Test Plan

### Automated Tests
- `test_role_based_routing`: Verify users can only access their role-specific routes → Talent users can access /talent, not /client or /admin
- `test_unauthorized_access`: Verify unauthorized access is blocked → Users get error page when accessing wrong role routes
- `test_redirect_logic`: Verify users are redirected to correct dashboards → Authenticated users go to role-appropriate dashboard
- `test_unauthenticated_redirect`: Verify unauthenticated users go to login → Unauthenticated users redirected to /login
- `test_role_validation`: Verify role validation works correctly → Invalid roles are handled gracefully
- `test_middleware_protection`: Verify middleware enforces route protection → Route protection works at middleware level
- `test_dashboard_pages`: Verify dashboard pages render correctly → Hello World pages display for each role

📁 Test file: `__tests__/role-based-routing.test.ts`

### Manual Testing Plan

#### Prerequisites
- Two different email addresses for testing
- Google OAuth account
- Postman or similar API testing tool
- Backend server running on port 3001
- Frontend server running on port 3000

#### Test Accounts Setup
1. **Talent Account**: `talent-test@example.com` (or your test email)
2. **Client Account**: `client-test@example.com` (or your second test email)
3. **Google OAuth**: Use your Google account for OAuth testing

---

## Step-by-Step Testing Instructions

### Phase 1: Environment Setup

#### 1.1 Start Servers
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start frontend  
cd ../
npm run dev
```

#### 1.2 Verify Environment Variables
```bash
# Check backend environment
cat backend/.env

# Check frontend environment
cat .env.local
```

**Required Variables:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Phase 2: Talent Flow Testing

#### 2.1 Create Talent Account via Email
1. **Navigate to**: `http://localhost:3000`
2. **Click**: "Get Started" → "Sign Up"
3. **Use Email**: `talent-test@example.com`
4. **Complete Sign Up**: Verify email if required
5. **Expected Result**: Redirected to `/role-selection`

#### 2.2 Role Selection for Talent
1. **On Role Selection Page**: Select "Talent & Creators"
2. **Click**: "Select Role"
3. **Expected Result**: 
   - Role saved to database
   - Redirected to `/onboard-talent`

#### 2.3 Talent Onboarding
1. **Fill Form**:
   - Full Name: `Test Talent User`
   - Bio: `Professional AI avatar talent for testing`
   - Expertise: `Tech Influencer, Content Creator`
   - Pricing: `$2,500 - $15,000 per campaign`
   - Availability: `Available for bookings`
2. **Click**: "Complete Profile Setup"
3. **Expected Result**: Redirected to `/talent` dashboard

#### 2.4 Verify Talent Dashboard Access
1. **Check Dashboard**: Should show talent-specific content
2. **Test Navigation**: Verify talent-specific menu items
3. **Test Protected Routes**:
   - ✅ `/talent` - Should be accessible
   - ❌ `/client` - Should redirect to `/talent`
   - ❌ `/admin` - Should redirect to `/talent`

#### 2.5 API Testing for Talent User

**Get User Data:**
```bash
# Replace CLERK_USER_ID with actual user ID from Clerk dashboard
curl -X GET "http://localhost:3000/api/users/CLERK_USER_ID" \
  -H "Authorization: Bearer CLERK_USER_ID" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clerk_user_id": "CLERK_USER_ID",
    "email": "talent-test@example.com",
    "role": "talent",
    "created_at": "2025-01-XX...",
    "updated_at": "2025-01-XX..."
  }
}
```

### Phase 3: Client Flow Testing

#### 3.1 Create Client Account via Google OAuth
1. **Navigate to**: `http://localhost:3000`
2. **Click**: "Get Started" → "Sign Up"
3. **Choose**: "Continue with Google"
4. **Complete OAuth**: Use your Google account
5. **Expected Result**: Redirected to `/role-selection`

#### 3.2 Role Selection for Client
1. **On Role Selection Page**: Select "Brands & Agencies"
2. **Click**: "Select Role"
3. **Expected Result**: 
   - Role saved to database
   - Redirected to `/onboard-client` (or `/client` if no onboarding)

#### 3.3 Verify Client Dashboard Access
1. **Check Dashboard**: Should show client-specific content
2. **Test Navigation**: Verify client-specific menu items
3. **Test Protected Routes**:
   - ❌ `/talent` - Should redirect to `/client`
   - ✅ `/client` - Should be accessible
   - ❌ `/admin` - Should redirect to `/client`

#### 3.4 API Testing for Client User

**Get User Data:**
```bash
# Replace CLERK_USER_ID with actual user ID from Clerk dashboard
curl -X GET "http://localhost:3000/api/users/CLERK_USER_ID" \
  -H "Authorization: Bearer CLERK_USER_ID" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clerk_user_id": "CLERK_USER_ID",
    "email": "your-google-email@gmail.com",
    "role": "client",
    "created_at": "2025-01-XX...",
    "updated_at": "2025-01-XX..."
  }
}
```

### Phase 4: Admin Flow Testing

#### 4.1 Create Admin Account
1. **Navigate to**: `http://localhost:3000`
2. **Sign Up**: Use a third email address
3. **Role Selection**: Select "Administrator"
4. **Expected Result**: Redirected to `/admin` dashboard

#### 4.2 Verify Admin Dashboard Access
1. **Check Dashboard**: Should show admin-specific content
2. **Test Navigation**: Verify admin-specific menu items
3. **Test Protected Routes**:
   - ✅ `/talent` - Should be accessible (admin can access all)
   - ✅ `/client` - Should be accessible (admin can access all)
   - ✅ `/admin` - Should be accessible

#### 4.3 API Testing for Admin User

**Get All Users (Admin Only):**
```bash
# Replace CLERK_USER_ID with admin user ID
curl -X GET "http://localhost:3000/api/users" \
  -H "Authorization: Bearer CLERK_USER_ID" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "clerk_user_id": "clerk-user-1",
      "email": "talent-test@example.com",
      "role": "talent",
      "created_at": "2025-01-XX...",
      "updated_at": "2025-01-XX..."
    },
    {
      "id": "uuid-2", 
      "clerk_user_id": "clerk-user-2",
      "email": "client-test@gmail.com",
      "role": "client",
      "created_at": "2025-01-XX...",
      "updated_at": "2025-01-XX..."
    }
  ]
}
```

### Phase 5: Error Handling Testing

#### 5.1 Test Unauthorized Access
1. **As Talent User**: Try to access `/client` or `/admin`
2. **Expected Result**: Redirected to `/talent` dashboard
3. **As Client User**: Try to access `/talent` or `/admin`
4. **Expected Result**: Redirected to `/client` dashboard

#### 5.2 Test Invalid Role Assignment
```bash
# Try to create user with invalid role
curl -X POST "http://localhost:3000/api/users" \
  -H "Authorization: Bearer CLERK_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "role": "invalid_role"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid role. Must be admin, client, or talent"
}
```

#### 5.3 Test Missing Authentication
```bash
# Try to access API without authentication
curl -X GET "http://localhost:3000/api/users/CLERK_USER_ID" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Unauthorized - User not authenticated"
}
```

### Phase 6: Edge Case Testing

#### 6.1 Test User Without Role
1. **Create User**: Sign up but don't select role
2. **Navigate to**: `/talent` or `/client`
3. **Expected Result**: Redirected to `/role-selection`

#### 6.2 Test Role Selection Page Access
1. **As Authenticated User**: Navigate to `/role-selection`
2. **Expected Result**: Should be able to select role
3. **As User with Role**: Navigate to `/role-selection`
4. **Expected Result**: Should redirect to appropriate dashboard

#### 6.3 Test Logout and Re-login
1. **Logout**: From any dashboard
2. **Login Again**: With same credentials
3. **Expected Result**: Redirected to appropriate dashboard based on role

### Phase 7: Performance Testing

#### 7.1 Test Page Load Times
```bash
# Test dashboard page load times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/talent"
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/client"
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/admin"
```

**Create curl-format.txt:**
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

### Phase 8: Browser Testing

#### 8.1 Test Different Browsers
- **Chrome**: Test all flows
- **Firefox**: Test all flows  
- **Safari**: Test all flows
- **Edge**: Test all flows

#### 8.2 Test Mobile Responsiveness
- **iPhone Safari**: Test role selection and dashboards
- **Android Chrome**: Test role selection and dashboards
- **Tablet**: Test responsive design

### Phase 9: Security Testing

#### 9.1 Test Direct URL Access
1. **Without Authentication**: Try to access `/talent`, `/client`, `/admin`
2. **Expected Result**: Redirected to `/login`

#### 9.2 Test API Security
```bash
# Test admin endpoint with non-admin user
curl -X GET "http://localhost:3000/api/users" \
  -H "Authorization: Bearer TALENT_USER_ID" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Forbidden - Admin access required"
}
```

### Phase 10: Database Verification

#### 10.1 Check Supabase Database
```sql
-- Connect to Supabase and run:
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

**Expected Results:**
- All test users should be in the database
- Roles should be correctly assigned
- Timestamps should be properly set

#### 10.2 Verify Role Constraints
```sql
-- Test role validation
INSERT INTO users (clerk_user_id, email, role) 
VALUES ('test-clerk-id', 'test@example.com', 'invalid_role');
```

**Expected Result**: Should fail due to enum constraint

---

## Test Checklist

### ✅ Environment Setup
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 3000
- [ ] Environment variables configured
- [ ] Database connection working

### ✅ Talent Flow
- [ ] Email signup works
- [ ] Role selection works
- [ ] Onboarding form works
- [ ] Dashboard access works
- [ ] Protected routes blocked
- [ ] API calls work

### ✅ Client Flow  
- [ ] Google OAuth signup works
- [ ] Role selection works
- [ ] Dashboard access works
- [ ] Protected routes blocked
- [ ] API calls work

### ✅ Admin Flow
- [ ] Admin signup works
- [ ] Admin dashboard works
- [ ] All routes accessible
- [ ] User management API works

### ✅ Error Handling
- [ ] Unauthorized access blocked
- [ ] Invalid roles handled
- [ ] Missing auth handled
- [ ] Edge cases handled

### ✅ Performance & Security
- [ ] Page load times acceptable
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Security measures working

### ✅ Database
- [ ] Users created correctly
- [ ] Roles assigned correctly
- [ ] Constraints working
- [ ] Data integrity maintained

## Dependencies
- Depends on: `ticket-001` (Clerk integration)
- Depends on: `ticket-002` (Supabase users table)
- Requires: Next.js App Router setup
- Requires: TypeScript configuration

## Suggested Implementation Plan
1. Create role-based middleware for route protection
2. Implement role validation and assignment logic
3. Create dashboard pages for each role (/talent, /client, /admin)
4. Implement redirect logic for authenticated users
5. Add error handling for unauthorized access
6. Create custom hooks for role management
7. Test all routing scenarios and edge cases

## Effort Estimate
- Estimated effort: **3 hours**
- Assumes Clerk and Supabase integration is complete
- Includes testing and validation time
- Includes error handling and edge case management

## Priority & Impact
- Priority: **High**
- Rationale: Core security feature, required for proper user segmentation

## Acceptance Checklist
- [ ] Role-based middleware implemented and working
- [ ] Route protection enforced for all role-specific routes
- [ ] Redirect logic implemented for authenticated users
- [ ] Dashboard pages created for each role (/talent, /client, /admin)
- [ ] Unauthorized access properly handled with error pages
- [ ] Role validation logic implemented and tested
- [ ] Custom hooks for role management created
- [ ] All routing scenarios tested and working
- [ ] Jest tests written and passing
- [ ] Error handling comprehensive and user-friendly
- [ ] TypeScript types implemented for role management

## Links & References
- Specification: `spec.md`
- Next.js Documentation: https://nextjs.org/docs/app
- Linear Project: `Ponte AI Marketplace Authentication System`
- Related tickets: `ticket-001` (Clerk integration), `ticket-002` (Supabase integration), `ticket-004` (onboarding integration) 