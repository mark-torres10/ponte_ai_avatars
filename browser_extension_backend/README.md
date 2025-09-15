# AI Avatar Browser Extension Backend

A FastAPI backend service for the AI Avatar Browser Extension project.

## Features

- FastAPI framework with Python 3.12
- CORS middleware for browser extension compatibility
- Health check endpoints
- Auto-generated API documentation
- Structured project setup with uv package manager

## Setup

### Prerequisites

- Python 3.12 or higher
- uv package manager

### Installation

1. Navigate to the backend directory:
   ```bash
   cd browser_extension_backend
   ```

2. Install dependencies using uv:
   ```bash
   uv sync
   ```

3. Activate the virtual environment:
   ```bash
   source .venv/bin/activate  # On Unix/macOS
   # or
   .venv\Scripts\activate     # On Windows
   ```

## Running the Server

### Development Mode

Run the server in development mode with auto-reload:

```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 3001
```

### Production Mode

Run the server directly:

```bash
uv run python main.py
```

## API Endpoints

- `GET /` - Hello world endpoint
- `GET /health` - Health check
- `GET /api/status` - API status information
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## Testing

Run tests with pytest:

```bash
uv run pytest
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
├── main.py              # FastAPI application
├── pyproject.toml       # Project configuration and dependencies
├── README.md           # This file
└── tests/              # Test files (to be created)
```

## Configuration

The server runs on:
- Host: `0.0.0.0` (all interfaces)
- Port: `3001`
- Auto-reload: Enabled in development mode

## Integration with Browser Extension

This backend is designed to work with the AI Avatar Browser Extension. The CORS middleware allows the browser extension to make requests to this API from any origin.

## Next Steps

- Add authentication endpoints
- Implement avatar generation APIs
- Add database integration
- Set up logging and monitoring
