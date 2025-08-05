# 🧾 Spec: Ponte AI Marketplace App Redesign with Authentication

## 1. Problem Statement
Ponte AI needs a comprehensive authentication system for their marketplace app to support role-based access control for Talent, Client, and Admin users. Currently, the app lacks any authentication mechanism, making it impossible to differentiate between user types and provide appropriate access to different features. This MVP will establish the foundational authentication infrastructure using Clerk and Supabase integration.

**Who is affected**: All users of the Ponte AI marketplace (Talent, Client, Admin)
**Why now**: Core functionality needed for marketplace operations
**Strategic link**: Enables proper user management and role-based feature access

## 2. Desired Outcomes & Metrics
**Primary Outcomes**:
- Users can sign up and log in with email, Google, and Microsoft authentication
- Role-based access control prevents unauthorized access to different sections
- Separate onboarding flows guide users through appropriate setup
- Authentication state is properly managed between Clerk and Supabase

**Success Metrics**:
- ✅ Users can successfully create accounts as Talent or Client
- ✅ Users are redirected to appropriate dashboards based on role
- ✅ Role-based route protection prevents unauthorized access
- ✅ Authentication flow works end-to-end (signup → onboarding → dashboard)
- ✅ User data is properly stored in Supabase users table
- ✅ Login/logout functionality works correctly

## 3. In Scope / Out of Scope

**In Scope**:
- Clerk authentication integration with email, Google, and Microsoft providers
- Supabase users table creation and management
- Role-based route protection (/talent, /client, /admin)
- **Talent Onboarding**: Use existing multi-step wizard from `/projects/talent-onboarding-flow/`
- **Client Onboarding**: Use existing placeholder form components
- Basic "Hello World" dashboard pages for each role
- Authentication state management and synchronization
- Comprehensive error handling for auth failures
- **Jest testing framework** with comprehensive testing strategy
- **Component composition patterns** and reusability guidelines

**Out of Scope**:
- Admin role implementation (future phase)
- Storage of detailed onboarding form data (future enhancement)
- Advanced user profile management
- Password reset flows (handled by Clerk)
- Email verification flows (handled by Clerk)
- Performance optimization beyond MVP requirements
- Advanced security features beyond basic role protection

## 4. Stakeholders & Dependencies

**Stakeholders**:
- **Primary**: Ponte AI development team
- **Users**: Talent and Client users of the marketplace
- **Future**: Admin users (not in MVP)

**Dependencies**:
- **Clerk**: Authentication provider setup and configuration
- **Supabase**: Database setup and user table creation
- **Next.js**: Frontend framework for implementation
- **Tailwind + shadcn-ui**: UI component library
- **Existing Ponte AI design patterns**: Visual consistency

**External Services**:
- Clerk authentication service
- Supabase database service
- Google OAuth (for sign-in)
- Microsoft OAuth (for sign-in)

## 5. Risks / Unknowns

**Technical Risks**:
- Clerk-Supabase integration complexity
- Role synchronization between Clerk and Supabase
- OAuth provider configuration and testing
- Route protection implementation edge cases

**Known Unknowns**:
- Performance impact of authentication checks
- Specific Clerk webhook configuration details
- Advanced component state management requirements

**Mitigation Strategies**:
- Use Clerk's hosted components to reduce integration complexity
- Implement comprehensive error handling with specific error types
- Leverage existing onboarding components from talent-onboarding-flow project
- Comprehensive Jest testing strategy with Clerk webhook testing
- Component composition patterns for reusability and maintainability

## 6. UX Notes & Accessibility

**User Journey Changes**:
- **Before**: No authentication, direct access to all features
- **After**: Authentication required, role-based access to specific sections

**New User Flows**:
1. **Unauthenticated User**: "/" → "/login" → signup → role selection → onboarding → dashboard
2. **Authenticated User**: "/" → role-appropriate dashboard
3. **Role-Based Access**: Users can only access their designated section

