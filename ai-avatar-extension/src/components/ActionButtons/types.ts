// ActionButtons component types
import { ActionButton as CanonicalActionButton } from '../../types';

// Extend the canonical ActionButton type with component-specific props
export type ActionButton = CanonicalActionButton & {
  /** Whether to show loading state */
  loading?: boolean;
};

export interface ActionButtonsProps {
  /** Array of action buttons to display */
  buttons: ActionButton[];
  /** Layout configuration for button arrangement */
  layout?: 'horizontal' | 'vertical' | 'grid';
  /** Maximum number of buttons per row in grid layout */
  maxPerRow?: number;
  /** Whether to show button descriptions */
  showDescriptions?: boolean;
  /** Custom CSS classes for styling */
  className?: string;
  /** Whether to enable keyboard navigation */
  enableKeyboardNav?: boolean;
  /** Callback when button is activated */
  onButtonActivate?: (buttonId: string) => void;
}

export interface ButtonLayoutConfig {
  /** Layout type for button arrangement */
  type: 'horizontal' | 'vertical' | 'grid';
  /** Maximum buttons per row (for grid layout) */
  maxPerRow: number;
  /** Whether to wrap buttons */
  wrap: boolean;
  /** Spacing between buttons */
  spacing: 'tight' | 'normal' | 'loose';
}

export interface ButtonState {
  /** Currently focused button index */
  focusedIndex: number;
  /** Whether keyboard navigation is active */
  keyboardActive: boolean;
  /** Loading states for individual buttons */
  loadingStates: Record<string, boolean>;
}
