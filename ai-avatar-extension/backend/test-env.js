require('dotenv').config();

console.log('Environment Variables Test:');
console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? 'SET' : 'NOT SET');
console.log('ELEVENLABS_TERRY_CREWS_VOICE_ID:', process.env.ELEVENLABS_TERRY_CREWS_VOICE_ID || 'NOT SET');
console.log('ELEVENLABS_WILL_HOWARD_VOICE_ID:', process.env.ELEVENLABS_WILL_HOWARD_VOICE_ID || 'NOT SET');

// Test the voice configuration
const VOICE_CONFIG = {
  voices: {
    'terry-crews': process.env['ELEVENLABS_TERRY_CREWS_VOICE_ID'] || '',
    'will-howard': process.env['ELEVENLABS_WILL_HOWARD_VOICE_ID'] || '',
  }
};

console.log('\nVoice Configuration:');
console.log('VOICE_CONFIG.voices:', VOICE_CONFIG.voices);
console.log('terry-crews voiceId:', VOICE_CONFIG.voices['terry-crews']);
console.log('will-howard voiceId:', VOICE_CONFIG.voices['will-howard']); 