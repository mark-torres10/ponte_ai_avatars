// ActionButtons component types

export interface ActionButton {
  id: string;
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
}

export interface ActionButtonsProps {
  buttons: ActionButton[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface ButtonLayoutConfig {
  containerClass: string;
  buttonClass: string;
  spacing: string;
}
