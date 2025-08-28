import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ESPNPageInfo } from './types';
import './globals.css';

interface PopupState {
  isActive: boolean;
  currentPage: ESPNPageInfo | null;
  loading: boolean;
}

const Popup: React.FC = () => {
  const [state, setState] = useState<PopupState>({
    isActive: false,
    currentPage: null,
    loading: true
  });

  useEffect(() => {
    // Check current tab status when popup opens
    checkCurrentTab();
  }, []);

  const checkCurrentTab = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.url && tab.url.includes('espn.com/nba/boxscore')) {
        const pageInfo = await analyzeCurrentPage();
        setState(prev => ({
          ...prev,
          currentPage: pageInfo,
          isActive: true,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false
        }));
      }
    } catch (error) {
      console.error('Error checking current tab:', error);
      setState(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  const analyzeCurrentPage = async (): Promise<ESPNPageInfo | null> => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.url) return null;

      const isBoxscore = /espn\.com\/nba\/boxscore\/_\/(gameId\/\d+)/.test(tab.url);
      if (!isBoxscore) return null;

      const gameIdMatch = tab.url.match(/gameId\/(\d+)/);
      const gameId = gameIdMatch ? gameIdMatch[1] : undefined;

      return {
        isBoxscore: true,
        gameId,
        url: tab.url
      };
    } catch (error) {
      console.error('Error analyzing current page:', error);
      return null;
    }
  };

  const activateAvatar = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'AVATAR_ACTIVATE',
          payload: state.currentPage
        });
        setState(prev => ({ ...prev, isActive: true }));
      }
    } catch (error) {
      console.error('Error activating avatar:', error);
    }
  };

  const deactivateAvatar = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'AVATAR_DEACTIVATE',
          payload: {}
        });
        setState(prev => ({ ...prev, isActive: false }));
      }
    } catch (error) {
      console.error('Error deactivating avatar:', error);
    }
  };

  const getStatusText = () => {
    if (state.loading) return 'Checking page...';
    if (state.currentPage) {
      return `ESPN NBA Boxscore detected${state.currentPage.gameId ? ` (Game: ${state.currentPage.gameId})` : ''}`;
    }
    return 'Not on ESPN NBA boxscore page';
  };

  const getStatusColor = () => {
    if (state.loading) return '#666';
    if (state.currentPage) return '#28a745';
    return '#dc3545';
  };

  return (
    <div style={{ width: '300px', padding: '16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '18px', color: '#333' }}>🤖 AI Avatar</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>Sports Commentary</p>
      </div>
      
      <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Status</h3>
        <p style={{ margin: 0, fontSize: '12px', color: getStatusColor() }}>{getStatusText()}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={activateAvatar}
          disabled={!state.currentPage || state.isActive}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #667eea',
            borderRadius: '6px',
            background: state.currentPage && !state.isActive ? '#667eea' : '#ccc',
            color: 'white',
            cursor: state.currentPage && !state.isActive ? 'pointer' : 'not-allowed',
            fontSize: '12px'
          }}
        >
          Activate Avatar
        </button>
        <button
          onClick={deactivateAvatar}
          disabled={!state.isActive}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            background: 'white',
            cursor: state.isActive ? 'pointer' : 'not-allowed',
            fontSize: '12px',
            opacity: state.isActive ? 1 : 0.5
          }}
        >
          Deactivate
        </button>
      </div>
      
      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: '#999' }}>
        <p style={{ margin: 0 }}>PonteAI • v1.0.0</p>
      </div>
    </div>
  );
};

// Render the popup
const root = ReactDOM.createRoot(document.getElementById('root') || document.body);
root.render(<Popup />);
