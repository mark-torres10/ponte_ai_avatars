// DialoguePopup component types
import type { ActionButton, DialogueState } from '../../types';

export interface DialoguePopupProps {
  isVisible: boolean;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}
