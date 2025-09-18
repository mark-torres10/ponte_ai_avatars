import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, HelpCircle, Keyboard, Send, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { DifficultyLevel, VoiceType, SportsContext, DebateQuestion, DebateResponse } from '../../types';
import { voiceService } from '../../services/voiceService';
import { VoiceEventHandlers } from '../../types';
import { apiService } from '../../services/api';

interface DebateModeProps {
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

const DebateMode: React.FC<DebateModeProps> = ({ difficulty, onDifficultyChange }) => {
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<DebateResponse | null>(null);
  const [question, setQuestion] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [voiceType, setVoiceType] = useState<VoiceType>('verse');
  const [sportsContext, setSportsContext] = useState<SportsContext>('basketball');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Voice event handlers
  const voiceEventHandlers: VoiceEventHandlers = {
    onConnectionChange: (connected: boolean) => {
      setIsConnected(connected);
      if (!connected) {
        setIsRecording(false);
        setIsSpeaking(false);
      }
    },
    onRecordingChange: (recording: boolean) => {
      setIsRecording(recording);
    },
    onSpeakingChange: (speaking: boolean) => {
      setIsSpeaking(speaking);
    },
    onTranscript: (text: string) => {
      setTranscript(text);
    },
    onResponse: (text: string) => {
      const debateResponse: DebateResponse = {
        text,
        timestamp: new Date(),
        voiceType,
        difficulty,
        isSpicy: difficulty === 'savage',
      };
      setResponse(debateResponse);
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsProcessing(false);
      setIsRecording(false);
    },
  };

  // Initialize voice service
  useEffect(() => {
    voiceService.setEventHandlers(voiceEventHandlers);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isConnected && !isRecording && !isProcessing) {
          try { voiceService.startRecording(); } catch {}
        }
      } else if (e.code === 'Escape') {
        try { voiceService.endSession(); } catch {}
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isConnected && isRecording) {
          try { voiceService.stopRecording(); } catch {}
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      voiceService.endSession();
    };
  }, [voiceType, difficulty]);

  // Handle voice input (Start session if needed; otherwise toggle mic)
  const handleVoiceInput = async () => {
    console.log('handleVoiceInput called', { isRecording, isProcessing, isConnected });
    
    // If connected, just toggle mic
    if (isConnected) {
      try {
        if (isRecording) {
          voiceService.stopRecording();
        } else {
          voiceService.startRecording();
        }
      } catch (e) {
        console.error('Toggle mic failed:', e);
        setError('Failed to toggle microphone');
      }
      return;
    }

    try {
      console.log('Starting voice session...');
      setError(null);
      setIsProcessing(true);

      // Start a new voice session
      await voiceService.startSession(
        voiceType,
        difficulty,
        `You are Parker, a sports commentator in debate mode. The user is about to ask a sports question. Respond with passion and energy, matching the ${difficulty} difficulty level.`,
        sportsContext
      );

      console.log('Voice session started, enabling mic...');
      voiceService.startRecording();
    } catch (error) {
      console.error('Voice input error:', error);
      setError(error instanceof Error ? error.message : 'Failed to start voice session');
      setIsProcessing(false);
    }
  };

  // Remove MediaRecorder-based local capture; WebRTC uses direct track enable/disable

  // Handle text input
  const handleTextDebate = async (questionText: string) => {
    if (!questionText.trim()) return;

    try {
      setError(null);
      setIsProcessing(true);
      setQuestion(questionText);

      // Start a voice session for text input
      await voiceService.startSession(
        voiceType,
        difficulty,
        `You are Parker, a sports commentator in debate mode. The user asked: "${questionText}". Respond with passion and energy, matching the ${difficulty} difficulty level.`,
        sportsContext
      );

      // Simulate sending the text as audio (in a real implementation, you might want to use text-to-speech)
      // For now, we'll just trigger a response
      setTimeout(() => {
        const debateResponse: DebateResponse = {
          text: `I hear you asking about "${questionText}". Let me give you my take on this...`,
          timestamp: new Date(),
          voiceType,
          difficulty,
          isSpicy: difficulty === 'savage',
        };
        setResponse(debateResponse);
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process question');
      setIsProcessing(false);
    }
  };


  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Debate Mode</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDifficultyChange('easy')}
            className={`px-2 py-1 text-xs rounded ${
              difficulty === 'easy' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => onDifficultyChange('savage')}
            className={`px-2 py-1 text-xs rounded ${
              difficulty === 'savage' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Savage
          </button>
          <button
            onClick={() => onDifficultyChange('expert')}
            className={`px-2 py-1 text-xs rounded ${
              difficulty === 'expert' 
                ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Expert
          </button>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="flex gap-1">
        <button
          onClick={() => setVoiceType('verse')}
          className={`flex-1 px-2 py-1 text-xs rounded ${
            voiceType === 'verse' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Verse
        </button>
        <button
          onClick={() => setVoiceType('cedar')}
          className={`flex-1 px-2 py-1 text-xs rounded ${
            voiceType === 'cedar' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Cedar
        </button>
        <button
          onClick={() => setVoiceType('marin')}
          className={`flex-1 px-2 py-1 text-xs rounded ${
            voiceType === 'marin' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Marin
        </button>
      </div>

      {/* Sports Context */}
      <div className="flex gap-1">
        <button
          onClick={() => setSportsContext('basketball')}
          className={`flex-1 px-2 py-1 text-xs rounded ${
            sportsContext === 'basketball' 
              ? 'bg-orange-100 text-orange-700 border border-orange-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏀 NBA
        </button>
        <button
          onClick={() => setSportsContext('football')}
          className={`flex-1 px-2 py-1 text-xs rounded ${
            sportsContext === 'football' 
              ? 'bg-orange-100 text-orange-700 border border-orange-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏈 NFL
        </button>
      </div>

      {/* Connection Status */}
      {isConnected && (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Connected to Parker
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-1 p-2 bg-red-100 text-red-700 text-xs rounded">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      {/* Input Mode Toggle */}
      <div className="flex gap-1">
        <button
          onClick={() => setInputMode('voice')}
          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded ${
            inputMode === 'voice' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Mic className="w-3 h-3" />
          Voice
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded ${
            inputMode === 'text' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Keyboard className="w-3 h-3" />
          Text
        </button>
      </div>

      {/* Voice Input */}
      {inputMode === 'voice' && (
        <div className="text-center">
          <button
            onClick={handleVoiceInput}
            disabled={isProcessing}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : isProcessing
                ? 'bg-yellow-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } disabled:opacity-50`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <p className="text-xs text-gray-600 mt-1">
            {isProcessing 
              ? 'Processing...'
              : !isConnected
              ? 'Press Space to connect and start talking'
              : isRecording 
              ? 'Listening... release Space to stop'
              : 'Press Space to talk, double-tap to end'
            }
          </p>
          <div className="mt-2">
            <button
              onClick={() => {
                try { voiceService.endSession(); } catch {}
              }}
              disabled={!isConnected}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              End Debate
            </button>
          </div>
        </div>
      )}

      {/* Text Input */}
      {inputMode === 'text' && (
        <div>
          <p className="text-xs text-gray-600 mb-2">
            Or type your question
          </p>
          
          <div className="flex gap-1 mt-2">
            <input
              type="text"
              placeholder="Ask a sports question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (isProcessing || !question.trim()) {
                    return;
                  }
                  handleTextDebate(question);
                }
              }}
            />
            <button 
              onClick={() => handleTextDebate(question)} 
              disabled={!question.trim() || isProcessing} 
              className="h-6 px-2 bg-blue-600 text-white text-xs rounded disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="p-2 bg-blue-50 rounded text-xs">
          <div className="text-blue-600 font-medium mb-1">You said:</div>
          <p className="italic">&ldquo;{transcript}&rdquo;</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="p-2 bg-gray-100 rounded text-xs">
          <div className="flex items-center gap-1 mb-1">
            <div className={`inline-block px-2 py-1 rounded text-xs ${
              difficulty === 'savage' ? 'bg-red-100 text-red-700' : 
              difficulty === 'expert' ? 'bg-purple-100 text-purple-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              Parker ({voiceType})
            </div>
            {isSpeaking && <Volume2 className="w-3 h-3 text-green-600" />}
          </div>
          <p className="italic">&ldquo;{response.text}&rdquo;</p>
          <div className="text-xs text-gray-500 mt-1">
            {response.timestamp.toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebateMode;
