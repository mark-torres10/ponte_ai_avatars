// Test entry point for OpenAI service
// This file bundles the OpenAI service and makes it available for testing

import { 
  generateSportsCommentary, 
  getOpenAIServiceStatus, 
  isOpenAIServiceReady,
  setTestConfig,
  clearTestConfig,
  reinitializeService
} from './services/openai';
import { 
  saveEnvironmentConfig 
} from './utils/config';

// Make functions globally available for testing
declare global {
  interface Window {
    testServiceInit: () => Promise<void>;
    testCommentaryGeneration: () => Promise<void>;
    testFallbackContent: () => Promise<void>;
    testErrorHandling: () => Promise<void>;
    testCommentaryStyles: () => Promise<void>;
    testEnhancedContext: () => Promise<void>;
    setTestConfiguration: (apiKey: string) => Promise<void>;
    clearTestConfiguration: () => Promise<void>;
    setCompleteTestConfig: () => Promise<void>;
  }
}

// Test function 1: Service Initialization
window.testServiceInit = async function() {
  const resultDiv = document.getElementById('init-result');
  if (!resultDiv) return;
  
  try {
    const status = await getOpenAIServiceStatus();
    const isReady = isOpenAIServiceReady();
    
    resultDiv.innerHTML = `
      <div class="success">
        <h4>✅ Service Status:</h4>
        <pre>${JSON.stringify(status, null, 2)}</pre>
        <p><strong>Service Ready:</strong> ${isReady ? 'Yes' : 'No'}</p>
      </div>
    `;
  } catch (error: any) {
    resultDiv.innerHTML = `
      <div class="error">
        <h4>❌ Error:</h4>
        <pre>${error.message}</pre>
      </div>
    `;
  }
};

// Test function 2: Enhanced Commentary Generation
window.testCommentaryGeneration = async function() {
  const resultDiv = document.getElementById('commentary-result');
  if (!resultDiv) return;
  
  try {
    const testGameData = {
      teamNames: ['Lakers', 'Celtics'],
      scores: { home: 108, away: 102 },
      venue: 'Crypto.com Arena',
      gameStatus: 'Final',
      location: 'Los Angeles, CA',
      metadata: {
        date: '2024-01-15',
        attendance: '18,997',
        playoffs: false
      },
      context: {
        rivalry: true,
        playoffImplications: false,
        seasonSeries: 'Lakers lead 2-1',
        keyPlayers: ['LeBron James', 'Jayson Tatum'],
        recentForm: ['Lakers: W-W-L-W', 'Celtics: L-W-W-L']
      }
    };

    resultDiv.innerHTML = '<p>🔄 Generating enhanced commentary...</p>';
    
    const result = await generateSportsCommentary(testGameData, 'post-game');
    
    if (result.success) {
      resultDiv.innerHTML = `
        <div class="success">
          <h4>✅ Enhanced Commentary Generated:</h4>
          <p><strong>Source:</strong> ${result.source}</p>
          <p><strong>Content:</strong></p>
          <pre>${result.commentary}</pre>
          ${result.metadata ? `
          <p><strong>Metadata:</strong></p>
          <pre>${JSON.stringify(result.metadata, null, 2)}</pre>
          ` : ''}
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div class="error">
          <h4>⚠️ Fallback Content Used:</h4>
          <p><strong>Error:</strong> ${result.error}</p>
          <p><strong>Fallback Content:</strong></p>
          <pre>${result.fallbackContent}</pre>
        </div>
      `;
    }
  } catch (error: any) {
    resultDiv.innerHTML = `
      <div class="error">
        <h4>❌ Error:</h4>
        <pre>${error.message}</pre>
      </div>
    `;
  }
};

// Test function 3: Enhanced Fallback Content
window.testFallbackContent = async function() {
  const resultDiv = document.getElementById('fallback-result');
  if (!resultDiv) return;
  
  try {
    const testGameData = {
      teamNames: ['Warriors', 'Heat'],
      venue: 'Chase Center',
      gameStatus: 'Q2',
      location: 'San Francisco, CA',
      context: {
        rivalry: false,
        keyPlayers: ['Stephen Curry', 'Jimmy Butler']
      }
    };

    resultDiv.innerHTML = '<p>🔄 Testing enhanced fallback content...</p>';
    
    const result = await generateSportsCommentary(testGameData, 'play-by-play');
    
    resultDiv.innerHTML = `
      <div class="success">
        <h4>✅ Enhanced Fallback Content Test:</h4>
        <p><strong>Success:</strong> ${result.success}</p>
        <p><strong>Source:</strong> ${result.source}</p>
        <p><strong>Content:</strong></p>
        <pre>${result.fallbackContent || result.commentary}</pre>
      </div>
    `;
  } catch (error: any) {
    resultDiv.innerHTML = `
      <div class="error">
        <h4>❌ Error:</h4>
        <pre>${error.message}</pre>
      </div>
    `;
  }
};

