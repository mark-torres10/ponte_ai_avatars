# AI Question-to-Response Avatar Generation Feature

## Project Overview

Transform the existing avatar generation flow from script-based input to interactive question-based AI responses. Users can now ask questions to AI personas and receive authentic, persona-specific responses that are automatically used for voice and video generation.

## Quick Links

- **Specification**: [`spec.md`](./spec.md)
- **Planning**: [`plan_ai_question_response.md`](./plan_ai_question_response.md)
- **Todo**: [`todo.md`](./todo.md)
- **Logs**: [`logs.md`](./logs.md)

## Key Features

- **Question Input Interface**: Transform TextInput component from script input to question input
- **Pre-selected Questions**: 4 professional, entrepreneur-focused questions for quick access
- **AI Response Generation**: Use existing OpenAI endpoint to generate persona-specific responses
- **Response Display**: Show AI responses in read-only format below the input
- **Flow Integration**: AI responses automatically become the text for voice and video generation

## Pre-selected Questions

1. "What's your biggest piece of advice for someone starting their first business?"
2. "How do you handle setbacks and failures in entrepreneurship?"
3. "What's the most important lesson you've learned about building a team?"
4. "How do you stay motivated during challenging times in business?"

## Technical Approach

- **Frontend**: Modify existing TextInput component to handle questions and display responses
- **Backend**: Enhance existing OpenAI personalization endpoint for question-to-response generation
- **Integration**: Minimal changes to existing voice/video generation flow
- **State Management**: Add response state and modify text flow

## Implementation Effort

- **Frontend Changes**: 4-6 hours
- **Backend Changes**: 2-3 hours
- **Testing & Integration**: 2-3 hours
- **Total Estimate**: 8-12 hours

## Success Criteria

- Users can complete the full flow: persona selection → question input → AI response → voice generation → video generation
- Pre-selected questions work correctly and overwrite custom input
- AI responses maintain persona authenticity and are suitable for voice generation
- All existing functionality (voice/video generation) continues to work unchanged
- Response generation is reliable and handles errors gracefully

## Dependencies

- Existing OpenAI personalization endpoint
- Existing voice and video generation flow
- Current persona selection system
- TextInput component (to be modified)

## Risk Mitigation

- **Demo Risk**: Implement fallback scenarios for OpenAI API failures
- **State Management**: Careful integration of new AI response state
- **Component Transformation**: Maintain existing component dependencies
- **Testing**: Comprehensive end-to-end flow testing
