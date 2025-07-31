# Video Generation Feature Documentation

## Overview

The video generation feature integrates D-ID API with Supabase file storage to create AI-powered videos from audio and avatar images. The system uploads audio and image files to Supabase, then uses D-ID to generate synchronized video content.

## Architecture

```
Frontend (Next.js) → Backend (Express) → D-ID API
                      ↓
                  Supabase Storage
```

### Flow:
1. Frontend sends audio URL and persona selection
2. Backend uploads audio and image to Supabase
3. Backend calls D-ID API with public URLs
4. D-ID generates video and returns result URL
5. Backend returns video URL to frontend

## API Endpoints

### POST /api/video/generate

**Request:**
```json
{
  "audioUrl": "https://example.com/audio.mp3",
  "personaId": "terry-crews",
  "imageIndex": 0,
  "videoFormat": "mp4",
  "quality": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoUrl": "https://d-id.com/video/abc123.mp4",
    "videoId": "abc123",
    "status": "completed",
    "progress": 100,
    "estimatedTimeRemaining": 0,
    "personaId": "terry-crews",
    "audioUrl": "https://supabase.com/audio.mp3",
    "imageUrl": "https://supabase.com/image.jpg"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Configuration

### Required Environment Variables

```bash
# D-ID API (Required for video generation)
DID_API_KEY=your_did_api_key_here

# Supabase (Required for file storage)
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# ElevenLabs (Required for voice generation)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_TERRY_CREWS_VOICE_ID=your_terry_crews_voice_id_here
ELEVENLABS_WILL_HOWARD_VOICE_ID=your_will_howard_voice_id_here
```

### Supabase Setup

1. Create a storage bucket named `test-bucket-ponteai`
2. Configure RLS policies:

```sql
-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Allow public reads
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (true);
```

3. Enable public URLs for the bucket

## Testing

### Health Check

Test all services are configured correctly:

```bash
curl http://localhost:3001/health/detailed
```

### Video Generation Test

Run the automated test suite:

```bash
npm run test:video
```

### Manual Testing

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd .. && npm run dev
   ```

3. Generate voice first, then video

## Troubleshooting

### Common Issues

#### 1. "D-ID service not configured"
- **Cause**: Missing or invalid `DID_API_KEY`
- **Solution**: Check your D-ID API key in `.env`

#### 2. "Supabase service not configured"
- **Cause**: Missing or invalid Supabase credentials
- **Solution**: Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`

#### 3. "Audio upload failed"
- **Cause**: Audio URL inaccessible or Supabase bucket issues
- **Solution**: 
  - Check audio URL is publicly accessible
  - Verify Supabase bucket exists and has correct permissions

#### 4. "Video generation failed"
- **Cause**: D-ID API issues or invalid file URLs
- **Solution**:
  - Check D-ID API key and credits
  - Verify uploaded files are publicly accessible
  - Check D-ID API status

#### 5. "CORS errors"
- **Cause**: Frontend/backend origin mismatch
- **Solution**: Ensure CORS_ORIGIN is set to `http://localhost:3000` for development

### Debug Mode

Enable detailed logging:

```bash
LOG_LEVEL=debug npm run dev
```

### Service-Specific Health Checks

```bash
# Test D-ID service
curl http://localhost:3001/health/did

# Test Supabase service
curl http://localhost:3001/health/supabase
```

## File Structure

```
backend/src/
├── routes/
│   └── video.ts              # Video generation endpoint
├── services/
│   ├── didService.ts         # D-ID API integration
│   └── supabaseService.ts    # Supabase file storage
└── types/
    └── video.ts              # TypeScript interfaces
```

## Error Codes

| Code | Description |
|------|-------------|
| `DID_API_401` | Invalid D-ID API credentials |
| `DID_API_402` | D-ID quota exceeded |
| `DID_API_429` | D-ID rate limit exceeded |
| `SUPABASE_UPLOAD_ERROR` | Supabase upload failed |
| `UPLOAD_ERROR` | General upload error |

## Performance

- **Typical video generation time**: 1-3 minutes
- **File size limits**: 10MB per request
- **Supported formats**: MP4, WebM
- **Quality options**: Low, Medium, High

## Security

- All file uploads go through Supabase with RLS policies
- D-ID API calls use Bearer token authentication
- CORS is configured for specific origins only
- Rate limiting is enabled (100 requests per 15 minutes)

## Monitoring

The system includes comprehensive logging for:
- Request/response details
- File upload progress
- D-ID API interactions
- Error tracking with request IDs

Check logs for detailed debugging information. 