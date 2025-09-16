# Ticket 008: FastAPI Backend for OpenAI Realtime Token Service

## Title
Setup FastAPI Backend for OpenAI Realtime API Token Management

## Description
Create a lightweight FastAPI backend service that mints ephemeral OpenAI Realtime API tokens for the browser extension. This backend handles token generation and validation while keeping the OpenAI API key secure on the server side. The service will be deployed to Railway and provides a simple token endpoint for the browser extension to consume.

## Acceptance Criteria
- [ ] FastAPI application structure created with proper project organization
- [ ] OpenAI Realtime API token minting endpoint implemented
- [ ] Origin validation and security for token requests
- [ ] Environment variable management for OpenAI API key
- [ ] Basic error handling and logging
- [ ] API documentation with FastAPI's automatic docs
- [ ] Health check endpoint for monitoring
- [ ] CORS configuration for browser extension requests
- [ ] Stateless design (no database required for MVP)
- [ ] Rate limiting to prevent token abuse
- [ ] Railway deployment configuration and deployment pipeline
- [ ] Minimal metadata logging only

## Technical Requirements
- **Framework**: FastAPI with Python 3.10+
- **Deployment**: Railway platform
- **API Integration**: OpenAI Realtime API for token minting
- **Architecture**: Stateless token service with minimal logging
- **Security**: Origin validation, rate limiting, API key protection
- **Documentation**: Automatic API docs via FastAPI
- **Monitoring**: Health check endpoint
- **Performance**: Fast token generation (<200ms response time)

## API Endpoints Specification

### Core Endpoints
- `POST /v1/realtime/token` - Generate ephemeral Realtime API token
- `GET /healthz` - Health check endpoint
- `GET /docs` - API documentation (FastAPI automatic)

### OpenAI Realtime API Integration

#### Session Creation Endpoint
**OpenAI Endpoint**: `POST https://api.openai.com/v1/realtime/sessions`

**Request Headers**:
```
Authorization: Bearer {OPENAI_API_KEY}
Content-Type: application/json
OpenAI-Beta: realtime=v1
```

**Request Body**:
```json
{
  "model": "gpt-realtime",
  "voice": "verse",
  "modalities": ["audio", "text"],
  "instructions": "You are Parker, an enthusiastic sports commentator. Respond with passion and energy, matching the user's intensity level.",
  "input_audio_format": "pcm16",
  "output_audio_format": "pcm16",
  "input_audio_transcription": {
    "model": "whisper-1"
  },
  "turn_detection": {
    "type": "server_vad",
    "threshold": 0.5,
    "prefix_padding_ms": 300,
    "silence_duration_ms": 500
  },
  "tools": [],
  "tool_choice": "auto",
  "temperature": 0.8,
  "max_response_output_tokens": 4096,
  "speed": 1.0
}
```

**Response**:
```json
{
  "id": "realtime_session_abc123",
  "object": "realtime.session",
  "created_at": 1703123456,
  "client_secret": "rt_ephemeral_token_string",
  "expires_at": 1703124056,
  "model": "gpt-realtime",
  "voice": "verse",
  "modalities": ["audio", "text"],
  "instructions": "You are Parker, an enthusiastic sports commentator...",
  "input_audio_format": "pcm16",
  "output_audio_format": "pcm16",
  "input_audio_transcription": {
    "model": "whisper-1"
  },
  "turn_detection": {
    "type": "server_vad",
    "threshold": 0.5,
    "prefix_padding_ms": 300,
    "silence_duration_ms": 500
  },
  "tools": [],
  "tool_choice": "auto",
  "temperature": 0.8,
  "max_response_output_tokens": 4096,
  "speed": 1.0
}
```

### FastAPI Backend Endpoints

#### Token Generation Endpoint
**Endpoint**: `POST /v1/realtime/token`

**Request Body**:
```json
{
  "model": "gpt-realtime",
  "voice": "verse",
  "instructions": "You are Parker, an enthusiastic sports commentator. Respond with passion and energy, matching the user's intensity level.",
  "difficulty": "easy"
}
```

**Response**:
```json
{
  "client_secret": "rt_ephemeral_token_string",
  "expires_at": 1703124056,
  "session_id": "realtime_session_abc123",
  "model": "gpt-realtime",
  "voice": "verse",
  "instructions": "You are Parker, an enthusiastic sports commentator...",
  "web_rtc_url": "wss://api.openai.com/v1/realtime"
}
```

