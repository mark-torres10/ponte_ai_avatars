import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  Settings, 
  Loader2
} from 'lucide-react';
import type { ActionButtonsProps, ActionButton, ButtonLayoutConfig, ButtonState } from './types';

/**
 * ActionButtons Component
 * 
 * Creates an interactive button system that provides users with meaningful choices 
 * and actions within the dialogue context. This component demonstrates the extension's 
 * interactive capabilities and allows for future expansion into more complex AI avatar 
 * interactions, moving beyond passive commentary to active user engagement.
 * 
 * Key Features:
 * - Professional button system using shadcn/ui components
 * - Strategic button variant system (primary, secondary, danger)
 * - Smooth hover and click animations with Framer Motion
 * - Comprehensive keyboard navigation support (Tab, Enter, Space)
 * - Intelligent layout system (horizontal, vertical, grid)
 * - Advanced accessibility features (ARIA labels, screen reader support)
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  layout = 'horizontal',
  maxPerRow = 3,
  showDescriptions: _showDescriptions = false,
  className = '',
  enableKeyboardNav = true,
  onButtonActivate
}) => {
  // Component state management
  const [buttonState, setButtonState] = useState<ButtonState>({
    focusedIndex: 0,
    keyboardActive: false,
    loadingStates: {}
  });

  // Error boundary state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Refs for keyboard navigation
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Validate props
  useEffect(() => {
    if (!buttons || buttons.length === 0) {
      setHasError(true);
      setErrorMessage('No action buttons provided');
      return;
    }

    if (maxPerRow < 1 || maxPerRow > 6) {
      setHasError(true);
      setErrorMessage('Invalid maxPerRow value');
      return;
    }

    setHasError(false);
    setErrorMessage('');
  }, [buttons, maxPerRow]);

  // Layout configuration based on props
  const layoutConfig: ButtonLayoutConfig = useMemo(() => {
    const config: ButtonLayoutConfig = {
      type: layout,
      maxPerRow: Math.min(maxPerRow, buttons.length),
      wrap: layout === 'grid' || layout === 'horizontal',
      spacing: layout === 'grid' ? 'tight' : 'normal'
    };
    return config;
  }, [layout, maxPerRow, buttons.length]);

  // Get button variant styles
  const getButtonVariantStyles = useCallback((variant: ActionButton['variant'] = 'secondary') => {
    const baseStyles = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-500`;
      case 'danger':
        return `${baseStyles} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl focus:ring-red-500`;
      case 'secondary':
      default:
        return `${baseStyles} bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl focus:ring-gray-500`;
    }
  }, []);

  // Get layout container styles
  const getLayoutStyles = useCallback(() => {
    const baseStyles = 'flex gap-3';
    
    switch (layoutConfig.type) {
      case 'horizontal':
        return `${baseStyles} flex-row flex-wrap justify-start`;
      case 'vertical':
        return `${baseStyles} flex-col items-stretch`;
      case 'grid':
        return `grid grid-cols-${layoutConfig.maxPerRow} gap-3 auto-rows-fr`;
      default:
        return baseStyles;
    }
  }, [layoutConfig]);

  // Handle button click with loading state
  const handleButtonClick = useCallback(async (button: ActionButton, index: number) => {
    if (button.disabled || button.loading) return;

    try {
      // Set loading state
      setButtonState(prev => ({
        ...prev,
        loadingStates: { ...prev.loadingStates, [button.id]: true }
      }));

      // Execute button action
      await button.action();
      
      // Call activation callback
      onButtonActivate?.(button.id);
      
    } catch (error) {
      console.error(`Error executing button action for ${button.label}:`, error);
      setHasError(true);
      setErrorMessage(`Failed to execute ${button.label} action`);
    } finally {
      // Clear loading state
      setButtonState(prev => ({
        ...prev,
        loadingStates: { ...prev.loadingStates, [button.id]: false }
      }));
    }
  }, [onButtonActivate]);

  // Keyboard navigation handlers
  const handleKeyDown = useCallback((event: React.KeyboardEvent, buttonIndex: number) => {
    if (!enableKeyboardNav) return;

    setButtonState(prev => ({ ...prev, keyboardActive: true }));

    switch (event.key) {
      case 'Tab':
        // Let browser handle Tab navigation
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (buttons[buttonIndex]) {
          handleButtonClick(buttons[buttonIndex], buttonIndex);
        }
        break;
      case 'ArrowRight':
        if (layoutConfig.type === 'horizontal' || layoutConfig.type === 'grid') {
          event.preventDefault();
          const nextIndex = (buttonIndex + 1) % buttons.length;
          setButtonState(prev => ({ ...prev, focusedIndex: nextIndex }));
          buttonRefs.current[nextIndex]?.focus();
        }
        break;
      case 'ArrowLeft':
        if (layoutConfig.type === 'horizontal' || layoutConfig.type === 'grid') {
          event.preventDefault();
          const prevIndex = buttonIndex === 0 ? buttons.length - 1 : buttonIndex - 1;
          setButtonState(prev => ({ ...prev, focusedIndex: prevIndex }));
          buttonRefs.current[prevIndex]?.focus();
        }
        break;
      case 'ArrowDown':
        if (layoutConfig.type === 'vertical' || layoutConfig.type === 'grid') {
          event.preventDefault();
          const nextIndex = (buttonIndex + 1) % buttons.length;
          setButtonState(prev => ({ ...prev, focusedIndex: nextIndex }));
          buttonRefs.current[nextIndex]?.focus();
        }
        break;
      case 'ArrowUp':
        if (layoutConfig.type === 'vertical' || layoutConfig.type === 'grid') {
          event.preventDefault();
          const prevIndex = buttonIndex === 0 ? buttons.length - 1 : buttonIndex - 1;
          setButtonState(prev => ({ ...prev, focusedIndex: prevIndex }));
          buttonRefs.current[prevIndex]?.focus();
        }
        break;
    }
  }, [enableKeyboardNav, buttons, layoutConfig.type, handleButtonClick]);

  // Focus management
  const handleFocus = useCallback((index: number) => {
    setButtonState(prev => ({ ...prev, focusedIndex: index }));
  }, []);

  // Error boundary effect
  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Error state
  if (hasError) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <span className="text-sm font-medium">
          {errorMessage || 'Error displaying action buttons'}. Please try again.
        </span>
      </div>
    );
  }

  // Animation variants for smooth interactions
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.2,
        stiffness: 300,
        damping: 25
      }
    },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.15,
        stiffness: 400
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`action-buttons ${className}`}
      role="group"
      aria-label="Action buttons"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${layout}-${buttons.length}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={getLayoutStyles()}
        >
          {buttons.map((button, index) => (
            <motion.button
              key={button.id}
              ref={(el) => { buttonRefs.current[index] = el; }}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              disabled={button.disabled || button.loading}
              onClick={() => handleButtonClick(button, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => handleFocus(index)}
              className={`
                relative px-6 py-3 rounded-lg text-sm font-semibold
                ${getButtonVariantStyles(button.variant)}
                ${button.disabled || button.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${buttonState.focusedIndex === index && buttonState.keyboardActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                transition-all duration-200 ease-out
                min-w-[120px]
                flex items-center justify-center gap-2
              `}
              aria-label={button.tooltip || button.label}
              aria-describedby={button.tooltip ? `tooltip-${button.id}` : undefined}
              tabIndex={enableKeyboardNav ? 0 : -1}
            >
              {/* Loading state */}
              <AnimatePresence mode="wait">
                {button.loading || buttonState.loadingStates[button.id] ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {button.icon || getDefaultIcon(button.variant)}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Button label */}
              <span className="whitespace-nowrap">{button.label}</span>

              {/* Tooltip */}
              {button.tooltip && (
                <div
                  id={`tooltip-${button.id}`}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10"
                  role="tooltip"
                >
                  {button.tooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Helper function to get default icons based on button variant
const getDefaultIcon = (variant?: ActionButton['variant']) => {
  switch (variant) {
    case 'primary':
      return <Play className="w-4 h-4" />;
    case 'danger':
      return <Square className="w-4 h-4" />;
    case 'secondary':
    default:
      return <Settings className="w-4 h-4" />;
  }
};

export default ActionButtons;
