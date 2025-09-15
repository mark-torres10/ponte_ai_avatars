import React from 'react';
import { Radio, HelpCircle, Mic } from 'lucide-react';

const GameCompanionMode: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800">Game Companion</span>
        <HelpCircle className="w-3 h-3 text-gray-400" />
      </div>
      
      {/* Description */}
      <div className="text-xs text-gray-600 mb-2">
        Parker provides live voice commentary during games - quarter analysis, halftime takes, and clutch moments!
      </div>
      
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg text-center">
        <div className="flex justify-center gap-2 mb-3">
          <Radio className="w-5 h-5 text-green-600" />
          <Mic className="w-5 h-5 text-green-600" />
        </div>
        <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded mb-3 inline-block">COMING SOON</span>
        <p className="text-xs text-gray-600 mb-3">
          Parker will interrupt with live voice commentary during games - quarter analysis, halftime takes, and clutch moments!
        </p>
        <div className="flex items-center justify-center gap-1 text-xs p-2 bg-white border border-green-200 rounded">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="italic text-green-700">
            "LIVE VOICE FROM COURTSIDE"
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameCompanionMode;
