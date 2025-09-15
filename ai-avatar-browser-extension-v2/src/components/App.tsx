import React, { useState } from 'react';
import { FeatureMode, DifficultyLevel } from '../types';
import Header from './Header';
import DebateMode from './modes/DebateMode';
import HotTakeMode from './modes/HotTakeMode';
import PredictionsMode from './modes/PredictionsMode';
import NBARecapMode from './modes/NBARecapMode';
import FanReactionsMode from './modes/FanReactionsMode';
import GameCompanionMode from './modes/GameCompanionMode';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<FeatureMode>('debate');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');

  // Function to handle mode changes and notify content script
  const handleModeChange = (newMode: FeatureMode) => {
    setCurrentMode(newMode);
    
    // Send message to content script to update avatar label
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'MODE_CHANGED',
          mode: newMode
        });
      }
    });
  };

  const renderModeContent = () => {
    switch (currentMode) {
      case 'debate':
        return <DebateMode difficulty={difficulty} onDifficultyChange={setDifficulty} />;
      case 'hot-take':
        return <HotTakeMode />;
      case 'predictions':
        return <PredictionsMode />;
      case 'nba-recap':
        return <NBARecapMode />;
      case 'fan-reactions':
        return <FanReactionsMode />;
      case 'game-companion':
        return <GameCompanionMode />;
      default:
        return <DebateMode difficulty={difficulty} onDifficultyChange={setDifficulty} />;
    }
  };

  return (
    <div className="w-full h-full bg-white">
      <Header 
        currentMode={currentMode} 
        onModeChange={handleModeChange}
      />
      <div className="p-3">
        {renderModeContent()}
      </div>
    </div>
  );
};

export default App;
