# Set up Clerk authentication integration

## Context & Motivation
Ponte AI's marketplace app needs a comprehensive authentication system to support role-based access control for Talent, Client, and Admin users. This ticket establishes the foundational Clerk integration that will enable user signup, login, and role management. This is the first step in implementing the authentication system and is required before any other authentication-related features can be built.

Reference: `spec.md` - Section 7.1 Clerk Integration Requirements

## Detailed Description & Requirements

#### Functional Requirements:
- Install and configure `@clerk/nextjs@latest` package
- Create `middleware.ts` using `clerkMiddleware()` from `@clerk/nextjs/server`
- Wrap app with `<ClerkProvider>` in `app/layout.tsx`
- Configure environment variables for Clerk integration
- Set up Clerk hosted components for authentication UI
- Enable email, Google, and Microsoft authentication providers

#### Non-Functional Requirements:
- Follow Next.js App Router patterns (not pages-based approach)
- Use only current Clerk APIs (avoid deprecated `authMiddleware()`)
- Ensure proper TypeScript integration
- Maintain existing Ponte AI design patterns

#### Validation & Error Handling:
- Validate environment variable configuration
- Handle Clerk initialization errors gracefully
- Ensure middleware properly protects routes
- Test authentication flow end-to-end

## Success Criteria
- Clerk package is installed and configured correctly
- Middleware is properly set up with correct matcher patterns
- App is wrapped with ClerkProvider in layout
- Environment variables are configured and validated
- Authentication providers (email, Google, Microsoft) are enabled
- Basic signup/login flow works without errors
- TypeScript compilation passes without errors

## Test Plan
- `test_clerk_installation`: Verify `@clerk/nextjs` package is installed → Package.json includes correct version
- `test_middleware_setup`: Verify middleware.ts exists and uses `clerkMiddleware()` → File exists with correct imports
- `test_provider_wrapping`: Verify ClerkProvider wraps app in layout → Layout.tsx includes ClerkProvider
- `test_environment_variables`: Verify environment variables are set → .env.local contains required keys
- `test_authentication_flow`: Test basic signup/login → Users can create accounts and log in
- `test_provider_configuration`: Verify OAuth providers are enabled → Google and Microsoft sign-in work

📁 Test file: `__tests__/clerk-integration.test.ts`

## Dependencies
- Requires: Next.js App Router setup
- Requires: TypeScript configuration
- Requires: Clerk account and API keys
- Requires: Google OAuth credentials
- Requires: Microsoft OAuth credentials

## Suggested Implementation Plan
1. Install `@clerk/nextjs@latest` package
2. Create environment variables in `.env.local`
3. Create `middleware.ts` with `clerkMiddleware()` and proper matcher
4. Update `app/layout.tsx` to wrap with `<ClerkProvider>`
5. Configure OAuth providers in Clerk dashboard
6. Test basic authentication flow
7. Add TypeScript types and validation

## Effort Estimate
- Estimated effort: **3 hours**
- Assumes Next.js App Router is already set up
- Assumes Clerk account and OAuth credentials are available
- Includes testing and validation time

## Priority & Impact
- Priority: **High**
- Rationale: Foundation for entire authentication system, blocks all other auth-related tickets

## Acceptance Checklist
- [ ] `@clerk/nextjs@latest` package installed
- [ ] Environment variables configured in `.env.local`
- [ ] `middleware.ts` created with `clerkMiddleware()`
- [ ] `app/layout.tsx` wrapped with `<ClerkProvider>`
- [ ] OAuth providers (Google, Microsoft) configured in Clerk dashboard
- [ ] Basic signup/login flow tested and working
- [ ] TypeScript compilation passes without errors
- [ ] Jest tests written and passing
- [ ] Code follows Next.js App Router patterns
- [ ] No deprecated Clerk APIs used

## Links & References
- Specification: `spec.md`
- Clerk Documentation: https://clerk.com/docs/quickstarts/nextjs
- Linear Project: `Ponte AI Marketplace Authentication System`
- Related tickets: `ticket-002` (Supabase integration), `ticket-003` (role-based routing) 