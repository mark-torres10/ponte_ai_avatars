import React from 'react';
import { MessageSquare, Flame, Target, Play, MessageCircle, Radio, Zap } from 'lucide-react';
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
  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-800">Parker Sports</span>
          <img 
            src="parker-avatar-80x80.png" 
            alt="Parker Avatar" 
            className="w-6 h-6 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
      
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
