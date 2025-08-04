# PON-42: Review, Submit, and Mock Dashboard

## Linear Issue
[View in Linear](https://linear.app/metresearch/issue/PON-42/review-submit-and-mock-dashboard)

## Context & Motivation
Create the final review step and mock dashboard to complete the onboarding flow and provide talent with a preview of their profile and potential earnings.

## Functional Requirements
- Create `ReviewStep` with summary display and edit functionality
- Implement form submission and success flow
- Build `MockDashboard` with profile overview and mock data
- Add AI persona generation button and OpenAI integration
- Create earnings projections and usage statistics display
- Implement success confirmation and redirect flow

## Non-functional Requirements
- Clear and comprehensive review interface
- Smooth submission process
- Engaging dashboard with realistic mock data
- Fast AI persona generation response

## Success Criteria
- Users can review all collected information
- Edit functionality works for all sections
- Form submission completes successfully
- Mock dashboard displays realistic data
- AI persona generation produces relevant results
- Success flow provides clear next steps

## Test Plan
- Test review step with all data types
- Verify edit functionality for each section
- Test form submission process
- Validate mock dashboard data display
- Test AI persona generation
- Verify success flow and redirects

## Dependencies
- OpenAI API integration
- Form submission handling
- Mock data generation

## Suggested Implementation Plan
1. Create `ReviewStep` component
2. Implement edit functionality for all sections
3. Build `MockDashboard` component
4. Add OpenAI API integration for persona generation
5. Create mock earnings and usage data
6. Implement success flow and redirects
7. Test AI integration and mock data

## Effort Estimate
3-4 days

## Priority & Impact
High Priority - Completes onboarding flow and provides value

## Acceptance Checklist
- [ ] Review step displays all information correctly
- [ ] Edit functionality works for all sections
- [ ] Form submission completes successfully
- [ ] Mock dashboard shows realistic data
- [ ] AI persona generation works
- [ ] Success flow provides clear guidance
- [ ] Redirects work correctly

## Links & References
- [Project Spec](../spec.md)
- [OpenAI API Documentation](https://platform.openai.com/docs) 