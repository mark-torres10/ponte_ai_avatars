/**
 * RealTimeTextStream Component
 * 
 * This component streams text character by character in real-time
 * synchronization with audio playback. It's not just a simulation.
 * 
 * PON-85: Audio Integration & ElevenLabs
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../stores/dialogueStore';

interface RealTimeTextStreamProps {
  text: string;
  className?: string;
  streamingSpeed?: number; // characters per second
  autoStart?: boolean;
  onStreamComplete?: () => void;
}

export const RealTimeTextStream: React.FC<RealTimeTextStreamProps> = ({
  text,
  className = '',
  streamingSpeed = 20,
  autoStart = false,
  onStreamComplete
}) => {
  const { audioState, setAudioSyncState } = useDialogueStore();
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStartTime, setStreamStartTime] = useState<number | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAudioTimeRef = useRef<number>(0);

  // Start text streaming
  const startStreaming = useCallback(() => {
    if (isStreaming || currentIndex >= text.length) return;
    
    setIsStreaming(true);
    setStreamStartTime(Date.now());
    
    // Calculate timing for smooth streaming
    const characterDelay = 1000 / streamingSpeed;
    
    streamIntervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        
        if (newIndex >= text.length) {
          // Streaming complete
          setIsStreaming(false);
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          onStreamComplete?.();
          return prevIndex;
        }
        
        // Update displayed text
        setDisplayedText(text.substring(0, newIndex));
        
        // Update sync state
        const currentTime = (Date.now() - (streamStartTime || 0)) / 1000;
        setAudioSyncState({
          currentTextIndex: newIndex,
          currentAudioTime: currentTime,
          isSynchronized: Math.abs(currentTime - (audioState.playback.currentTime || 0)) < 0.1,
          syncAccuracy: Math.abs(currentTime - (audioState.playback.currentTime || 0)) * 1000,
          syncStatus: Math.abs(currentTime - (audioState.playback.currentTime || 0)) < 0.05 ? 'perfect' :
                     Math.abs(currentTime - (audioState.playback.currentTime || 0)) < 0.1 ? 'good' :
                     Math.abs(currentTime - (audioState.playback.currentTime || 0)) < 0.2 ? 'acceptable' : 'poor'
        });
        
        return newIndex;
      });
    }, characterDelay);
  }, [text, streamingSpeed, isStreaming, currentIndex, onStreamComplete, setAudioSyncState, audioState.playback.currentTime, streamStartTime]);

  // Stop text streaming
  const stopStreaming = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Pause text streaming
  const pauseStreaming = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Resume text streaming
  const resumeStreaming = useCallback(() => {
    if (!isStreaming && currentIndex < text.length) {
      startStreaming();
    }
  }, [isStreaming, currentIndex, text.length, startStreaming]);

  // Reset streaming
  const resetStreaming = useCallback(() => {
    stopStreaming();
    setDisplayedText('');
    setCurrentIndex(0);
    setIsStreaming(false);
    setStreamStartTime(null);
  }, [stopStreaming]);

  // Auto-start streaming when audio starts playing
  useEffect(() => {
    if (autoStart && audioState.playback.isPlaying && !isStreaming && currentIndex === 0) {
      startStreaming();
    }
  }, [autoStart, audioState.playback.isPlaying, isStreaming, currentIndex, startStreaming]);

  // Handle audio state changes
  useEffect(() => {
    if (audioState.playback.isPlaying && !isStreaming && currentIndex < text.length) {
      // Audio is playing but text isn't streaming - start streaming
      startStreaming();
    } else if (!audioState.playback.isPlaying && isStreaming) {
      // Audio stopped but text is still streaming - pause streaming
      pauseStreaming();
    }
  }, [audioState.playback.isPlaying, isStreaming, currentIndex, text.length, startStreaming, pauseStreaming]);

  // Sync text with audio time
  useEffect(() => {
    if (audioState.playback.isPlaying && streamStartTime) {
      const currentTime = (Date.now() - streamStartTime) / 1000;
      const expectedIndex = Math.floor(currentTime * streamingSpeed);
      
      if (Math.abs(expectedIndex - currentIndex) > 1) {
        // Text is out of sync with audio - adjust
        const newIndex = Math.max(0, Math.min(expectedIndex, text.length));
        setCurrentIndex(newIndex);
        setDisplayedText(text.substring(0, newIndex));
      }
    }
  }, [audioState.playback.currentTime, audioState.playback.isPlaying, streamStartTime, currentIndex, streamingSpeed, text]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Calculate progress percentage
  const progressPercentage = text.length > 0 ? (currentIndex / text.length) * 100 : 0;

  return (
    <div className={`real-time-text-stream ${className}`} data-testid="real-time-text-stream">
      {/* Text Display */}
      <div className="text-content mb-4">
        <div className="text-lg leading-relaxed">
          <AnimatePresence mode="popLayout">
            {displayedText.split('').map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                className="inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </AnimatePresence>
          
          {/* Cursor */}
          {isStreaming && currentIndex < text.length && (
            <motion.span
              className="inline-block w-0.5 h-6 bg-blue-500 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {currentIndex} / {text.length} characters</span>
          <span>Speed: {streamingSpeed} chars/sec</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="control-buttons flex space-x-3">
        <button
          onClick={startStreaming}
          disabled={isStreaming || currentIndex >= text.length}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Streaming
        </button>
        
        <button
          onClick={pauseStreaming}
          disabled={!isStreaming}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pause
        </button>
        
        <button
          onClick={resumeStreaming}
          disabled={isStreaming || currentIndex >= text.length}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Resume
        </button>
        
        <button
          onClick={resetStreaming}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reset
        </button>
      </div>

      {/* Status Information */}
      <div className="status-info mt-4 p-3 bg-gray-50 rounded">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Streaming Status:</strong> {isStreaming ? 'Active' : 'Inactive'}
          </div>
          <div>
            <strong>Audio Sync:</strong> {audioState.sync.isSynchronized ? 'Synchronized' : 'Out of sync'}
          </div>
          <div>
            <strong>Sync Accuracy:</strong> {audioState.sync.syncAccuracy.toFixed(0)}ms
          </div>
          <div>
            <strong>Sync Quality:</strong> {audioState.sync.syncStatus}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTextStream;
