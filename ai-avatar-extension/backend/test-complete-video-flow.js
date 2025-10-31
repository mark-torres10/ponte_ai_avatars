const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DID_API_KEY = process.env.DID_API_KEY;

async function testCompleteVideoFlow() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DID_API_KEY) {
    console.error('❌ Required environment variables not found');
    return;
  }
  
  console.log('🚀 Testing complete video generation flow...');
  
  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    console.log('✅ Supabase client initialized');
    
    // Step 1: Create signed URLs for audio and image
    console.log('\n📝 Step 1: Creating signed URLs...');
    
    // Audio file (existing from previous voice generation)
    const audioFileKey = 'test_user_id/will-howard/2025-08-01_02-58-51/audio_v1.mp3';
    const audioBucket = 'test-bucket-ponteai';
    
    // Image file (from avatar assets)
    const imageFileKey = 'avatar_assets/voice_actor_b/static/pic1.jpeg';
    const imageBucket = 'ponteai-assets';
    
    // Create signed URLs
    const { data: audioSignedUrlData } = await supabase.storage
      .from(audioBucket)
      .createSignedUrl(audioFileKey, 7200); // 2 hours
    
    const { data: imageSignedUrlData } = await supabase.storage
      .from(imageBucket)
      .createSignedUrl(imageFileKey, 7200); // 2 hours
    
    if (!audioSignedUrlData?.signedUrl || !imageSignedUrlData?.signedUrl) {
      throw new Error('Failed to create signed URLs');
    }
    
    console.log('✅ Signed URLs created:');
    console.log('🎵 Audio URL:', audioSignedUrlData.signedUrl.substring(0, 50) + '...');
    console.log('🖼️ Image URL:', imageSignedUrlData.signedUrl.substring(0, 50) + '...');
    
    // Step 2: Generate video with D-ID
    console.log('\n🎬 Step 2: Generating video with D-ID...');
    
    const authHeader = `Basic ${Buffer.from(`${DID_API_KEY}:`).toString('base64')}`;
    const text = "Greetings, allow me to introduce you to an innovative product poised to transform your everyday tasks significantly. This cutting-edge solution boasts a range of remarkable features designed to enhance your efficiency and streamline your daily activities.";
    
    const talkData = {
      script: {
        type: 'audio',
        audio_url: audioSignedUrlData.signedUrl,
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
      source_url: imageSignedUrlData.signedUrl
    };
    
    console.log('📝 Creating D-ID talk request...');
    
    const response = await axios.post('https://api.d-id.com/talks', talkData, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Talk request created:', response.data.id);
    
    // Step 3: Poll for completion
    console.log('\n🔄 Step 3: Polling for video completion...');
    
    const completedTalk = await pollForCompletion(response.data.id, authHeader);
    console.log('✅ Video generation completed!');
    console.log('📹 Video URL:', completedTalk.result_url);
    console.log('⏱️ Duration:', completedTalk.duration);
    
    // Step 4: Download video
    console.log('\n⬇️ Step 4: Downloading video...');
    
    const videoResponse = await axios.get(completedTalk.result_url, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    const videoBuffer = Buffer.from(videoResponse.data);
    console.log('✅ Video downloaded, size:', videoBuffer.length, 'bytes');
    
    // Step 5: Upload to Supabase with proper metadata
    console.log('\n⬆️ Step 5: Uploading to Supabase with metadata...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const requesterId = 'test_user_id';
    const voiceActorId = 'will-howard';
    const version = 1;
    
    // Generate file paths
    const videoFileKey = `${requesterId}/${voiceActorId}/${timestamp}/video_v${version}.mp4`;
    const metadataKey = `${requesterId}/${voiceActorId}/${timestamp}/video_metadata.json`;
    
    // Upload video file
    const { error: videoError } = await supabase.storage
      .from('test-bucket-ponteai')
      .upload(videoFileKey, videoBuffer, {
        contentType: 'video/mp4',
        upsert: false
      });
    
    if (videoError) {
      throw new Error(`Video upload failed: ${videoError.message}`);
    }
    
    console.log('✅ Video uploaded:', videoFileKey);
    
    // Create comprehensive metadata
    const videoMetadata = {
      actor: voiceActorId,
      text: text,
      audio_file_key: audioFileKey,
      video_file_key: videoFileKey,
      image_file_key: imageFileKey,
      generation_timestamp: timestamp,
      api_response_data: {
        did_response: {
          talk_id: completedTalk.id,
          status: completedTalk.status,
          duration: completedTalk.duration,
          size: videoBuffer.length
        }
      },
      version: version,
      format: 'mp4',
      // Additional metadata for tracking
      source_audio_bucket: audioBucket,
      source_image_bucket: imageBucket,
      audio_signed_url_expiry: new Date(Date.now() + 7200000).toISOString(), // 2 hours
      image_signed_url_expiry: new Date(Date.now() + 7200000).toISOString(), // 2 hours
      processing_duration_seconds: Math.round((Date.now() - new Date(timestamp).getTime()) / 1000)
    };
    
    // Upload metadata
    const metadataBuffer = Buffer.from(JSON.stringify(videoMetadata, null, 2));
    
    const { error: metadataError } = await supabase.storage
      .from('test-bucket-ponteai')
      .upload(metadataKey, metadataBuffer, {
        contentType: 'application/json',
        upsert: false
      });
    
    if (metadataError) {
      console.warn('⚠️ Metadata upload failed:', metadataError.message);
    } else {
      console.log('✅ Metadata uploaded:', metadataKey);
    }
    
    // Get public URLs
    const { data: videoPublicUrlData } = supabase.storage
      .from('test-bucket-ponteai')
      .getPublicUrl(videoFileKey);
    
    const { data: metadataPublicUrlData } = supabase.storage
      .from('test-bucket-ponteai')
      .getPublicUrl(metadataKey);
    
    // Step 6: Save results
    console.log('\n💾 Step 6: Saving results...');
    
    const results = {
      success: true,
      videoFileKey: videoFileKey,
      metadataKey: metadataKey,
      videoPublicUrl: videoPublicUrlData.publicUrl,
      metadataPublicUrl: metadataPublicUrlData.publicUrl,
      didTalkId: completedTalk.id,
      duration: completedTalk.duration,
      size: videoBuffer.length,
      sourceAudioKey: audioFileKey,
      sourceImageKey: imageFileKey,
      timestamp: timestamp,
      metadata: videoMetadata
    };
    
    fs.writeFileSync('complete-video-flow-results.json', JSON.stringify(results, null, 2));
    console.log('✅ Results saved to complete-video-flow-results.json');
    
    console.log('\n🎉 Complete video flow successful!');
    console.log('📹 Video URL:', videoPublicUrlData.publicUrl);
    console.log('📄 Metadata URL:', metadataPublicUrlData.publicUrl);
    
  } catch (error) {
    console.error('❌ Complete video flow failed:', error.message);
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

testCompleteVideoFlow(); 