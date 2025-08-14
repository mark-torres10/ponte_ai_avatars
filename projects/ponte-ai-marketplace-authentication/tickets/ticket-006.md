# PON-53: Restructure app layout with dedicated pages and admin navigation

## Context & Motivation
The current app has everything consolidated on the main page, but we need to restructure the layout to provide dedicated pages for each user role with proper navigation. This ticket moves each section to its own component/page and implements a navbar for admin users to switch between client dashboard and avatar generation. This restructuring improves user experience, navigation clarity, and role-based feature access.

Reference: Current implementation in `src/app/page.tsx` and role-based routing from PON-50

## Detailed Description & Requirements

#### Functional Requirements:
- **Home Page**: Clean main homepage with landing content only
- **Login Page**: Dedicated login page with Clerk authentication
- **Talent Page**: Display talent onboarding wizard components (direct routing from role selection)
- **Client Page**: Display client onboarding form components (direct routing from role selection)
- **Admin Page**: Implement navbar navigation between:
  - Client dashboard view
  - Generate avatar endpoint (`/generate-avatar`)
- **Navigation**: Remove consolidated layout, implement role-specific navigation
- **Route Protection**: Maintain existing middleware-based route protection
- **Role Selection**: Route users directly to role-specific pages (`/talent`, `/client`, `/admin`)

#### Non-Functional Requirements:
- Maintain existing authentication and role-based access control
- Preserve all existing functionality and data flows
- Ensure smooth page transitions and loading states
- Follow established component composition patterns
- Maintain responsive design across all pages
- Preserve existing error handling and validation

#### Validation & Error Handling:
- Handle navigation state management for admin navbar
- Maintain route protection for unauthorized access
- Preserve authentication state across page transitions
- Handle loading states during page navigation
- Ensure proper error boundaries for each page

## Success Criteria
- Home page displays only landing content without role-specific features
- Login page provides dedicated authentication interface
- Talent page shows onboarding wizard components
- Client page shows onboarding form components
- Admin page includes functional navbar for switching between views
- Role selection routes users directly to appropriate pages (`/talent`, `/client`, `/admin`)
- All existing functionality preserved and working
- Route protection continues to work correctly
- Navigation is intuitive and role-appropriate
- Page transitions are smooth and responsive

## Test Plan

### Automated Tests
- `test_home_page_restructure`: Verify home page shows only landing content → No role-specific features on main page
- `test_login_page_dedicated`: Verify dedicated login page works → Authentication flows correctly
- `test_talent_page_onboarding`: Verify talent page shows onboarding → Talent onboarding wizard displays correctly
- `test_client_page_onboarding`: Verify client page shows onboarding → Client onboarding forms display correctly
- `test_admin_navbar`: Verify admin navbar functionality → Can switch between client dashboard and avatar generation
- `test_route_protection`: Verify route protection still works → Unauthorized access properly blocked
- `test_navigation_state`: Verify navigation state management → Admin navbar state persists correctly
- `test_page_transitions`: Verify smooth page transitions → Loading states and navigation work properly

📁 Test file: `__tests__/layout-restructure.test.ts`

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
3. **Admin Account**: `admin-test@example.com` (or your third test email)
4. **Google OAuth**: Use your Google account for OAuth testing

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

### Phase 2: Home Page Restructure Testing

#### 2.1 Test Home Page (Unauthenticated)
- [x] **Navigate to**: `http://localhost:3000`
- [x] **Expected**: Should show clean landing page with only:
  - [x] Hero section with "License Iconic Personalities as AI Avatars"
  - [x] "Get Started" button
  - [x] Sample avatar carousel
  - [x] Features section
  - [x] **NO role-specific dashboard content**
  - [x] **NO admin navigation**
  - [x] **NO talent/client onboarding components**
- [x] **Verify**: No NEXT_REDIRECT errors in browser console (F12 → Console tab)
- [x] **Check**: Page loads without any JavaScript errors

#### 2.2 Test Home Page (Authenticated)
- [x] **Sign in** to the application
- [x] **Navigate to**: `http://localhost:3000`
- [x] **Expected**: Should show clean landing page with:
  - [x] Same content as unauthenticated version
  - [x] "Go to Dashboard" button instead of "Get Started"
  - [x] **NO role-specific dashboard content**
  - [x] **NO admin navigation**
- [x] **Verify**: No NEXT_REDIRECT errors in browser console
- [x] **Check**: Button should link to role selection if no role assigned

### Phase 3: Dedicated Login Page Testing

