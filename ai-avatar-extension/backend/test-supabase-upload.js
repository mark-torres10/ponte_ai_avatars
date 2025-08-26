const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testSupabaseUpload() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase configuration not found in environment variables');
    return;
  }
  
  console.log('🔧 Supabase URL:', SUPABASE_URL);
  console.log('🔑 Service Role Key length:', SUPABASE_SERVICE_ROLE_KEY.length);
  
  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    console.log('✅ Supabase client initialized');
    
    // Check if metadata file exists
    if (!fs.existsSync('video-metadata.json')) {
      console.error('❌ video-metadata.json not found. Please run test-video-generation.js first.');
      return;
    }
    
    // Load metadata
    const metadata = JSON.parse(fs.readFileSync('video-metadata.json', 'utf8'));
    console.log('📄 Loaded metadata:', metadata);
    
    // Check if local video file exists
    if (!fs.existsSync(metadata.localFilePath)) {
      console.error('❌ Local video file not found:', metadata.localFilePath);
      return;
    }
    
    console.log('📁 Local video file found:', metadata.localFilePath);
    
    // Read the video file
    const videoBuffer = fs.readFileSync(metadata.localFilePath);
    console.log('📊 Video file size:', videoBuffer.length, 'bytes');
    
    // Upload to Supabase using the same approach as the existing codebase
    console.log('⬆️ Uploading to Supabase...');
    const uploadResult = await uploadToSupabase(supabase, videoBuffer, metadata.talkId);
    console.log('✅ Upload result:', uploadResult);
    
    // Update metadata with upload result
    const updatedMetadata = {
      ...metadata,
      supabaseUpload: uploadResult,
      uploadTimestamp: new Date().toISOString()
    };
    
    fs.writeFileSync('video-metadata.json', JSON.stringify(updatedMetadata, null, 2));
    console.log('📄 Updated metadata saved to video-metadata.json');
    
  } catch (error) {
    console.error('❌ Supabase upload test failed:', error.message);
    if (error.response?.data) {
      console.error('📊 Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function uploadToSupabase(supabase, videoBuffer, talkId) {
  try {
    console.log('⬆️ Uploading to Supabase...');
    
    // Create a unique filename following the existing pattern
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test-upload/did-video-${talkId}-${timestamp}.mp4`;
    
    console.log('📁 Uploading to path:', filename);
    
    // Upload to Supabase Storage using the client library
    const { data, error } = await supabase.storage
      .from('ponteai-assets')
      .upload(filename, videoBuffer, {
        contentType: 'video/mp4',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Upload failed:', error.message);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    console.log('✅ Upload successful!');
    console.log('📁 File path:', filename);
    console.log('📊 Upload data:', data);
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('ponteai-assets')
      .getPublicUrl(filename);
    
    console.log('🔗 Public URL:', publicUrlData.publicUrl);
    
    return {
      success: true,
      filePath: filename,
      publicUrl: publicUrlData.publicUrl,
      size: videoBuffer.length,
      uploadData: data
    };
    
  } catch (error) {
    console.error('❌ Failed to upload to Supabase:', error.message);
    throw error;
  }
}

testSupabaseUpload(); 