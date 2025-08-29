// ElevenLabs API Service for AI Avatar Extension
// This service provides high-quality text-to-speech generation with audio streaming
// and playback capabilities, optimized for browser extension context

import { 
  AudioGenerationRequest, 
  AudioGenerationResult, 
  ElevenLabsResponse,
  AudioPlaybackState,
  AudioSyncState 
} from '../types';

// ElevenLabs API configuration
const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';
const DEFAULT_MODEL_ID = 'eleven_monolingual_v1';
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.5
};

// Audio quality and performance settings
const AUDIO_SETTINGS = {
  maxTextLength: 5000,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  bufferSize: 4096
};

export class ElevenLabsService {
  private apiKey: string;
  private voiceId: string;
  private isInitialized: boolean = false;
  private audioContext: AudioContext | null = null;
  private currentAudioBuffer: AudioBuffer | null = null;
  private audioSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private playbackStartTime: number = 0;
  private isPlaying: boolean = false;

  constructor(apiKey: string, voiceId: string) {
    this.apiKey = apiKey;
    this.voiceId = voiceId;
    this.initializeAudioContext();
  }

  /**
   * Initialize Web Audio API context for audio playback
   */
  private initializeAudioContext(): void {
    try {
      // Create audio context with user interaction requirement
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.isInitialized = true;
      console.log('🎵 [ELEVENLABS] Audio context initialized successfully');
    } catch (error) {
      console.error('❌ [ELEVENLABS] Failed to initialize audio context:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Check if the service is ready to use
   */
  public isReady(): boolean {
    return this.isInitialized && !!this.apiKey && !!this.voiceId;
  }

  /**
   * Check if API key is valid
   */
  public hasValidApiKey(): boolean {
    return !!this.apiKey && this.apiKey.startsWith('sk_');
  }

  /**
   * Generate audio from text using ElevenLabs API
   */
  public async generateAudio(text: string, options: Partial<AudioGenerationRequest> = {}): Promise<AudioGenerationResult> {
    const startTime = Date.now();
    
    try {
      // Validate input
      if (!text || typeof text !== 'string') {
        throw new Error('Text input is required and must be a string');
      }

      if (text.length > AUDIO_SETTINGS.maxTextLength) {
        throw new Error(`Text must be ${AUDIO_SETTINGS.maxTextLength} characters or less for voice generation`);
      }

      if (!this.isReady()) {
        throw new Error('ElevenLabs service is not ready');
      }

      console.log('🎵 [ELEVENLABS] Generating audio for text length:', text.length);

      // Prepare request
      const request: AudioGenerationRequest = {
        text,
        voiceId: this.voiceId,
        modelId: options.modelId || DEFAULT_MODEL_ID,
        voiceSettings: options.voiceSettings || DEFAULT_VOICE_SETTINGS
      };

      // Call ElevenLabs API
      const response = await this.callElevenLabsAPI(request);
      
      if (!response.success || !response.audioBuffer) {
        throw new Error(response.error || 'Audio generation failed');
      }

      // Convert ArrayBuffer to AudioBuffer for playback
      const audioBuffer = await this.convertToAudioBuffer(response.audioBuffer);
      
      const generationTime = Date.now() - startTime;
      
      console.log('✅ [ELEVENLABS] Audio generated successfully in', generationTime, 'ms');

      return {
        success: true,
        audioBuffer: response.audioBuffer,
        audioUrl: this.createAudioURL(response.audioBuffer),
        duration: audioBuffer.duration,
        metadata: {
          generationTime,
          textLength: text.length,
          voiceId: this.voiceId,
          modelId: request.modelId || DEFAULT_MODEL_ID
        }
      };

    } catch (error) {
      const generationTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error('❌ [ELEVENLABS] Audio generation failed:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        metadata: {
          generationTime,
          textLength: text.length,
          voiceId: this.voiceId,
          modelId: options.modelId || DEFAULT_MODEL_ID
        }
      };
    }
  }

  /**
   * Call ElevenLabs API with retry logic
   */
  private async callElevenLabsAPI(request: AudioGenerationRequest): Promise<ElevenLabsResponse> {
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= AUDIO_SETTINGS.maxRetries; attempt++) {
      try {
        console.log(`🎵 [ELEVENLABS] API call attempt ${attempt}/${AUDIO_SETTINGS.maxRetries}`);
        
        const response = await fetch(`${ELEVENLABS_API_BASE}/text-to-speech/${request.voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text: request.text,
            model_id: request.modelId,
            voice_settings: request.voiceSettings,
          }),
          signal: AbortSignal.timeout(AUDIO_SETTINGS.timeout)
        });

        if (!response.ok) {
          const errorText = await response.text();
          
          if (response.status === 401) {
            throw new Error('ElevenLabs API authentication failed - check API key');
          }
          
          if (response.status === 429) {
            throw new Error('ElevenLabs API rate limit exceeded - please try again later');
          }
          
          throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        
        return {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          audioBuffer
        };

      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`⚠️ [ELEVENLABS] API call attempt ${attempt} failed:`, lastError);
        
        if (attempt < AUDIO_SETTINGS.maxRetries) {
          await this.delay(AUDIO_SETTINGS.retryDelay * attempt);
        }
      }
    }

    throw new Error(`All API call attempts failed. Last error: ${lastError}`);
  }

  /**
   * Convert ArrayBuffer to AudioBuffer for Web Audio API
   */
  private async convertToAudioBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.currentAudioBuffer = audioBuffer;
      return audioBuffer;
    } catch (error) {
      throw new Error(`Failed to decode audio data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create data URL for audio buffer
   */
  private createAudioURL(arrayBuffer: ArrayBuffer): string {
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }

  /**
   * Play audio with synchronization support
   */
  public async playAudio(syncCallback?: (currentTime: number) => void): Promise<boolean> {
    if (!this.audioContext || !this.currentAudioBuffer) {
      console.error('❌ [ELEVENLABS] Cannot play audio - context or buffer not available');
      return false;
    }

    try {
      // Resume audio context if suspended (required for user interaction)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Stop any currently playing audio
      this.stopAudio();

      // Create new audio source
      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.buffer = this.currentAudioBuffer;
      this.audioSource.connect(this.gainNode!);

      // Set up synchronization callback
      if (syncCallback) {
        this.audioSource.onended = () => {
          this.isPlaying = false;
          console.log('🎵 [ELEVENLABS] Audio playback completed');
        };
      }

      // Start playback
      this.audioSource.start(0);
      this.playbackStartTime = this.audioContext.currentTime;
      this.isPlaying = true;

      console.log('🎵 [ELEVENLABS] Audio playback started');

      // Set up synchronization monitoring
      if (syncCallback) {
        this.monitorPlaybackSync(syncCallback);
      }

      return true;

    } catch (error) {
      console.error('❌ [ELEVENLABS] Failed to play audio:', error);
      this.isPlaying = false;
      return false;
    }
  }

  /**
   * Pause audio playback
   */
  public pauseAudio(): void {
    if (this.audioSource && this.isPlaying) {
      try {
        this.audioSource.stop();
        this.isPlaying = false;
        console.log('⏸️ [ELEVENLABS] Audio playback paused');
      } catch (error) {
        console.error('❌ [ELEVENLABS] Failed to pause audio:', error);
      }
    }
  }

  /**
   * Stop audio playback
   */
  public stopAudio(): void {
    if (this.audioSource) {
      try {
        this.audioSource.stop();
        this.audioSource = null;
        this.isPlaying = false;
        this.playbackStartTime = 0;
        console.log('⏹️ [ELEVENLABS] Audio playback stopped');
      } catch (error) {
        console.error('❌ [ELEVENLABS] Failed to stop audio:', error);
      }
    }
  }

  /**
   * Set audio volume (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    if (this.gainNode) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.gainNode.gain.setValueAtTime(clampedVolume, this.audioContext?.currentTime || 0);
      console.log('🔊 [ELEVENLABS] Volume set to:', clampedVolume);
    }
  }

  /**
   * Set playback rate (0.5 to 2.0)
   */
  public setPlaybackRate(rate: number): void {
    if (this.audioSource) {
      const clampedRate = Math.max(0.5, Math.min(2.0, rate));
      this.audioSource.playbackRate.setValueAtTime(clampedRate, this.audioContext?.currentTime || 0);
      console.log('⏩ [ELEVENLABS] Playback rate set to:', clampedRate);
    }
  }

  /**
   * Get current playback state
   */
  public getPlaybackState(): AudioPlaybackState {
    if (!this.audioContext || !this.currentAudioBuffer) {
      return {
        isPlaying: false,
        isPaused: false,
        isStopped: true,
        currentTime: 0,
        duration: 0,
        volume: this.gainNode ? this.gainNode.gain.value : 1,
        playbackRate: 1,
        isMuted: false
      };
    }

    const currentTime = this.isPlaying ? 
      (this.audioContext.currentTime - this.playbackStartTime) : 0;

    return {
      isPlaying: this.isPlaying,
      isPaused: false,
      isStopped: !this.isPlaying,
      currentTime: Math.max(0, currentTime),
      duration: this.currentAudioBuffer.duration,
      volume: this.gainNode ? this.gainNode.gain.value : 1,
      playbackRate: this.audioSource ? this.audioSource.playbackRate.value : 1,
      isMuted: false
    };
  }

  /**
   * Monitor playback synchronization
   */
  private monitorPlaybackSync(syncCallback: (currentTime: number) => void): void {
    if (!this.audioContext || !this.isPlaying) return;

    const checkSync = () => {
      if (this.isPlaying && this.audioContext) {
        const currentTime = this.audioContext.currentTime - this.playbackStartTime;
        syncCallback(currentTime);
        
        // Continue monitoring
        requestAnimationFrame(checkSync);
      }
    };

    requestAnimationFrame(checkSync);
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.stopAudio();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.currentAudioBuffer = null;
    this.gainNode = null;
    this.isInitialized = false;
    
    console.log('🧹 [ELEVENLABS] Service disposed');
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
let elevenLabsServiceInstance: ElevenLabsService | null = null;

export function getElevenLabsService(apiKey: string, voiceId: string): ElevenLabsService {
  if (!elevenLabsServiceInstance) {
    elevenLabsServiceInstance = new ElevenLabsService(apiKey, voiceId);
  }
  return elevenLabsServiceInstance;
}

export function disposeElevenLabsService(): void {
  if (elevenLabsServiceInstance) {
    elevenLabsServiceInstance.dispose();
    elevenLabsServiceInstance = null;
  }
}