#### Health Check Endpoint
**Endpoint**: `GET /healthz`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-21T10:30:00Z",
  "version": "1.0.0",
  "openai_status": "connected"
}
```

## Model and Voice Configuration

### Available Models
- **`gpt-realtime`** (Recommended) - Latest production-ready speech-to-speech model
- **`gpt-4o-realtime-preview-2024-12-17`** - Previous preview version
- **`gpt-4o-mini-realtime-preview-2024-12-17`** - Lighter, faster model with reduced accuracy

### Available Voices
- **`verse`** (Default) - Balanced, professional voice
- **`cedar`** - Deeper, more authoritative voice
- **`marin`** - Lighter, more conversational voice

### Audio Format Configuration
- **Input Format**: `pcm16` (16-bit PCM, 24kHz sample rate, mono, little-endian)
- **Output Format**: `pcm16` (16-bit PCM, 24kHz sample rate, mono, little-endian)

### Turn Detection Configuration
- **Type**: `server_vad` (Server-side Voice Activity Detection)
- **Threshold**: `0.5` (Sensitivity level for voice detection)
- **Prefix Padding**: `300ms` (Audio before speech detection)
- **Silence Duration**: `500ms` (Silence before turn ends)

## Error Handling and Rate Limiting

### OpenAI API Error Codes
- **400**: Bad Request (invalid parameters, CORS issues)
- **401**: Invalid credentials (expired/invalid API key)
- **402**: Insufficient credits
- **403**: Content flagged by moderation
- **408**: Request timeout
- **429**: Rate limit exceeded
- **502**: Model unavailable
- **503**: Service unavailable

### Rate Limiting Strategy
- **Token Generation**: 10 requests per minute per IP
- **OpenAI API**: Respect OpenAI's rate limits (varies by tier)
- **Retry Logic**: Exponential backoff with jitter
- **Circuit Breaker**: Fail fast after 5 consecutive errors

### Error Response Format
```json
{
  "error": {
    "code": 429,
    "message": "Rate limit exceeded. Please try again later.",
    "retry_after": 60,
    "details": {
      "limit": 10,
      "remaining": 0,
      "reset_time": "2024-12-21T10:35:00Z"
    }
  }
}
```

## Security Implementation

### Origin Validation
- **Allowed Origins**: 
  - `https://www.espn.com`
  - `chrome-extension://{extension-id}`
- **CORS Headers**: Strict origin checking
- **Referer Validation**: Additional security layer

### API Key Management
- **Environment Variables**: `OPENAI_API_KEY` (server-side only)
- **Token Expiration**: 10 minutes (600 seconds)
- **Single Use**: Each token can only be used once
- **Audit Logging**: Track token generation and usage

### Rate Limiting Implementation
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

@limiter.limit("10/minute")
async def create_token(request: Request):
    # Token creation logic
    pass
```

## Environment Configuration

### Required Environment Variables
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-...
REALTIME_MODEL=gpt-realtime
REALTIME_VOICE=verse
TOKEN_TTL_SECONDS=600

# Security Configuration
ALLOWED_ORIGINS=["https://www.espn.com","chrome-extension://abc123"]
CORS_ORIGINS=["https://www.espn.com","chrome-extension://abc123"]

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_BURST=5

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
```

### Optional Configuration
```bash
# Advanced Settings
DEFAULT_INSTRUCTIONS="You are Parker, an enthusiastic sports commentator..."
DEFAULT_TEMPERATURE=0.8
DEFAULT_MAX_TOKENS=4096
DEFAULT_SPEED=1.0

# Monitoring
HEALTH_CHECK_INTERVAL=30
METRICS_ENABLED=true
```

## Implementation Example

