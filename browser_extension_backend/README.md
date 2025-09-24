# Parker Realtime Token Service

A FastAPI backend service that mints ephemeral OpenAI Realtime API tokens for the AI Avatar Browser Extension. This service handles token generation and validation while keeping the OpenAI API key secure on the server side.

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **OpenAI Realtime API Integration**: Secure token minting for real-time voice interactions
- **Origin Validation**: Security middleware to validate request origins
- **Rate Limiting**: Prevents token abuse with configurable limits
- **Health Monitoring**: Built-in health checks and monitoring endpoints
- **CORS Support**: Configured for browser extension compatibility
- **Railway Deployment**: Ready for production deployment on Railway platform
- **Comprehensive Logging**: Structured logging for monitoring and debugging

## Architecture

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

## Setup

### Prerequisites

- Python 3.10 or higher
- uv package manager
- OpenAI API key with Realtime API access

### Installation

1. Navigate to the backend directory:
   ```bash
   cd browser_extension_backend
   ```

2. Install dependencies using uv:
   ```bash
   uv sync
   ```

3. Copy environment configuration:
   ```bash
   cp env.example .env
   ```

4. Configure environment variables in `.env`:
   ```bash
   OPENAI_API_KEY=sk-your-openai-api-key
   ALLOWED_ORIGINS=["https://www.espn.com","chrome-extension://your-extension-id"]
   CORS_ORIGINS=["https://www.espn.com","chrome-extension://your-extension-id"]
   ```

## Running the Server

### Development Mode

Run the server in development mode with auto-reload:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

Run the server directly:

```bash
uv run python -m app.main
```

### Docker

Build and run with Docker:

```bash
docker build -t parker-token-service .
docker run -p 8000:8000 --env-file .env parker-token-service
```

## API Endpoints

### Core Endpoints

- `POST /v1/realtime/token` - Generate ephemeral Realtime API token
- `GET /healthz` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

### Token Generation

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

### Health Check

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

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (required) | - |
| `REALTIME_MODEL` | OpenAI Realtime model | `gpt-realtime` |
| `REALTIME_VOICE` | Voice type | `verse` |
| `ALLOWED_ORIGINS` | Allowed request origins | `["https://www.espn.com","chrome-extension://abc123"]` |
| `CORS_ORIGINS` | CORS allowed origins | `["https://www.espn.com","chrome-extension://abc123"]` |
| `RATE_LIMIT_PER_MINUTE` | Rate limit per minute | `10` |
| `LOG_LEVEL` | Logging level | `INFO` |

### Model and Voice Options

**Available Models**:
- `gpt-realtime` (Recommended) - Latest production-ready speech-to-speech model
- `gpt-4o-realtime-preview-2024-12-17` - Previous preview version
- `gpt-4o-mini-realtime-preview-2024-12-17` - Lighter, faster model

**Available Voices**:
- `verse` (Default) - Balanced, professional voice
- `cedar` - Deeper, more authoritative voice
- `marin` - Lighter, more conversational voice

## Testing

Run tests with pytest:

```bash
uv run pytest
```

Run specific test files:

```bash
uv run pytest tests/test_token.py
uv run pytest tests/test_health.py
uv run pytest tests/test_security.py
```

## Development

### Code Formatting

Format code with black:

```bash
uv run black .
```

### Import Sorting

Sort imports with isort:

```bash
uv run isort .
```

### Linting

Run flake8 for linting:

```bash
uv run flake8 .
```

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
├── env.example               # Environment variables example
└── README.md                 # This documentation
```

## Security Features

- **Origin Validation**: Validates request origins against allowed list
- **Rate Limiting**: Prevents token abuse with configurable limits
- **API Key Protection**: OpenAI API key stored securely on server side
- **CORS Configuration**: Strict origin checking for browser requests
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Deployment

### Railway Deployment

1. **Deploy via Railway Dashboard**:
   - Create new project at [railway.com/new](https://railway.com/new)
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy automatically

2. **Deploy via Railway CLI**:
   ```bash
   # Install Railway CLI
   bash <(curl -fsSL cli.new)
   
   # Authenticate
   railway login
   
   # Deploy
   railway up
   
   # Set environment variables
   railway variables set OPENAI_API_KEY=sk-...
   ```

### Environment Variables for Production

Set these variables in Railway:

```bash
OPENAI_API_KEY=sk-your-production-key
ALLOWED_ORIGINS=["https://www.espn.com","chrome-extension://your-extension-id"]
CORS_ORIGINS=["https://www.espn.com","chrome-extension://your-extension-id"]
RATE_LIMIT_PER_MINUTE=10
LOG_LEVEL=INFO
```

## Performance

- **Response Time**: <200ms for token generation
- **Rate Limiting**: 10 requests per minute per IP
- **Token Expiration**: 10 minutes (600 seconds)
- **Health Checks**: 30-second intervals

## Monitoring

- Health check endpoint at `/healthz`
- Structured JSON logging
- OpenAI API connectivity monitoring
- Railway built-in monitoring and alerts

## Error Handling

The service handles various error scenarios:

- **403**: Origin not allowed
- **429**: Rate limit exceeded
- **502**: OpenAI API unavailable
- **500**: Internal server error

All errors return structured JSON responses with appropriate HTTP status codes.

## Integration with Browser Extension

This backend is designed to work seamlessly with the AI Avatar Browser Extension:

1. Extension requests token from `/v1/realtime/token`
2. Backend validates origin and generates OpenAI session
3. Extension receives ephemeral token for direct WebRTC connection
4. Extension establishes WebRTC connection to OpenAI Realtime API
5. Real-time voice interactions with Parker commence

## Support

For issues and questions:
- Check the health endpoint: `GET /healthz`
- Review logs for error details
- Ensure environment variables are properly configured
- Verify OpenAI API key has Realtime API access