**UI/UX Requirements**:
- Use Clerk's hosted components for authentication UI
- Follow existing Ponte AI design patterns
- Implement Tailwind CSS + shadcn-ui for custom components
- **Talent Onboarding**: Use existing multi-step wizard from talent-onboarding-flow project
- **Client Onboarding**: Use existing placeholder form components
- Responsive design for mobile and desktop

**Accessibility**:
- Ensure Clerk components meet accessibility standards
- Keyboard navigation support for onboarding flows
- Screen reader compatibility for role selection and onboarding
- Clear error messages and validation feedback

## 7. Technical Notes

**Architecture**:
- **Frontend**: Next.js with App Router
- **Authentication**: Clerk (hosted components)
- **Backend**: Supabase for user data management
- **Styling**: Tailwind CSS + shadcn-ui components
- **Database**: Supabase PostgreSQL with users table

**Database Schema**:
```sql
users table:
- id UUID PRIMARY KEY
- clerk_user_id TEXT UNIQUE NOT NULL
- email TEXT UNIQUE
- role ENUM('admin', 'client', 'talent')
- created_at TIMESTAMP
```

**Key Components**:
- Authentication middleware for route protection
- Role-based redirect logic
- Onboarding wizard components
- User data synchronization between Clerk and Supabase

**Implementation Approach**:
- Use Clerk's hosted components for auth UI
- Implement custom onboarding wizards
- Create middleware for route protection
- Set up Supabase triggers for user data synchronization

## 7.1 Clerk Integration Requirements

**CRITICAL**: All Clerk integration must follow the current Next.js App Router approach:

### Required Setup Steps:
1. **Install**: `@clerk/nextjs@latest`
2. **Middleware**: Create `middleware.ts` using `clerkMiddleware()` from `@clerk/nextjs/server`
3. **Provider**: Wrap app with `<ClerkProvider>` in `app/layout.tsx`
4. **Components**: Use Clerk-provided components (`<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>`)

### Environment Variables:
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmFuY3ktbGFkeWJpcmQtOTMuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_Thw6lj8UMU7HqrmPbj2ZbsNkZdaSdQnuby8BtsHbYF
```

### Required Code Patterns:

**middleware.ts**:
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

**app/layout.tsx**:
```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### Forbidden Patterns (DO NOT USE):
- ❌ `authMiddleware()` (deprecated)
- ❌ `_app.tsx` or pages-based approach
- ❌ Older environment variable patterns
- ❌ Deprecated APIs (`withAuth`, `currentUser` from older versions)

### Verification Checklist:
- [ ] Uses `clerkMiddleware()` in `middleware.ts`
- [ ] Wraps app with `<ClerkProvider>` in `app/layout.tsx`
- [ ] Imports only from `@clerk/nextjs` or `@clerk/nextjs/server`
- [ ] Follows App Router structure (not `_app.tsx` or `pages/`)

## 7.2 Testing Strategy

**Framework**: Jest with React Testing Library

### Testing Approach:
1. **Unit Testing**: Individual components and utilities
2. **Integration Testing**: Authentication flows and role-based routing
3. **E2E Testing**: Complete user journeys with Playwright
4. **Clerk Webhook Testing**: Mock Clerk webhook endpoints and test user event handling

### Test Coverage Requirements:
- **Authentication Components**: 90% coverage
- **Role-Based Routing**: 100% coverage
- **Onboarding Flows**: 85% coverage
- **Error Handling**: 100% coverage

### Testing Strategy for Clerk Integration:
- Mock Clerk authentication responses
- Test webhook handling for user events
- Validate role synchronization between Clerk and Supabase
- Test authentication state management

### Testing Strategy for Role-Based Routing:
- Test route protection for unauthorized access
- Validate role-based redirects
- Test middleware configuration
- Verify role assignment and validation

## 7.3 Component Composition Patterns

### Component Architecture:
- **Compound Components**: Use compound component patterns for complex UI elements
- **Render Props**: For flexible component composition
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Higher-Order Components**: For cross-cutting concerns like authentication

### Component Reusability Guidelines:
1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Define clear, typed interfaces for all props
3. **Default Props**: Provide sensible defaults for optional props
4. **Composition over Inheritance**: Prefer composition patterns
5. **Custom Hooks**: Extract stateful logic into reusable hooks

