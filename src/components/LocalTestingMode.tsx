'use client';

import { useState } from 'react';
import { useLocalTesting } from '@/lib/local-testing-context';

export default function LocalTestingMode() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLocalMode, toggleLocalMode } = useLocalTesting();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={togglePanel}
        className="btn-secondary-ponte px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        aria-label="Toggle local testing mode"
      >
        <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
          isLocalMode ? 'bg-blue-400' : 'bg-gray-400'
        }`}></div>
        <span>Local Mode</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-2 animate-in slide-in-from-bottom-2 duration-200">
          <div className="bg-background border border-border rounded-lg p-4 shadow-lg max-w-sm">
            <h3 className="text-sm font-semibold mb-3">Local Testing Mode</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Local Mode</span>
                <button
                  onClick={toggleLocalMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isLocalMode ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                      isLocalMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {isLocalMode ? (
                  <p>✅ Using local development environment</p>
                ) : (
                  <p>🌐 Using production environment</p>
                )}
              </div>
              
              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => {
                    // Add any additional testing functions here
                    console.log('Test function triggered');
                  }}
                  className="w-full btn-secondary-ponte px-3 py-1 text-xs rounded"
                >
                  Run Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 