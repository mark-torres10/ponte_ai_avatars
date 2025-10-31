const axios = require('axios');
require('dotenv').config();

async function testDIDProductionIssue() {
  const apiKey = process.env.DID_API_KEY;
  
  if (!apiKey) {
    console.error('❌ DID_API_KEY not found in environment variables');
    return;
  }
  
  console.log('🔑 API Key length:', apiKey.length);
  console.log('🔑 API Key preview:', apiKey.substring(0, 10) + '...');
  
  // Create Basic Auth header
  const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
  console.log('🔐 Auth header preview:', authHeader.substring(0, 20) + '...');
  
  // Replicate the exact request from the production logs
  const requestData = {
    script: {
      type: 'audio',
      audio_url: 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAA...', // This is truncated in logs
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
  
  console.log('🚀 Testing D-ID API with production request data...');
  console.log('📊 Request data:', JSON.stringify(requestData, null, 2));
  
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

testDIDProductionIssue(); 