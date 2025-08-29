// Audio-Text Synchronization Utilities
// This module provides precise timing and synchronization between audio playback
// and text streaming for the AI avatar extension

import { AudioSyncState, AudioPlaybackState } from '../types';

// Synchronization configuration
const SYNC_CONFIG = {
  // Timing thresholds for sync quality assessment
  perfectThreshold: 50,    // <50ms variance = perfect sync
  goodThreshold: 100,      // <100ms variance = good sync
  acceptableThreshold: 200, // <200ms variance = acceptable sync
  poorThreshold: 500,      // <500ms variance = poor sync
  // Above 500ms = failed sync
  
  // Sync check frequency (milliseconds)
  syncCheckInterval: 16,   // ~60fps for smooth monitoring
  
  // Text streaming speed ranges (characters per second)
  minSpeed: 5,
  maxSpeed: 25,
  defaultSpeed: 15
};

export class AudioTextSynchronizer {
  private syncState: AudioSyncState;
  private textStreamingSpeed: number;
  private lastSyncCheck: number = 0;
  private syncTimer: number | null = null;
  private onSyncUpdate: ((syncState: AudioSyncState) => void) | null = null;

  constructor(initialSpeed: number = SYNC_CONFIG.defaultSpeed) {
    this.textStreamingSpeed = Math.max(SYNC_CONFIG.minSpeed, Math.min(SYNC_CONFIG.maxSpeed, initialSpeed));
    
    this.syncState = {
      isSynchronized: false,
      syncAccuracy: 0,
      currentTextIndex: 0,
      currentAudioTime: 0,
      syncStatus: 'failed',
      lastSyncCheck: new Date(),
      syncErrors: []
    };
  }

  /**
   * Set the text streaming speed for synchronization calculations
   */
  public setTextStreamingSpeed(speed: number): void {
    this.textStreamingSpeed = Math.max(SYNC_CONFIG.minSpeed, Math.min(SYNC_CONFIG.maxSpeed, speed));
    console.log('⚡ [AUDIO-SYNC] Text streaming speed set to:', this.textStreamingSpeed, 'cps');
  }

  /**
   * Start synchronization monitoring
   */
  public startSyncMonitoring(
    audioPlaybackState: AudioPlaybackState,
    currentTextIndex: number,
    onUpdate?: (syncState: AudioSyncState) => void
  ): void {
    this.onSyncUpdate = onUpdate || null;
    this.syncState.currentTextIndex = currentTextIndex;
    this.syncState.currentAudioTime = audioPlaybackState.currentTime;
    
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = window.setInterval(() => {
      this.checkSynchronization(audioPlaybackState, currentTextIndex);
    }, SYNC_CONFIG.syncCheckInterval);

    console.log('🎯 [AUDIO-SYNC] Synchronization monitoring started');
  }

  /**
   * Stop synchronization monitoring
   */
  public stopSyncMonitoring(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    
    this.syncState.isSynchronized = false;
    this.syncState.syncStatus = 'failed';
    
    console.log('⏹️ [AUDIO-SYNC] Synchronization monitoring stopped');
  }

  /**
   * Check current synchronization status
   */
  private checkSynchronization(
    audioPlaybackState: AudioPlaybackState,
    currentTextIndex: number
  ): void {
    const now = Date.now();
    
    // Calculate expected text position based on audio time
    const expectedTextIndex = this.calculateExpectedTextIndex(audioPlaybackState.currentTime);
    
    // Calculate sync accuracy (difference between expected and actual text position)
    const textIndexDifference = Math.abs(currentTextIndex - expectedTextIndex);
    const syncAccuracy = this.calculateSyncAccuracy(textIndexDifference);
    
    // Update sync state
    this.syncState = {
      ...this.syncState,
      isSynchronized: syncAccuracy < SYNC_CONFIG.poorThreshold,
      syncAccuracy,
      currentTextIndex,
      currentAudioTime: audioPlaybackState.currentTime,
      syncStatus: this.assessSyncQuality(syncAccuracy),
      lastSyncCheck: new Date(now),
      syncErrors: this.updateSyncErrors(syncAccuracy, now)
    };

    // Notify listeners of sync state update
    if (this.onSyncUpdate) {
      this.onSyncUpdate(this.syncState);
    }

    // Log sync issues if they occur
    if (syncAccuracy > SYNC_CONFIG.acceptableThreshold) {
      console.warn('⚠️ [AUDIO-SYNC] Sync accuracy below acceptable threshold:', syncAccuracy, 'ms');
    }
  }

  /**
   * Calculate expected text index based on audio playback time
   */
  private calculateExpectedTextIndex(audioTime: number): number {
    // Convert audio time to expected character position
    // Formula: characters = (audioTime * textStreamingSpeed)
    return Math.floor(audioTime * this.textStreamingSpeed);
  }

  /**
   * Calculate synchronization accuracy in milliseconds
   */
  private calculateSyncAccuracy(textIndexDifference: number): number {
    // Convert character difference to time difference
    // Formula: timeDifference = characterDifference / textStreamingSpeed * 1000
    return (textIndexDifference / this.textStreamingSpeed) * 1000;
  }

