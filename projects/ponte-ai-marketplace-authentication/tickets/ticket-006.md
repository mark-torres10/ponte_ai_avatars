# PON-53: Restructure app layout with dedicated pages and admin navigation

## Context & Motivation
The current app has everything consolidated on the main page, but we need to restructure the layout to provide dedicated pages for each user role with proper navigation. This ticket moves each section to its own component/page and implements a navbar for admin users to switch between client dashboard and avatar generation. This restructuring improves user experience, navigation clarity, and role-based feature access.

Reference: Current implementation in `src/app/page.tsx` and role-based routing from PON-50

## Detailed Description & Requirements

#### Functional Requirements:
- **Home Page**: Clean main homepage with landing content only
- **Login Page**: Dedicated login page with Clerk authentication
- **Talent Page**: Display talent onboarding wizard components
- **Client Page**: Display client onboarding form components  
- **Admin Page**: Implement navbar navigation between:
  - Client dashboard view
  - Generate avatar endpoint (`/generate-avatar`)
- **Navigation**: Remove consolidated layout, implement role-specific navigation
- **Route Protection**: Maintain existing middleware-based route protection

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
- [ ] **Navigate to**: `http://localhost:3000`
- [ ] **Expected**: Should show clean landing page with only:
  - [ ] Hero section with "License Iconic Personalities as AI Avatars"
  - [ ] "Get Started" button
  - [ ] Sample avatar carousel
  - [ ] Features section
  - [ ] **NO role-specific dashboard content**
  - [ ] **NO admin navigation**
  - [ ] **NO talent/client onboarding components**
- [ ] **Verify**: No NEXT_REDIRECT errors in browser console (F12 → Console tab)
- [ ] **Check**: Page loads without any JavaScript errors

#### 2.2 Test Home Page (Authenticated)
- [ ] **Sign in** to the application
- [ ] **Navigate to**: `http://localhost:3000`
- [ ] **Expected**: Should show clean landing page with:
  - [ ] Same content as unauthenticated version
  - [ ] "Go to Dashboard" button instead of "Get Started"
  - [ ] **NO role-specific dashboard content**
  - [ ] **NO admin navigation**
- [ ] **Verify**: No NEXT_REDIRECT errors in browser console
- [ ] **Check**: Button should link to role selection if no role assigned

### Phase 3: Dedicated Login Page Testing

#### 3.1 Test Login Page Access
- [ ] **Navigate to**: `http://localhost:3000/login`
- [ ] **Expected**: Should show dedicated login page with:
  - [ ] Clerk authentication components
  - [ ] Email/password login form
  - [ ] Google OAuth button
  - [ ] Microsoft OAuth button
  - [ ] "Sign up" link
  - [ ] Clean, focused login interface
- [ ] **Verify**: No dashboard content or navigation on login page
- [ ] **Check**: Authentication flows work correctly

#### 3.2 Test Login Flow
- [ ] **On Login Page**: Enter valid credentials
- [ ] **Expected**: Should authenticate and redirect to appropriate page
- [ ] **Verify**: Login process is smooth and error-free
- [ ] **Check**: No role-specific content appears during login

### Phase 4: Talent Page Onboarding Testing

#### 4.1 Test Talent Page Access
- [ ] **Sign in and select "Talent & Creators" role**
- [ ] **Navigate to**: `http://localhost:3000/talent`
- [ ] **Expected**: Should show talent page with:
  - [ ] Talent onboarding wizard components
  - [ ] Multi-step onboarding process
  - [ ] **NO admin navigation**
  - [ ] **NO client dashboard content**
  - [ ] **NO home page landing content**
- [ ] **Verify**: Page loads without errors
- [ ] **Check**: Onboarding wizard functions correctly

#### 4.2 Test Talent Onboarding Flow
- [ ] **On Talent Page**: Complete onboarding steps
- [ ] **Expected**: Should progress through onboarding wizard
- [ ] **Verify**: All onboarding components work properly
- [ ] **Check**: No navigation conflicts or layout issues

### Phase 5: Client Page Onboarding Testing

#### 5.1 Test Client Page Access
- [ ] **Sign in and select "Brands & Agencies" role**
- [ ] **Navigate to**: `http://localhost:3000/client`
- [ ] **Expected**: Should show client page with:
  - [ ] Client onboarding form components
  - [ ] Client-specific forms and fields
  - [ ] **NO admin navigation**
  - [ ] **NO talent onboarding content**
  - [ ] **NO home page landing content**
- [ ] **Verify**: Page loads without errors
- [ ] **Check**: Client forms function correctly

#### 5.2 Test Client Onboarding Flow
- [ ] **On Client Page**: Complete client onboarding forms
- [ ] **Expected**: Should progress through client onboarding
- [ ] **Verify**: All client form components work properly
- [ ] **Check**: No navigation conflicts or layout issues

### Phase 6: Admin Page Navigation Testing