### State Management Strategy:
- **Local State**: Use React useState for component-specific state
- **Context API**: For authentication state and user role management
- **Custom Hooks**: For complex state logic (useAuth, useUserRole)
- **Zustand**: For global state management if needed (future enhancement)

### Component Patterns:
```typescript
// Compound Component Pattern Example
<OnboardingWizard>
  <OnboardingWizard.Step title="Basic Info">
    <BasicInfoForm />
  </OnboardingWizard.Step>
  <OnboardingWizard.Step title="Media Upload">
    <MediaUploadForm />
  </OnboardingWizard.Step>
</OnboardingWizard>

// Custom Hook Pattern Example
const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { role } = useUserRole(user?.id);
  return { user, isLoaded, role, isAuthenticated: !!user };
};
```

## 7.4 Existing Component Integration

### Talent Onboarding Flow:
- **Source**: `/projects/talent-onboarding-flow/`
- **Components**: Use existing `OnboardingWizard`, `BasicInfoStep`, `MediaUploadStep`, etc.
- **Integration**: Integrate with authentication flow and role management
- **Modifications**: Add authentication state management and role assignment

### Client Onboarding Flow:
- **Source**: Existing placeholder form components
- **Integration**: Connect with authentication and role management
- **Enhancement**: Add role-specific form fields and validation

### Component Reuse Strategy:
1. **Extract Common Logic**: Create shared hooks for form handling
2. **Role-Specific Components**: Extend existing components with role-based features
3. **Authentication Integration**: Add auth state management to existing components
4. **Error Handling**: Enhance existing components with comprehensive error handling

## 8. Compliance, Cost, GTM

**Compliance**:
- User data handling follows Clerk and Supabase privacy policies
- Role-based access control for data protection
- No sensitive data collection in MVP onboarding flows

**Cost Considerations**:
- Clerk pricing based on user volume
- Supabase usage costs for database operations
- No additional infrastructure costs beyond existing setup

**GTM Implications**:
- Enables proper user segmentation for marketing
- Foundation for future feature rollouts
- Improved user experience with proper authentication

## 9. Success Criteria

**Functional Requirements**:
- [ ] Users can sign up with email, Google, or Microsoft
- [ ] Users can select role (Talent or Client) during signup
- [ ] Multi-step onboarding wizards work for both user types
- [ ] Users are redirected to appropriate dashboards based on role
- [ ] Route protection prevents unauthorized access
- [ ] Login/logout functionality works correctly
- [ ] User data is properly stored in Supabase
- [ ] Authentication state is synchronized between Clerk and Supabase

**Technical Requirements**:
- [ ] Clerk integration is properly configured
- [ ] Supabase users table is created with correct schema
- [ ] Role-based middleware is implemented
- [ ] **Talent onboarding components** are integrated from existing project
- [ ] **Client onboarding components** are functional with role management
- [ ] Comprehensive error handling is in place
- [ ] **Jest testing framework** is configured and running
- [ ] **Clerk webhook testing** is implemented
- [ ] **Role-based routing tests** are passing
- [ ] **Component composition patterns** are implemented
- [ ] **State management strategy** is implemented

**User Experience Requirements**:
- [ ] Authentication flow is smooth and intuitive
- [ ] **Talent onboarding wizard** guides users effectively using existing components
- [ ] **Client onboarding form** provides clear role-specific experience
- [ ] Role-based access is clear and enforced
- [ ] Error messages are helpful and actionable
- [ ] UI follows Ponte AI design patterns
- [ ] **Component reusability** guidelines are followed
- [ ] **State management** provides consistent user experience

**Definition of Done**:
- All functional requirements are met
- All technical requirements are implemented
- All user experience requirements are satisfied
- **Jest testing framework** is configured with comprehensive test coverage
- **Clerk webhook testing** validates authentication integration
- **Role-based routing tests** confirm proper access control
- **Component composition patterns** are implemented and tested
- **State management strategy** provides consistent user experience
- **Existing onboarding components** are successfully integrated
- Code is ready for deployment to production 