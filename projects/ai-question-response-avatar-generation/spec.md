# 🧾 Spec: AI Question-to-Response Avatar Generation Feature

## 1. Problem Statement

**Who is affected?** Users of the avatar generation demo who want to create more dynamic and engaging content by asking questions to AI personas rather than providing pre-written scripts.

**What's the pain point?** The current avatar generation flow requires users to write their own scripts, which can be time-consuming and may not capture the authentic voice and personality of the selected persona. Users want to simply ask questions and have the AI respond naturally as that persona.

**Why now?** This feature enhances the demo's interactivity and showcases the AI's ability to generate persona-specific responses, making the avatar generation more engaging and realistic for potential clients and stakeholders.

**Strategic link:** This represents an evolution of Ponte AI's avatar technology from script-based to conversational AI, demonstrating more sophisticated AI capabilities and improving user engagement.

## 2. Desired Outcomes & Metrics

**What should be true once this is done?**
- Users can ask questions to AI personas and receive authentic, persona-specific responses
- The avatar generation flow becomes more interactive and engaging
- AI responses are automatically used for voice and video generation
- Pre-selected questions provide quick access to common use cases

**Success criteria:**
- Users can complete the full flow: persona selection → question input → AI response → voice generation → video generation
- Pre-selected questions work correctly and overwrite custom input
- AI responses maintain persona authenticity and are suitable for voice generation
- All existing functionality (voice/video generation) continues to work unchanged
- Response generation is reliable and handles errors gracefully

**No analytics tracking required** - this is a demo-focused implementation.

## 3. Scope Boundaries and Technical Requirements

**Phase 1: Basic Talking Head Avatar System**
1. **Avatar Creation & Management**
   - Upload photos/videos to create custom talking head avatars
   - Basic avatar customization (appearance, style)
   - Avatar management system

2. **Text-to-Speech Integration**
   - Convert text input to natural speech for avatars
   - Integration with existing ElevenLabs API
   - Basic voice customization options

3. **Talking Head Video Generation**
   - Generate talking head videos using D-ID API
   - Real-time video generation from text input
   - Basic video output and display

**Phase 2: AI Question-to-Response Integration**
4. **Question Input Interface**
   - Text input field for custom questions
   - 4 pre-selected, persona-specific professional questions
   - Pre-selected questions overwrite current text when clicked
   - Maintain existing character limits and validation

5. **AI Response Generation**
   - Use existing generic OpenAI endpoint (`/api/openai/prompt`)
   - Create new specialized endpoint for persona question responses
   - Generate persona-specific responses to questions
   - Display responses in read-only text area
   - Handle API errors gracefully

**Phase 3: Enhanced Avatar Generation Flow**
6. **Flow Integration**
   - AI response becomes the text passed to ElevenLabs for voice generation
   - AI response becomes the text passed to D-ID for video generation
   - Maintain existing voice and video generation flow unchanged

7. **UI Updates**
   - Transform TextInput component from script input to question input
   - Add pre-selected question buttons above text input
   - Add AI response display area below text input
   - Update component labels and descriptions

8. **Complete System Integration**
   - Full integration with existing avatar generation workflow
   - Persona-based avatar customization
   - Professional avatar generation experience

**Out of Scope:**
- Modifying ElevenLabs or D-ID integrations
- Creating new API endpoints
- Adding analytics or tracking
- Changing the voice or video generation process
- Adding new persona types or images

## 4. User Experience Considerations

**User Flow:**
1. User selects a persona
2. User sees question input interface with pre-selected questions
3. User either types a custom question or clicks a pre-selected one
4. System generates AI response based on the question and persona
5. AI response is displayed in read-only format
6. User proceeds to voice generation (using AI response text)
7. User proceeds to video generation (using AI response text)

**Pre-selected Questions (Professional, Entrepreneur-focused):**
1. "What's your biggest piece of advice for someone starting their first business?"
2. "How do you handle setbacks and failures in entrepreneurship?"
3. "What's the most important lesson you've learned about building a team?"
4. "How do you stay motivated during challenging times in business?"

**UI Layout:**
- Pre-selected question buttons (4 buttons, 2x2 grid)
- Question input textarea below buttons
- AI response display below input (read-only, styled differently)
- Maintain existing action buttons and flow

## 5. Technical Feasibility and Estimation

**Technical Approach:**
- **Phase 1**: Integrate D-ID API for talking head generation, create basic avatar management
- **Phase 2**: Enhance existing OpenAI endpoint for persona responses, add question interface
- **Phase 3**: Integrate with existing voice/video generation flow, complete system integration
- **State Management**: Incremental state management updates for each phase

**Implementation Effort:**
- **Phase 1**: 8-10 hours (D-ID integration, avatar management, basic TTS)
- **Phase 2**: 6-8 hours (AI response generation, question interface)
- **Phase 3**: 4-6 hours (system integration, workflow completion)
- **Total Estimate**: 18-24 hours across 3 phases

**Technical Risks:**
- OpenAI API reliability and response quality
- State management complexity in modified flow
- Maintaining existing functionality while adding new features

**Dependencies:**
- Existing generic OpenAI endpoint (`/api/openai/prompt`)
- New specialized endpoint for persona question responses
- Existing voice and video generation flow
- Current persona selection system

## 6. Success Validation

**Phase 1 Requirements:**
- [ ] Users can upload photos to create talking head avatars
- [ ] Basic avatar customization options are available
- [ ] Text input generates talking head videos via D-ID API
- [ ] Basic TTS integration works with ElevenLabs
- [ ] Avatar management system functions properly

**Phase 2 Requirements:**
- [ ] Users can type custom questions in the text input
- [ ] Pre-selected questions appear as clickable buttons
- [ ] Clicking pre-selected questions overwrites current text input
- [ ] AI generates persona-specific responses to questions
- [ ] Responses are displayed in read-only format

**Phase 3 Requirements:**
- [ ] AI response text is used for voice generation
- [ ] AI response text is used for video generation
- [ ] All existing functionality continues to work
- [ ] Complete avatar generation workflow is functional

**User Experience Requirements:**
- [ ] Question input is intuitive and clear
- [ ] Pre-selected questions are relevant and professional
- [ ] AI responses maintain persona authenticity
- [ ] Response generation is fast and reliable
- [ ] Error handling is graceful and informative

**Technical Requirements:**
- [ ] No changes to ElevenLabs or D-ID integrations
- [ ] New specialized endpoint uses existing generic OpenAI endpoint
- [ ] State management handles question → response → voice → video flow
- [ ] Component maintains existing styling and branding
- [ ] Error handling covers API failures and edge cases

This specification ensures that the new AI question-to-response feature enhances the avatar generation demo while maintaining all existing functionality and requiring minimal technical changes.
