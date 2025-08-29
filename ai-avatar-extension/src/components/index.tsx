// Main components index file
// Export all dialogue UI components for easy importing

export { DialoguePopup } from './DialoguePopup';
export { StreamingText } from './StreamingText';
export { ActionButtons } from './ActionButtons';
export { IntegratedDialogue } from './IntegratedDialogue';

// Export types
export type {
  DialoguePopupProps,
  DialogueState,
  DialoguePosition
} from './DialoguePopup';

export type {
  StreamingTextProps,
  StreamingTextState,
  CharacterAnimationProps
} from './StreamingText';

export type {
  ActionButtonsProps,
  ActionButton,
  ButtonLayoutConfig,
  ButtonState
} from './ActionButtons';


