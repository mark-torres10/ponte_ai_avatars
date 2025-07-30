'use client';

import { useState } from 'react';
import BackendStatus from './BackendStatus';

export default function CollapsibleBackendStatus() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBackendStatus = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleBackendStatus}
        className="btn-secondary-ponte px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        aria-label="Toggle backend status"
      >
        <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
          isOpen ? 'bg-green-400' : 'bg-yellow-400'
        }`}></div>
        <span>Backend Status</span>
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
          <div className="max-w-sm">
            <BackendStatus />
          </div>
        </div>
      )}
    </div>
  );
} 