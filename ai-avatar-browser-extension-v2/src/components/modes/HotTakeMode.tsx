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
      
      <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded">
        <div className="flex items-center gap-1 mb-2">
          <Flame className="w-3 h-3 text-red-600" />
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">SPICY</span>
        </div>
        <p className="text-xs italic">"{todayHotTake}"</p>
      </div>
    </div>
  );
};

export default HotTakeMode;
