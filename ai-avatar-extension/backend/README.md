# AI Avatar Browser Extension Backend

Express.js API service for the AI Avatar Browser Extension - Sports Commentary MVP. This backend handles all external API integrations (OpenAI, ElevenLabs, Wikipedia) and provides REST endpoints for the Chrome extension to generate sports commentary on ESPN NBA boxscore pages.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your API keys and configuration
```

3. Start development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── src/
│   ├── __tests__/          # Test files
│   ├── middleware/         # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── app.ts             # Express app configuration
│   └── index.ts           # Server entry point
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production/test) | - | Yes |
| `PORT` | Server port | 3001 | Yes |
| `CORS_ORIGIN` | Frontend URL for CORS | http://localhost:3000 | Yes |
| `OPENAI_API_KEY` | OpenAI API key for commentary generation | - | Yes |
| `ELEVENLABS_API_KEY` | ElevenLabs API key for audio synthesis | - | Yes |
| `WIKIPEDIA_API_KEY` | Wikipedia API key for team information | - | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 | No |
| `LOG_LEVEL` | Logging level | info | No |

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 📡 API Endpoints

### Health Check

#### GET /health
Returns basic health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 123.456,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "environment": "development"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /health/detailed
Returns detailed system information including memory usage, CPU usage, and configuration.

### Avatar Generation (Coming Soon)

#### POST /api/v1/avatar/generate-text
Generate personalized text using OpenAI.

#### POST /api/v1/avatar/generate-voice
Generate voice using ElevenLabs.

#### POST /api/v1/avatar/generate-video
Generate video using D-ID.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Test Structure

- `health.test.ts` - Health check endpoint tests
- `error-handling.test.ts` - Error handling and middleware tests
- `config.test.ts` - Configuration validation tests

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Request validation
- **Error Handling** - Comprehensive error handling

## 📊 Logging

The application uses structured logging with different levels:

- **ERROR** - Application errors
- **WARN** - Warning messages
- **INFO** - General information
- **DEBUG** - Debug information

Logs include:
- Request/response logging
- API call performance metrics
- Error tracking with stack traces
- Request ID correlation

## 🚀 Deployment

### Production Build

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔗 Integration with Frontend

The backend is designed to work with the Next.js frontend:

- CORS configured for `http://localhost:3000`
- RESTful API design
- Consistent error response format
- Request ID tracking for debugging

## 📈 Monitoring

The application includes:

- Health check endpoints for monitoring
- Request/response logging
- Performance metrics
- Error tracking
- System resource monitoring

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## 📝 License

MIT License - see LICENSE file for details. 