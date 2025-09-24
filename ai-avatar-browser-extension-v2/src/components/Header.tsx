import React, { useState } from 'react';
import { MessageSquare, Flame, Target, Play, MessageCircle, Radio, Settings } from 'lucide-react';
import { FeatureMode } from '../types';

interface HeaderProps {
  currentMode: FeatureMode;
  onModeChange: (mode: FeatureMode) => void;
}

const features = [
  { id: 'debate' as FeatureMode, icon: MessageSquare, name: 'Debate Mode', tooltip: 'Debate Mode' },
  { id: 'hot-take' as FeatureMode, icon: Flame, name: 'Hot Take', tooltip: 'Hot Take Mode' },
  { id: 'predictions' as FeatureMode, icon: Target, name: 'Predictions', tooltip: 'Predictions Mode' },
  { id: 'nba-recap' as FeatureMode, icon: Play, name: 'NBA Recap', tooltip: 'NBA Recap Mode' },
  { id: 'fan-reactions' as FeatureMode, icon: MessageCircle, name: 'Fan Reactions', tooltip: 'Fan Take Reactions' },
  { id: 'game-companion' as FeatureMode, icon: Radio, name: 'Game Companion', tooltip: 'Game Companion Mode' },
];

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [bypassToken, setBypassToken] = useState('');

  const handleSaveSettings = () => {
    chrome.storage.local.set({
      apiBaseUrl: apiUrl,
      vercelBypassToken: bypassToken
    }, () => {
      alert('Settings saved successfully!');
      setShowSettings(false);
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-800">Ponte AI: Personalized AI Avatars</span>
          <img 
            src="ponteai_logo.png" 
            alt="Ponte AI Logo" 
            className="w-6 h-6 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-3 p-3 bg-gray-50 rounded border">
          <h3 className="text-sm font-medium mb-2">Configuration</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-600">API Base URL:</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://browser-extension-backend-1x3ubrylp-marktorres10s-projects.vercel.app"
                className="w-full text-xs p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Bypass Token:</label>
              <input
                type="text"
                value={bypassToken}
                onChange={(e) => setBypassToken(e.target.value)}
                placeholder="SQvfBTNk4MfyuzKZehOh9xXP5JVIht21"
                className="w-full text-xs p-1 border rounded"
              />
            </div>
            <button
              onClick={handleSaveSettings}
              className="w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
      
      {/* 6 Feature Icons in 2x3 Grid */}
      <div className="grid grid-cols-3 gap-1">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          const isActive = currentMode === feature.id;
          
          return (
            <button
              key={feature.id}
              className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-50 text-gray-500 hover:text-blue-600'
              }`}
              onClick={() => onModeChange(feature.id)}
              title={feature.tooltip}
            >
              <IconComponent className="w-3 h-3 mb-1" />
              <span className="text-xs">
                {feature.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
