import React from 'react';
import { HelpCircle, Play, Mic } from 'lucide-react';

const NBARecapMode: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800">NBA Recap</span>
        <HelpCircle className="w-3 h-3 text-gray-400" />
      </div>
      
      {/* Description */}
      <div className="text-xs text-gray-600 mb-2">
        Parker delivers BRUTAL voice recaps of last night's games - daily rundowns and your team updates!
      </div>
      
      <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg text-center">
        <div className="flex justify-center gap-2 mb-3">
          <Play className="w-5 h-5 text-orange-600" />
          <Mic className="w-5 h-5 text-orange-600" />
        </div>
        <span className="px-3 py-1 bg-orange-200 text-orange-800 text-xs font-bold rounded mb-3 inline-block">COMING SOON</span>
        <p className="text-xs text-gray-600 mb-3">
          Parker will deliver his most <strong>BRUTAL</strong> voice recaps of last night's games - daily rundowns and personalized team updates!
        </p>
        <div className="p-2 bg-white border border-orange-200 rounded">
          <p className="text-xs italic text-orange-700">
            &ldquo;Ladies and gentlemen, here's what went down last night! Luka dropped 42 and made the Suns look like they should've stayed home!&rdquo;
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">DAILY RECAP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NBARecapMode;
