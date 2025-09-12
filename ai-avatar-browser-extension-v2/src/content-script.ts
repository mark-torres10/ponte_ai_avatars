// Content script for Parker Sports Extension V2
// This script runs on ESPN pages and injects the avatar icon and popup

console.log('Parker Sports Extension V2 content script loaded');

// Global cleanup variables to prevent memory leaks
let cleanupInterval: NodeJS.Timeout | null = null;
let outsideClickHandler: ((e: Event) => void) | null = null;

// Check if we're on an ESPN page
const isESPNPage = window.location.hostname.includes('espn.com');

if (isESPNPage) {
  console.log('ESPN page detected, Parker Sports Extension V2 is active');
  
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
