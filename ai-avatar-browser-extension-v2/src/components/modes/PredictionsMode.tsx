import React, { useState } from 'react';
import { Target, HelpCircle, Mic, MicOff, Keyboard, Send } from 'lucide-react';

const PredictionsMode: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [game, setGame] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      setGame("Lakers vs Celtics tonight");
      handlePrediction();
    }, 2000);
  };

  const handlePrediction = () => {
    const predictions = [
      { text: "This game is OVER before it starts! Home team dominates!", confidence: 95 },
      { text: "Something feels OFF... I got a gut feeling about an upset.", confidence: 72 },
      { text: "BARN BURNER! Whoever wants it more in final minutes wins.", confidence: 60 },
      { text: "Going against the grain - underdog special tonight!", confidence: 83 }
    ];
    
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    setPrediction(randomPrediction.text);
    setConfidence(randomPrediction.confidence);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800">Predictions</span>
        <HelpCircle className="w-3 h-3 text-gray-400" />
      </div>
      
      <div className="space-y-2">
        {/* Voice Input (Primary) */}
        <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <div className="text-xs text-center text-green-700 mb-1">
            🎯 {isRecording ? 'Recording... (Spacebar to stop)' : 'Tap or press Spacebar for predictions'}
          </div>
          <button
            className={`h-12 w-12 rounded-full transition-all duration-300 ${
              isRecording 
                ? 'bg-red-600 animate-pulse scale-110' 
                : 'bg-green-600 hover:scale-105'
            }`}
            onClick={handleVoiceInput}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 text-white mx-auto" />
            ) : (
              <Mic className="w-5 h-5 text-white mx-auto" />
            )}
          </button>
          {isRecording && (
            <div className="text-xs text-red-600 animate-pulse">
              🔴 Tap or press Spacebar to stop
            </div>
          )}
        </div>

        {/* Text Input (Secondary) */}
        <div className="relative">
          <button
            className="h-6 text-xs text-gray-500 w-full flex items-center justify-center gap-1 hover:text-gray-700"
            onClick={() => setInputMode(inputMode === 'voice' ? 'text' : 'voice')}
          >
            <Keyboard className="w-3 h-3" />
            Or type a game
          </button>
          
          {inputMode === 'text' && (
            <div className="flex gap-1 mt-2">
              <input
                type="text"
                placeholder="Enter a game..."
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                onKeyDown={(e) => e.key === 'Enter' && handlePrediction()}
              />
              <button 
                onClick={handlePrediction} 
                disabled={!game.trim()} 
                className="h-6 px-2 bg-green-600 text-white text-xs rounded disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {prediction && (
        <div className="space-y-2">
          <div className="p-2 bg-blue-50 border-l-2 border-blue-600 rounded text-xs">
            <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs mb-1">Parker's Pick</div>
            <p className="italic">"{prediction}"</p>
          </div>
          
          <div className="p-2 bg-gray-100 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">Confidence</span>
              <span className={`px-2 py-1 rounded text-xs ${
                confidence >= 90 ? 'bg-red-100 text-red-700' : 
                confidence >= 70 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
              }`}>
                {confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-500 ${
                  confidence >= 90 ? 'bg-red-600' : 
                  confidence >= 70 ? 'bg-blue-600' : 'bg-gray-400'
                }`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionsMode;
