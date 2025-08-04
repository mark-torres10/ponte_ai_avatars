# 🤖 Next Agent Prompt for PON-43: Progress Management and Draft Saving

You are an expert AI agent tasked with implementing the next ticket in our project workflow. I've just completed PON-42 and need to hand off to you with all the necessary context.

## Current Project Context

**Project Path**: `projects/talent-onboarding-flow/`
**Project README**: Please read the README.md file in the project directory to understand:
- Project overview and goals
- Technology stack and architecture
- Development setup and environment requirements
- Coding standards and conventions
- Testing requirements and patterns
- Deployment and operational considerations

## Linear Ticket to Implement

**Ticket ID**: PON-43
**Title**: Progress Management and Draft Saving
**Description**: 
```
## Context & Motivation

Implement comprehensive progress management and draft saving functionality to ensure users can complete the onboarding process without losing their progress.

## Functional Requirements

* Implement automatic draft saving and progress persistence
* Add resume capability and offline sync
* Create progress indicators and validation
* Implement form abandonment recovery
* Add local storage management
* Create progress tracking across all steps

## Non-functional Requirements

* Seamless progress saving without user intervention
* Fast resume capability
* Reliable data persistence
* Clear progress indication

## Success Criteria

* Drafts save automatically during user interaction
* Users can resume from any step
* Progress indicators accurately reflect completion
* Form abandonment recovery works reliably
* Data persists across browser sessions

## Test Plan

* Test automatic draft saving
* Verify resume functionality from all steps
* Test progress indicator accuracy
* Validate form abandonment recovery
* Test data persistence across sessions
* Verify offline capability

## Dependencies

* Local storage management
* Form state persistence
* Progress tracking logic

## Suggested Implementation Plan

1. Implement automatic draft saving logic
2. Create progress tracking system
3. Add resume functionality
4. Implement form abandonment recovery
5. Add local storage management
6. Create progress indicators
7. Test persistence and recovery

## Effort Estimate

2-3 days

## Priority & Impact

Medium Priority - Improves user experience and completion rates

## Acceptance Checklist

- [ ] Automatic draft saving works
- [ ] Resume functionality works from all steps
- [ ] Progress indicators are accurate
- [ ] Form abandonment recovery works
- [ ] Data persists across sessions
- [ ] Offline capability functions
- [ ] Progress tracking is reliable

## Links & References

* [Project Spec](../projects/talent-onboarding-flow/spec.md)
```

**Priority**: Medium
**Assignee**: Next Agent
**Due Date**: Not specified
**Labels**: Progress Management, User Experience
**Related Issues**: PON-42 (Review, Submit, and Mock Dashboard)

## Implementation Context from Previous Work

### What Was Just Completed
- **Previous Ticket**: PON-42 - Review, Submit, and Mock Dashboard
- **Key Changes Made**: 
  - Created comprehensive ReviewStep component with edit functionality for all sections
  - Implemented MockDashboard with realistic earnings projections and AI persona generation
  - Added OpenAI API integration through backend routes for secure AI operations
  - Enhanced OnboardingWizard with proper navigation and form submission flow
  - Fixed security issues by moving all OpenAI calls to backend API routes
  - Implemented proper form validation and error handling
- **Files Modified**: 
  - `src/components/ReviewStep.tsx` - Complete rewrite with edit functionality
  - `src/components/MockDashboard.tsx` - New component with earnings projections
  - `src/components/OnboardingWizard.tsx` - Enhanced navigation and form handling
  - `src/lib/openai.ts` - Backend API integration for AI operations
  - `backend/src/routes/openai.ts` - New backend routes for AI operations
  - `src/components/MediaUploadStep.tsx` - Minor improvements
- **New Dependencies**: None added
- **Breaking Changes**: None

### Current State of the Codebase
- **Working Branch**: `feature/PON-43_progress_management_draft_saving` (freshly created from main)
- **Last Commit**: `ef16a15` - "(PON-42) Review, Submit, and Mock Dashboard (#21)"
- **Environment Status**: 
  - Frontend runs on port 3000 (or 3001 if 3000 is busy)
  - Backend runs on port 3001
  - OpenAI API integration is working through backend routes
- **Test Status**: All components are working and tested with Playwright

### Technical Decisions Made
- **Architecture Changes**: 
  - All OpenAI API calls moved to backend for security
  - Form state management using React Hook Form with proper validation
  - Component-based architecture with clear separation of concerns
