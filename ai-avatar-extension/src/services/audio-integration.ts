/**
 * Audio Integration Service
 * 
 * This service coordinates all audio-related functionality across the extension:
 * - ElevenLabs text-to-speech generation
 * - Audio-text synchronization
 * - Audio state management
 * - Component communication
 * 
 * PON-85: Audio Integration & ElevenLabs
 */

import { getElevenLabsService, disposeElevenLabsService } from './elevenlabs';
import { defaultAudioSynchronizer } from '../utils/audio-sync';
import { useDialogueStore } from '../stores/dialogueStore';
import type { 
  AudioGenerationRequest, 
  AudioGenerationResult,
  AudioPlaybackState,
  AudioSyncState 
} from '../types';

export class AudioIntegrationService {
  private elevenLabsService: ReturnType<typeof getElevenLabsService> | null = null;
  private audioSynchronizer = defaultAudioSynchronizer;
  private isInitialized = false;
  private currentAudioBuffer: ArrayBuffer | null = null;
  private audioContext: AudioContext | null = null;
  private audioSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private playbackStartTime = 0;
  private syncInterval: number | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the audio integration service
   */
  private async initialize(): Promise<void> {
    try {
      // Get ElevenLabs service instance with API key and voice ID
      const apiKey = 'sk_8396a26794af42afa3cec3ae47521c72d432447c96c3049e'; // From config
      const voiceId = 'jtHwJJIeJSiCcvv6MzGd'; // From config
      this.elevenLabsService = getElevenLabsService(apiKey, voiceId);
      
      if (!this.elevenLabsService?.isReady()) {
        throw new Error('ElevenLabs service not ready');
      }

      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);

      this.isInitialized = true;
      console.log('🎵 Audio Integration Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Audio Integration Service:', error);
      this.handleError('Failed to initialize audio service');
    }
  }

  /**
   * Generate audio from text and integrate with dialogue system
   */
  public async generateAudioFromText(text: string, options: Partial<AudioGenerationRequest> = {}): Promise<AudioGenerationResult> {
    try {
      if (!this.isInitialized || !this.elevenLabsService) {
        throw new Error('Audio service not initialized');
      }

      // Update store state
      const store = useDialogueStore.getState();
      store.setAudioControlsState({
        playButton: { enabled: false, loading: true, tooltip: 'Generating audio...' },
        pauseButton: { enabled: false, tooltip: 'Audio not ready' },
        stopButton: { enabled: false, tooltip: 'Audio not ready' }
      });

      // Generate audio using ElevenLabs
      const audioResult = await this.elevenLabsService.generateAudio(text, options);
      
      if (audioResult.success && audioResult.audioBuffer) {
        this.currentAudioBuffer = audioResult.audioBuffer;
        
        // Update store with generation result
        store.setAudioGenerationResult(audioResult);
        store.setAudioPlaybackState({
          duration: audioResult.duration || 0,
          isStopped: true,
          isPlaying: false,
          isPaused: false
        });

        // Enable audio controls
        store.setAudioControlsState({
          playButton: { enabled: true, loading: false, tooltip: 'Play audio' },
          pauseButton: { enabled: false, tooltip: 'Audio not playing' },
          stopButton: { enabled: true, tooltip: 'Stop audio' }
        });

        console.log('🎵 Audio generated successfully:', audioResult);
        return audioResult;
      } else {
        throw new Error(audioResult.error || 'Audio generation failed');
      }
    } catch (error) {
      console.error('❌ Audio generation failed:', error);
      this.handleError('Failed to generate audio');
      
      // Return fallback result
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackAudio: undefined
      };
    }
  }

  /**
   * Play audio with text synchronization
   */
  public async playAudio(): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.currentAudioBuffer || !this.audioContext) {
        throw new Error('Audio not ready for playback');
      }

      // Stop any existing playback
      this.stopAudio();

      // Create audio buffer source
      const audioBuffer = await this.audioContext.decodeAudioData(this.currentAudioBuffer);
      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.buffer = audioBuffer;
      this.audioSource.connect(this.gainNode!);

      // Set playback rate and volume
      const store = useDialogueStore.getState();
      const { playbackRate, volume } = store.audioState.playback;
      this.audioSource.playbackRate.value = playbackRate;
      this.gainNode!.gain.value = volume;

      // Start playback
      this.audioSource.start(0);
      this.playbackStartTime = this.audioContext.currentTime;

      // Update store state
      store.setAudioPlaybackState({
        isPlaying: true,
        isPaused: false,
        isStopped: false,
        currentTime: 0
      });

      store.setAudioControlsState({
        playButton: { enabled: false, loading: false, tooltip: 'Audio playing' },
        pauseButton: { enabled: true, tooltip: 'Pause audio' },
        stopButton: { enabled: true, tooltip: 'Stop audio' }
      });

      // Start synchronization monitoring
      this.startSynchronization();

      // Set up playback end handler
      this.audioSource.onended = () => {
        this.handlePlaybackEnd();
      };

      console.log('🎵 Audio playback started');
      return true;
    } catch (error) {
      console.error('❌ Audio playback failed:', error);
      this.handleError('Failed to play audio');
      return false;
    }
  }

  /**
   * Pause audio playback
   */
  public pauseAudio(): void {
    try {
      if (this.audioSource && this.audioContext) {
        this.audioSource.stop();
        this.audioSource = null;

        // Update store state
        const store = useDialogueStore.getState();
        const currentTime = this.audioContext.currentTime - this.playbackStartTime;
        
        store.setAudioPlaybackState({
          isPlaying: false,
          isPaused: true,
          isStopped: false,
          currentTime: Math.max(0, currentTime)
        });

        store.setAudioControlsState({
          playButton: { enabled: true, loading: false, tooltip: 'Resume audio' },
          pauseButton: { enabled: false, tooltip: 'Audio paused' },
          stopButton: { enabled: true, tooltip: 'Stop audio' }
        });

        // Stop synchronization
        this.stopSynchronization();

        console.log('⏸️ Audio paused');
      }
    } catch (error) {
      console.error('❌ Failed to pause audio:', error);
    }
  }

  /**
   * Stop audio playback
   */
  public stopAudio(): void {
    try {
      if (this.audioSource) {
        this.audioSource.stop();
        this.audioSource = null;
      }

      // Update store state
      const store = useDialogueStore.getState();
      store.setAudioPlaybackState({
        isPlaying: false,
        isPaused: false,
        isStopped: true,
        currentTime: 0
      });

              store.setAudioControlsState({
          playButton: { enabled: true, loading: false, tooltip: 'Play audio' },
          pauseButton: { enabled: false, tooltip: 'Audio not playing' },
          stopButton: { enabled: false, tooltip: 'Audio stopped' }
        });

      // Stop synchronization
      this.stopSynchronization();

      console.log('⏹️ Audio stopped');
    } catch (error) {
      console.error('❌ Failed to stop audio:', error);
    }
  }

  /**
   * Set audio volume
   */
  public setVolume(volume: number): void {
    try {
      if (this.gainNode) {
        this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
      }

      // Update store
      const store = useDialogueStore.getState();
      store.setAudioPlaybackState({ volume });
      store.setAudioControlsState({
        volumeControl: { value: volume, min: 0, max: 1, step: 0.1 }
      });
    } catch (error) {
      console.error('❌ Failed to set volume:', error);
    }
  }

  /**
   * Set playback speed
   */
  public setPlaybackSpeed(speed: number): void {
    try {
      if (this.audioSource) {
        this.audioSource.playbackRate.value = speed;
      }

      // Update store
      const store = useDialogueStore.getState();
      store.setAudioPlaybackState({ playbackRate: speed });
      store.setAudioControlsState({
        speedControl: { value: speed, min: 0.5, max: 2, step: 0.25, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }
      });
    } catch (error) {
      console.error('❌ Failed to set playback speed:', error);
    }
  }

  /**
   * Start audio-text synchronization
   */
  private startSynchronization(): void {
    try {
      const store = useDialogueStore.getState();
      const { speed } = store.streamingTextState;
      
      // Start sync monitoring
      this.audioSynchronizer.startSyncMonitoring(
        store.audioState.playback,
        store.streamingTextState.currentIndex,
        (syncState) => {
          // Update store with sync state
          store.setAudioSyncState(syncState);
        }
      );

      // Set up periodic sync updates
      this.syncInterval = window.setInterval(() => {
        if (this.audioContext && this.audioSource) {
          const currentTime = this.audioContext.currentTime - this.playbackStartTime;
          const expectedTextIndex = Math.floor(currentTime * speed);
          
          store.setAudioPlaybackState({ currentTime });
          store.setAudioSyncState({ 
            currentAudioTime: currentTime,
            currentTextIndex: expectedTextIndex
          });
        }
      }, 16); // ~60fps sync updates

      console.log('🔄 Audio-text synchronization started');
    } catch (error) {
      console.error('❌ Failed to start synchronization:', error);
    }
  }

  /**
   * Stop audio-text synchronization
   */
  private stopSynchronization(): void {
    try {
      this.audioSynchronizer.stopSyncMonitoring();
      
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }

      console.log('🔄 Audio-text synchronization stopped');
    } catch (error) {
      console.error('❌ Failed to stop synchronization:', error);
    }
  }

  /**
   * Handle playback end
   */
  private handlePlaybackEnd(): void {
    try {
      // Update store state
      const store = useDialogueStore.getState();
      store.setAudioPlaybackState({
        isPlaying: false,
        isPaused: false,
        isStopped: true,
        currentTime: 0
      });

              store.setAudioControlsState({
          playButton: { enabled: true, loading: false, tooltip: 'Replay audio' },
          pauseButton: { enabled: false, tooltip: 'Audio not playing' },
          stopButton: { enabled: false, tooltip: 'Audio stopped' }
        });

      // Stop synchronization
      this.stopSynchronization();

      console.log('🎵 Audio playback completed');
    } catch (error) {
      console.error('❌ Failed to handle playback end:', error);
    }
  }

  /**
   * Handle errors gracefully
   */
  private handleError(message: string): void {
    try {
      const store = useDialogueStore.getState();
      store.setAudioError(message);
      
      // Reset audio controls to safe state
      store.setAudioControlsState({
        playButton: { enabled: false, loading: false, tooltip: 'Audio error' },
        pauseButton: { enabled: false, tooltip: 'Audio error' },
        stopButton: { enabled: false, tooltip: 'Audio error' }
      });
    } catch (error) {
      console.error('❌ Failed to handle error:', error);
    }
  }

  /**
   * Get current audio state
   */
  public getAudioState() {
    return useDialogueStore.getState().audioState;
  }

  /**
   * Check if audio is ready
   */
  public isReady(): boolean {
    return this.isInitialized && this.currentAudioBuffer !== null;
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    try {
      this.stopAudio();
      this.stopSynchronization();
      
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      if (this.elevenLabsService) {
        disposeElevenLabsService();
        this.elevenLabsService = null;
      }

      this.currentAudioBuffer = null;
      this.isInitialized = false;

      console.log('🧹 Audio Integration Service disposed');
    } catch (error) {
      console.error('❌ Failed to dispose audio service:', error);
    }
  }
}

// Export singleton instance
export const audioIntegrationService = new AudioIntegrationService();

// Export for testing
export function getAudioIntegrationService(): AudioIntegrationService {
  return audioIntegrationService;
}

export function disposeAudioIntegrationService(): void {
  audioIntegrationService.dispose();
}
