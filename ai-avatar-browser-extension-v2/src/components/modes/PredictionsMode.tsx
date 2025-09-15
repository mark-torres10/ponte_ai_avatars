import React from 'react';
import { Target, HelpCircle, Mic } from 'lucide-react';

const PredictionsMode: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800">Predictions</span>
        <HelpCircle className="w-3 h-3 text-gray-400" />
      </div>
      
      {/* Description */}
      <div className="text-xs text-gray-600 mb-2">
        Parker analyzes games and delivers BRUTAL predictions with confidence levels!
      </div>
      
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg text-center">
        <div className="flex justify-center gap-2 mb-3">
          <Target className="w-5 h-5 text-green-600" />
          <Mic className="w-5 h-5 text-green-600" />
        </div>
        <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded mb-3 inline-block">COMING SOON</span>
        <p className="text-xs text-gray-600 mb-3">
          Ask Parker about any game - he'll analyze matchups and deliver his most <strong>BRUTAL</strong> predictions with confidence levels!
        </p>
        <div className="p-2 bg-white border border-green-200 rounded">
          <p className="text-xs italic text-green-700">
            &ldquo;This game is OVER before it starts! Home team dominates!&rdquo;
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xs text-gray-500">Confidence:</span>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">95%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionsMode;
