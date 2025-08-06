# Add Voice Actor C (Parker Munns) to Avatar Generation System

## Context & Motivation
This ticket adds Voice Actor C (Parker Munns) to the existing avatar generation system, expanding the available personas from two to three voice actors. Parker Munns is a tech and marketing entrepreneur persona that will provide users with an additional voice option for their avatar generation needs. The system currently supports Voice Actor A (Terry Crews) and Voice Actor B (Will Howard), and this addition maintains consistency with the existing architecture.

## Detailed Description & Requirements

### Functional Requirements:
- Add Parker Munns as a new voice actor option in all avatar generation flows
- Support voice generation using ElevenLabs API with voice ID `jtHwJJIeJSiCcvv6MzGd`
- Support video generation using D-ID API with the new voice actor
- Load 5 avatar images from Supabase storage path `avatar_assets/voice_actor_c/static/`
- Implement text personalization for Parker Munns' entrepreneurial personality
- Maintain backward compatibility with existing voice actors

### Non-Functional Requirements:
- Performance: Maintain existing response times for voice/video generation
- Security: Use secure HTTPS URLs for all image assets
- Logging: Include proper logging for new voice actor operations
- Error Handling: Graceful fallback if voice actor assets are unavailable

### Validation & Error Handling:
- Validate ElevenLabs voice ID configuration on startup
- Handle missing image assets with fallback placeholder images
- Log failed voice/video generation attempts for Parker Munns
- Maintain existing rate limiting and validation logic

## Success Criteria
- [ ] Parker Munns appears as an option in the frontend voice actor selection
- [ ] Voice generation works with ElevenLabs voice ID `jtHwJJIeJSiCcvv6MzGd`
- [ ] Video generation works with D-ID API using Parker Munns' images
- [ ] All 5 avatar images load correctly from Supabase storage
- [ ] Text personalization applies entrepreneurial personality traits
- [ ] Existing voice actors continue to function without regression
- [ ] All tests pass for new functionality
- [ ] Code reviewed and merged to main branch

## Test Plan
- `test_voice_generation_parker_munns`: Valid text + personaId 'parker-munns' → 200 + audio data
- `test_video_generation_parker_munns`: Valid payload with 'parker-munns' → 200 + video URL
- `test_avatar_images_parker_munns`: API call → 200 + 5 signed image URLs
- `test_text_personalization_parker_munns`: Valid text + 'parker-munns' → 200 + personalized text
- `test_invalid_persona_id`: Invalid personaId → 400 error
- `test_missing_voice_id_config`: Missing env var → 500 error
- `test_existing_voice_actors_unaffected`: Terry/Will still work → 200 responses

📁 Test files: `backend/src/__tests__/voice.test.ts`, `backend/src/__tests__/video.test.ts`, `src/lib/__tests__/storage.test.ts`

## Dependencies
- Depends on: Supabase storage bucket access for `avatar_assets/voice_actor_c/static/`
- Requires: ElevenLabs API key and voice ID `jtHwJJIeJSiCcvv6MzGd`
- Requires: D-ID API key for video generation
- Requires: Environment variable `ELEVENLABS_PARKER_MUNNS_VOICE_ID`

## Suggested Implementation Plan
1. **Backend Configuration Updates**
   - Add `ELEVENLABS_PARKER_MUNNS_VOICE_ID` to environment config
   - Update `PERSONA_VOICE_IDS` mapping in voice.ts
   - Update `PERSONA_IMAGES` mapping in video.ts
   - Add Parker Munns to `VOICE_ACTOR_CONFIG` in did.ts
   - Add entrepreneurial text style to `PERSONA_PROMPTS` in text.ts

2. **Frontend Updates**
   - Add Parker Munns to persona configurations in avatar-images route
   - Update any hardcoded persona lists in components

3. **Asset Verification**
   - Verify 5 images exist in Supabase: `avatar_assets/voice_actor_c/static/pic1.jpeg` through `pic5.jpeg`
   - Test signed URL generation for new voice actor

4. **Testing & Validation**
   - Add comprehensive tests for new voice actor
   - Verify integration with existing voice actors
   - Test error handling and fallback scenarios

## Effort Estimate
- Estimated effort: **3 hours**
- Assumes Supabase images are already uploaded and accessible
- Assumes ElevenLabs voice ID is valid and configured
- Assume that this is done by AI agents and not by people. For example, something that, due to constraints in how quickly human developers might be able to code, might take 1 week to implement, would take an AI agent 2 hours.

## Priority & Impact
- Priority: **Medium**
- Rationale: Expands user options and maintains feature parity with existing voice actors

## Acceptance Checklist
- [ ] Environment variable `ELEVENLABS_PARKER_MUNNS_VOICE_ID` added to config
- [ ] Backend voice generation supports 'parker-munns' persona
- [ ] Backend video generation supports 'parker-munns' persona
- [ ] Frontend avatar images API includes Parker Munns
- [ ] Text personalization applies entrepreneurial personality
- [ ] All 5 avatar images load from Supabase storage
- [ ] Comprehensive test coverage added
- [ ] Existing voice actors functionality verified
- [ ] Code reviewed and merged
- [ ] Documentation updated if needed

## Links & References
- Plan: `/planning/voice_actor_c_integration/ticket_add_voice_actor_c.md`
- PR URL: https://github.com/mark-torres10/ponte_ai_avatars/pull/32
- Linear Issue: https://linear.app/metresearch/issue/PON-54
- Related files: `backend/src/routes/voice.ts`, `backend/src/routes/video.ts`, `backend/src/routes/text.ts`, `backend/src/services/did.ts`, `src/app/api/avatar-images/route.ts`
- Supabase storage path: `avatar_assets/voice_actor_c/static/`
- ElevenLabs voice ID: `jtHwJJIeJSiCcvv6MzGd` 