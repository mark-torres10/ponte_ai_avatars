# Convert Home Page to Public Landing Page

## Ticket Overview
**Goal**: Transform the home page ('/') from redirecting authenticated users to their dashboards into a public landing page accessible to all visitors.

## Problem Statement
Currently, authenticated users are automatically redirected from '/' to their role-based dashboards via middleware. This prevents them from seeing the marketing landing page, missing opportunities for engagement and feature discovery.

## Success Criteria
1. ✅ All users (authenticated and unauthenticated) can access and view the landing page at '/'
2. ✅ Unauthenticated users see clear Login/Signup options and "Get Started" leads to login
3. ✅ Authenticated users see the landing page first, and "Get Started" redirects them to appropriate dashboard
4. ✅ No breaking changes to existing authentication or onboarding flows
5. ✅ Clean header design maintained
6. ✅ Build succeeds with `npm run build`

## Technical Implementation

### 1. Middleware Changes (`src/middleware.ts`)
- **Remove lines 55-95**: Delete the root page redirect logic that sends authenticated users to dashboards
- **Keep all other protections**: Dashboard routes (/talent, /client, /admin) remain protected
- **Preserve auth flows**: Role-selection and onboarding flows unchanged

### 2. Landing Page CTA Logic (`src/app/page.tsx`)
- **Update "Get Started" button logic**: For authenticated users, determine their role and redirect to appropriate dashboard
- **Keep existing UI**: Header already has proper conditional display for auth states
- **Maintain design**: No visual changes needed, current design follows landing page best practices

### 3. Testing Requirements
- **Unauthenticated flow**: Visitor → Landing page → Login → Role selection → Dashboard
- **Authenticated flow**: User → Landing page → Get Started → Appropriate dashboard
- **Protected routes**: Ensure dashboard routes still require proper authentication

## Files to Modify
1. `/src/middleware.ts` - Remove root redirect logic
2. `/src/app/page.tsx` - Update "Get Started" CTA logic for authenticated users

## Acceptance Criteria
- [ ] Unauthenticated users can view landing page and access login via header or "Get Started"
- [ ] Authenticated users can view landing page and are routed to correct dashboard via "Get Started"
- [ ] All existing auth protections remain functional
- [ ] No console errors or TypeScript issues
- [ ] `npm run build` completes successfully
- [ ] Mobile responsive design maintained

## Implementation Notes
- Current landing page content already follows best practices from landing page playbook
- No content changes needed - focus on routing behavior only
- Preserve existing Clerk authentication integration
- Maintain clean, minimal header design

## Risk Mitigation
- Test both user flows thoroughly before deployment
- Ensure existing users aren't confused by behavior change
- Verify no auth bypass vulnerabilities introduced
