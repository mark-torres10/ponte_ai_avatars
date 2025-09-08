import React, { useState } from 'react';
import { Mic, MicOff, HelpCircle, Keyboard, Send } from 'lucide-react';
import { DifficultyLevel } from '../../types';

interface DebateModeProps {
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

const DebateMode: React.FC<DebateModeProps> = ({ difficulty, onDifficultyChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
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
      setQuestion("Is Giannis still the most dominant player in the league?");
      handleDebate();
    }, 2000);
  };

  const handleDebate = () => {
    const responses = {
      easy: {
        giannis: "I respect Giannis, but pure dominance means consistent championships. Where's the consistency?",
        lebron: "LeBron's still amazing at his age, but father time is undefeated. We're seeing some cracks.",
        default: "Interesting take! Let me present the counterpoint..."
      },
      savage: {
        giannis: "GIANNIS?! ONE championship and y'all acting like he's MJ! The Bucks haven't done ANYTHING since 2021!",
        lebron: "LeBron? This man is FORTY! Stop living in the past! We got Luka, Tatum carrying the league NOW!",
        default: "OH SO NOW WE'RE MAKING UP NARRATIVES?! That's the WORST take I've heard all week!"
      }
    };

    const questionLower = question.toLowerCase();
    let response = '';
    
    if (questionLower.includes('giannis')) {
      response = responses[difficulty].giannis;
    } else if (questionLower.includes('lebron')) {
      response = responses[difficulty].lebron;
    } else {
      response = responses[difficulty].default;
    }
    
    setResponse(response);
  };

  const handleSpacebarPress = (e: React.KeyboardEvent) => {
    if (e.code === 'Space' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      handleVoiceInput();
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800">Debate Mode</span>
        <HelpCircle className="w-3 h-3 text-gray-400" />
      </div>

      {/* Voice Input (Primary) */}
      <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="text-xs text-center text-blue-700 mb-1">
          🎙️ {isRecording ? 'Recording... (Spacebar to stop)' : 'Tap or press Spacebar to ask Parker'}
        </div>
        <button
          className={`h-12 w-12 rounded-full transition-all duration-300 ${
            isRecording 
              ? 'bg-red-600 animate-pulse scale-110' 
              : 'bg-blue-600 hover:scale-105'
          }`}
          onClick={handleVoiceInput}
          onKeyDown={handleSpacebarPress}
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

      {/* Difficulty Selection */}
      <div className="flex gap-1 justify-center">
        <button
          className={`h-6 px-3 text-xs rounded-md transition-colors ${
            difficulty === 'easy' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onDifficultyChange('easy')}
        >
          Go Easy
        </button>
        <button
          className={`h-6 px-3 text-xs rounded-md transition-colors ${
            difficulty === 'savage' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onDifficultyChange('savage')}
        >
          Go Savage
        </button>
      </div>

      {/* Text Input (Secondary) */}
      <div className="relative">
        <button
          className="h-6 text-xs text-gray-500 w-full flex items-center justify-center gap-1 hover:text-gray-700"
          onClick={() => setInputMode(inputMode === 'voice' ? 'text' : 'voice')}
        >
          <Keyboard className="w-3 h-3" />
          Or type your question
        </button>
        
        {inputMode === 'text' && (
          <div className="flex gap-1 mt-2">
            <input
              type="text"
              placeholder="Ask a sports question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleDebate()}
            />
            <button 
              onClick={handleDebate} 
              disabled={!question.trim()} 
              className="h-6 px-2 bg-blue-600 text-white text-xs rounded disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Response Display */}
      {response && (
        <div className="p-2 bg-gray-100 rounded text-xs">
          <div className={`inline-block px-2 py-1 rounded text-xs mb-1 ${
            difficulty === 'savage' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            Parker
          </div>
          <p className="italic">"{response}"</p>
        </div>
      )}
    </div>
  );
};

export default DebateMode;
