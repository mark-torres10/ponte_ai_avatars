// Background script for Parker Sports Extension V2
// This script handles extension lifecycle and API calls to bypass CORS issues

// Get bypass token from Chrome storage
const getBypassToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['vercelBypassToken'], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (result.vercelBypassToken) {
        resolve(result.vercelBypassToken);
      } else {
        reject(new Error('Vercel bypass token not configured'));
      }
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('Parker Sports Extension V2 installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // The popup will handle the UI, this is just for logging
  console.log('Extension icon clicked on tab:', tab.url);
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('🔍 DEBUG: Background script received message:', request);
  console.log('🔍 DEBUG: Message sender:', sender);
  console.log('🔍 DEBUG: Message action:', request.action);
  
  if (request.action === 'apiCall') {
    console.log('🔍 DEBUG: Handling apiCall request');
    handleApiCall(request, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getTabInfo') {
    console.log('🔍 DEBUG: Handling getTabInfo request');
    sendResponse({
      url: sender.tab?.url,
      title: sender.tab?.title
    });
  }
  
  console.log('🔍 DEBUG: Message handling completed');
});

async function handleApiCall(request: any, sendResponse: (response: any) => void) {
  try {
    console.log('🔍 DEBUG: handleApiCall called with request:', request);
    const { method, url, headers, body } = request;
    
    console.log('🔍 DEBUG: Extracted request details:', { method, url, headers, body });
    
    // Get bypass token securely
    console.log('🔍 DEBUG: About to get bypass token');
    const bypassToken = await getBypassToken();
    console.log('🔍 DEBUG: Bypass token retrieved:', bypassToken ? 'SUCCESS' : 'FAILED');
    
    console.log('🔍 DEBUG: Making API call with details:', { method, url, headers, body });
    
    // Use query parameters for bypass token to avoid preflight requests; avoid double-append
    let urlWithBypass = url;
    try {
      const parsedUrl = new URL(url);
      if (!parsedUrl.searchParams.has('x-vercel-protection-bypass')) {
        parsedUrl.searchParams.set('x-vercel-protection-bypass', bypassToken);
      }
      urlWithBypass = parsedUrl.toString();
    } catch (_e) {
      // Fallback if URL parsing fails (should not happen with absolute URLs)
      if (!url.includes('x-vercel-protection-bypass=')) {
        urlWithBypass = url.includes('?')
          ? `${url}&x-vercel-protection-bypass=${encodeURIComponent(bypassToken)}`
          : `${url}?x-vercel-protection-bypass=${encodeURIComponent(bypassToken)}`;
      }
    }
    console.log('🔍 DEBUG: URL with bypass token:', urlWithBypass);
    
    // Only set Content-Type for requests with body to avoid unnecessary preflight
    const requestHeaders: Record<string, string> = {
      ...headers
    };
    
    // Only add Content-Type for requests that have a body
    if (body) {
      requestHeaders['Content-Type'] = 'application/json';
    }
    
    console.log('🔍 DEBUG: Final request headers:', requestHeaders);
    console.log('🔍 DEBUG: Request body:', body ? JSON.stringify(body) : undefined);
    
    console.log('🔍 DEBUG: About to make fetch request');
    const response = await fetch(urlWithBypass, {
      method: method || 'GET',
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined
    });
    
    console.log('🔍 DEBUG: Fetch response received');
    console.log('🔍 DEBUG: Response status:', response.status);
    console.log('🔍 DEBUG: Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('🔍 DEBUG: Response ok:', response.ok);
    
    if (!response.ok) {
      console.log('❌ DEBUG: Response not ok, attempting to read error data');
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ DEBUG: Error data:', errorData);
      throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
    }
    
    console.log('🔍 DEBUG: Response ok, attempting to read JSON data');
    const data = await response.json();
    console.log('✅ DEBUG: API response data received:', data);
    
    console.log('🔍 DEBUG: Sending success response to popup');
    sendResponse({
      success: true,
      data: data,
      status: response.status
    });
    
  } catch (error) {
    console.error('❌ DEBUG: API call failed with error:', error);
    console.error('❌ DEBUG: Error type:', typeof error);
    console.error('❌ DEBUG: Error message:', error instanceof Error ? error.message : String(error));
    console.error('❌ DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    console.log('🔍 DEBUG: Sending error response to popup');
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

