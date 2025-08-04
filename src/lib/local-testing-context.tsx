'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LocalTestingContextType {
  isLocalMode: boolean;
  setIsLocalMode: (mode: boolean) => void;
  toggleLocalMode: () => void;
}

const LocalTestingContext = createContext<LocalTestingContextType | undefined>(undefined);

export function LocalTestingProvider({ children }: { children: ReactNode }) {
  const [isLocalMode, setIsLocalMode] = useState(false);

  const toggleLocalMode = () => {
    setIsLocalMode(!isLocalMode);
  };

  return (
    <LocalTestingContext.Provider value={{ isLocalMode, setIsLocalMode, toggleLocalMode }}>
      {children}
    </LocalTestingContext.Provider>
  );
}

export function useLocalTesting() {
  const context = useContext(LocalTestingContext);
  if (context === undefined) {
    throw new Error('useLocalTesting must be used within a LocalTestingProvider');
  }
  return context;
} 