// Test function 4: Enhanced Error Handling
window.testErrorHandling = async function() {
  const resultDiv = document.getElementById('error-result');
  if (!resultDiv) return;
  
  try {
    // Test with invalid data to trigger error handling
    const invalidGameData = {};
    
    resultDiv.innerHTML = '<p>🔄 Testing enhanced error handling...</p>';
    
    const result = await generateSportsCommentary(invalidGameData, 'analytical');
    
    resultDiv.innerHTML = `
      <div class="success">
        <h4>✅ Enhanced Error Handling Test:</h4>
        <p><strong>Success:</strong> ${result.success}</p>
        <p><strong>Source:</strong> ${result.source}</p>
        <p><strong>Error:</strong> ${result.error || 'None'}</p>
        <p><strong>Fallback Content:</strong></p>
        <pre>${result.fallbackContent || 'None'}</pre>
      </div>
    `;
  } catch (error: any) {
    resultDiv.innerHTML = `
      <div class="error">
        <h4>❌ Unexpected Error:</h4>
        <pre>${error.message}</pre>
      </div>
    `;
  }
};

// Test function 5: Commentary Styles
window.testCommentaryStyles = async function() {
  const resultDiv = document.getElementById('commentary-result');
  if (!resultDiv) return;
  
  try {
    const testGameData = {
      teamNames: ['Bulls', 'Knicks'],
      scores: { home: 95, away: 98 },
      venue: 'Madison Square Garden',
      gameStatus: 'Final',
      location: 'New York, NY',
      context: {
        rivalry: true,
        playoffImplications: true
      }
    };

    resultDiv.innerHTML = '<p>🔄 Testing different commentary styles...</p>';
    
    const styles = ['pre-game', 'play-by-play', 'halftime', 'post-game', 'analytical', 'color-commentary'];
    let results = '';
    
    for (const style of styles) {
      try {
        const result = await generateSportsCommentary(testGameData, style as any);
        const content = result.commentary || result.fallbackContent || 'No content generated';
        results += `\n\n**${style.toUpperCase()} Style:**\n${content}`;
      } catch (error: any) {
        results += `\n\n**${style.toUpperCase()} Style:** Error - ${error.message}`;
      }
    }
    
    resultDiv.innerHTML = `
      <div class="success">
        <h4>✅ Commentary Styles Test:</h4>
        <p><strong>All Styles Generated:</strong></p>
        <pre>${results}</pre>
      </div>
    `;
  } catch (error: any) {
    resultDiv.innerHTML = `
      <div class="error">
        <h4>❌ Error:</h4>
        <pre>${error.message}</pre>
      </div>
    `;
  }
};

// Test function 6: Enhanced Context
window.testEnhancedContext = async function() {
  const resultDiv = document.getElementById('fallback-result');
  if (!resultDiv) return;
  
  try {
    const playoffGameData = {
      teamNames: ['Lakers', 'Warriors'],
      scores: { home: 112, away: 108 },
      venue: 'Crypto.com Arena',
      gameStatus: 'Final',
      location: 'Los Angeles, CA',
      metadata: {
        date: '2024-05-20',
        attendance: '19,068',
        playoffs: true,
        season: '2023-24 Playoffs'
      },
      context: {
        rivalry: true,
        playoffImplications: true,
        seasonSeries: 'Series tied 2-2',
        keyPlayers: ['LeBron James', 'Stephen Curry', 'Anthony Davis', 'Draymond Green'],
        recentForm: ['Lakers: W-W-L-W', 'Warriors: L-L-W-L']
      }
    };

    resultDiv.innerHTML = '<p>🔄 Testing enhanced context awareness...</p>';
    
    const result = await generateSportsCommentary(playoffGameData, 'post-game');
    
    resultDiv.innerHTML = `
      <div class="success">
        <h4>✅ Enhanced Context Test:</h4>
        <p><strong>Success:</strong> ${result.success}</p>
        <p><strong>Source:</strong> ${result.source}</p>
        <p><strong>Content:</strong></p>
        <pre>${result.fallbackContent || result.commentary}</pre>
        ${result.metadata ? `
        <p><strong>Metadata:</strong></p>
        <pre>${JSON.stringify(result.metadata, null, 2)}</pre>
        ` : ''}
      </div>
    `;
  } catch (error: any) {
    resultDiv.innerHTML = `
      <div class="error">
        <h4>❌ Error:</h4>
        <pre>${error.message}</pre>
      </div>
    `;
  }
};