#### 6.1 Test Admin Page Access
- [ ] **Sign in and select "Administrator" role**
- [ ] **Navigate to**: `http://localhost:3000/admin`
- [ ] **Expected**: Should show admin page with:
  - [ ] Admin navbar at the top
  - [ ] Two navigation options: "Client Dashboard" and "Generate Avatar"
  - [ ] Default view (likely client dashboard)
  - [ ] **NO talent onboarding content**
  - [ ] **NO home page landing content**
- [ ] **Verify**: Page loads without errors
- [ ] **Check**: Admin navbar is visible and functional

#### 6.2 Test Admin Navbar - Client Dashboard
- [ ] **On Admin Page**: Click "Client Dashboard" in navbar
- [ ] **Expected**: Should show client dashboard view with:
  - [ ] Client dashboard content
  - [ ] Client-specific stats and information
  - [ ] Admin navbar remains visible
  - [ ] "Client Dashboard" tab highlighted/active
- [ ] **Verify**: Client dashboard loads correctly
- [ ] **Check**: Navigation state is maintained

#### 6.3 Test Admin Navbar - Generate Avatar
- [ ] **On Admin Page**: Click "Generate Avatar" in navbar
- [ ] **Expected**: Should show generate avatar interface with:
  - [ ] Avatar generation form/interface
  - [ ] Avatar generation functionality
  - [ ] Admin navbar remains visible
  - [ ] "Generate Avatar" tab highlighted/active
- [ ] **Verify**: Avatar generation page loads correctly
- [ ] **Check**: Navigation state is maintained

#### 6.4 Test Admin Navbar State Persistence
- [ ] **On Admin Page**: Switch between "Client Dashboard" and "Generate Avatar"
- [ ] **Expected**: Should maintain selected tab state
- [ ] **Verify**: Navigation state persists correctly
- [ ] **Check**: No state loss during navigation

### Phase 7: Route Protection Testing

#### 7.1 Test Route Protection - Talent User
- [ ] **Sign in and select "Talent & Creators" role**
- [ ] **Try to access**: `http://localhost:3000/client`
- [ ] **Expected**: Should redirect to `/talent` (unauthorized access blocked)
- [ ] **Try to access**: `http://localhost:3000/admin`
- [ ] **Expected**: Should redirect to `/talent` (unauthorized access blocked)
- [ ] **Verify**: Route protection still works correctly

#### 7.2 Test Route Protection - Client User
- [ ] **Sign in and select "Brands & Agencies" role**
- [ ] **Try to access**: `http://localhost:3000/talent`
- [ ] **Expected**: Should redirect to `/client` (unauthorized access blocked)
- [ ] **Try to access**: `http://localhost:3000/admin`
- [ ] **Expected**: Should redirect to `/client` (unauthorized access blocked)
- [ ] **Verify**: Route protection still works correctly

#### 7.3 Test Route Protection - Admin User
- [ ] **Sign in and select "Administrator" role**
- [ ] **Navigate to**: `http://localhost:3000/talent`
- [ ] **Expected**: Should be accessible (admin can access all)
- [ ] **Navigate to**: `http://localhost:3000/client`
- [ ] **Expected**: Should be accessible (admin can access all)
- [ ] **Navigate to**: `http://localhost:3000/admin`
- [ ] **Expected**: Should be accessible
- [ ] **Verify**: Admin can access all pages

### Phase 8: Page Transitions Testing

#### 8.1 Test Page Loading Performance
- [ ] **Navigate to each page**: Home → Login → Talent → Client → Admin
- [ ] **Expected**: Pages should load within 2-3 seconds
- [ ] **Check**: No long loading times or hanging requests
- [ ] **Verify**: Smooth transitions between pages

#### 8.2 Test Navigation State Management
- [ ] **On Admin Page**: Switch between navbar tabs multiple times
- [ ] **Expected**: Navigation state should persist correctly
- [ ] **Check**: No state loss or navigation conflicts
- [ ] **Verify**: Admin navbar functions reliably

#### 8.3 Test Browser Back/Forward
- [ ] **Navigate through multiple pages**
- [ ] **Use browser back button**
- [ ] **Expected**: Should navigate back correctly
- [ ] **Use browser forward button**
- [ ] **Expected**: Should navigate forward correctly
- [ ] **Verify**: Browser navigation works properly

### Phase 9: Error Handling Testing

#### 9.1 Test Browser Console for Errors
- [ ] **Open browser dev tools** (F12 or right-click → Inspect)
- [ ] **Go to Console tab**
- [ ] **Navigate through all pages**: Home → Login → Talent → Client → Admin
- [ ] **Expected**: No JavaScript errors or NEXT_REDIRECT errors
- [ ] **Check**: No failed network requests in Network tab

#### 9.2 Test Network Requests
- [ ] **In dev tools, go to Network tab**
- [ ] **Navigate through the application**
- [ ] **Expected**: All API calls should succeed (200 status)
- [ ] **Check**: No 404, 500, or other error responses

