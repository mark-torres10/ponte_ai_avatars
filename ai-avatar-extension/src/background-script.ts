import { ESPNPageInfo, ExtensionMessage } from './types';

// ESPN URL pattern detection
const ESPN_BOXSCORE_PATTERN = /espn\.com\/nba\/boxscore\/_\/(gameId\/\d+)/;

// Check if current tab is on an ESPN NBA boxscore page
async function checkESPNPage(tabId: number): Promise<ESPNPageInfo | null> {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) return null;

    const url = new URL(tab.url);
    const isBoxscore = ESPN_BOXSCORE_PATTERN.test(tab.url);
    
    if (isBoxscore) {
      const gameIdMatch = tab.url.match(/gameId\/(\d+)/);
      const gameId = gameIdMatch ? gameIdMatch[1] : undefined;
      
      return {
        isBoxscore: true,
        gameId,
        url: tab.url
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error checking ESPN page:', error);
    return null;
  }
}

// Handle tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const pageInfo = await checkESPNPage(tabId);
    
    if (pageInfo) {
      // Send message to content script that page is detected
      try {
        await chrome.tabs.sendMessage(tabId, {
          type: 'PAGE_DETECTED',
          payload: pageInfo
        } as ExtensionMessage);
      } catch (error) {
        // Content script might not be ready yet, ignore error
        console.log('Content script not ready yet');
      }
    }
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Avatar Sports Commentary extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  console.log('Background script received message:', message);
  
  // Handle different message types
  switch (message.type) {
    case 'AVATAR_ACTIVATE':
      // Future: Handle avatar activation logic
      console.log('Avatar activation requested');
      break;
    case 'AVATAR_DEACTIVATE':
      // Future: Handle avatar deactivation logic
      console.log('Avatar deactivation requested');
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
  
  sendResponse({ success: true });
});
