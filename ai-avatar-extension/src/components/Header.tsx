import React from 'react';
import { HeaderProps, FeatureMode } from '../types/ui';
import { FeatureGrid } from './FeatureGrid';
import { Zap, HelpCircle } from 'lucide-react';

const Header: React.FC<HeaderProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Main header with branding */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h1 className="text-lg font-bold text-gray-900">Parker Sports</h1>
        </div>
        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
      </div>

      {/* Feature grid */}
      <FeatureGrid
        activeMode={activeMode}
        onModeChange={onModeChange}
      />
    </div>
  );
};

export { Header };
