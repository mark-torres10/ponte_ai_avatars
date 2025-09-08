// Content script for Parker Sports Extension V2
// This script runs on ESPN pages and injects the avatar icon and popup

console.log('Parker Sports Extension V2 content script loaded');

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
    <div id="parker-popup" class="parker-popup" style="display: none; position: fixed; top: 90px; right: 20px; pointer-events: auto; z-index: 2147483646;">
      <div class="parker-popup-content">
        <div class="parker-popup-header">
          <span class="parker-popup-title">Parker Sports</span>
          <button id="parker-close" class="parker-close">×</button>
        </div>
        <div class="parker-popup-body">
          <div class="parker-modes">
            <button class="parker-mode-btn active" data-mode="debate">
              <span class="parker-mode-icon">💬</span>
              <span class="parker-mode-text">Debate</span>
            </button>
            <button class="parker-mode-btn" data-mode="hottake">
              <span class="parker-mode-icon">🔥</span>
              <span class="parker-mode-text">Hot Take</span>
            </button>
            <button class="parker-mode-btn" data-mode="predictions">
              <span class="parker-mode-icon">🎯</span>
              <span class="parker-mode-text">Predictions</span>
            </button>
            <button class="parker-mode-btn" data-mode="nba">
              <span class="parker-mode-icon">🏀</span>
              <span class="parker-mode-text">NBA Recap</span>
            </button>
            <button class="parker-mode-btn" data-mode="fan">
              <span class="parker-mode-icon">💭</span>
              <span class="parker-mode-text">Fan Reactions</span>
            </button>
            <button class="parker-mode-btn" data-mode="companion">
              <span class="parker-mode-icon">📻</span>
              <span class="parker-mode-text">Game Companion</span>
            </button>
          </div>
          <div class="parker-content">
            <div class="parker-mode-content" id="parker-debate">
              <h3>Debate Mode</h3>
              <p>Ask Parker a sports question and watch him argue back!</p>
              <div class="parker-voice-box">
                <button class="parker-mic-btn">
                  <span class="parker-mic-icon">🎤</span>
                </button>
                <p>Tap or press Spacebar to ask Parker</p>
              </div>
              <div class="parker-difficulty">
                <button class="parker-diff-btn active" data-diff="easy">Go Easy</button>
                <button class="parker-diff-btn" data-diff="savage">Go Savage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
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
    
    .parker-popup {
      position: fixed !important;
      top: 90px !important;
      right: 20px !important;
      width: 400px !important;
      max-height: 600px !important;
      background: white !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
      z-index: 2147483646 !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .parker-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .parker-popup-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 16px;
    }
    
    .parker-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #64748b;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .parker-close:hover {
      color: #ef4444;
    }
    
    .parker-popup-body {
      padding: 20px;
    }
    
    .parker-modes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 20px;
    }
    
    .parker-mode-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 8px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 12px;
    }
    
    .parker-mode-btn:hover {
      background: #f1f5f9;
      border-color: #3B82F6;
    }
    
    .parker-mode-btn.active {
      background: #3B82F6;
      color: white;
      border-color: #3B82F6;
    }
    
    .parker-mode-icon {
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    .parker-mode-text {
      font-weight: 500;
    }
    
    .parker-content {
      min-height: 200px;
    }
    
    .parker-mode-content h3 {
      margin: 0 0 8px 0;
      color: #1e293b;
      font-size: 16px;
    }
    
    .parker-mode-content p {
      margin: 0 0 16px 0;
      color: #64748b;
      font-size: 14px;
    }
    
    .parker-voice-box {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #dbeafe, #e0e7ff);
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .parker-mic-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #3B82F6;
      border: none;
      color: white;
      cursor: pointer;
      margin-bottom: 8px;
      transition: all 0.2s ease;
    }
    
    .parker-mic-btn:hover {
      background: #2563eb;
      transform: scale(1.05);
    }
    
    .parker-mic-icon {
      font-size: 24px;
    }
    
    .parker-difficulty {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    
    .parker-diff-btn {
      padding: 8px 16px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }
    
    .parker-diff-btn:hover {
      background: #f3f4f6;
    }
    
    .parker-diff-btn.active {
      background: #3B82F6;
      color: white;
      border-color: #3B82F6;
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
    const popup = document.getElementById('parker-popup');
    const portal = document.getElementById('parker-portal-container');
    
    if (portal) {
      portal.style.setProperty('z-index', '2147483647', 'important');
      portal.style.setProperty('position', 'fixed', 'important');
    }
    
    if (avatar) {
      avatar.style.setProperty('z-index', '2147483647', 'important');
      avatar.style.setProperty('position', 'fixed', 'important');
    }
    
    if (popup) {
      popup.style.setProperty('z-index', '2147483646', 'important');
      popup.style.setProperty('position', 'fixed', 'important');
    }
    
    // Additional force to ensure visibility
    if (portal) {
      portal.style.display = 'block';
      portal.style.visibility = 'visible';
    }
  }, 100);
  
  // Continuous monitoring to ensure elements stay on top
  setInterval(() => {
    const avatar = document.getElementById('parker-avatar');
    const popup = document.getElementById('parker-popup');
    const portal = document.getElementById('parker-portal-container');
    
    if (portal && portal.style.zIndex !== '2147483647') {
      portal.style.setProperty('z-index', '2147483647', 'important');
    }
    
    if (avatar && avatar.style.zIndex !== '2147483647') {
      avatar.style.setProperty('z-index', '2147483647', 'important');
    }
    
    if (popup && popup.style.zIndex !== '2147483646') {
      popup.style.setProperty('z-index', '2147483646', 'important');
    }
  }, 1000);

  // Add event listeners
  const avatar = document.getElementById('parker-avatar');
  const popup = document.getElementById('parker-popup');
  const closeBtn = document.getElementById('parker-close');
  const modeBtns = document.querySelectorAll('.parker-mode-btn');
  const diffBtns = document.querySelectorAll('.parker-diff-btn');

  // Toggle popup on avatar click
  avatar?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = popup?.style.display !== 'none';
    if (popup) {
      popup.style.display = isVisible ? 'none' : 'block';
    }
  });

  // Close popup
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (popup) {
      popup.style.display = 'none';
    }
  });

  // Mode switching
  modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Here you would switch the content based on mode
    });
  });

  // Difficulty switching
  diffBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!avatarContainer.contains(e.target as Node)) {
      if (popup) {
        popup.style.display = 'none';
      }
    }
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
