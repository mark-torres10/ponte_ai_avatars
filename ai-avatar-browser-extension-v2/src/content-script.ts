// Content script for Parker Sports Extension V2
// This script runs on ESPN pages and can inject UI elements if needed

console.log('Parker Sports Extension V2 content script loaded');

// Check if we're on an ESPN page
const isESPNPage = window.location.hostname.includes('espn.com');

if (isESPNPage) {
  console.log('ESPN page detected, Parker Sports Extension V2 is active');
  
  // Add any ESPN-specific functionality here
  // For now, we'll just log that we're active
  document.addEventListener('DOMContentLoaded', () => {
    console.log('ESPN page loaded, Parker Sports ready');
  });
}
