# Video Generation Setup Guide

## Prerequisites

Before running the video generation feature, you need to set up the following services:

### 1. Environment Variables Setup

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Fill in your API keys in the `.env` file:

   **Required for Video Generation:**
   - `DID_API_KEY` - Get from [D-ID Console](https://console.d-id.com/)
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon/public key

   **Required for Voice Generation:**
   - `ELEVENLABS_API_KEY` - Get from [ElevenLabs Console](https://elevenlabs.io/)
   - `ELEVENLABS_TERRY_CREWS_VOICE_ID` - Voice ID for Terry Crews persona
   - `ELEVENLABS_WILL_HOWARD_VOICE_ID` - Voice ID for Will Howard persona

### 2. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a storage bucket named `test-bucket-ponteai`
3. Configure RLS (Row Level Security) policies:

   ```sql
   -- Allow authenticated uploads
   CREATE POLICY "Allow authenticated uploads" ON storage.objects
   FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');
   
   -- Allow public reads
   CREATE POLICY "Allow public reads" ON storage.objects
   FOR SELECT USING (true);
   ```

4. Enable public URLs for the bucket

### 3. D-ID API Setup

1. Sign up at [D-ID Console](https://console.d-id.com/)
2. Get your API key from the dashboard
3. Ensure you have sufficient credits for video generation

### 4. ElevenLabs Setup

1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from the dashboard
3. Create or find voice IDs for your personas

## Testing the Setup

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd .. && npm run dev
   ```

3. Test the health endpoints:
   - Backend: `http://localhost:3001/health`
   - Frontend: `http://localhost:3000`

4. Test voice generation first, then video generation

## Troubleshooting

### Common Issues:

1. **"D-ID service not configured"**
   - Check that `DID_API_KEY` is set in `.env`
   - Verify the API key is valid

2. **"Supabase service not configured"**
   - Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
   - Verify the bucket `test-bucket-ponteai` exists

3. **"Audio upload failed"**
   - Check that the audio URL is accessible
   - Verify Supabase bucket permissions

4. **"Video generation failed"**
   - Check D-ID API key and credits
   - Verify the uploaded files are publicly accessible

### Debug Mode

Enable detailed logging by setting:
```
LOG_LEVEL=debug
```

This will show detailed request/response information for debugging. 