- **Patterns Established**: 
  - Use of `useFormContext` for form state sharing across components
  - Backend API integration pattern for external services
  - Proper TypeScript typing throughout the application
  - Consistent error handling and user feedback patterns
- **Performance Considerations**: 
  - Lazy loading of components where appropriate
  - Efficient form state management to prevent unnecessary re-renders
- **Security Implications**: 
  - API keys kept server-side only
  - Proper validation on both frontend and backend

## Relevant Conversation Context

### Key Insights from Current Session
- The onboarding flow is now complete with all 5 steps working seamlessly
- Users can navigate between steps, edit information, and submit successfully
- The MockDashboard provides realistic preview of potential earnings
- AI persona generation is working through secure backend integration
- All ESLint errors have been resolved and code quality is high

### Challenges Encountered
- Initially had security issues with OpenAI API keys exposed to frontend
- Some ESLint warnings about unused variables and dependencies
- Needed to align interview completion logic between components
- Required proper navigation callback system for edit functionality

### Solutions Implemented
- Moved all OpenAI operations to backend API routes
- Cleaned up unused variables and fixed dependency arrays
- Implemented consistent interview completion logic across components
- Created navigation callback system for seamless editing experience

### Questions for Next Agent
- How should we handle form data persistence when users navigate away and return?
- What's the best approach for detecting form abandonment vs. intentional navigation?
- Should we implement auto-save on every field change or on step completion?
- How do we handle conflicts if users have multiple tabs open with the same form?

## Your Task

1. **Read the Project README**: Start by reading the README.md in the project directory to understand the full context
2. **Analyze the Linear Ticket**: Review all ticket details and requirements for PON-43
3. **Consider Previous Context**: Take into account the implementation context from PON-42 work
4. **Plan Your Approach**: Based on the project patterns and previous work, plan your implementation strategy
5. **Execute the Ticket**: Follow the standard ticket execution process as outlined in `HOW_TO_EXECUTE_A_TICKET.md`

## Success Criteria

- [ ] Automatic draft saving works without user intervention
- [ ] Users can resume from any step in the onboarding process
- [ ] Progress indicators accurately reflect completion status
- [ ] Form abandonment recovery works reliably
- [ ] Data persists across browser sessions and page refreshes
- [ ] Offline capability functions when network is unavailable
- [ ] Progress tracking is reliable and consistent
- [ ] Code follows project conventions and patterns established in previous work
- [ ] All tests pass and new tests are written as needed
- [ ] Documentation is updated if required
- [ ] Code review is ready with clear commit messages
- [ ] Any dependencies or environment changes are documented

## Additional Notes

### Current Form Structure
The onboarding form uses React Hook Form with the following structure:
```typescript
interface OnboardingFormData {
  basicInfo: {
    name: string;
    email: string;
  };
  media: {
    headshots: File[];
    videoSample?: File;
  };
  personality: {
    toneCategories: string[];
    customTone?: string;
    personalityTraits: {
      professionalism: number;
      enthusiasm: number;
      creativity: number;
    };
  };
  interview: {
    predefinedAnswers: Record<string, string>;
    customQuestions: string[];
  };
}
```

### Key Components to Work With
- `OnboardingWizard.tsx` - Main wizard component with form context
- `ProgressIndicator.tsx` - Current progress display component
- `BasicInfoStep.tsx`, `MediaUploadStep.tsx`, `TonePersonalityStep.tsx`, `SelfInterviewStep.tsx`, `ReviewStep.tsx` - Individual step components

### Recommended Implementation Approach
1. **Local Storage Integration**: Use `localStorage` or `sessionStorage` for data persistence
2. **Auto-save Logic**: Implement debounced auto-save on form field changes
3. **Progress Tracking**: Enhance the existing `ProgressIndicator` component
4. **Resume Functionality**: Add logic to detect and restore saved progress
5. **Form Abandonment**: Implement beforeunload event handlers
6. **Offline Support**: Consider using Service Workers for offline capability

### Testing Considerations
- Test with different browsers and devices
- Test with slow network conditions
- Test form abandonment scenarios
- Test data persistence across sessions
- Test concurrent tab usage

---

**Remember**: You are inheriting a project in progress. Maintain consistency with the established patterns, conventions, and architectural decisions while implementing your specific ticket requirements. The onboarding flow is now fully functional, so your focus should be on enhancing the user experience with reliable progress management and data persistence. 