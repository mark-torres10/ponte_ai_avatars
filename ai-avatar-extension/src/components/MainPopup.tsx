import React, { useState } from 'react';
import { MainPopupState, FeatureMode, DebateModeState } from '../types/ui';
import { Header } from './Header';
import { DebateMode } from './DebateMode';

const MainPopup: React.FC = () => {
  const [state, setState] = useState<MainPopupState>({
    activeMode: 'debate',
    isVisible: true,
    debateMode: {
      isRecording: false,
      difficulty: 'easy',
      userInput: '',
      parkerResponse: '',
      isTyping: false
    }
  });

  const handleModeChange = (mode: FeatureMode) => {
    setState(prev => ({
      ...prev,
      activeMode: mode
    }));
  };

  const handleDebateStateChange = (newState: Partial<DebateModeState>) => {
    setState(prev => ({
      ...prev,
      debateMode: {
        ...prev.debateMode,
        ...newState
      }
    }));
  };

  const renderActiveMode = () => {
    switch (state.activeMode) {
      case 'debate':
        return (
          <DebateMode
            state={state.debateMode}
            onStateChange={handleDebateStateChange}
          />
        );
      case 'hot-take':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Hot Take Mode</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'predictions':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Predictions Mode</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'nba-recap':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">NBA Recap Mode</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'fan-reactions':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Fan Take Reactions</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'game-companion':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Game Companion Mode</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      <Header
        activeMode={state.activeMode}
        onModeChange={handleModeChange}
      />
      <div className="flex-1 overflow-y-auto">
        {renderActiveMode()}
      </div>
    </div>
  );
};

export default MainPopup;