### FastAPI Application Structure
```python
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import httpx
import os
from datetime import datetime, timedelta
import logging

app = FastAPI(title="Parker Realtime Token Service", version="1.0.0")

# Rate limiting setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", []),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# OpenAI client
openai_client = httpx.AsyncClient(
    base_url="https://api.openai.com/v1",
    headers={
        "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
        "OpenAI-Beta": "realtime=v1"
    }
)

@app.post("/v1/realtime/token")
@limiter.limit("10/minute")
async def create_realtime_token(
    request: Request,
    token_request: TokenRequest
):
    """Generate ephemeral OpenAI Realtime API token"""
    try:
        # Validate origin
        origin = request.headers.get("origin")
        if origin not in os.getenv("ALLOWED_ORIGINS", []):
            raise HTTPException(status_code=403, detail="Origin not allowed")
        
        # Create OpenAI session
        session_response = await openai_client.post(
            "/realtime/sessions",
            json={
                "model": token_request.model,
                "voice": token_request.voice,
                "modalities": ["audio", "text"],
                "instructions": token_request.instructions,
                "input_audio_format": "pcm16",
                "output_audio_format": "pcm16",
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "prefix_padding_ms": 300,
                    "silence_duration_ms": 500
                },
                "temperature": 0.8,
                "max_response_output_tokens": 4096,
                "speed": 1.0
            }
        )
        
        if session_response.status_code != 200:
            raise HTTPException(
                status_code=session_response.status_code,
                detail=f"OpenAI API error: {session_response.text}"
            )
        
        session_data = session_response.json()
        
        return {
            "client_secret": session_data["client_secret"],
            "expires_at": session_data["expires_at"],
            "session_id": session_data["id"],
            "model": session_data["model"],
            "voice": session_data["voice"],
            "instructions": session_data["instructions"],
            "web_rtc_url": "wss://api.openai.com/v1/realtime"
        }
        
    except httpx.HTTPError as e:
        logging.error(f"OpenAI API error: {e}")
        raise HTTPException(status_code=502, detail="OpenAI API unavailable")
    except Exception as e:
        logging.error(f"Token creation error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/healthz")
async def health_check():
    """Health check endpoint"""
    try:
        # Test OpenAI API connectivity
        test_response = await openai_client.get("/models")
        openai_status = "connected" if test_response.status_code == 200 else "disconnected"
    except:
        openai_status = "disconnected"
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0",
        "openai_status": openai_status
    }
```

## Data Models

### Pydantic Models
```python
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class ModelType(str, Enum):
    GPT_REALTIME = "gpt-realtime"
    GPT_4O_REALTIME_PREVIEW = "gpt-4o-realtime-preview-2024-12-17"
    GPT_4O_MINI_REALTIME_PREVIEW = "gpt-4o-mini-realtime-preview-2024-12-17"

class VoiceType(str, Enum):
    VERSE = "verse"
    CEDAR = "cedar"
    MARIN = "marin"

class DifficultyLevel(str, Enum):
    EASY = "easy"
    SAVAGE = "savage"

class TokenRequest(BaseModel):
    model: ModelType = Field(default=ModelType.GPT_REALTIME)
    voice: VoiceType = Field(default=VoiceType.VERSE)
    instructions: Optional[str] = Field(default=None)
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.EASY)

class TokenResponse(BaseModel):
    client_secret: str = Field(..., description="Ephemeral token for Realtime API")
    expires_at: int = Field(..., description="Unix timestamp when token expires")
    session_id: str = Field(..., description="OpenAI session ID")
    model: str = Field(..., description="Model used for the session")
    voice: str = Field(..., description="Voice used for the session")
    instructions: str = Field(..., description="System instructions")
    web_rtc_url: str = Field(..., description="WebRTC connection URL")

class ErrorResponse(BaseModel):
    error: dict = Field(..., description="Error details")

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Current timestamp")
    version: str = Field(..., description="Service version")
    openai_status: str = Field(..., description="OpenAI API status")
```

## Testing Specifications

