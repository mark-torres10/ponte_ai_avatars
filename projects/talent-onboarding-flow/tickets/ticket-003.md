# PON-41: Tone Selection and Self-Interview System

## Linear Issue
[View in Linear](https://linear.app/metresearch/issue/PON-41/tone-selection-and-self-interview-system)

## Context & Motivation
Implement the tone/personality selection and self-interview components to capture talent's communication style and personal information for avatar generation.

## Functional Requirements
- Create `TonePersonalityStep` component with predefined categories and sliders
- Implement `SelfInterviewStep` with predefined questions and free-form
- Add voice recording capability for free-form responses
- Create progressive disclosure (defaults → sliders → custom)
- Implement tone and interview data state management
- Support personality trait sliders (extroversion, formality, energy, professionalism)

## Non-functional Requirements
- Intuitive user interface for tone selection
- Smooth voice recording experience
- Progressive disclosure to guide user choices
- Responsive design for all screen sizes

## Success Criteria
- Users can select tone categories easily
- Personality sliders provide accurate trait selection
- Voice recording works across browsers
- Interview data is captured completely
- Progressive disclosure guides user choices effectively

## Test Plan
- Test tone category selection
- Validate personality slider functionality
- Test voice recording across browsers
- Verify interview question responses
- Test progressive disclosure flow
- Validate data persistence

## Dependencies
- Voice recording libraries
- Slider component libraries
- Form state management

## Suggested Implementation Plan
1. Create `TonePersonalityStep` component
2. Implement predefined tone categories
3. Add personality trait sliders
4. Create `SelfInterviewStep` component
5. Implement voice recording functionality
6. Add progressive disclosure logic
7. Test voice recording across browsers

## Effort Estimate
3-4 days

## Priority & Impact
High Priority - Core personality and interview data collection

## Acceptance Checklist
- [ ] Tone categories work correctly
- [ ] Personality sliders function properly
- [ ] Voice recording works in major browsers
- [ ] Interview questions capture all data
- [ ] Progressive disclosure guides users
- [ ] Data persists during navigation
- [ ] Mobile experience is smooth

## Links & References
- [Project Spec](../spec.md) 