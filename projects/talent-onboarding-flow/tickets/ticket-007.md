# PON-39: Core Wizard Framework and Basic Info Step

## Linear Issue
[View in Linear](https://linear.app/metresearch/issue/PON-39/core-wizard-framework-and-basic-info-step)

## Context & Motivation
Create the foundational wizard structure and implement the first step of the talent onboarding flow. This establishes the core architecture for the multi-step onboarding process.

## Functional Requirements
- Create main `OnboardingWizard` component with step navigation
- Implement `BasicInfoStep` component with form validation
- Set up React Hook Form for state management
- Add progress indicator and responsive design
- Create step container architecture

## Non-functional Requirements
- Mobile-responsive design
- Accessible form controls (WCAG 2.1 AA)
- Fast loading and smooth transitions
- Consistent with Ponte design system

## Success Criteria
- Users can navigate between steps smoothly
- Form validation works correctly for all fields
- Progress indicator accurately reflects current step
- Mobile experience is seamless
- Form data persists during navigation

## Test Plan
- Test step navigation (forward/backward)
- Validate form fields (name, email, phone, location)
- Test mobile responsiveness
- Verify accessibility compliance
- Test form data persistence

## Dependencies
- Existing Ponte design system
- React Hook Form library
- Next.js 14 setup

## Suggested Implementation Plan
1. Create `OnboardingWizard` container component
2. Implement step navigation logic
3. Create `ProgressIndicator` component
4. Build `BasicInfoStep` with form validation
5. Add responsive styling and animations
6. Test across different devices

## Effort Estimate
3-4 days

## Priority & Impact
High Priority - Foundation for entire onboarding flow

## Acceptance Checklist
- [ ] Wizard navigation works correctly
- [ ] Basic info form validates properly
- [ ] Progress indicator displays accurately
- [ ] Mobile responsive design implemented
- [ ] Form data persists during navigation
- [ ] Accessibility requirements met
- [ ] Consistent with design system

## Links & References
- [Project Spec](../spec.md)
- [Ponte Design System](../../../src/app/globals.css) 