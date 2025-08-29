// Main components index file
// Export all dialogue UI components for easy importing

export { DialoguePopup } from './DialoguePopup';
export { StreamingText } from './StreamingText';
export { ActionButtons } from './ActionButtons';
export { IntegratedDialogue } from './IntegratedDialogue';

// Export types from canonical source
export type {
  DialogueState,
  ActionButton,
  StreamingTextState
} from '../types';

export type {
  DialoguePopupProps
} from './DialoguePopup';

export type {
  StreamingTextProps,
  CharacterAnimationProps
} from './StreamingText';

export type {
  ActionButtonsProps,
  ButtonLayoutConfig,
  ButtonState
} from './ActionButtons';


