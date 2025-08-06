# Integrate existing onboarding components with authentication

## Context & Motivation
The marketplace app needs to integrate the existing talent onboarding wizard and client onboarding forms with the new authentication system. This ticket leverages the existing components from the talent-onboarding-flow project and client onboarding forms, adding authentication state management and role assignment to create a seamless user experience. This integration ensures users can complete onboarding while being properly authenticated and assigned roles.

Reference: `spec.md` - Section 7.4 Existing Component Integration

## Detailed Description & Requirements

#### Functional Requirements:
- Integrate existing talent onboarding wizard from `/projects/talent-onboarding-flow/`
- Integrate existing client onboarding form components
- Add authentication state management to onboarding flows
- Implement role assignment during onboarding process
- Connect onboarding completion with user role assignment
- Ensure onboarding data is properly synchronized with user accounts

#### Non-Functional Requirements:
- Maintain existing UI/UX patterns and design system
- Ensure smooth transition from onboarding to dashboard
- Implement proper error handling for onboarding failures
- Follow component composition patterns for reusability
- Maintain performance and user experience quality

#### Validation & Error Handling:
- Handle onboarding interruption and recovery
- Validate role assignment during onboarding
- Handle authentication failures during onboarding
- Ensure data consistency between onboarding and user accounts

## Success Criteria
- Existing talent onboarding wizard is integrated with authentication
- Existing client onboarding forms are integrated with authentication
- Role assignment works correctly during onboarding
- Onboarding completion triggers proper user role assignment
- Users are redirected to appropriate dashboards after onboarding
- Onboarding data is properly synchronized with user accounts
- Error handling is comprehensive for onboarding scenarios

## Test Plan
- `test_talent_onboarding_integration`: Verify talent onboarding wizard works with auth → Users can complete talent onboarding while authenticated
- `test_client_onboarding_integration`: Verify client onboarding forms work with auth → Users can complete client onboarding while authenticated
- `test_role_assignment`: Verify role assignment during onboarding → Users are assigned correct roles after onboarding
- `test_onboarding_completion`: Verify onboarding completion flow → Users are redirected to correct dashboard after onboarding
- `test_data_synchronization`: Verify onboarding data sync → Onboarding data is properly saved with user accounts
- `test_onboarding_interruption`: Verify onboarding interruption handling → Users can resume onboarding if interrupted
- `test_error_handling`: Verify error handling during onboarding → Authentication failures are handled gracefully

📁 Test file: `__tests__/onboarding-integration.test.ts`

## Dependencies
- Depends on: `ticket-001` (Clerk integration)
- Depends on: `ticket-002` (Supabase users table)
- Depends on: `ticket-003` (role-based routing)
- Requires: Existing talent onboarding wizard components
- Requires: Existing client onboarding form components

## Suggested Implementation Plan
1. Analyze existing talent onboarding wizard components
2. Analyze existing client onboarding form components
3. Create authentication integration layer for onboarding flows
4. Implement role assignment logic during onboarding
5. Add authentication state management to onboarding components
6. Connect onboarding completion with user role assignment
7. Implement error handling and recovery for onboarding
8. Test complete onboarding flows with authentication

## Effort Estimate
- Estimated effort: **4 hours**
- Assumes authentication system is complete
- Assumes existing onboarding components are available
- Includes testing and validation time
- Includes error handling and edge case management

## Priority & Impact
- Priority: **High**
- Rationale: Core user experience feature, required for complete authentication flow

## Acceptance Checklist
- [ ] Existing talent onboarding wizard integrated with authentication
- [ ] Existing client onboarding forms integrated with authentication
- [ ] Role assignment implemented during onboarding process
- [ ] Onboarding completion triggers proper user role assignment
- [ ] Users redirected to appropriate dashboards after onboarding
- [ ] Onboarding data properly synchronized with user accounts
- [ ] Error handling implemented for onboarding scenarios
- [ ] Onboarding interruption and recovery implemented
- [ ] Component composition patterns followed for reusability
- [ ] All onboarding flows tested and working
- [ ] Jest tests written and passing
- [ ] Performance and user experience maintained

## Links & References
- Specification: `spec.md`
- Existing Talent Onboarding: `/projects/talent-onboarding-flow/`
- Existing Components: `/src/components/OnboardingWizard.tsx`
- Linear Project: `Ponte AI Marketplace Authentication System`
- Related tickets: `ticket-001` (Clerk integration), `ticket-002` (Supabase integration), `ticket-003` (role-based routing) 