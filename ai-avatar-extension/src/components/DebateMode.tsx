import React from 'react';
import { DebateModeProps } from '../types/ui';
import { MicrophoneButton } from './MicrophoneButton';
import { DifficultyToggle } from './DifficultyToggle';
import { HelpCircle, Keyboard } from 'lucide-react';

const DebateMode: React.FC<DebateModeProps> = ({ state, onStateChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStateChange({ userInput: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.userInput.trim()) {
      // Simulate Parker's response
      const mockResponses = [
        "I respect Giannis, but pure dominance means consistent championships. Where's the consistency?",
        "LeBron at 38 is still the best player in the league. Age is just a number when you're built different.",
        "The Warriors dynasty is over. Time to rebuild and let the young guns take over.",
        "Luka needs to step up defensively if he wants to be considered a true superstar.",
        "The Lakers need to stop making excuses and start winning games. Period."
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      onStateChange({ parkerResponse: randomResponse });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Debate Mode</h2>
        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
      </div>

      {/* Voice input interface */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-4">Tap or press Spacebar to ask Parker</p>
          <MicrophoneButton
            isRecording={state.isRecording}
            onToggleRecording={() => onStateChange({ isRecording: !state.isRecording })}
          />
        </div>

        {/* Difficulty toggle */}
        <DifficultyToggle
          difficulty={state.difficulty}
          onDifficultyChange={(difficulty: 'easy' | 'savage') => onStateChange({ difficulty })}
        />

        {/* Text input option */}
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Keyboard className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={state.userInput}
              onChange={handleInputChange}
              placeholder="Or type your question"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!state.userInput.trim()}
              className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Ask
            </button>
          </form>
        </div>
      </div>

      {/* Parker's response */}
      {state.parkerResponse && (
        <div className="bg-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
              P
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Parker</p>
              <p className="text-sm text-gray-600">{state.parkerResponse}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DebateMode };
