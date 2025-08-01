# Talent Onboarding Flow

## Project Overview
Build a comprehensive multi-step wizard for onboarding talent creators to the platform, enabling them to monetize their likeness through AI avatar licensing.

## Linear Project
[View in Linear](https://linear.app/metresearch/project/talent-onboarding-flow-implementation-276dab39e16f)

## Project Structure
```
projects/talent-onboarding-flow/
├── spec.md              ← Complete project specification
├── braindump.md         ← Initial brainstorming and requirements
├── tickets/             ← Individual implementation tickets
└── README.md           ← This file
```

## Key Features
- **Multi-step Wizard**: 5-step onboarding process with progress tracking
- **File Upload**: Support for headshots and video samples (JPG, PNG, MP4, MOV, WebM)
- **Tone Selection**: Predefined categories, personality sliders, and custom input
- **Self-Interview**: Predefined questions with optional voice recording
- **Mock Dashboard**: Profile overview with AI persona generation
- **Progress Management**: Automatic draft saving and resume capability

## Success Metrics
- Completion Rate: >80% of users complete onboarding
- Time to Complete: <10 minutes average
- Data Quality: >90% complete required information
- User Satisfaction: >4.5/5 rating

## Implementation Phases
1. **Phase 1A**: Basic wizard structure and navigation
2. **Phase 1B**: Basic info and media upload steps
3. **Phase 1C**: Tone/personality and interview steps
4. **Phase 1D**: Review step and form submission
5. **Phase 1E**: Mock dashboard and AI integration
6. **Phase 1F**: Testing, refinement, and polish

## Technical Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Ponte design system
- **Form Management**: React Hook Form
- **File Upload**: react-dropzone
- **AI Integration**: OpenAI API for persona generation

## Status
✅ **Complete** - Project planning and ticket creation

## Linear Project
[View in Linear](https://linear.app/metresearch/project/talent-onboarding-flow-implementation-276dab39e16f)

## Tickets Created
- [PON-39: Core Wizard Framework and Basic Info Step](https://linear.app/metresearch/issue/PON-39/core-wizard-framework-and-basic-info-step)
- [PON-40: Media Upload and File Management](https://linear.app/metresearch/issue/PON-40/media-upload-and-file-management)
- [PON-41: Tone Selection and Self-Interview System](https://linear.app/metresearch/issue/PON-41/tone-selection-and-self-interview-system)
- [PON-42: Review, Submit, and Mock Dashboard](https://linear.app/metresearch/issue/PON-42/review-submit-and-mock-dashboard)
- [PON-43: Progress Management and Draft Saving](https://linear.app/metresearch/issue/PON-43/progress-management-and-draft-saving)
- [PON-44: Admin Talent Review Dashboard - Core Structure](https://linear.app/metresearch/issue/PON-44/admin-talent-review-dashboard-core-structure)
- [PON-45: Admin Talent Review - Detail Views and Analytics](https://linear.app/metresearch/issue/PON-45/admin-talent-review-detail-views-and-analytics)
- [PON-46: Media Management and File Operations](https://linear.app/metresearch/issue/PON-46/media-management-and-file-operations)
- [PON-47: Backend Integration and Supabase Setup](https://linear.app/metresearch/issue/PON-47/backend-integration-and-supabase-setup)

## Parallel Execution Plan
**Can be done in parallel:**
- Tickets 1, 2, 3 (Core Framework, Media Upload, Tone/Interview)

**Must be done in order:**
- Tickets 1-3 → Ticket 4 (Review & Dashboard)
- Ticket 4 → Ticket 5 (Progress Management)

**Can be done in parallel:**
- Tickets 6, 7, 8 (Admin Dashboard, Detail Views, Media Management)

**Final Integration:**
- All tickets → Ticket 9 (Backend Integration) 