### Unit Tests
```python
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import json

@pytest.fixture
def client():
    from main import app
    return TestClient(app)

@pytest.fixture
def mock_openai_response():
    return {
        "id": "realtime_session_abc123",
        "object": "realtime.session",
        "created_at": 1703123456,
        "client_secret": "rt_ephemeral_token_string",
        "expires_at": 1703124056,
        "model": "gpt-realtime",
        "voice": "verse"
    }

def test_create_token_success(client, mock_openai_response):
    with patch('httpx.AsyncClient.post', new_callable=AsyncMock) as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = mock_openai_response
        
        response = client.post(
            "/v1/realtime/token",
            json={
                "model": "gpt-realtime",
                "voice": "verse",
                "difficulty": "easy"
            },
            headers={"origin": "https://www.espn.com"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "client_secret" in data
        assert data["model"] == "gpt-realtime"

def test_create_token_invalid_origin(client):
    response = client.post(
        "/v1/realtime/token",
        json={"model": "gpt-realtime", "voice": "verse"},
        headers={"origin": "https://malicious-site.com"}
    )
    
    assert response.status_code == 403
    assert "Origin not allowed" in response.json()["detail"]

def test_create_token_rate_limit(client):
    # Test rate limiting by making multiple requests
    for _ in range(11):  # Exceed rate limit of 10/minute
        response = client.post(
            "/v1/realtime/token",
            json={"model": "gpt-realtime", "voice": "verse"},
            headers={"origin": "https://www.espn.com"}
        )
    
    assert response.status_code == 429

def test_health_check(client):
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "version" in data
```

### Integration Tests
```python
import pytest
import httpx
from unittest.mock import patch

@pytest.mark.asyncio
async def test_openai_api_integration():
    """Test actual OpenAI API integration"""
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        # Test with mock OpenAI API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/realtime/sessions",
                headers={
                    "Authorization": "Bearer test-key",
                    "OpenAI-Beta": "realtime=v1"
                },
                json={
                    "model": "gpt-realtime",
                    "voice": "verse",
                    "modalities": ["audio", "text"]
                }
            )
            # Handle expected 401 for test key
            assert response.status_code in [200, 401]
```

### Performance Tests
```python
import time
import asyncio

@pytest.mark.asyncio
async def test_token_generation_performance():
    """Test token generation meets performance requirements"""
    start_time = time.time()
    
    # Simulate token generation
    response = await create_realtime_token(mock_request, mock_token_request)
    
    end_time = time.time()
    duration = end_time - start_time
    
    # Should complete within 200ms
    assert duration < 0.2, f"Token generation took {duration}s, expected <0.2s"
```

## Railway Deployment Configuration

### Railway Setup Methods

Railway supports multiple deployment methods for FastAPI applications:

