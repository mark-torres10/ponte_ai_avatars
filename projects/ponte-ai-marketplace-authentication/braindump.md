# Project Brain Dump - Ponte AI Marketplace App Redesign

## Initial Context
- **Team**: Ponte AI
- **Environment**: No conda env
- **Date**: January 2025
- **Status**: Initial brainstorming phase

## Project Concept
**Vision**: Redesign of the Ponte AI marketplace app with comprehensive authentication system using Claude and Clerk integration with Supabase backend.

**Core Components**:
1. Authentication system using Clerk
2. Role-based access control (Talent, Client, Admin)
3. Separate onboarding flows for different user types
4. Supabase backend integration
5. Protected routes based on user roles

## Key Questions to Address
1. What is the core concept or problem to solve?
   - **ANSWERED**: Marketplace app redesign with proper authentication and role-based access
2. How does this fit into Ponte AI's strategy?
   - **ANSWERED**: Core marketplace functionality with proper user management
3. Who are the target users?
   - **ANSWERED**: Three user types - Talent, Client, Admin
4. What are the technical requirements?
   - **ANSWERED**: Claude + Clerk auth, Supabase backend, role-based routing
5. Timeline and constraints?
   - **TO EXPLORE**: Need to understand timeline and resource constraints
6. Success criteria?
   - **ANSWERED**: Working auth flow, role-based access, proper Supabase integration
7. Existing research or prototypes?
   - **TO EXPLORE**: Current app state and existing authentication
8. Key stakeholders?
   - **TO EXPLORE**: Who needs to be involved in this redesign

## Initial Thoughts & Ideas

### Technical Architecture
- **Frontend**: Next.js with Clerk authentication components
- **Backend**: Supabase for database and user management
- **Auth Provider**: Clerk
- **Database**: Supabase with users table for role management

### User Roles & Access
- **Talent**: Access to /talent only
- **Client**: Access to /client only  
- **Admin**: Access to /admin only (future implementation)
- **Unauthenticated**: Redirected to /login

### Authentication Flow
1. User visits "/" → redirected to "/login" if not authenticated
2. User signs up → chooses role (Talent or Client)
3. Separate onboarding flows for each role
4. User gets redirected to appropriate dashboard based on role
5. Role-based route protection prevents unauthorized access

### Database Schema
```sql
users table:
- id UUID PRIMARY KEY
- clerk_user_id TEXT UNIQUE NOT NULL
- email TEXT UNIQUE
- role ENUM('admin', 'client', 'talent')
- created_at TIMESTAMP
```

### Routes Structure
- "/" → Home (redirects based on auth status)
- "/login" → Authentication page with Clerk components
- "/admin" → Admin dashboard (Hello World for now)
- "/talent" → Talent dashboard (Hello World for now)
- "/client" → Client dashboard (Hello World for now)

## Potential Risks & Concerns
1. **Auth Integration Complexity**: Clerk + Supabase integration
2. **Role Management**: Ensuring proper role-based access control
3. **Onboarding Flow**: Separate flows for different user types
4. **Data Consistency**: Keeping Clerk and Supabase user data in sync
5. **Security**: Proper route protection and role validation

## Knowledge Gaps
1. **Current App State**: What's the current authentication system?
   - **ANSWERED**: No auth currently, greenfield project from scratch
2. **Onboarding Requirements**: What specific fields are needed for Talent vs Client onboarding?
   - **ANSWERED**: Multi-step wizards for both, templated versions for MVP
3. **Admin Implementation**: Timeline and requirements for admin role
   - **ANSWERED**: Future implementation, not part of MVP
4. **Existing Supabase Setup**: Current database structure and migrations
   - **ANSWERED**: Greenfield, starting fresh
5. **Performance Requirements**: Expected user load and performance needs
   - **ANSWERED**: MVP focus, performance optimization later

## Technical Implementation Details
- **UI Framework**: Tailwind CSS + shadcn-ui components
- **Auth Components**: Clerk's hosted components where possible
- **Design System**: Follow existing Ponte AI design patterns
- **Onboarding**: Multi-step wizards for both Talent and Client
  - **Talent**: Basic Info → Skills/Experience → Portfolio → Preferences
  - **Client**: Basic Info → Company Details → Project Requirements → Preferences
- **Database**: Fresh Supabase setup with users table
- **Scope**: MVP with all specified features required
- **Testing**: Basic testing for auth flows
- **Data Storage**: Onboarding details not stored initially (future enhancement)
- **Error Handling**: Comprehensive error handling for auth failures and role assignment

## Next Steps
Ready to move to Phase 2: Requirements Specification and Context Refinement 