import React from 'react';
import { MessageCircle, HelpCircle, Mic } from 'lucide-react';

const FanReactionsMode: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800">Fan Take Reactions</span>
        <HelpCircle className="w-3 h-3 text-gray-400" />
      </div>
      
      {/* Description */}
      <div className="text-xs text-gray-600 mb-2">
        Parker reacts to fan comments with his most BRUTAL voice reactions!
      </div>
      
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg text-center">
        <div className="flex justify-center gap-2 mb-3">
          <Mic className="w-5 h-5 text-purple-600" />
          <MessageCircle className="w-5 h-5 text-purple-600" />
        </div>
        <span className="px-3 py-1 bg-purple-200 text-purple-800 text-xs font-bold rounded mb-3 inline-block">COMING SOON</span>
        <p className="text-xs text-gray-600 mb-3">
          Read fan comments aloud or paste them - Parker will deliver his most <strong>BRUTAL</strong> voice reactions yet!
        </p>
        <div className="p-2 bg-white border border-purple-200 rounded">
          <p className="text-xs italic text-purple-700">
            &ldquo;This is RIDICULOUS! ABSURD!&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};

export default FanReactionsMode;