#### 9.3 Test Error Boundaries
- [ ] **Navigate to each page**
- [ ] **Expected**: No error boundary triggers
- [ ] **Check**: All pages render correctly
- [ ] **Verify**: Error handling works properly

### Phase 10: Cross-Browser Testing

#### 10.1 Test in Chrome
- [ ] **Open Chrome browser**
- [ ] **Complete all test scenarios above**
- [ ] **Expected**: All functionality works as expected

#### 10.2 Test in Firefox
- [ ] **Open Firefox browser**
- [ ] **Complete all test scenarios above**
- [ ] **Expected**: All functionality works as expected

#### 10.3 Test in Safari
- [ ] **Open Safari browser**
- [ ] **Complete all test scenarios above**
- [ ] **Expected**: All functionality works as expected

### Phase 11: Mobile Responsiveness Testing

#### 11.1 Test on Mobile Device
- [ ] **Open application on mobile device or use browser dev tools mobile view**
- [ ] **Test home page**: Should be responsive and usable
- [ ] **Test login page**: Should be responsive and usable
- [ ] **Test talent page**: Should be responsive and usable
- [ ] **Test client page**: Should be responsive and usable
- [ ] **Test admin page**: Should be responsive and usable
- [ ] **Test admin navbar**: Should work on mobile
- [ ] **Expected**: All functionality works on mobile devices

### Phase 12: Final Verification

#### 12.1 Complete End-to-End Flow
- [ ] **Sign up as new user**
- [ ] **Select role** (any role)
- [ ] **Access appropriate page**
- [ ] **Test navigation and functionality**
- [ ] **Sign out**
- [ ] **Sign back in**
- [ ] **Expected**: Complete flow works without errors

#### 12.2 Verify All Requirements Met
- [ ] **Home page restructure**: ✅ Working
- [ ] **Dedicated login page**: ✅ Working
- [ ] **Talent page onboarding**: ✅ Working
- [ ] **Client page onboarding**: ✅ Working
- [ ] **Admin navbar navigation**: ✅ Working
- [ ] **Route protection**: ✅ Working
- [ ] **Page transitions**: ✅ Working
- [ ] **Mobile responsiveness**: ✅ Working
- [ ] **Cross-browser compatibility**: ✅ Working

---

## Test Checklist Summary

### ✅ Environment Setup
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 3000
- [ ] Environment variables configured
- [ ] Database connection working

### ✅ Home Page Restructure
- [ ] Home page shows only landing content
- [ ] No role-specific features on main page
- [ ] No admin navigation on home page
- [ ] No onboarding components on home page

### ✅ Dedicated Login Page
- [ ] Login page is separate and focused
- [ ] Authentication flows work correctly
- [ ] No dashboard content on login page
- [ ] Login process is smooth

### ✅ Talent Page
- [ ] Talent page shows onboarding wizard
- [ ] No admin navigation on talent page
- [ ] No client content on talent page
- [ ] Onboarding wizard functions correctly

### ✅ Client Page
- [ ] Client page shows onboarding forms
- [ ] No admin navigation on client page
- [ ] No talent content on client page
- [ ] Client forms function correctly

### ✅ Admin Page
- [ ] Admin page has navbar navigation
- [ ] Can switch between client dashboard and avatar generation
- [ ] Navigation state persists correctly
- [ ] Admin navbar works on mobile

### ✅ Route Protection
- [ ] Route protection still works correctly
- [ ] Unauthorized access properly blocked
- [ ] Admin can access all routes
- [ ] Role-based access enforced

### ✅ Page Transitions
- [ ] Smooth page transitions
- [ ] Fast loading times
- [ ] No navigation conflicts
- [ ] Browser back/forward works

### ✅ Error Handling
- [ ] No JavaScript errors in console
- [ ] No failed network requests
- [ ] Error boundaries work properly
- [ ] Graceful error handling

### ✅ User Experience
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility
- [ ] Intuitive navigation
- [ ] Consistent user experience

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
- [ ] Home page restructured to show only landing content
- [ ] Dedicated login page implemented and functional
- [ ] Talent page displays onboarding wizard components
- [ ] Client page displays onboarding form components
- [ ] Admin page includes functional navbar navigation
- [ ] Admin can switch between client dashboard and avatar generation
- [ ] All existing functionality preserved and working
- [ ] Route protection continues to work correctly
- [ ] Navigation is intuitive and role-appropriate
- [ ] Page transitions are smooth and responsive
- [ ] Loading states implemented for all pages
- [ ] Error handling preserved across all pages
- [ ] Jest tests written and passing
- [ ] Manual testing completed for all user flows

## Links & References
- Current Implementation: `src/app/page.tsx`
- Role-based Routing: PON-50 implementation
- Existing Components: `src/components/OnboardingWizard.tsx`
- Generate Avatar: `src/app/generate-avatar/page.tsx`
- Linear Project: `Ponte AI Marketplace Authentication System`
- Related tickets: PON-50 (role-based routing), PON-51 (onboarding integration), PON-52 (testing framework) 