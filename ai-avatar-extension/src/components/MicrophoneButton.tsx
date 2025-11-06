import React from 'react';
import { MicrophoneButtonProps } from '../types/ui';
import { Mic, MicOff } from 'lucide-react';

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ 
  isRecording, 
  onToggleRecording 
}) => {
  return (
    <button
      onClick={onToggleRecording}
      className={`
        w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200
        ${isRecording 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-black hover:bg-gray-800'
        }
      `}
    >
      {isRecording ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
    </button>
  );
};

export { MicrophoneButton };
