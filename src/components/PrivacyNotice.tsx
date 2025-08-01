'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PrivacyNoticeProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function PrivacyNotice({ onAccept, onDecline }: PrivacyNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    setIsVisible(false);
    // Store consent in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('privacy-consent', 'accepted');
      localStorage.setItem('privacy-consent-date', new Date().toISOString());
    }
    onAccept();
  };

  const handleDecline = () => {
    setIsVisible(false);
    // Store decline in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('privacy-consent', 'declined');
      localStorage.setItem('privacy-consent-date', new Date().toISOString());
    }
    onDecline();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-white/10 p-4 z-50"
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Privacy & Cookie Notice
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              We use cookies and similar technologies to provide, protect, and improve our services. 
              By clicking &quot;Accept&quot;, you consent to our use of cookies and data collection as described in our{' '}
              <a 
                href="/privacy-policy" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              . You can change your preferences at any time.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="btn-primary-ponte px-4 py-2 text-xs font-medium"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 