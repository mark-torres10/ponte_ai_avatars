const fs = require('fs');
require('dotenv').config();

function testUrlExtraction() {
  console.log('🧪 Testing URL extraction regex...');
  
  // Test cases
  const testUrls = [
    'https://evfgjtpvrasitxpbftva.supabase.co/storage/v1/object/public/test-bucket-ponteai/test_user_id/will-howard/2025-08-01_02-58-51/audio_v1.mp3',
    'https://evfgjtpvrasitxpbftva.supabase.co/storage/v1/object/public/ponteai-assets/avatar_assets/voice_actor_b/static/pic1.jpeg',
    'https://example.supabase.co/storage/v1/object/public/my-bucket/folder/file.mp3',
    'https://test.supabase.co/storage/v1/object/public/bucket-name/path/to/file.json'
  ];
  
  const regex = /\/storage\/v1\/object\/public\/(.+)$/;
  
  testUrls.forEach((url, index) => {
    console.log(`\n📝 Test ${index + 1}:`);
    console.log('URL:', url);
    
    const match = url.match(regex);
    
    if (match && match[1]) {
      const fileKey = decodeURIComponent(match[1]);
      console.log('✅ Success!');
      console.log('📁 Extracted file key:', fileKey);
    } else {
      console.log('❌ Failed to extract file key');
      console.log('Match result:', match);
    }
  });
  
  // Test the specific error case
  console.log('\n🔍 Testing the specific case that was failing:');
  const audioUrl = 'https://evfgjtpvrasitxpbftva.supabase.co/storage/v1/object/public/test-bucket-ponteai/test_user_id/will-howard/2025-08-01_02-58-51/audio_v1.mp3';
  
  const audioUrlMatch = audioUrl.match(/\/storage\/v1\/object\/public\/(.+)$/);
  if (!audioUrlMatch || !audioUrlMatch[1]) {
    console.log('❌ Could not extract audio file key from URL');
  } else {
    const audioFileKey = decodeURIComponent(audioUrlMatch[1]);
    console.log('✅ Audio file key extracted successfully:');
    console.log('📁 Audio file key:', audioFileKey);
    
    // Test bucket extraction
    const bucketMatch = audioFileKey.match(/^([^\/]+)\/(.+)$/);
    if (bucketMatch) {
      console.log('📦 Bucket:', bucketMatch[1]);
      console.log('📄 File path:', bucketMatch[2]);
    }
  }
}

testUrlExtraction(); 