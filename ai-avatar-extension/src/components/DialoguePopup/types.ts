// Dialogue UI specific types for DialoguePopup component
import type { ActionButton } from '../../types';

export interface DialogueState {
  isVisible: boolean;
  currentText: string;
  isStreaming: boolean;
  availableActions: ActionButton[];
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export interface DialoguePopupProps {
  isVisible: boolean;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export interface DialoguePosition {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  transform?: string;
}
