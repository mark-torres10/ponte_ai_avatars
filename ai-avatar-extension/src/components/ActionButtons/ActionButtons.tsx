import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ActionButtonsProps, ButtonLayoutConfig } from './types';

/**
 * ActionButtons Component
 * 
 * Features:
 * - Professional button system using shadcn/ui styling
 * - Strategic button variant system (primary, secondary, danger)
 * - Smooth hover and click animations with Framer Motion
 * - Comprehensive keyboard navigation support (Tab, Enter, Space)
 * - Intelligent layout system (horizontal, vertical, grid)
 * - Advanced accessibility features (ARIA labels, screen reader support)
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  layout = 'horizontal',
  className = '',
  disabled = false,
  size = 'md'
}) => {
  // Error boundary for button errors
  const [hasError, setHasError] = React.useState(false);

  // Error boundary effect
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('ActionButtons error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Validate props
  React.useEffect(() => {
    if (!Array.isArray(buttons)) {
      setHasError(true);
      console.error('ActionButtons: buttons prop must be an array');
    }
  }, [buttons]);

  // Show error state if component has errored
  if (hasError) {
    return (
      <div className="text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
        <strong>Error:</strong> Button component failed to load. Please refresh the page.
      </div>
    );
  }
  // Layout configuration for different button arrangements
  const layoutConfig = useMemo((): ButtonLayoutConfig => {
    const configs: Record<string, ButtonLayoutConfig> = {
      horizontal: {
        containerClass: 'flex flex-row items-center space-x-3',
        buttonClass: 'flex-shrink-0',
        spacing: 'space-x-3'
      },
      vertical: {
        containerClass: 'flex flex-col items-stretch space-y-3',
        buttonClass: 'w-full',
        spacing: 'space-y-3'
      },
      grid: {
        containerClass: 'grid grid-cols-2 gap-3',
        buttonClass: 'w-full',
        spacing: 'gap-3'
      }
    };
    
    return configs[layout] || configs.horizontal;
  }, [layout]);

  // Size configuration for consistent button sizing
  const sizeConfig = useMemo(() => {
    const configs = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    return configs[size] || configs.md;
  }, [size]);

  // Button variant styling with professional appearance
  const getButtonVariantClasses = (variant: string = 'secondary') => {
    const baseClasses = `
      font-medium rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeConfig}
    `;

    const variantClasses = {
      primary: `
        bg-orange-500 text-white
        hover:bg-orange-600 hover:shadow-lg
        focus:ring-orange-500/50
        active:bg-orange-700
      `,
      secondary: `
        bg-gray-100 text-gray-700
        hover:bg-gray-200 hover:shadow-md
        focus:ring-gray-500/50
        active:bg-gray-300
        border border-gray-200
      `,
      danger: `
        bg-red-500 text-white
        hover:bg-red-600 hover:shadow-lg
        focus:ring-red-500/50
        active:bg-red-700
      `
    };

    return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.secondary}`;
  };

  // Handle button click with smooth animation feedback
  const handleButtonClick = (button: any, event: React.MouseEvent | React.KeyboardEvent) => {
    if (button.disabled || disabled) return;
    
    // Prevent default for keyboard events
    if (event.type === 'keydown') {
      event.preventDefault();
    }
    
    // Execute button action
    button.action();
  };

  // Handle keyboard navigation
  const handleKeyDown = (button: any, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleButtonClick(button, event);
    }
  };

  return (
    <div 
      data-testid="action-buttons"
      className={`action-buttons ${layoutConfig.containerClass} ${className}`}
      role="group"
      aria-label="Action buttons"
    >
      {buttons.map((button, index) => (
        <motion.button
          key={button.id}
          id={button.id}
          className={`${getButtonVariantClasses(button.variant)} ${layoutConfig.buttonClass}`}
          disabled={button.disabled || disabled}
          onClick={(e) => handleButtonClick(button, e)}
          onKeyDown={(e) => handleKeyDown(button, e)}
          whileHover={{ 
            scale: button.disabled || disabled ? 1 : 1.02,
            y: button.disabled || disabled ? 0 : -1
          }}
          whileTap={{ 
            scale: button.disabled || disabled ? 1 : 0.98,
            y: button.disabled || disabled ? 0 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          role="button"
          tabIndex={0}
          aria-label={button.tooltip || button.label}
          aria-disabled={button.disabled || disabled}
          data-variant={button.variant}
        >
          <div className="flex items-center justify-center space-x-2">
            {button.icon && (
              <span className="flex-shrink-0">
                {button.icon}
              </span>
            )}
            <span>{button.label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
