import { create } from 'zustand';
import { DialogueState, StreamingTextState, ActionButton, AudioPlaybackState, AudioSyncState, AudioControlsState, AudioGenerationResult } from '../types';

interface DialogueStore {
  // Core dialogue state
  dialogueState: DialogueState;
  streamingTextState: StreamingTextState;
  
  // Audio integration state (PON-85)
  audioState: {
    playback: AudioPlaybackState;
    sync: AudioSyncState;
    controls: AudioControlsState;
    generation: AudioGenerationResult | null;
    isEnabled: boolean;
    lastError?: string;
  };
  
  // Actions
  setDialogueVisible: (visible: boolean) => void;
  setDialoguePosition: (position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => void;
  setCurrentText: (text: string) => void;
  setStreamingState: (isStreaming: boolean) => void;
  setStreamingProgress: (currentIndex: number) => void;
  setStreamingComplete: (isComplete: boolean) => void;
  setStreamingSpeed: (speed: number) => void;
  setAvailableActions: (actions: ActionButton[]) => void;
  
  // Audio integration actions (PON-85)
  setAudioEnabled: (enabled: boolean) => void;
  setAudioPlaybackState: (playback: Partial<AudioPlaybackState>) => void;
  setAudioSyncState: (sync: Partial<AudioSyncState>) => void;
  setAudioControlsState: (controls: Partial<AudioControlsState>) => void;
  setAudioGenerationResult: (result: AudioGenerationResult | null) => void;
  setAudioError: (error: string | undefined) => void;
  resetAudioState: () => void;
  
  // Integration with existing commentary system
  updateFromCommentary: (commentaryText: string) => void;
  resetDialogue: () => void;
  
  // Component communication
  notifyStreamingComplete: () => void;
  notifyActionExecuted: (actionId: string) => void;
}

export const useDialogueStore = create<DialogueStore>((set, get) => ({
  // Initial state
  dialogueState: {
    isVisible: false,
    currentText: '',
    isStreaming: false,
    availableActions: [],
    position: 'top-right'
  },
  
  streamingTextState: {
    text: '',
    currentIndex: 0,
    isComplete: false,
    speed: 20 // characters per second
  },
  
  // Audio integration state (PON-85)
  audioState: {
    playback: {
      isPlaying: false,
      isPaused: false,
      isStopped: true,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      playbackRate: 1,
      isMuted: false
    },
    sync: {
      isSynchronized: false,
      syncAccuracy: 0,
      currentTextIndex: 0,
      currentAudioTime: 0,
      syncStatus: 'acceptable',
      lastSyncCheck: new Date(),
      syncErrors: []
    },
    controls: {
      playButton: {
        enabled: true,
        loading: false,
        tooltip: 'Play audio'
      },
      pauseButton: {
        enabled: false,
        tooltip: 'Pause audio'
      },
      stopButton: {
        enabled: false,
        tooltip: 'Stop audio'
      },
      volumeControl: {
        value: 0.8,
        min: 0,
        max: 1,
        step: 0.1
      },
      speedControl: {
        value: 1,
        min: 0.5,
        max: 2,
        step: 0.25,
        options: [0.5, 0.75, 1, 1.25, 1.5, 2]
      }
    },
    generation: null,
    isEnabled: true,
    lastError: undefined
  },
  
  // Core actions
  setDialogueVisible: (visible) => set((state) => ({
    dialogueState: { ...state.dialogueState, isVisible: visible }
  })),
  
  setDialoguePosition: (position) => set((state) => ({
    dialogueState: { ...state.dialogueState, position }
  })),
  
  setCurrentText: (text) => set((state) => ({
    dialogueState: { ...state.dialogueState, currentText: text },
    streamingTextState: { ...state.streamingTextState, text }
  })),
  
  setStreamingState: (isStreaming) => set((state) => ({
    dialogueState: { ...state.dialogueState, isStreaming },
    streamingTextState: { ...state.streamingTextState, isComplete: false }
  })),
  
  setStreamingProgress: (currentIndex) => set((state) => ({
    streamingTextState: { ...state.streamingTextState, currentIndex }
  })),
  
  setStreamingComplete: (isComplete) => set((state) => ({
    streamingTextState: { ...state.streamingTextState, isComplete },
    dialogueState: { ...state.dialogueState, isStreaming: false }
  })),
  
  setStreamingSpeed: (speed) => set((state) => ({
    streamingTextState: { ...state.streamingTextState, speed }
  })),
  
  setAvailableActions: (actions) => set((state) => ({
    dialogueState: { ...state.dialogueState, availableActions: actions }
  })),
  
  // Audio integration actions (PON-85)
  setAudioEnabled: (enabled) => set((state) => ({
    audioState: { ...state.audioState, isEnabled: enabled }
  })),
  
  setAudioPlaybackState: (playback) => set((state) => ({
    audioState: {
      ...state.audioState,
      playback: { ...state.audioState.playback, ...playback }
    }
  })),
  
  setAudioSyncState: (sync) => set((state) => ({
    audioState: {
      ...state.audioState,
      sync: { ...state.audioState.sync, ...sync }
    }
  })),
  
  setAudioControlsState: (controls) => set((state) => ({
    audioState: {
      ...state.audioState,
      controls: { ...state.audioState.controls, ...controls }
    }
  })),
  
  setAudioGenerationResult: (result) => set((state) => ({
    audioState: { ...state.audioState, generation: result }
  })),
  
  setAudioError: (error) => set((state) => ({
    audioState: { ...state.audioState, lastError: error }
  })),
  
  resetAudioState: () => set((state) => ({
    audioState: {
      ...state.audioState,
      playback: {
        isPlaying: false,
        isPaused: false,
        isStopped: true,
        currentTime: 0,
        duration: 0,
        volume: 0.8,
        playbackRate: 1,
        isMuted: false
      },
      sync: {
        isSynchronized: false,
        syncAccuracy: 0,
        currentTextIndex: 0,
        currentAudioTime: 0,
        syncStatus: 'acceptable',
        lastSyncCheck: new Date(),
        syncErrors: []
      },
      controls: {
        playButton: { enabled: true, loading: false, tooltip: 'Play audio' },
        pauseButton: { enabled: false, tooltip: 'Pause audio' },
        stopButton: { enabled: false, tooltip: 'Stop audio' },
        volumeControl: { value: 0.8, min: 0, max: 1, step: 0.1 },
        speedControl: { value: 1, min: 0.5, max: 2, step: 0.25, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }
      },
      generation: null,
      lastError: undefined
    }
  })),
  
  // Integration with existing commentary system
  updateFromCommentary: (commentaryText) => {
    const store = get();
    store.setCurrentText(commentaryText);
    store.setStreamingState(true);
    store.setStreamingProgress(0);
    
    // Set default actions for commentary
    const defaultActions: ActionButton[] = [
      {
        id: 'regenerate',
        label: '🔄 Regenerate',
        action: () => {
          console.log('🔄 Regenerating commentary...');
          // This will integrate with existing commentary generation
        },
        variant: 'primary'
      },
      {
        id: 'change-style',
        label: '🎨 Change Style',
        action: () => {
          console.log('🎨 Changing commentary style...');
          // This will integrate with existing style selection
        },
        variant: 'secondary'
      },
      {
        id: 'stop',
        label: '⏹️ Stop',
        action: () => {
          console.log('⏹️ Stopping commentary generation...');
          store.setStreamingState(false);
        },
        variant: 'danger'
      }
    ];
    
    store.setAvailableActions(defaultActions);
  },
  
  resetDialogue: () => set((state) => ({
    dialogueState: {
      isVisible: false,
      currentText: '',
      isStreaming: false,
      availableActions: [],
      position: 'top-right'
    },
    streamingTextState: {
      text: '',
      currentIndex: 0,
      isComplete: false,
      speed: 20
    },
    audioState: {
      ...state.audioState,
      playback: {
        isPlaying: false,
        isPaused: false,
        isStopped: true,
        currentTime: 0,
        duration: 0,
        volume: 0.8,
        playbackRate: 1,
        isMuted: false
      },
      sync: {
        isSynchronized: false,
        syncAccuracy: 0,
        currentTextIndex: 0,
        currentAudioTime: 0,
        syncStatus: 'acceptable',
        lastSyncCheck: new Date(),
        syncErrors: []
      },
      generation: null,
      lastError: undefined
    }
  })),
  
  // Component communication
  notifyStreamingComplete: () => {
    const store = get();
    store.setStreamingComplete(true);
    
    // Add completion actions
    const completionActions: ActionButton[] = [
      {
        id: 'save',
        label: '💾 Save Commentary',
        action: () => {
          console.log('💾 Saving commentary...');
        },
        variant: 'primary'
      },
      {
        id: 'share',
        label: '📤 Share',
        action: () => {
          console.log('📤 Sharing commentary...');
        },
        variant: 'secondary'
      },
      {
        id: 'close',
        label: '✕ Close',
        action: () => {
          store.setDialogueVisible(false);
        },
        variant: 'secondary'
      }
    ];
    
    store.setAvailableActions(completionActions);
  },
  
  notifyActionExecuted: (actionId) => {
    console.log(`Action executed: ${actionId}`);
    // This can be extended for analytics, logging, etc.
  }
}));
