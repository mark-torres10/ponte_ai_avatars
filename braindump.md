# Avatar Generation Demo - Brain Dump

## Project Context
- **Existing Frontend**: Next.js production MVP already exists with `/generate-avatar` stub page
- **Goal**: Replace stub with functional avatar generation demo
- **Team**: PonteAI Linear team
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS, ShadCN UI

## Core Functionality Requirements

### 1. Persona Selection
- **Voice Actor A**: Terry Crews (actor and ex-athlete)
- **Voice Actor B**: Will Howard (NFL quarterback/athlete)
- **UI**: Clickable persona cards with updated descriptions
- **Images**: Use existing images in `app/public/voice_actor_a/` and `app/public/voice_actor_b/`
- **Future**: Design for easy Supabase integration (Persona objects)

### 2. Text Input & Personalization
- **Flow**: 
  1. User selects persona
  2. Freeform text box appears
  3. Optional personalization button (bottom right)
  4. AI rewrites text in persona's voice/style using OpenAI
  5. Easy toggle between original and AI versions
- **UI**: Clear indication that personalization is optional
- **Functionality**: Undo/switch between versions easily

### 3. Voice Generation (ElevenLabs)
- **API**: ElevenLabs for voice generation
- **Custom Voices**: Already have voice IDs for both personas
- **Success Criteria**: 
  - Select profile
  - Write text
  - Personalize text (optional)
  - Generate audio
  - Play audio sample
- **UI**: Clickable audio player

### 4. Video Generation (D-ID)
- **API**: D-ID for avatar video generation
- **Flow**: 
  1. "Generate AI Avatar" button
  2. Loading component (ShadCN pre-made)
  3. Video generation (takes time)
  4. Display generated video
- **Integration**: Use existing implementation patterns from reference repos

### 5. Final Page Layout (Top to Bottom)
1. Avatar selection
2. Text box
3. Voice sample with play button
4. Generated video
5. Feedback form at bottom

## Technical Considerations

### APIs to Integrate
- **OpenAI**: For text personalization
- **ElevenLabs**: For voice generation (custom voice IDs provided later)
- **D-ID**: For video generation

### UI/UX Requirements
- **Responsive**: Works on all devices
- **Loading States**: Proper loading indicators
- **Error Handling**: Graceful error states
- **Accessibility**: Screen reader friendly
- **Brand Consistency**: Matches existing Ponte AI styling

### Code Organization
- **Components**: Modular, reusable components
- **State Management**: Handle complex state (persona, text versions, audio, video)
- **API Integration**: Clean separation of concerns
- **Error Boundaries**: Proper error handling

### Future Considerations
- **Supabase Integration**: Design for easy database integration
- **Scalability**: Easy to add more personas
- **Performance**: Optimize for video generation delays
- **Caching**: Cache generated content appropriately

## Implementation Details (Clarified)

### Persona Selection
- **Images**: Show all images from each persona folder in carousel/gallery
- **Descriptions**: 
  - Voice Actor A: "Actor & Ex-Athlete Terry Crews"
  - Voice Actor B: "NFL Quarterback Will Howard"
- **Selection**: One-time choice with manual reset button to prevent losing progress
- **Reset**: Clear reset button to start over

### Text Personalization
- **Button**: Manual "Personalize with AI" button
- **Loading**: Simple loading state for OpenAI call
- **Toggle**: Simple button to switch between original and AI versions
- **Timing**: User can tweak text as much as needed before voice generation

### Voice Generation
- **Trigger**: Separate "Generate Voice" button (manual)
- **Loading**: Clear loading state/popup showing voice creation in progress
- **Player**: Simple audio player with play button
- **Error**: Popup showing "Voice generation failed at ElevenLabs"

### Video Generation
- **Trigger**: "Generate AI Avatar" button appears after voice generation
- **Loading**: Loading state during video generation
- **Error**: Popup showing "Video generation failed at D-ID"

### Downloads
- **Separate Downloads**: Text, Audio, and Video can be downloaded individually
- **Format**: Appropriate formats for each asset type

### Technical Architecture
- **Frontend**: Next.js frontend making API calls
- **Backend**: Separate backend API managing all integrations
- **Implementation Order**: 
  1. OpenAI personalization first
  2. ElevenLabs voice generation second
  3. D-ID video generation third
- **Error Handling**: Simple popups indicating which service failed
- **No Analytics**: Demo only, no tracking
- **No Caching**: Simple implementation for now

### Feedback Form
- **Timing**: Only appears after video creation
- **Fields**: Rating, comments, use case, overall experience
- **Purpose**: Collect demo feedback for improvement

## Questions to Resolve
1. **Voice IDs**: Need ElevenLabs voice IDs for both personas
2. **API Keys**: Need API keys for OpenAI, ElevenLabs, D-ID
3. **Backend Setup**: Need to determine backend framework (Express, FastAPI, etc.)
4. **API Endpoints**: Define REST API structure for frontend-backend communication

## Success Metrics
- User can complete full flow: persona → text → voice → video
- Smooth transitions between states
- Professional appearance for demos
- Fast enough for real-time interaction
- Error-free operation

## Reference Materials
- Existing voice implementation: https://github.com/mark-torres10/ai_voice_visual_avatar_agent/blob/main/planning/SCRIPT_VOICE_IMPLEMENTATION_SUMMARY.md
- Existing video implementation: https://github.com/mark-torres10/ai_voice_visual_avatar_agent/blob/main/planning/VIDEO_IMPLEMENTATION_SUMMARY.md
- D-ID API docs: https://docs.d-id.com/reference/get-started
- Existing Next.js MVP structure and styling
