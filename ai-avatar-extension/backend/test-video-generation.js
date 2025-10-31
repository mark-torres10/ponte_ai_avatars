const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function testVideoGeneration() {
  const apiKey = process.env.DID_API_KEY;
  
  if (!apiKey) {
    console.error('❌ DID_API_KEY not found in environment variables');
    return;
  }
  
  console.log('🔑 API Key length:', apiKey.length);
  
  // Create Basic Auth header
  const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
  
  // Use environment variables or placeholder URLs for testing
  // NOTE: For actual testing, get these URLs from the Supabase console for the given assets
  const audioUrl = process.env.TEST_AUDIO_URL || 'https://example.com/test-audio.mp3';
  const imageUrl = process.env.TEST_IMAGE_URL || 'https://example.com/test-image.jpeg';
  
  try {
    console.log('🚀 Testing D-ID video generation with audio...');
    console.log('🎵 Audio URL:', audioUrl);
    console.log('🖼️ Image URL:', imageUrl);
    
    // Test creating a talk request with audio
    const talkData = {
      script: {
        type: 'audio',
        audio_url: audioUrl,
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
      source_url: imageUrl
    };
    
    console.log('📝 Creating talk request with data:', JSON.stringify(talkData, null, 2));
    
    const response = await axios.post('https://api.d-id.com/talks', talkData, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Talk request created successfully!');
    console.log('📊 Status:', response.status);
    console.log('📊 Talk ID:', response.data.id);
    console.log('📊 Status:', response.data.status);
    
    // Poll for completion
    if (response.data.id) {
      console.log('🔄 Polling for video completion...');
      const completedTalk = await pollForCompletion(response.data.id, authHeader);
      
      if (completedTalk && completedTalk.result_url) {
        console.log('🎉 Video generation completed!');
        console.log('📹 Video URL:', completedTalk.result_url);
        console.log('⏱️ Duration:', completedTalk.duration);
        
        // Download the video
        console.log('⬇️ Downloading video...');
        const videoBuffer = await downloadVideo(completedTalk.result_url);
        console.log('✅ Video downloaded, size:', videoBuffer.byteLength, 'bytes');
        
        // Save locally
        const localFilePath = await saveVideoLocally(videoBuffer, completedTalk.id);
        console.log('💾 Video saved locally at:', localFilePath);
        
        // Save metadata for the next test
        const metadata = {
          talkId: completedTalk.id,
          localFilePath: localFilePath,
          videoUrl: completedTalk.result_url,
          duration: completedTalk.duration,
          size: videoBuffer.byteLength,
          timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync('video-metadata.json', JSON.stringify(metadata, null, 2));
        console.log('📄 Metadata saved to video-metadata.json');
      }
    }
    
  } catch (error) {
    console.error('❌ D-ID video generation failed:');
    console.error('📊 Status:', error.response?.status);
    console.error('📊 Status Text:', error.response?.statusText);
    console.error('📊 Error message:', error.message);
    
    if (error.response?.data) {
      console.error('📊 Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function pollForCompletion(talkId, authHeader) {
  const maxAttempts = 60; // 5 minutes max (5 second intervals)
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      console.log(`📊 Polling attempt ${attempts + 1}/${maxAttempts}...`);
      
      const response = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      const data = response.data;
      const status = data.status;
      
      console.log(`📊 Status: ${status}`);
      
      switch (status) {
        case 'done':
          console.log('🎉 Video generation completed successfully!');
          return data;
          
        case 'error':
          console.error('❌ Video generation failed:', data.error);
          throw new Error(`Video generation failed: ${data.error?.description || 'Unknown error'}`);
          
        case 'created':
        case 'started':
          console.log('⏳ Still processing...');
          break;
          
        default:
          console.log(`⚠️ Unknown status: ${status}`);
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
    } catch (error) {
      console.error(`❌ Error polling (attempt ${attempts + 1}):`, error.message);
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  throw new Error(`Video generation timeout: exceeded ${maxAttempts} polling attempts`);
}

async function downloadVideo(videoUrl) {
  try {
    console.log('⬇️ Downloading video from:', videoUrl);
    
    const response = await axios.get(videoUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    const videoBuffer = Buffer.from(response.data);
    console.log('✅ Video downloaded successfully, size:', videoBuffer.length, 'bytes');
    
    return videoBuffer;
  } catch (error) {
    console.error('❌ Failed to download video:', error.message);
    throw error;
  }
}

async function saveVideoLocally(videoBuffer, talkId) {
  try {
    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `did-video-${talkId}-${timestamp}.mp4`;
    const filePath = path.join(downloadsDir, filename);
    
    // Write the video buffer to file
    fs.writeFileSync(filePath, videoBuffer);
    
    console.log('💾 Video saved locally:', filePath);
    return filePath;
    
  } catch (error) {
    console.error('❌ Failed to save video locally:', error.message);
    throw error;
  }
}

testVideoGeneration(); 