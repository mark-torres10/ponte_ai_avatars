import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../../stores/dialogueStore';
import { DialoguePopup } from '../DialoguePopup';
import { StreamingText } from '../StreamingText';
import { ActionButtons } from '../ActionButtons';
import { ActionButton } from '../../types';
import { audioIntegrationService } from '../../services/audio-integration';

interface IntegratedDialogueProps {
  isVisible: boolean;
  onClose: () => void;
}

export const IntegratedDialogue: React.FC<IntegratedDialogueProps> = ({
  isVisible,
  onClose
}) => {
  const {
    dialogueState,
    streamingTextState,
    setDialogueVisible,
    setStreamingComplete,
    notifyActionExecuted
  } = useDialogueStore();

  // Handle close action
  const handleClose = useCallback(() => {
    setDialogueVisible(false);
    onClose();
  }, [setDialogueVisible, onClose]);

  // Handle streaming completion
  const handleStreamingComplete = useCallback(() => {
    setStreamingComplete(true);
    notifyActionExecuted('streaming_complete');
  }, [setStreamingComplete, notifyActionExecuted]);

  // Handle action execution
  const handleActionExecute = useCallback((actionId: string) => {
    notifyActionExecuted(actionId);
  }, [notifyActionExecuted]);

  // Update store when visibility changes
  useEffect(() => {
    setDialogueVisible(isVisible);
  }, [isVisible, setDialogueVisible]);

  // Enhanced action buttons with integration
  const getIntegratedActions = (): ActionButton[] => {
    if (streamingTextState.isComplete) {
      // Show completion actions
      return [
        {
          id: 'save',
          label: '💾 Save Commentary',
          action: () => handleActionExecute('save'),
          variant: 'primary'
        },
        {
          id: 'share',
          label: '📤 Share',
          action: () => handleActionExecute('share'),
          variant: 'secondary'
        },
        {
          id: 'regenerate',
          label: '🔄 New Commentary',
          action: () => handleActionExecute('regenerate'),
          variant: 'secondary'
        },
        {
          id: 'close',
          label: '✕ Close',
          action: handleClose,
          variant: 'secondary'
        }
      ];
    }

    if (dialogueState.isStreaming) {
      // Show streaming actions
      return [
        {
          id: 'stop',
          label: '⏹️ Stop',
          action: () => handleActionExecute('stop'),
          variant: 'danger'
        },
        {
          id: 'pause',
          label: '⏸️ Pause',
          action: () => handleActionExecute('pause'),
          variant: 'secondary'
        }
      ];
    }

    // Show initial actions
    return [
      {
        id: 'generate',
        label: '🚀 Generate Commentary',
        action: () => handleActionExecute('generate'),
        variant: 'primary'
      },
      {
        id: 'settings',
        label: '⚙️ Settings',
        action: () => handleActionExecute('settings'),
        variant: 'secondary'
      },
      {
        id: 'close',
        label: '✕ Close',
        action: handleClose,
        variant: 'secondary'
      }
    ];
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <DialoguePopup
          isVisible={isVisible}
          position={dialogueState.position}
          onClose={handleClose}
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                AI Sports Commentary
              </h2>
              <p className="text-sm text-gray-600">
                {streamingTextState.isComplete 
                  ? 'Commentary complete! What would you like to do next?'
                  : dialogueState.isStreaming 
                    ? 'Generating your personalized commentary...'
                    : 'Ready to generate professional sports commentary'
                }
              </p>
            </div>

            {/* Streaming Text Component */}
            {dialogueState.currentText && (
              <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                <StreamingText
                  text={dialogueState.currentText}
                  speed={streamingTextState.speed}
                  isStreaming={dialogueState.isStreaming}
                  onComplete={handleStreamingComplete}
                  audioSync={true}
                  audioPlaybackState={useDialogueStore.getState().audioState.playback}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <ActionButtons
                buttons={getIntegratedActions()}
                layout="horizontal"
                onButtonActivate={handleActionExecute}
                audioControls={true}
                _audioPlaybackState={useDialogueStore.getState().audioState.playback}
                _onAudioControl={(action: 'play' | 'pause' | 'stop' | 'volume' | 'speed', value?: number) => {
                  switch (action) {
                    case 'play':
                      audioIntegrationService.playAudio();
                      break;
                    case 'pause':
                      audioIntegrationService.pauseAudio();
                      break;
                    case 'stop':
                      audioIntegrationService.stopAudio();
                      break;
                    case 'volume':
                      if (value !== undefined) {
                        audioIntegrationService.setVolume(value);
                      }
                      break;
                    case 'speed':
                      if (value !== undefined) {
                        audioIntegrationService.setPlaybackSpeed(value);
                      }
                      break;
                  }
                }}
              />
            </div>

            {/* Status Indicator */}
            <div className="text-center text-xs text-gray-500">
              {streamingTextState.isComplete && (
                <span className="text-green-600">✓ Commentary ready</span>
              )}
              {dialogueState.isStreaming && (
                <span className="text-blue-600">⏳ Generating...</span>
              )}
              {!dialogueState.isStreaming && !streamingTextState.isComplete && (
                <span className="text-gray-500">Ready to start</span>
              )}
            </div>
          </div>
        </DialoguePopup>
      )}
    </AnimatePresence>
  );
};