#### 3.1 Test Login Page Access
- [x] **Navigate to**: `http://localhost:3000/login`
- [x] **Expected**: Should show dedicated login page with:
  - [x] Clerk authentication components
  - [x] Email/password login form
  - [x] Google OAuth button
  - [x] Microsoft OAuth button
  - [x] "Sign up" link
  - [x] Clean, focused login interface
- [x] **Verify**: No dashboard content or navigation on login page
- [x] **Check**: Authentication flows work correctly

#### 3.2 Test Login Flow
- [x] **On Login Page**: Enter valid credentials
- [x] **Expected**: Should authenticate and redirect to appropriate page
- [x] **Verify**: Login process is smooth and error-free
- [x] **Check**: No role-specific content appears during login

### Phase 4: Talent Page Onboarding Testing

#### 4.1 Test Talent Page Access
- [x] **Sign in and select "Talent & Creators" role**
- [x] **Navigate to**: `http://localhost:3000/talent`
- [x] **Expected**: Should show talent page with:
  - [x] Talent onboarding wizard components
  - [x] Multi-step onboarding process
  - [x] **NO admin navigation**
  - [x] **NO client dashboard content**
  - [x] **NO home page landing content**
- [x] **Verify**: Page loads without errors
- [x] **Check**: Onboarding wizard functions correctly

#### 4.2 Test Talent Onboarding Flow
- [x] **On Talent Page**: Complete onboarding steps
- [x] **Expected**: Should progress through onboarding wizard
- [x] **Verify**: All onboarding components work properly
- [x] **Check**: No navigation conflicts or layout issues

### Phase 5: Client Page Onboarding Testing

#### 5.1 Test Client Page Access
- [x] **Sign in and select "Brands & Agencies" role**
- [x] **Navigate to**: `http://localhost:3000/client`
- [x] **Expected**: Should show client page with:
  - [x] Client onboarding form components
  - [x] Client-specific forms and fields
  - [x] **NO admin navigation**
  - [x] **NO talent onboarding content**
  - [x] **NO home page landing content**
- [x] **Verify**: Page loads without errors
- [x] **Check**: Client forms function correctly

#### 5.2 Test Client Onboarding Flow
- [x] **On Client Page**: Complete client onboarding forms
- [x] **Expected**: Should progress through client onboarding
- [x] **Verify**: All client form components work properly
- [x] **Check**: No navigation conflicts or layout issues

#### 5.3 Test Client Profile Submission
- [x] **On Client Page**: Fill out all required fields
- [x] **Click**: "Complete Profile Setup" button
- [x] **Expected**: Should show submission confirmation
- [x] **Verify**: Progress indicator updates correctly
- [x] **Check**: User receives confirmation message

#### 5.4 Test Client Dashboard Preview
- [x] **After submission**: Should show sample dashboard
- [x] **Expected**: Dashboard preview with:
  - [x] Sample collaboration opportunities
  - [x] Potential talent matches
  - [x] Project management features
  - [x] "Awaiting approval" status message
- [x] **Verify**: Dashboard is engaging and informative
- [x] **Check**: User understands next steps

### Phase 6: Admin Page Navigation Testing

#### 6.1 Test Admin Page Access
- [x] **Sign in and select "Administrator" role**
- [x] **Navigate to**: `http://localhost:3000/admin`
- [x] **Expected**: Should show admin page with:
  - [x] Admin navbar at the top
  - [x] Two navigation options: "Client Dashboard" and "Generate Avatar"
  - [x] Default view (likely client dashboard)
  - [x] **NO talent onboarding content**
  - [x] **NO home page landing content**
- [x] **Verify**: Page loads without errors
- [x] **Check**: Admin navbar is visible and functional

#### 6.2 Test Admin Navbar - Client Dashboard
- [x] **On Admin Page**: Click "Client Dashboard" in navbar
- [x] **Expected**: Should show client dashboard view with:
  - [x] Client dashboard content
  - [x] Client-specific stats and information
  - [x] Admin navbar remains visible
  - [x] "Client Dashboard" tab highlighted/active
- [x] **Verify**: Client dashboard loads correctly
- [x] **Check**: Navigation state is maintained

#### 6.3 Test Admin Navbar - Generate Avatar
- [x] **On Admin Page**: Click "Generate Avatar" in navbar
- [x] **Expected**: Should show generate avatar interface with:
  - [x] Avatar generation form/interface
  - [x] Avatar generation functionality
  - [x] Admin navbar remains visible
  - [x] "Generate Avatar" tab highlighted/active
- [x] **Verify**: Avatar generation page loads correctly
- [x] **Check**: Navigation state is maintained

#### 6.4 Test Admin Navbar State Persistence
- [x] **On Admin Page**: Switch between "Client Dashboard" and "Generate Avatar"
- [x] **Expected**: Should maintain selected tab state
- [x] **Verify**: Navigation state persists correctly
- [x] **Check**: No state loss during navigation

