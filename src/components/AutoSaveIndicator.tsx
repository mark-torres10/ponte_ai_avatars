'use client'

import React, { useState, useEffect } from 'react'

interface AutoSaveIndicatorProps {
  lastSaved?: number
  isSaving?: boolean
  hasChanges?: boolean
}

export default function AutoSaveIndicator({ 
  lastSaved, 
  isSaving = false, 
  hasChanges = false 
}: AutoSaveIndicatorProps) {
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    if (isSaving || hasChanges) {
      setShowStatus(true)
      const timer = setTimeout(() => setShowStatus(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, hasChanges])

  if (!showStatus && !isSaving) {
    return null
  }

  const formatLastSaved = (timestamp?: number) => {
    if (!timestamp) return 'Never'
    
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (seconds < 60) {
      return 'Just now'
    } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    } else {
      return new Date(timestamp).toLocaleTimeString()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-background/90 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          {isSaving ? (
            <>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-xs text-foreground/70">Saving...</span>
            </>
          ) : hasChanges ? (
            <>
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-xs text-foreground/70">Changes detected</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-foreground/70">
                Saved {formatLastSaved(lastSaved)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 