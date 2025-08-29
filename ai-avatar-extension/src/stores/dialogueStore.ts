import { create } from 'zustand';
import { DialogueState, StreamingTextState, ActionButton } from '../types';

interface DialogueStore {
  // Core dialogue state
  dialogueState: DialogueState;
  streamingTextState: StreamingTextState;
  
  // Actions
  setDialogueVisible: (visible: boolean) => void;
  setDialoguePosition: (position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => void;
  setCurrentText: (text: string) => void;
  setStreamingState: (isStreaming: boolean) => void;
  setStreamingProgress: (currentIndex: number) => void;
  setStreamingComplete: (isComplete: boolean) => void;
  setStreamingSpeed: (speed: number) => void;
  setAvailableActions: (actions: ActionButton[]) => void;
  
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
  
  resetDialogue: () => set({
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
    }
  }),
  
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
