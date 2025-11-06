import React from 'react';
import { DifficultyToggleProps } from '../types/ui';

const DifficultyToggle: React.FC<DifficultyToggleProps> = ({ 
  difficulty, 
  onDifficultyChange 
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onDifficultyChange('easy')}
        className={`
          flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
          ${difficulty === 'easy'
            ? 'bg-gray-300 text-gray-900'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
      >
        Go Easy
      </button>
      <button
        onClick={() => onDifficultyChange('savage')}
        className={`
          flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
          ${difficulty === 'savage'
            ? 'bg-gray-300 text-gray-900'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
      >
        Go Savage
      </button>
    </div>
  );
};

export { DifficultyToggle };
