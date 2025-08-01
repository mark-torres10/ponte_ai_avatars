'use client';

import { useState, useEffect } from 'react';
import PrivacyNotice from './PrivacyNotice';

export default function PrivacyNoticeWrapper() {
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('privacy-consent');
      const consentDate = localStorage.getItem('privacy-consent-date');
      
      // Show notice if no consent or consent is older than 1 year
      if (!consent || !consentDate) {
        setShowPrivacyNotice(true);
      } else {
        const consentTime = new Date(consentDate).getTime();
        const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
        
        if (consentTime < oneYearAgo) {
          setShowPrivacyNotice(true);
        }
      }
    }
  }, []);

  const handleAccept = () => {
    setShowPrivacyNotice(false);
    // Additional analytics tracking could be added here
  };

  const handleDecline = () => {
    setShowPrivacyNotice(false);
    // Handle declined consent (e.g., disable analytics)
  };

  if (!showPrivacyNotice) {
    return null;
  }

  return (
    <PrivacyNotice 
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
} 