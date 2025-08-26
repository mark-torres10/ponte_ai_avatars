const axios = require('axios');
require('dotenv').config();

async function testDIDAPI() {
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
  
  try {
    console.log('🚀 Testing D-ID API connection...');
    
    const response = await axios.get('https://api.d-id.com/talks', {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ D-ID API connection successful!');
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    console.log('📊 Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ D-ID API connection failed:');
    console.error('📊 Status:', error.response?.status);
    console.error('📊 Status Text:', error.response?.statusText);
    console.error('📊 Error message:', error.message);
    
    if (error.response?.data) {
      console.error('📊 Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDIDAPI(); 