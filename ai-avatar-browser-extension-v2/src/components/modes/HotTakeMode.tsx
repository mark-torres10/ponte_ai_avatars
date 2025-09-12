import React from 'react';
import { Flame, HelpCircle } from 'lucide-react';

const HotTakeMode: React.FC = () => {
  const todayHotTake = "I don't wanna hear another WORD about the Lakers until they WIN something! Three years of 'championship aspirations' and NOTHING to show for it!";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800">Hot Take</span>
        <HelpCircle className="w-3 h-3 text-gray-400" />
      </div>
      
      {/* Description */}
      <div className="text-xs text-gray-600 mb-2">
        Parker&apos;s daily outrageous opinion that will make you question everything!
      </div>
      
      {/* Hot Take Content */}
      <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-1 mb-2">
          <Flame className="w-3 h-3 text-red-600" />
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">SPICY</span>
        </div>
        <p className="text-xs italic leading-relaxed">&ldquo;{todayHotTake}&rdquo;</p>
      </div>
      
      {/* Placeholder for future hot takes */}
      <div className="p-2 bg-gray-50 border border-gray-200 rounded text-center">
        <p className="text-xs text-gray-500 italic">
          More hot takes coming throughout the day...
        </p>
      </div>
    </div>
  );
};

export default HotTakeMode;
