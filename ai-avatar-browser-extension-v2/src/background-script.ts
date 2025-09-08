// Background script for Parker Sports Extension V2
// This script handles extension lifecycle and basic functionality

chrome.runtime.onInstalled.addListener(() => {
  console.log('Parker Sports Extension V2 installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // The popup will handle the UI, this is just for logging
  console.log('Extension icon clicked on tab:', tab.url);
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabInfo') {
    sendResponse({
      url: sender.tab?.url,
      title: sender.tab?.title
    });
  }
});