### Phase 7: Route Protection Testing

#### 7.1 Test Route Protection - Talent User
- [x] **Sign in and select "Talent & Creators" role**
- [x] **Try to access**: `http://localhost:3000/client`
- [x] **Expected**: Should redirect to `/talent` (unauthorized access blocked)
- [x] **Try to access**: `http://localhost:3000/admin`
- [x] **Expected**: Should redirect to `/talent` (unauthorized access blocked)
- [x] **Verify**: Route protection still works correctly

#### 7.2 Test Route Protection - Client User
- [x] **Sign in and select "Brands & Agencies" role**
- [x] **Try to access**: `http://localhost:3000/talent`
- [x] **Expected**: Should redirect to `/client` (unauthorized access blocked)
- [x] **Try to access**: `http://localhost:3000/admin`
- [x] **Expected**: Should redirect to `/client` (unauthorized access blocked)
- [x] **Verify**: Route protection still works correctly

#### 7.3 Test Route Protection - Admin User
- [x] **Sign in and select "Administrator" role**
- [x] **Navigate to**: `http://localhost:3000/talent`
- [x] **Expected**: Should be accessible (admin can access all)
- [x] **Navigate to**: `http://localhost:3000/client`
- [x] **Expected**: Should be accessible (admin can access all)
- [x] **Navigate to**: `http://localhost:3000/admin`
- [x] **Expected**: Should be accessible
- [x] **Verify**: Admin can access all pages

### Phase 8: Page Transitions Testing

#### 8.1 Test Page Loading Performance
- [x] **Navigate to each page**: Home → Login → Talent → Client → Admin
- [x] **Expected**: Pages should load within 2-3 seconds
- [x] **Check**: No long loading times or hanging requests
- [x] **Verify**: Smooth transitions between pages

#### 8.2 Test Navigation State Management
- [x] **On Admin Page**: Switch between navbar tabs multiple times
- [x] **Expected**: Navigation state should persist correctly
- [x] **Check**: No state loss or navigation conflicts
- [x] **Verify**: Admin navbar functions reliably

#### 8.3 Test Browser Back/Forward
- [x] **Navigate through multiple pages**
- [x] **Use browser back button**
- [x] **Expected**: Should navigate back correctly
- [x] **Use browser forward button**
- [x] **Expected**: Should navigate forward correctly
- [x] **Verify**: Browser navigation works properly

### Phase 9: Error Handling Testing

#### 9.1 Test Browser Console for Errors
- [x] **Open browser dev tools** (F12 or right-click → Inspect)
- [x] **Go to Console tab**
- [x] **Navigate through all pages**: Home → Login → Talent → Client → Admin
- [x] **Expected**: No JavaScript errors or NEXT_REDIRECT errors
- [x] **Check**: No failed network requests in Network tab

#### 9.2 Test Network Requests
- [x] **In dev tools, go to Network tab**
- [x] **Navigate through the application**
- [x] **Expected**: All API calls should succeed (200 status)
- [x] **Check**: No 404, 500, or other error responses

#### 9.3 Test Error Boundaries
- [x] **Navigate to each page**
- [x] **Expected**: No error boundary triggers
- [x] **Check**: All pages render correctly
- [x] **Verify**: Error handling works properly

### Phase 10: Cross-Browser Testing

#### 10.1 Test in Chrome
- [x] **Open Chrome browser**
- [x] **Complete all test scenarios above**
- [x] **Expected**: All functionality works as expected

#### 10.2 Test in Firefox
- [x] **Open Firefox browser**
- [x] **Complete all test scenarios above**
- [x] **Expected**: All functionality works as expected

#### 10.3 Test in Safari
- [x] **Open Safari browser**
- [x] **Complete all test scenarios above**
- [x] **Expected**: All functionality works as expected

### Phase 11: Mobile Responsiveness Testing

#### 11.1 Test on Mobile Device
- [x] **Open application on mobile device or use browser dev tools mobile view**
- [x] **Test home page**: Should be responsive and usable
- [x] **Test login page**: Should be responsive and usable
- [x] **Test talent page**: Should be responsive and usable
- [x] **Test client page**: Should be responsive and usable
- [x] **Test admin page**: Should be responsive and usable
- [x] **Test admin navbar**: Should work on mobile
- [x] **Expected**: All functionality works on mobile devices

### Phase 12: Final Verification

#### 12.1 Complete End-to-End Flow
- [x] **Sign up as new user**
- [x] **Select role** (any role)
- [x] **Access appropriate page**
- [x] **Test navigation and functionality**
- [x] **Sign out**
- [x] **Sign back in**
- [x] **Expected**: Complete flow works without errors

