import React from 'react';
import { FeatureGridProps, FeatureMode } from '../types/ui';
import { 
  MessageCircle, 
  Flame, 
  Target, 
  Play, 
  MessageSquare, 
  Wifi 
} from 'lucide-react';

const FeatureGrid: React.FC<FeatureGridProps> = ({ activeMode, onModeChange }) => {
  const features = [
    {
      id: 'debate' as FeatureMode,
      icon: MessageCircle,
      label: 'Debate Mode',
      tooltip: 'Quick Voice (Spacebar)',
      isActive: activeMode === 'debate'
    },
    {
      id: 'hot-take' as FeatureMode,
      icon: Flame,
      label: 'Hot Take',
      tooltip: 'Hot Take',
      isActive: activeMode === 'hot-take'
    },
    {
      id: 'predictions' as FeatureMode,
      icon: Target,
      label: 'Predictions Mode',
      tooltip: 'Predictions Mode',
      isActive: activeMode === 'predictions'
    },
    {
      id: 'nba-recap' as FeatureMode,
      icon: Play,
      label: 'NBA Recap',
      tooltip: 'NBA Recap',
      isActive: activeMode === 'nba-recap'
    },
    {
      id: 'fan-reactions' as FeatureMode,
      icon: MessageSquare,
      label: 'Fan Reactions',
      tooltip: 'Fan Take Reactions',
      isActive: activeMode === 'fan-reactions'
    },
    {
      id: 'game-companion' as FeatureMode,
      icon: Wifi,
      label: 'Game Companion',
      tooltip: 'Game Companion Mode',
      isActive: activeMode === 'game-companion'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {features.map((feature) => {
        const IconComponent = feature.icon;
        return (
          <button
            key={feature.id}
            onClick={() => onModeChange(feature.id)}
            className={`
              relative p-3 rounded-lg transition-all duration-200 group
              ${feature.isActive 
                ? 'bg-yellow-100 border-2 border-yellow-400' 
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }
            `}
            title={feature.tooltip}
          >
            <IconComponent 
              className={`
                w-6 h-6 mx-auto transition-colors duration-200
                ${feature.isActive ? 'text-yellow-600' : 'text-gray-600 group-hover:text-gray-800'}
              `} 
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {feature.tooltip}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export { FeatureGrid };
