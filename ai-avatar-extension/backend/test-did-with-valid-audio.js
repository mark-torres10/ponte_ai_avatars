const axios = require('axios');
require('dotenv').config();

async function testDIDWithValidAudio() {
  const apiKey = process.env.DID_API_KEY;
  
  if (!apiKey) {
    console.error('❌ DID_API_KEY not found in environment variables');
    return;
  }
  
  console.log('🔑 API Key length:', apiKey.length);
  
  // Create Basic Auth header
  const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
  
  // Test with a valid HTTPS audio URL (using a sample from the working examples)
  const requestData = {
    script: {
      type: 'audio',
      audio_url: 'https://evfgjtpvrasitxpbftva.supabase.co/storage/v1/object/public/test-bucket-ponteai/test_user_id/will-howard/2025-08-01_02-58-51/audio_v1.mp3',
      reduce_noise: true
    },
    config: {
      result_format: 'mp4',
      fluent: true,
      pad_audio: 0.0,
      stitch: true,
      align_driver: true,
      align_expand_factor: 0.3
    },
    // ⚠️  SECURITY NOTE: Original URL contained sensitive JWT token - replaced with placeholder
    source_url: 'https://example.com/placeholder-avatar-image.jpg'
  };
  
  console.log('🚀 Testing D-ID API with valid HTTPS audio URL...');
  console.log('📊 Audio URL:', requestData.script.audio_url);
  
  try {
    const response = await axios.post('https://api.d-id.com/talks', requestData, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 120000
    });
    
    console.log('✅ D-ID API request successful!');
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    console.log('📊 Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ D-ID API request failed:');
    console.error('📊 Status:', error.response?.status);
    console.error('📊 Status Text:', error.response?.statusText);
    console.error('📊 Error message:', error.message);
    
    if (error.response?.data) {
      console.error('📊 Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDIDWithValidAudio(); 