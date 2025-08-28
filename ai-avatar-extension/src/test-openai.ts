// Test entry point for OpenAI service
// This file bundles the OpenAI service and makes it available for testing

import { openAIService, generateSportsCommentary, isOpenAIServiceReady, getOpenAIServiceStatus } from './services/openai';

// Make functions globally available for testing
declare global {
  interface Window {
    testServiceInit: () => Promise<void>;
    testCommentaryGeneration: () => Promise<void>;
    testFallbackContent: () => Promise<void>;
    testErrorHandling: () => Promise<void>;
  }
}

// Test function 1: Service Initialization
window.testServiceInit = async function() {
  const resultDiv = document.getElementById('init-result');
  if (!resultDiv) return;
  
  try {
    const status = getOpenAIServiceStatus();
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

// Test function 2: Commentary Generation
window.testCommentaryGeneration = async function() {
  const resultDiv = document.getElementById('commentary-result');
  if (!resultDiv) return;
  
  try {
    const testGameData = {
      teamNames: ['Lakers', 'Celtics'],
      scores: { home: 108, away: 102 },
      venue: 'Crypto.com Arena',
      gameStatus: 'Final',
      location: 'Los Angeles, CA'
    };

    resultDiv.innerHTML = '<p>🔄 Generating commentary...</p>';
    
    const result = await generateSportsCommentary(testGameData);
    
    if (result.success) {
      resultDiv.innerHTML = `
        <div class="success">
          <h4>✅ Commentary Generated:</h4>
          <p><strong>Source:</strong> ${result.source}</p>
          <p><strong>Content:</strong></p>
          <pre>${result.commentary}</pre>
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

// Test function 3: Fallback Content
window.testFallbackContent = async function() {
  const resultDiv = document.getElementById('fallback-result');
  if (!resultDiv) return;
  
  try {
    const testGameData = {
      teamNames: ['Warriors', 'Heat'],
      venue: 'Chase Center'
    };

    resultDiv.innerHTML = '<p>🔄 Testing fallback content...</p>';
    
    const result = await generateSportsCommentary(testGameData);
    
    resultDiv.innerHTML = `
      <div class="success">
        <h4>✅ Fallback Content Test:</h4>
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

// Test function 4: Error Handling
window.testErrorHandling = async function() {
  const resultDiv = document.getElementById('error-result');
  if (!resultDiv) return;
  
  try {
    // Test with invalid data to trigger error handling
    const invalidGameData = {};
    
    resultDiv.innerHTML = '<p>🔄 Testing error handling...</p>';
    
    const result = await generateSportsCommentary(invalidGameData);
    
    resultDiv.innerHTML = `
      <div class="success">
        <h4>✅ Error Handling Test:</h4>
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

// Log that the test page has loaded
console.log('✅ OpenAI Service Test Page Loaded');
console.log('Available test functions:', Object.keys(window).filter(key => key.startsWith('test')));
