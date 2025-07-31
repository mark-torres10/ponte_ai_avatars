#!/usr/bin/env node

/**
 * Test script for video generation flow
 * This script tests the complete video generation pipeline
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';
const TEST_PERSONA_ID = 'terry-crews';
const TEST_IMAGE_INDEX = 0;
const TEST_TEXT = 'Hello, this is a test of the voice and video generation system.';
const TEST_AUDIO_URL = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'; // Fallback test audio URL

async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await axios.get(`${API_BASE_URL}/health/detailed`);
    console.log('✅ Health check passed:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Health check failed:', error.response?.data || error.message);
    return null;
  }
}

async function testVoiceGeneration() {
  console.log('\n🎤 Testing voice generation...');
  
  const testPayload = {
    text: TEST_TEXT,
    personaId: TEST_PERSONA_ID
  };

  console.log('📤 Sending voice generation request:', JSON.stringify(testPayload, null, 2));

  try {
    const response = await axios.post(`${API_BASE_URL}/api/voice/generate`, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': `test-${Date.now()}`
      },
      timeout: 60000 // 1 minute timeout
    });

    console.log('✅ Voice generation successful:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Voice generation failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

async function testVideoGeneration(audioUrl = null) {
  console.log('\n🎬 Testing video generation...');
  
  // Use provided audio URL or fallback to test URL
  const audioUrlToUse = audioUrl || TEST_AUDIO_URL;
  
  const testPayload = {
    audioUrl: audioUrlToUse,
    personaId: TEST_PERSONA_ID,
    imageIndex: TEST_IMAGE_INDEX,
    videoFormat: 'mp4',
    quality: 'medium'
  };

  console.log('📤 Sending video generation request:', JSON.stringify(testPayload, null, 2));

  try {
    const response = await axios.post(`${API_BASE_URL}/api/video/generate`, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': `test-${Date.now()}`
      },
      timeout: 300000 // 5 minutes timeout
    });

    console.log('✅ Video generation successful:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Video generation failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

async function testIndividualServices() {
  console.log('\n🔧 Testing individual services...');
  
  // Test D-ID service
  try {
    const didResponse = await axios.get(`${API_BASE_URL}/health/did`);
    console.log('✅ D-ID service:', didResponse.data);
  } catch (error) {
    console.error('❌ D-ID service failed:', error.response?.data || error.message);
  }

  // Test Supabase service
  try {
    const supabaseResponse = await axios.get(`${API_BASE_URL}/health/supabase`);
    console.log('✅ Supabase service:', supabaseResponse.data);
  } catch (error) {
    console.error('❌ Supabase service failed:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Starting voice and video generation test suite...\n');
  
  // Test 1: Health check
  const healthStatus = await testHealthCheck();
  if (!healthStatus || healthStatus.status === 'unhealthy') {
    console.error('❌ Health check failed. Please check your configuration.');
    process.exit(1);
  }

  // Test 2: Individual services
  await testIndividualServices();

  // Test 3: Voice generation
  const voiceResult = await testVoiceGeneration();
  let generatedAudioUrl = null;
  
  if (voiceResult && voiceResult.success) {
    console.log('\n🎉 Voice generation test passed!');
    generatedAudioUrl = voiceResult.data?.audioUrl;
    console.log('📻 Generated audio URL available for video generation');
  } else {
    console.log('\n⚠️  Voice generation test failed. Will use fallback audio URL for video test.');
  }

  // Test 4: Video generation
  const videoResult = await testVideoGeneration(generatedAudioUrl);
  
  if (videoResult && videoResult.success) {
    console.log('\n🎉 All tests passed! Voice and video generation are working correctly.');
    console.log('📹 Generated video URL:', videoResult.data?.videoUrl);
  } else {
    console.log('\n⚠️  Video generation test failed. Check the logs above for details.');
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  testHealthCheck,
  testVideoGeneration,
  testIndividualServices
}; 