import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { DialoguePopupProps, DialoguePosition } from './types';

/**
 * Professional DialoguePopup Component
 * 
 * Features:
 * - Professional shadcn/ui styling with sports theme
 * - Strategic positioning system (top-right, top-left, bottom-right, bottom-left)
 * - Smooth entrance/exit animations with Framer Motion
 * - Seamless integration with existing commentary system
 * - Advanced z-index management for page layering
 */
export const DialoguePopup: React.FC<DialoguePopupProps> = ({
  isVisible,
  position,
  children,
  onClose,
  className = ''
}) => {
  // Error boundary for component errors
  const [hasError, setHasError] = React.useState(false);

  // Error boundary effect
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('DialoguePopup error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Show error state if component has errored
  if (hasError) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-[9999]">
        <strong>Error:</strong> Dialogue component failed to load. Please refresh the page.
      </div>
    );
  }
  // Calculate positioning based on position prop
  const getPositionStyles = (): DialoguePosition => {
    const baseStyles: Record<string, DialoguePosition> = {
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' }
    };
    
    return baseStyles[position] || baseStyles['top-right'];
  };

  // Animation variants for smooth 60fps performance
  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position.startsWith('top') ? -20 : 20,
      x: position.endsWith('right') ? 20 : -20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: position.startsWith('top') ? -20 : 20,
      x: position.endsWith('right') ? 20 : -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const positionStyles = getPositionStyles();

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          data-testid="dialogue-popup"
          className={`fixed z-[9999] ${className}`}
          style={positionStyles}
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          {/* Professional dialogue container with sports theme */}
          <motion.div
            className="
              bg-white/95 backdrop-blur-sm
              border border-gray-200/50
              rounded-2xl shadow-2xl
              min-w-[320px] max-w-[480px]
              overflow-hidden
              animate-in
            "
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  AI Sports Commentary
                </span>
              </div>
              
              {onClose && (
                <motion.button
                  onClick={onClose}
                  className="
                    p-1.5 rounded-lg
                    text-gray-400 hover:text-gray-600
                    hover:bg-gray-100/50
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-orange-500/20
                  "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close dialogue"
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>

            {/* Content area */}
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
