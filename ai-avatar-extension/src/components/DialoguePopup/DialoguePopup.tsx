import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import { DialoguePopupProps } from './types';

/**
 * Professional DialoguePopup Component - PON-84 Implementation
 * 
 * Features:
 * - Professional shadcn/ui styling with enhanced sports theme
 * - Strategic positioning system with responsive behavior
 * - Smooth 60fps animations with Framer Motion
 * - Seamless integration with existing commentary system
 * - Advanced z-index management for page layering
 * - Enhanced accessibility and professional appearance
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

  // Enhanced positioning system with responsive behavior
  const getPositionStyles = (): Record<string, string> => {
    const baseStyles: Record<string, Record<string, string>> = {
      'top-right': { 
        top: '20px', 
        right: '20px'
      },
      'top-left': { 
        top: '20px', 
        left: '20px'
      },
      'bottom-right': { 
        bottom: '20px', 
        right: '20px'
      },
      'bottom-left': { 
        bottom: '20px', 
        left: '20px'
      }
    };
    
    return baseStyles[position] || baseStyles['top-right'];
  };

  // Simplified animation variants for smooth 60fps performance
  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: position.startsWith('top') ? -30 : 30,
      x: position.endsWith('right') ? 30 : -30
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: position.startsWith('top') ? -30 : 30,
      x: position.endsWith('right') ? 30 : -30,
      transition: {
        duration: 0.25
      }
    }
  };

  // Header animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, delay: 0.1 }
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, delay: 0.2 }
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
          aria-label="Parker Munns Dialogue"
          role="dialog"
          aria-modal="true"
        >
          {/* Enhanced professional dialogue container with sports theme */}
          <motion.div
            className="
              bg-gradient-to-br from-white/98 to-gray-50/95
              backdrop-blur-md
              border border-orange-200/30
              rounded-3xl shadow-2xl
              min-w-[340px] max-w-[520px]
              overflow-hidden
              animate-in
              relative
            "
            style={{
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                0 0 40px rgba(249, 115, 22, 0.1)
              `
            }}
          >
            {/* Enhanced header with sports theme */}
            <motion.div 
              className="
                flex items-center justify-between p-5 
                border-b border-orange-100/50
                bg-gradient-to-r from-orange-50/50 to-blue-50/30
              "
              variants={headerVariants}
            >
              <div className="flex items-center space-x-3">
                {/* Enhanced animated indicator */}
                <div className="relative">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-orange-400 rounded-full animate-ping" />
                </div>
                
                {/* Enhanced title with sports branding */}
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-gray-800">
                    Parker Munns
                  </span>
                  <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
                </div>
              </div>
              
              {/* Enhanced close button */}
              {onClose && (
                <motion.button
                  onClick={onClose}
                  className="
                    p-2 rounded-xl
                    text-gray-400 hover:text-gray-700
                    hover:bg-orange-50/50
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-orange-500/30
                    focus:bg-orange-50/50
                    group
                  "
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close dialogue"
                >
                  <X size={18} className="group-hover:text-orange-600 transition-colors" />
                </motion.button>
              )}
            </motion.div>

            {/* Enhanced content area with smooth animations */}
            <motion.div 
              className="p-5 bg-white/80"
              variants={contentVariants}
            >
              {children}
            </motion.div>

            {/* Subtle footer accent */}
            <div className="h-1 bg-gradient-to-r from-orange-400 via-blue-500 to-orange-400 opacity-60" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
