# Ticket 008: FastAPI Backend Setup and Deployment

## Title
Setup FastAPI Backend with ElevenLabs and OpenAI Integration for Railway Deployment

## Description
Create a new FastAPI backend service that will power the Debate Mode and Hot Take Mode features. This backend will handle audio processing, AI-powered responses, and text-to-speech synthesis. The service will be deployed to Railway and provide REST APIs for the browser extension to consume.

## Acceptance Criteria
- [ ] FastAPI application structure created with proper project organization
- [ ] ElevenLabs API integration for text-to-speech synthesis
- [ ] OpenAI API integration for ASR (Whisper) and LLM responses
- [ ] `/v1/debates/*` API endpoints implemented
- [ ] Audio processing endpoints for WebAudio input (base64 wav/opus)
- [ ] Streaming text + TTS audio response capability
- [ ] Railway deployment configuration and deployment pipeline
- [ ] Environment variable management for API keys
- [ ] Basic error handling and logging
- [ ] API documentation with FastAPI's automatic docs
- [ ] Health check endpoint for monitoring
- [ ] CORS configuration for browser extension requests
- [ ] Stateless design (no database required for MVP)
- [ ] Minimal metadata logging only

## Technical Requirements
- **Framework**: FastAPI with Python 3.10+
- **Deployment**: Railway platform
- **API Integrations**: 
  - ElevenLabs API for TTS synthesis to MP3/OPUS
  - OpenAI API for ASR (Whisper) and LLM (GPT-4) responses
- **Audio Processing**: Handle WebAudio chunks and base64 audio formats
- **Response Format**: Streamed text + TTS audio for Parker's replies
- **Architecture**: Stateless design with minimal logging
- **Security**: API key management, CORS configuration
- **Documentation**: Automatic API docs via FastAPI
- **Monitoring**: Health check endpoint
- **Performance**: Optimized for low-latency responses

## API Endpoints Specification

### Core Endpoints
- `POST /v1/debates/audio` - Process audio input and return debate response
- `POST /v1/debates/text` - Process text input and return debate response
- `POST /v1/hot-takes/generate` - Generate daily hot take content
- `GET /health` - Health check endpoint
- `GET /docs` - API documentation (FastAPI automatic)

### Request/Response Format
```json
// Audio Input Request
{
  "audio_data": "base64_encoded_audio",
  "audio_format": "wav|opus",
  "difficulty": "easy|savage",
  "mode": "debate|hot_take"
}

// Response
{
  "text_response": "Parker's response text",
  "audio_url": "temporary_audio_url",
  "confidence": 0.85,
  "processing_time_ms": 1200
}
```

## User Story
As a browser extension developer, I need a FastAPI backend that can process audio and text inputs to generate Parker's AI responses with voice synthesis, so that the Debate Mode and Hot Take Mode features can provide interactive AI commentary.

## Definition of Done
- [ ] FastAPI application structure is properly organized
- [ ] ElevenLabs integration is working for TTS synthesis
- [ ] OpenAI integration is working for ASR and LLM responses
- [ ] All API endpoints are implemented and functional
- [ ] Railway deployment is successful and accessible
- [ ] API documentation is available and accurate
- [ ] Health check endpoint responds correctly
- [ ] CORS is configured for browser extension requests
- [ ] Error handling is implemented for all endpoints
- [ ] Environment variables are properly managed
- [ ] Performance meets requirements (<2s response time)
- [ ] Code is clean, well-structured, and documented
- [ ] Security best practices are followed
- [ ] Testing completed for all endpoints
- [ ] Integration testing with browser extension completed

## Dependencies
- Ticket 002 (Debate Mode) - Requires backend for audio processing
- Ticket 003 (Hot Take Mode) - Requires backend for content generation
- ElevenLabs API access and credentials
- OpenAI API access and credentials
- Railway account and deployment setup

## Architecture Overview
```
Extension (client)
├── WebAudio (mic) → send audio chunks (or base64 wav/opus) to backend
├── Receives streamed text + TTS audio for Parker's reply
└── Manages ephemeral thread state; "Save transcript" writes to local IndexedDB

FastAPI (backend)
├── /v1/debates/* APIs
├── OpenAI: ASR (Whisper), LLM (for banter + summary), optional Realtime for low-latency
├── ElevenLabs: TTS synth to MP3/OPUS
└── Stateless (no DB needed for MVP); logs minimal metadata only
```

## Effort Estimate
6 days

## Priority
High

## Labels
- backend
- api
- deployment
- integration
