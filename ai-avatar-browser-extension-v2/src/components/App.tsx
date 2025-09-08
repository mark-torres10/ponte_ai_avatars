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
        onModeChange={setCurrentMode}
      />
      <div className="p-3">
        {renderModeContent()}
      </div>
    </div>
  );
};

export default App;
