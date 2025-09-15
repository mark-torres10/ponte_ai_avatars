// Content script for Parker Sports Extension V2
// This script runs on ESPN pages and injects the avatar icon and popup

console.log('Parker Sports Extension V2 content script loaded');

// Global cleanup variables to prevent memory leaks
let cleanupInterval: NodeJS.Timeout | null = null;
let outsideClickHandler: ((e: Event) => void) | null = null;
let messageListenerRegistered = false;

// Helper function to convert mode IDs to display names
function getModeDisplayName(mode: string): string {
  const modeMap: { [key: string]: string } = {
    'debate': 'Debate Mode',
    'hot-take': 'Hot Take Mode',
    'predictions': 'Predictions Mode',
    'nba-recap': 'NBA Recap Mode',
    'fan-reactions': 'Fan Reactions Mode',
    'game-companion': 'Game Companion Mode'
  };
  return modeMap[mode] || 'Unknown Mode';
}

// Message handler for mode changes
function onModeMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  if (message?.type === 'MODE_CHANGED') {
    const modeLabel = document.getElementById('parker-mode-label');
    if (modeLabel) {
      const modeDisplayName = getModeDisplayName(message.mode);
      modeLabel.textContent = `${modeDisplayName} Active`;
    }
  }
}

// Check if we're on an ESPN page
const isESPNPage = window.location.hostname.includes('espn.com');

if (isESPNPage) {
  console.log('ESPN page detected, Parker Sports Extension V2 is active');
  
  // Register message listener only once
  if (!messageListenerRegistered) {
    chrome.runtime.onMessage.addListener(onModeMessage);
    messageListenerRegistered = true;
  }
  
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParkerAvatar);
  } else {
    initParkerAvatar();
  }
}

function initParkerAvatar() {
  // Cleanup previous instances to prevent memory leaks
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
  
  if (outsideClickHandler) {
    document.removeEventListener('click', outsideClickHandler);
    outsideClickHandler = null;
  }
  
  // Remove existing styles to prevent duplication
  const existingStyles = document.querySelectorAll('style[data-parker-extension]');
  existingStyles.forEach(style => style.remove());
  
  // Remove existing avatar if it exists
  const existingAvatar = document.getElementById('parker-avatar-container');
  const existingPortal = document.getElementById('parker-portal-container');
  if (existingAvatar) {
    existingAvatar.remove();
  }
  if (existingPortal) {
    existingPortal.remove();
  }

  // Create a portal container that will always be on top
  const portalContainer = document.createElement('div');
  portalContainer.id = 'parker-portal-container';
  portalContainer.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 2147483647 !important;
    margin: 0 !important;
    padding: 0 !important;
  `;

  // Create avatar container
  const avatarContainer = document.createElement('div');
  avatarContainer.id = 'parker-avatar-container';
  avatarContainer.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    pointer-events: auto !important;
    z-index: 2147483647 !important;
  `;
  avatarContainer.innerHTML = `
    <div id="parker-avatar" class="parker-avatar">
      <img src="${chrome.runtime.getURL('parker-avatar-80x80.png')}" alt="Parker Sports" />
    </div>
    <div id="parker-mode-label" class="parker-mode-label">
      Debate Mode Active
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.setAttribute('data-parker-extension', 'true');
  style.textContent = `
    .parker-avatar {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      width: 60px !important;
      height: 60px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #3B82F6, #1D4ED8) !important;
      border: 3px solid white !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      cursor: pointer !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.3s ease !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .parker-avatar:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
    }
    
    .parker-avatar img {
      width: 50px !important;
      height: 50px !important;
      border-radius: 50% !important;
      object-fit: cover !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .parker-mode-label {
      position: fixed !important;
      top: 85px !important;
      right: 20px !important;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(29, 78, 216, 0.95)) !important;
      color: white !important;
      padding: 6px 12px !important;
      border-radius: 8px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      text-align: center !important;
      white-space: nowrap !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      margin: 0 !important;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      backdrop-filter: blur(8px) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
      animation: parker-label-glow 2s ease-in-out infinite alternate !important;
    }
    
    @keyframes parker-label-glow {
      0% {
        box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      }
      100% {
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }
    }
  `;

  // Add to page with highest priority
  document.head.appendChild(style);
  
  // Add avatar container to portal
  portalContainer.appendChild(avatarContainer);
  
  // Ensure body exists and add portal container
  if (document.body) {
    document.body.appendChild(portalContainer);
  } else {
    // If body doesn't exist yet, wait for it
    const observer = new MutationObserver(() => {
      if (document.body) {
        document.body.appendChild(portalContainer);
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  }
  
  // Force the elements to be on top by setting CSS properties directly
  setTimeout(() => {
    const avatar = document.getElementById('parker-avatar');
    const portal = document.getElementById('parker-portal-container');
    
    if (portal) {
      portal.style.setProperty('z-index', '2147483647', 'important');
      portal.style.setProperty('position', 'fixed', 'important');
    }
    
    if (avatar) {
      avatar.style.setProperty('z-index', '2147483647', 'important');
      avatar.style.setProperty('position', 'fixed', 'important');
    }
    
    // Additional force to ensure visibility
    if (portal) {
      portal.style.display = 'block';
      portal.style.visibility = 'visible';
    }
  }, 100);
  
  // Continuous monitoring to ensure elements stay on top
  cleanupInterval = setInterval(() => {
    const avatar = document.getElementById('parker-avatar');
    const portal = document.getElementById('parker-portal-container');
    
    if (portal && portal.style.zIndex !== '2147483647') {
      portal.style.setProperty('z-index', '2147483647', 'important');
    }
    
    if (avatar && avatar.style.zIndex !== '2147483647') {
      avatar.style.setProperty('z-index', '2147483647', 'important');
    }
  }, 1000);

  // Add event listeners
  const avatar = document.getElementById('parker-avatar');

  // Avatar click handler (no popup functionality)
  avatar?.addEventListener('click', (e) => {
    e.stopPropagation();
    // Avatar click functionality can be added here later
    console.log('Parker avatar clicked - no popup functionality');
  });

  // Message listener is now registered at module scope to prevent duplicates

  console.log('Parker Sports avatar injected successfully');
}

// Handle SPA navigation (ESPN uses client-side routing)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Re-inject avatar after navigation
    setTimeout(() => {
      if (document.getElementById('parker-avatar-container')) {
        return; // Already exists
      }
      initParkerAvatar();
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });
