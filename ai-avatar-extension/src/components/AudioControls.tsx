/**
 * AudioControls Component
 * 
 * Professional audio control interface using shadcn-ui components
 * with real audio playback functionality.
 * 
 * PON-85: Audio Integration & ElevenLabs
 */

import React, { useState, useCallback } from 'react';
import { useDialogueStore } from '../stores/dialogueStore';
import { audioIntegrationService } from '../services/audio-integration';
import { Play, Pause, Square, Volume2, RotateCcw } from 'lucide-react';

interface AudioControlsProps {
  className?: string;
  showVolume?: boolean;
  showSpeed?: boolean;
  showProgress?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  className = '',
  showVolume = true,
  showSpeed = true,
  showProgress = true
}) => {
  const { audioState } = useDialogueStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlay = useCallback(async () => {
    try {
      if (audioState.generation?.audioBuffer) {
        await audioIntegrationService.playAudio();
      } else {
        setIsGenerating(true);
        const store = useDialogueStore.getState();
        const text = store.streamingTextState.text;
        
        if (text) {
          const result = await audioIntegrationService.generateAudioFromText(text);
          if (result.success) {
            await audioIntegrationService.playAudio();
          }
        }
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsGenerating(false);
    }
  }, [audioState.generation]);

  const handlePause = useCallback(() => {
    try {
      audioIntegrationService.pauseAudio();
    } catch (error) {
      console.error('Failed to pause audio:', error);
    }
  }, []);

  const handleStop = useCallback(() => {
    try {
      audioIntegrationService.stopAudio();
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    audioIntegrationService.setVolume(volume);
  }, []);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(e.target.value);
    audioIntegrationService.setPlaybackSpeed(speed);
  }, []);

  // Debug logging
  console.log('🎵 AudioControls rendering with props:', { className, showVolume, showSpeed, showProgress });
  console.log('🎵 AudioControls audioState:', audioState);
  
  return (
    <div className={`audio-controls ${className}`} data-testid="audio-controls">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Audio Controls</h4>
        <div className="text-xs text-gray-500">
          Status: {audioState.playback.isPlaying ? 'Playing' : 
                   audioState.playback.isPaused ? 'Paused' : 
                   audioState.playback.isStopped ? 'Stopped' : 'Ready'}
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <button
          data-testid="audio-play-button"
          onClick={handlePlay}
          disabled={isGenerating || audioState.playback.isPlaying}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Play
            </>
          )}
        </button>

        <button
          data-testid="audio-pause-button"
          onClick={handlePause}
          disabled={!audioState.playback.isPlaying}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Pause className="w-4 h-4" />
          Pause
        </button>

        <button
          data-testid="audio-stop-button"
          onClick={handleStop}
          disabled={audioState.playback.isStopped && !audioState.playback.isPaused}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Square className="w-4 h-4" />
          Stop
        </button>
      </div>

      {showVolume && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioState.playback.volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-500">
            {Math.round(audioState.playback.volume * 100)}%
          </span>
        </div>
      )}

      {showSpeed && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Speed</label>
          <select
            value={audioState.playback.playbackRate}
            onChange={handleSpeedChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      )}

      {showProgress && audioState.playback.duration > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Time: {audioState.playback.currentTime.toFixed(1)}s</span>
            <span>Duration: {audioState.playback.duration.toFixed(1)}s</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-200"
              style={{ 
                width: `${(audioState.playback.currentTime / audioState.playback.duration) * 100}%` 
              }}
            />
          </div>
        </div>
      )}

      {audioState.lastError && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          <strong>Error:</strong> {audioState.lastError}
        </div>
      )}
    </div>
  );
};

export default AudioControls;
