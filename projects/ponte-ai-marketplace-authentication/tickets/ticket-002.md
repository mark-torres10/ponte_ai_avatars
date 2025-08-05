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
- `test_table_creation`: Verify users table exists with correct schema → Table created with all required columns
- `test_constraints`: Verify database constraints are enforced → Unique constraints prevent duplicate entries
- `test_indexes`: Verify database indexes are created → Queries on clerk_user_id and email are fast
- `test_connection`: Verify Supabase connection works → Can connect and perform basic operations
- `test_migration`: Verify migration files are valid → Migrations can be applied and rolled back
- `test_sync_triggers`: Verify user sync triggers work → User data is synchronized correctly
- `test_typescript_types`: Verify TypeScript types are generated → Database types are available in code

📁 Test file: `__tests__/supabase-integration.test.ts`

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

## Links & References
- Specification: `spec.md`
- Supabase Documentation: https://supabase.com/docs
- Database Schema: `spec.md` Section 7 Technical Notes
- Linear Project: `Ponte AI Marketplace Authentication System`
- Related tickets: `ticket-001` (Clerk integration), `ticket-003` (role-based routing) 