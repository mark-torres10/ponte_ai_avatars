'use client';

import { useState } from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

interface StorageErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
}

export default function StorageErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  showRetry = true 
}: StorageErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  if (!error) return null;

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Storage Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
            <p className="mt-1 text-red-600">
              Your audio was generated successfully, but there was an issue saving it to storage. 
              You can still play and download the audio.
            </p>
          </div>
          <div className="mt-3 flex space-x-3">
            {showRetry && onRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Retry Storage'}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto flex-shrink-0"
          >
            <X className="h-5 w-5 text-red-400 hover:text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
} 