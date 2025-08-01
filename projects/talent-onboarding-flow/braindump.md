# Talent Onboarding Flow - Brain Dump

## Project Overview
Build a seamless talent onboarding flow for avatar creation that allows creators/clients to easily join the platform and monetize their likeness through AI avatar licensing.

## Current State Analysis
- **Existing**: Placeholder "Coming Soon" page at `/onboard-client`
- **Components Available**: PersonaSelection, TextInput, VoiceGeneration
- **Design System**: Ponte design system with gradients and card components
- **Data Structure**: Persona interface with id, name, description, images, selected

## Core Requirements (from specs)
1. ✅ Build internal onboarding form for adding new avatars
2. ✅ Upload headshot or video sample
3. ✅ Provide tone descriptors and optional self-interview
4. ✅ Store client metadata (tone, preferred topics, voice config)
5. ✅ Prepare mock dashboard to view onboarded talent
6. ✅ Deliverable: Flow to onboard a new talent (creator/client) into the system

## Key Questions & Considerations

### User Experience Flow
- **Multi-step Wizard**: ✅ Confirmed - 4-5 step wizard with progress bar
- **Completion Time**: Target 5-10 minutes for optimal user experience
- **Progress Saving**: Should users be able to save drafts and return later?
- **Mobile Responsiveness**: Seamless experience across all devices

### Content Requirements

#### Headshot/Video Upload
- **File Formats**: ✅ JPG, PNG, MP4, MOV, WebM
- **Size Limits**: ✅ 10MB for images, 50MB for videos
- **Processing**: Frontend cropping/compression for optimal performance
- **Preview**: Real-time preview during upload
- **Multiple Files**: ✅ Allow multiple headshots (not just one)

#### Tone Descriptors
- **Predefined Categories**: ✅ Professional, Friendly, Authoritative, Casual, Energetic, Calm, etc.
- **Personality Sliders**: ✅ Sliders for personality traits (extroversion, formality, energy, etc.)
- **Free Text Input**: ✅ Additional custom tone descriptions (after defaults)
- **Order**: Defaults first, then sliders, then free text (encourage using defaults)

#### Self-Interview
- **Predefined Questions**: ✅ Text input for specific questions
- **Free-form Section**: ✅ "Tell us anything about yourself" (text or voice recording)
- **Optional**: ✅ Clearly marked as optional
- **Examples**: Provide example responses for guidance

#### Preferred Topics
- **Categories**: Business, Technology, Entertainment, Sports, etc.
- **Selection**: Multi-select checkboxes or free text?
- **Weighting**: Allow users to rank preferences?

### Technical Implementation

#### Frontend Architecture
- **Form Management**: React Hook Form vs custom state management?
- **Validation**: Client-side validation rules?
- **File Upload**: Direct upload or base64 encoding?
- **Preview**: Real-time avatar preview generation?

#### Data Structure
```typescript
interface TalentProfile {
  id: string;
  name: string;
  email: string;
  headshots: string[]; // URLs or base64
  videoSample?: string;
  toneDescriptors: string[];
  preferredTopics: string[];
  selfInterview?: string;
  voiceConfig?: {
    pitch: number;
    speed: number;
    accent?: string;
  };
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Mock Dashboard Features
- **Profile Overview**: Basic info and status
- **Earnings Preview**: Mock revenue projections
- **Usage Stats**: Mock licensing statistics
- **Settings**: Edit profile information
- **AI Persona Generation**: ✅ "Get your personalized AI-powered persona" button
- **OpenAI Integration**: Generate personalized persona using OpenAI API

### Integration Points

#### Backend Integration (Phase 2)
- **Supabase Schema**: Design database tables
- **API Endpoints**: Create/update talent profiles
- **File Storage**: Handle image/video uploads
- **Authentication**: User registration/login

#### Existing System Integration
- **Navigation**: How does this fit into existing nav?
- **Persona System**: How does this relate to existing personas?
- **Voice Generation**: Integration with existing voice components?

## Success Criteria
- **Completion Rate**: >80% of users complete onboarding
- **Time to Complete**: <10 minutes average
- **User Satisfaction**: Intuitive and professional experience
- **Data Quality**: Complete and accurate talent profiles
- **Mobile Experience**: Seamless on all devices

## Potential Risks & Mitigations
- **File Upload Issues**: Implement robust error handling and retry logic
- **Form Abandonment**: Save progress automatically, clear progress indicators
- **Data Validation**: Comprehensive client and server-side validation
- **Performance**: Optimize image/video processing and upload speeds

## Technical Stack Considerations
- **Form Library**: React Hook Form for validation and state management
- **File Upload**: Custom implementation or library (react-dropzone)?
- **Image Processing**: Client-side cropping/compression
- **State Management**: Local state vs global state (Zustand/Redux)?
- **Styling**: Continue with existing Ponte design system

## Next Steps
1. Define detailed user flow and wireframes
2. Design data models and API contracts
3. Implement frontend components
4. Create mock dashboard
5. Integrate with backend (Phase 2)

## Open Questions
- Should we implement real-time avatar preview during onboarding?
- What approval workflow do we need for new talent?
- How should we handle duplicate submissions?
- What analytics should we track during onboarding?
- Should we implement A/B testing for different flows? 