// Test function 7: Set Test Configuration
window.setTestConfiguration = async function(apiKey: string) {
  try {
    await setTestConfig(apiKey);
    console.log('✅ Test configuration set successfully');
    
    // Update the service status display
    const resultDiv = document.getElementById('init-result');
    if (resultDiv) {
      const status = await getOpenAIServiceStatus();
      const isReady = isOpenAIServiceReady();
      
      resultDiv.innerHTML = `
        <div class="success">
          <h4>✅ Service Status (Updated):</h4>
          <pre>${JSON.stringify(status, null, 2)}</pre>
          <p><strong>Service Ready:</strong> ${isReady ? 'Yes' : 'No'}</p>
          <p><strong>API Key Set:</strong> ${apiKey ? 'Yes' : 'No'}</p>
        </div>
      `;
    }
  } catch (error: any) {
    console.error('❌ Error setting test configuration:', error);
  }
};

// Test function 7b: Set Complete Test Configuration
window.setCompleteTestConfig = async function() {
  try {
    const openaiKey = (document.getElementById('openai-key') as HTMLInputElement)?.value;
    const elevenlabsKey = (document.getElementById('elevenlabs-key') as HTMLInputElement)?.value;
    const voiceId = (document.getElementById('voice-id') as HTMLInputElement)?.value;
    
    if (!openaiKey || !elevenlabsKey || !voiceId) {
      alert('Please fill in all three fields: OpenAI API Key, ElevenLabs API Key, and Voice ID');
      return;
    }
    
    // Use the config utility to set all values
    const config = {
      openaiApiKey: openaiKey,
      elevenlabsApiKey: elevenlabsKey,
      parkerMunnsVoiceId: voiceId
    };
    
    await saveEnvironmentConfig(config);
    console.log('✅ Complete test configuration set successfully');
    
    // Reinitialize the service with new configuration
    await reinitializeService();
    console.log('✅ Service reinitialized with new configuration');
    
    // Test the service directly after setting config
    const testResult = await generateSportsCommentary({
      teamNames: ['Test Team A', 'Test Team B'],
      venue: 'Test Arena',
      gameStatus: 'Q1'
    }, 'play-by-play');
    
    console.log('✅ Test commentary generation result:', testResult);
    
    // Update the service status display
    const resultDiv = document.getElementById('init-result');
    if (resultDiv) {
      const status = await getOpenAIServiceStatus();
      const isReady = isOpenAIServiceReady();
      
      resultDiv.innerHTML = `
        <div class="success">
          <h4>✅ Service Status (Complete Config):</h4>
          <pre>${JSON.stringify(status, null, 2)}</pre>
          <p><strong>Service Ready:</strong> ${isReady ? 'Yes' : 'No'}</p>
          <p><strong>All Keys Set:</strong> Yes</p>
        </div>
      `;
    }
    
    // Show success message
    const configResultDiv = document.getElementById('config-result');
    if (configResultDiv) {
      configResultDiv.innerHTML = `
        <div class="success">
          <h4>✅ Configuration Set Successfully:</h4>
          <p><strong>OpenAI API Key:</strong> ${openaiKey.substring(0, 10)}...</p>
          <p><strong>ElevenLabs API Key:</strong> ${elevenlabsKey.substring(0, 10)}...</p>
          <p><strong>Voice ID:</strong> ${voiceId}</p>
        </div>
      `;
    }
  } catch (error: any) {
    console.error('❌ Error setting complete test configuration:', error);
    
    // Show error message
    const configResultDiv = document.getElementById('config-result');
    if (configResultDiv) {
      configResultDiv.innerHTML = `
        <div class="error">
          <h4>❌ Configuration Error:</h4>
          <pre>${error.message}</pre>
        </div>
      `;
    }
  }
};

// Test function 8: Clear Test Configuration
window.clearTestConfiguration = async function() {
  try {
    await clearTestConfig();
    console.log('✅ Test configuration cleared');
    
    // Update the service status display
    const resultDiv = document.getElementById('init-result');
    if (resultDiv) {
      const status = await getOpenAIServiceStatus();
      const isReady = isOpenAIServiceReady();
      
      resultDiv.innerHTML = `
        <div class="success">
          <h4>✅ Service Status (Cleared):</h4>
          <pre>${JSON.stringify(status, null, 2)}</pre>
          <p><strong>Service Ready:</strong> ${isReady ? 'Yes' : 'No'}</p>
          <p><strong>API Key Set:</strong> No</p>
        </div>
      `;
    }
  } catch (error: any) {
    console.error('❌ Error clearing test configuration:', error);
  }
};

// Log that the test page has loaded
console.log('✅ Enhanced OpenAI Service Test Page Loaded');
console.log('Available test functions:', Object.keys(window).filter(key => key.startsWith('test')));
console.log('Configuration functions:', Object.keys(window).filter(key => key.includes('Configuration')));