  /**
   * Assess sync quality based on accuracy threshold
   */
  private assessSyncQuality(syncAccuracy: number): AudioSyncState['syncStatus'] {
    if (syncAccuracy < SYNC_CONFIG.perfectThreshold) return 'perfect';
    if (syncAccuracy < SYNC_CONFIG.goodThreshold) return 'good';
    if (syncAccuracy < SYNC_CONFIG.acceptableThreshold) return 'acceptable';
    if (syncAccuracy < SYNC_CONFIG.poorThreshold) return 'poor';
    return 'failed';
  }

  /**
   * Update sync error tracking
   */
  private updateSyncErrors(syncAccuracy: number, timestamp: number): string[] {
    const errors = [...this.syncState.syncErrors];
    
    if (syncAccuracy > SYNC_CONFIG.acceptableThreshold) {
      const errorMessage = `Sync accuracy ${syncAccuracy.toFixed(1)}ms at ${new Date(timestamp).toISOString()}`;
      errors.push(errorMessage);
      
      // Keep only last 10 errors to prevent memory bloat
      if (errors.length > 10) {
        errors.splice(0, errors.length - 10);
      }
    }
    
    return errors;
  }

  /**
   * Get current synchronization state
   */
  public getSyncState(): AudioSyncState {
    return { ...this.syncState };
  }

  /**
   * Check if synchronization is currently active
   */
  public isMonitoring(): boolean {
    return this.syncTimer !== null;
  }

  /**
   * Get synchronization quality as a percentage
   */
  public getSyncQualityPercentage(): number {
    const { syncAccuracy } = this.syncState;
    
    if (syncAccuracy < SYNC_CONFIG.perfectThreshold) return 100;
    if (syncAccuracy < SYNC_CONFIG.goodThreshold) return 90;
    if (syncAccuracy < SYNC_CONFIG.acceptableThreshold) return 75;
    if (syncAccuracy < SYNC_CONFIG.poorThreshold) return 50;
    return 25;
  }

  /**
   * Get human-readable sync status description
   */
  public getSyncStatusDescription(): string {
    const { syncStatus, syncAccuracy } = this.syncState;
    
    switch (syncStatus) {
      case 'perfect':
        return `Perfect synchronization (${syncAccuracy.toFixed(1)}ms variance)`;
      case 'good':
        return `Good synchronization (${syncAccuracy.toFixed(1)}ms variance)`;
      case 'acceptable':
        return `Acceptable synchronization (${syncAccuracy.toFixed(1)}ms variance)`;
      case 'poor':
        return `Poor synchronization (${syncAccuracy.toFixed(1)}ms variance)`;
      case 'failed':
        return `Synchronization failed (${syncAccuracy.toFixed(1)}ms variance)`;
      default:
        return 'Unknown synchronization status';
    }
  }

  /**
   * Reset synchronization state
   */
  public reset(): void {
    this.stopSyncMonitoring();
    
    this.syncState = {
      isSynchronized: false,
      syncAccuracy: 0,
      currentTextIndex: 0,
      currentAudioTime: 0,
      syncStatus: 'failed',
      lastSyncCheck: new Date(),
      syncErrors: []
    };
    
    console.log('🔄 [AUDIO-SYNC] Synchronization state reset');
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.stopSyncMonitoring();
    this.onSyncUpdate = null;
    console.log('🧹 [AUDIO-SYNC] Synchronizer disposed');
  }
}

// Utility functions for external use

/**
 * Calculate optimal text streaming speed for given audio duration and text length
 */
export function calculateOptimalStreamingSpeed(textLength: number, audioDuration: number): number {
  if (audioDuration <= 0 || textLength <= 0) {
    return SYNC_CONFIG.defaultSpeed;
  }
  
  // Calculate speed that would make text finish exactly when audio finishes
  const optimalSpeed = textLength / audioDuration;
  
  // Clamp to acceptable range
  return Math.max(SYNC_CONFIG.minSpeed, Math.min(SYNC_CONFIG.maxSpeed, optimalSpeed));
}

/**
 * Format sync accuracy for display
 */
export function formatSyncAccuracy(accuracy: number): string {
  if (accuracy < 1) {
    return `${(accuracy * 1000).toFixed(0)}μs`;
  }
  if (accuracy < 1000) {
    return `${accuracy.toFixed(1)}ms`;
  }
  return `${(accuracy / 1000).toFixed(2)}s`;
}

/**
 * Get sync quality color for UI display
 */
export function getSyncQualityColor(syncStatus: AudioSyncState['syncStatus']): string {
  switch (syncStatus) {
    case 'perfect': return '#10B981'; // Green
    case 'good': return '#3B82F6';    // Blue
    case 'acceptable': return '#F59E0B'; // Yellow
    case 'poor': return '#F97316';    // Orange
    case 'failed': return '#EF4444';  // Red
    default: return '#6B7280';        // Gray
  }
}

// Export default instance
export const defaultAudioSynchronizer = new AudioTextSynchronizer();