#### **Method 1: One-Click Deploy from Template (Recommended for MVP)**
1. **Template Selection**: Use Railway's FastAPI template
2. **Deployment**: Click "Deploy" on [Railway FastAPI Template](https://railway.com/deploy/fastapi-1)
3. **Ejection**: Eject from template to create your own GitHub repository
4. **Customization**: Modify the ejected code for our specific requirements

#### **Method 2: Deploy from GitHub Repository**
1. **Repository Setup**: Push code to GitHub repository
2. **Railway Project**: Create new project at [railway.com/new](https://railway.com/new)
3. **GitHub Integration**: Click "Deploy from GitHub repo"
4. **Repository Selection**: Select your FastAPI repository
5. **Deploy**: Click "Deploy Now"

#### **Method 3: CLI Deployment**
```bash
# Install Railway CLI
bash <(curl -fsSL cli.new)

# Authenticate with Railway
railway login

# Initialize project
railway init

# Deploy application
railway up

# Generate public domain
railway domain
```

#### **Method 4: Dockerfile Deployment**
```dockerfile
# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Railway sets PORT environment variable)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/healthz || exit 1

# Run application with Hypercorn (recommended for production)
CMD ["hypercorn", "main:app", "--bind", "0.0.0.0:$PORT"]
```

### Railway Configuration Files

#### **railway.json** (Config as Code)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "hypercorn main:app --bind 0.0.0.0:$PORT",
    "healthcheckPath": "/healthz",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### **railway.toml** (Alternative Config Format)
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "hypercorn main:app --bind 0.0.0.0:$PORT"
healthcheckPath = "/healthz"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Environment Variables Configuration

#### **Required Environment Variables**
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-...
REALTIME_MODEL=gpt-realtime
REALTIME_VOICE=verse
TOKEN_TTL_SECONDS=600

# Security Configuration
ALLOWED_ORIGINS=["https://www.espn.com","chrome-extension://abc123"]
CORS_ORIGINS=["https://www.espn.com","chrome-extension://abc123"]

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_BURST=5

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
```

#### **Setting Environment Variables in Railway**

**Via Railway Dashboard:**
1. Navigate to your service in Railway dashboard
2. Go to **Settings** → **Variables** tab
3. Click **+ New Variable**
4. Add each environment variable with its value
5. Mark sensitive variables (like API keys) as **Secret**

**Via Railway CLI:**
```bash
# Set environment variables (requires Railway CLI)
railway variables set OPENAI_API_KEY=sk-...
railway variables set REALTIME_MODEL=gpt-realtime
railway variables set ALLOWED_ORIGINS='["https://www.espn.com","chrome-extension://abc123"]'

# Set secret variables
railway variables set OPENAI_API_KEY=sk-... --secret
```

### Production Deployment Checklist

#### **Pre-Deployment**
- [ ] All environment variables configured
- [ ] Health check endpoint working (`/healthz`)
- [ ] CORS properly configured for production domains
- [ ] Rate limiting configured appropriately
- [ ] Logging configured for production
- [ ] Error handling implemented
- [ ] Security headers configured

#### **Deployment Steps**
1. **Code Preparation**:
   ```bash
   # Ensure all dependencies are in requirements.txt
   pip freeze > requirements.txt
   
   # Test locally with production settings
   python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. **Railway Deployment**:
   ```bash
   # Deploy via CLI
   railway up
   
   # Or push to GitHub and deploy via dashboard
   git push origin main
   ```

3. **Domain Configuration**:
   ```bash
   # Generate public domain
   railway domain
   
   # Or configure custom domain
   railway domain add your-custom-domain.com
   ```

4. **Health Check Validation**:
   ```bash
   # Test health endpoint
   curl https://your-app.railway.app/healthz
   
   # Expected response:
   # {"status": "healthy", "timestamp": "...", "version": "1.0.0", "openai_status": "connected"}
   ```

#### **Post-Deployment Verification**
- [ ] Application starts successfully
- [ ] Health check endpoint responds correctly
- [ ] API documentation accessible at `/docs`
- [ ] Token generation endpoint works
- [ ] Origin validation blocks unauthorized requests
- [ ] Rate limiting functions correctly
- [ ] Logs are being generated properly
- [ ] Performance meets requirements (<200ms response time)

### Railway-Specific Considerations

#### **Port Configuration**
- Railway automatically sets the `PORT` environment variable
- Application must bind to `0.0.0.0:$PORT`
- Default port is usually 3000, but always use `$PORT` environment variable

#### **Health Checks**
- Railway uses health checks for deployment validation
- Health check endpoint should respond within 100 seconds
- Failed health checks trigger automatic restarts

#### **Scaling**
- Railway automatically scales based on traffic
- Vertical scaling: Increase CPU/memory as needed
- Horizontal scaling: Multiple instances for high availability

#### **Monitoring**
- Railway provides built-in monitoring and logging
- Access logs via Railway dashboard
- Set up alerts for critical errors

#### **Cost Optimization**
- Railway offers free tier with usage limits
- Monitor usage to avoid unexpected charges
- Consider Railway Metal for production workloads

### Docker Configuration
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/healthz || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Requirements
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
httpx==0.25.2
slowapi==0.1.9
pydantic==2.5.0
python-multipart==0.0.6
python-dotenv==1.0.0
```

## User Story
As a browser extension developer, I need a FastAPI backend that can mint secure, ephemeral OpenAI Realtime API tokens, so that the Debate Mode and Hot Take Mode features can establish direct WebRTC connections for real-time voice interactions with Parker.

## Definition of Done
- [ ] FastAPI application structure is properly organized
- [ ] OpenAI Realtime API token minting is working correctly
- [ ] Origin validation and security are implemented
- [ ] Rate limiting prevents token abuse
- [ ] All API endpoints are implemented and functional
- [ ] Railway deployment is successful and accessible
- [ ] API documentation is available and accurate
- [ ] Health check endpoint responds correctly
- [ ] CORS is configured for browser extension requests
- [ ] Error handling is implemented for all endpoints
- [ ] Environment variables are properly managed
- [ ] Performance meets requirements (<200ms response time)
- [ ] Code is clean, well-structured, and documented
- [ ] Security best practices are followed
- [ ] Testing completed for all endpoints
- [ ] Integration testing with browser extension completed

## Dependencies
- Ticket 002 (Debate Mode) - Requires backend for Realtime API tokens
- Ticket 003 (Hot Take Mode) - Requires backend for Realtime API tokens
- OpenAI API access and credentials
- Railway account and deployment setup

## Architecture Overview
```
Extension (client)
├── WebRTC connection to OpenAI Realtime API
├── Audio I/O: getUserMedia, WebRTC streaming
├── Token fetch: POST /v1/realtime/token → receives ephemeral client_secret
└── Manages ephemeral thread state; "Save transcript" writes to local IndexedDB

FastAPI (backend)
├── POST /v1/realtime/token → validates origin/auth
├── Calls OpenAI /v1/realtime/sessions with server key
└── Returns client_secret to browser (no audio processing)

OpenAI Realtime API
└── Handles ASR + LLM + TTS + turn-taking via WebRTC
```

## Subtask Breakdown

### **PON-96-1: Project Structure & Environment Setup** (1 day)
- Create FastAPI project structure
- Set up Python environment with uv
- Install and configure dependencies
- Set up development environment
- Create basic project documentation

### **PON-96-2: Basic FastAPI Application & Health Check** (1 day)
- Implement basic FastAPI app
- Add health check endpoint
- Configure CORS middleware
- Set up basic error handling
- Create initial API documentation

### **PON-96-3: OpenAI API Integration & Token Generation** (2 days)
- Implement OpenAI Realtime API client
- Create token generation endpoint
- Add request/response models
- Implement error handling
- Add basic logging

### **PON-96-4: Security & Validation Implementation** (1 day)
- Add origin validation middleware
- Implement rate limiting
- Add API key management
- Create security configuration
- Add security tests

### **PON-96-5: Advanced Configuration & Model Management** (1 day)
- Implement model and voice configuration
- Add difficulty-based instructions
- Create environment configuration
- Add advanced logging
- Implement monitoring

### **PON-96-6: Testing Suite Implementation** (1 day)
- Create comprehensive unit tests
- Implement integration tests
- Add performance tests
- Create security tests
- Validate all requirements

### **PON-96-7: Deployment Configuration & Railway Setup** (1 day)
- Create Docker configuration
- Set up Railway deployment
- Configure production environment
- Implement monitoring
- Test deployment

### **PON-96-8: Documentation & Final Integration** (1 day)
- Create comprehensive documentation
- Add deployment guides
- Perform end-to-end testing
- Validate integration requirements
- Final cleanup and optimization

## Implementation Phases

### **Phase 1: Foundation & Basic Setup** (PON-96-1, PON-96-2)
- **Duration**: 2 days
- **Deliverables**: Working FastAPI app with health check
- **Success Criteria**: App starts, health endpoint works, CORS configured

### **Phase 2: Core Token Service** (PON-96-3, PON-96-4)
- **Duration**: 3 days
- **Deliverables**: Token generation with security
- **Success Criteria**: OpenAI integration works, security implemented

### **Phase 3: Advanced Features & Testing** (PON-96-5, PON-96-6)
- **Duration**: 2 days
- **Deliverables**: Full configuration and comprehensive testing
- **Success Criteria**: All features work, tests pass, performance validated

### **Phase 4: Deployment & Documentation** (PON-96-7, PON-96-8)
- **Duration**: 2 days
- **Deliverables**: Production deployment and complete documentation
- **Success Criteria**: Deployed to Railway, documentation complete

## Project Structure
```
browser_extension_backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── models/                 # Pydantic models
│   │   ├── __init__.py
│   │   ├── token.py           # Token request/response models
│   │   └── health.py          # Health check models
│   ├── services/              # Business logic
│   │   ├── __init__.py
│   │   ├── openai_client.py   # OpenAI API client
│   │   └── token_service.py   # Token generation logic
│   ├── middleware/            # Custom middleware
│   │   ├── __init__.py
│   │   ├── security.py        # Origin validation
│   │   └── rate_limit.py      # Rate limiting
│   └── config/                # Configuration
│       ├── __init__.py
│       └── settings.py        # Environment settings
├── tests/                     # Test suite
│   ├── __init__.py
│   ├── test_token.py          # Token endpoint tests
│   ├── test_health.py         # Health check tests
│   └── test_security.py       # Security tests
├── requirements.txt           # Dependencies
├── Dockerfile                 # Container configuration
├── railway.json              # Railway deployment config
└── README.md                 # Documentation
```

## Effort Estimate
8 days (broken into 8 subtasks)

## Priority
High

## Labels
- backend
- api
- deployment
- integration
