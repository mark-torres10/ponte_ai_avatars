#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
// ⚠️  SECURITY NOTE: Replace these placeholder URLs with your actual test file URLs
// The original URLs contained sensitive JWT tokens and have been removed for security
const TEST_FILES = {
  video: {
    url: 'https://example.com/placeholder-video.mp4', // Replace with your video URL
    localPath: 'public/local-test-video.mp4'
  },
  audio: {
    url: 'https://example.com/placeholder-audio.mp3', // Replace with your audio URL
    localPath: 'public/local-test-audio.mp3'
  }
};

// Ensure public directory exists
function ensurePublicDir() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('✅ Created public directory');
  }
}

// Download file function
function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading ${path.basename(localPath)}...`);
    
    const file = fs.createWriteStream(localPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(localPath);
        console.log(`✅ Downloaded ${path.basename(localPath)} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(localPath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main function
async function setupLocalTestFiles() {
  try {
    console.log('🚀 Setting up local test files...\n');
    
    ensurePublicDir();
    
    // Download all test files
    for (const [type, config] of Object.entries(TEST_FILES)) {
      try {
        await downloadFile(config.url, config.localPath);
      } catch (error) {
        console.error(`❌ Failed to download ${type}:`, error.message);
        
        // If download fails, try to copy from backend/downloads if it exists
        const backendPath = `backend/downloads/${type === 'video' ? 'did-video-tlk_E3AqLQZiVYqUvWfGR-gEZ-2025-08-01T04-07-07-634Z.mp4' : 'test_audio.mp3'}`;
        
        if (fs.existsSync(backendPath)) {
          console.log(`📋 Copying ${type} from backend/downloads...`);
          fs.copyFileSync(backendPath, config.localPath);
          console.log(`✅ Copied ${path.basename(config.localPath)} from backend/downloads`);
        }
      }
    }
    
    console.log('\n🎉 Local test files setup complete!');
    console.log('\n📁 Files available:');
    for (const [type, config] of Object.entries(TEST_FILES)) {
      if (fs.existsSync(config.localPath)) {
        const stats = fs.statSync(config.localPath);
        console.log(`  - ${config.localPath} (${(stats.size / 1024).toFixed(1)} KB)`);
      }
    }
    
    console.log('\n💡 Usage:');
    console.log('  - Video: /local-test-video.mp4');
    console.log('  - Audio: /local-test-audio.mp3');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupLocalTestFiles();
}

module.exports = { setupLocalTestFiles, TEST_FILES }; 