#### 12.2 Verify All Requirements Met
- [x] **Home page restructure**: ✅ Working
- [x] **Dedicated login page**: ✅ Working
- [x] **Talent page onboarding**: ✅ Working
- [x] **Client page onboarding**: ✅ Working
- [x] **Admin navbar navigation**: ✅ Working
- [x] **Route protection**: ✅ Working
- [x] **Page transitions**: ✅ Working
- [x] **Mobile responsiveness**: ✅ Working
- [x] **Cross-browser compatibility**: ✅ Working

---

## Test Checklist Summary

### ✅ Environment Setup
- [x] Backend server running on port 3001
- [x] Frontend server running on port 3000
- [x] Environment variables configured
- [x] Database connection working

### ✅ Home Page Restructure
- [x] Home page shows only landing content
- [x] No role-specific features on main page
- [x] No admin navigation on home page
- [x] No onboarding components on home page

### ✅ Dedicated Login Page
- [x] Login page is separate and focused
- [x] Authentication flows work correctly
- [x] No dashboard content on login page
- [x] Login process is smooth

### ✅ Talent Page
- [x] Talent page shows onboarding wizard
- [x] No admin navigation on talent page
- [x] No client content on talent page
- [x] Onboarding wizard functions correctly

### ✅ Client Page
- [x] Client page shows onboarding forms
- [x] No admin navigation on client page
- [x] No talent content on client page
- [x] Client forms function correctly
- [x] Profile submission shows confirmation
- [x] Progress indicator updates correctly
- [x] Sample dashboard preview displayed after submission
- [x] User receives clear next steps guidance

### ✅ Admin Page
- [x] Admin page has navbar navigation
- [x] Can switch between client dashboard and avatar generation
- [x] Navigation state persists correctly
- [x] Admin navbar works on mobile

### ✅ Route Protection
- [x] Route protection still works correctly
- [x] Unauthorized access properly blocked
- [x] Admin can access all routes
- [x] Role-based access enforced

### ✅ Page Transitions
- [x] Smooth page transitions
- [x] Fast loading times
- [x] No navigation conflicts
- [x] Browser back/forward works

### ✅ Error Handling
- [x] No JavaScript errors in console
- [x] No failed network requests
- [x] Error boundaries work properly
- [x] Graceful error handling

### ✅ User Experience
- [x] Mobile responsive design
- [x] Cross-browser compatibility
- [x] Intuitive navigation
- [x] Consistent user experience

## Dependencies
- Depends on: PON-50 (role-based routing and access control)
- Requires: Existing onboarding components from talent-onboarding-flow
- Requires: Existing client onboarding form components
- Requires: Generate avatar endpoint functionality
- Requires: Current authentication system (Clerk + Supabase)

## Suggested Implementation Plan
1. Create dedicated page components for each role section
2. Extract current page content into appropriate role-specific pages
3. Implement admin navbar component with navigation state management
4. Update routing to use dedicated pages instead of consolidated layout
5. Test route protection with new page structure
6. Verify all existing functionality works with new layout
7. Update navigation components and links
8. Test page transitions and loading states

## Effort Estimate
- Estimated effort: **3 hours**
- Assumes existing authentication and role-based routing is working
- Includes component extraction, navigation implementation, and testing
- Includes preserving all existing functionality and data flows

## Priority & Impact
- Priority: **High**
- Rationale: Improves user experience and navigation clarity, enables proper role-based feature access

## Acceptance Checklist
- [x] Home page restructured to show only landing content
- [x] Dedicated login page implemented and functional
- [x] Talent page displays onboarding wizard components
- [x] Client page displays onboarding form components
- [x] Client profile submission shows confirmation and progress updates
- [x] Client dashboard preview displayed after submission with clear next steps
- [x] Admin page includes functional navbar navigation
- [x] Admin can switch between client dashboard and avatar generation
- [x] All existing functionality preserved and working
- [x] Route protection continues to work correctly
- [x] Navigation is intuitive and role-appropriate
- [x] Page transitions are smooth and responsive
- [x] Loading states implemented for all pages
- [x] Error handling preserved across all pages
- [x] Jest tests written and passing
- [x] Manual testing completed for all user flows

## Links & References
- Current Implementation: `src/app/page.tsx`
- Role-based Routing: PON-50 implementation
- Existing Components: `src/components/OnboardingWizard.tsx`
- Generate Avatar: `src/app/generate-avatar/page.tsx`
- Linear Project: `Ponte AI Marketplace Authentication System`
- Related tickets: PON-50 (role-based routing), PON-51 (onboarding integration), PON-52 (testing framework) 