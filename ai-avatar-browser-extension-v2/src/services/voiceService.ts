// Voice Service for Parker Sports Extension
// Handles WebRTC connections and real-time voice interactions

import { apiService } from './api';
import { TokenResponse, VoiceSession, VoiceEventHandlers, SportsContext, VoiceType, DifficultyLevel } from '../types';

// VoiceSession and VoiceEventHandlers are imported from types/index.ts

class VoiceService {
  private session: VoiceSession | null = null;
  private websocket: WebSocket | null = null;
  private eventHandlers: VoiceEventHandlers = {};
  private isInitialized = false;

  constructor() {
    // Initialize will be called when first needed
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Test API connection
      await apiService.getHealth();
      this.isInitialized = true;
      console.log('Voice service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize voice service:', error);
      throw error;
    }
  }

  // Set event handlers
  setEventHandlers(handlers: VoiceEventHandlers) {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  // Start a new voice session
  async startSession(
    voice: VoiceType,
    difficulty: DifficultyLevel,
    instructions: string,
    sportsContext?: SportsContext
  ): Promise<VoiceSession> {
    try {
      await this.initialize();

      // Generate token from backend
      const tokenResponse = await apiService.generateToken({
        model: 'gpt-realtime',
        voice,
        instructions,
        difficulty,
        voice_quality: 'standard',
        audio_format: 'pcm',
        enable_interruptions: true,
        response_length: 'medium',
        sports_context: sportsContext || 'basketball',
      });

      // Create session
      this.session = {
        sessionId: tokenResponse.session_id,
        clientSecret: tokenResponse.client_secret,
        webRtcUrl: tokenResponse.web_rtc_url,
        voice: tokenResponse.voice as VoiceType,
        difficulty: tokenResponse.difficulty as DifficultyLevel,
        isConnected: false,
        isRecording: false,
        isSpeaking: false,
      };

      // Connect to WebRTC
      await this.connectWebRTC();

      if (!this.session) {
        throw new Error('Failed to create session');
      }

      return this.session;
    } catch (error) {
      console.error('Failed to start voice session:', error);
      this.eventHandlers.onError?.(error as Error);
      throw error;
    }
  }

  // Connect to WebRTC
  private async connectWebRTC(): Promise<void> {
    if (!this.session) {
      throw new Error('No active session');
    }

    return new Promise((resolve, reject) => {
      try {
        if (!this.session) {
          reject(new Error('No active session'));
          return;
        }
        this.websocket = new WebSocket(this.session.webRtcUrl);

        this.websocket.onopen = () => {
          console.log('WebRTC connection established');
          if (this.session) {
            this.session.isConnected = true;
          }
          this.eventHandlers.onConnectionChange?.(true);
          resolve();
        };

        this.websocket.onmessage = (event) => {
          this.handleWebSocketMessage(event);
        };

        this.websocket.onclose = () => {
          console.log('WebRTC connection closed');
          if (this.session) {
            this.session.isConnected = false;
          }
          this.eventHandlers.onConnectionChange?.(false);
        };

        this.websocket.onerror = (error) => {
          console.error('WebRTC connection error:', error);
          this.eventHandlers.onError?.(new Error('WebRTC connection failed'));
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Handle WebSocket messages
  private handleWebSocketMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'session.created':
          console.log('Session created:', data.session);
          break;
          
        case 'session.updated':
          console.log('Session updated:', data.session);
          break;
          
        case 'conversation.item.input_audio_buffer.committed':
          console.log('Audio input committed');
          break;
          
        case 'conversation.item.input_audio_buffer.speech_started':
          console.log('Speech started');
          if (this.session) {
            this.session.isRecording = true;
          }
          this.eventHandlers.onRecordingChange?.(true);
          break;
          
        case 'conversation.item.input_audio_buffer.speech_stopped':
          console.log('Speech stopped');
          if (this.session) {
            this.session.isRecording = false;
          }
          this.eventHandlers.onRecordingChange?.(false);
          break;
          
        case 'conversation.item.transcript':
          console.log('Transcript:', data.transcript);
          this.eventHandlers.onTranscript?.(data.transcript);
          break;
          
        case 'conversation.item.output_audio_buffer.speech_started':
          console.log('Parker started speaking');
          if (this.session) {
            this.session.isSpeaking = true;
          }
          this.eventHandlers.onSpeakingChange?.(true);
          break;
          
        case 'conversation.item.output_audio_buffer.speech_stopped':
          console.log('Parker stopped speaking');
          if (this.session) {
            this.session.isSpeaking = false;
          }
          this.eventHandlers.onSpeakingChange?.(false);
          break;
          
        case 'conversation.item.message':
          console.log('Message:', data.message);
          this.eventHandlers.onResponse?.(data.message.content);
          break;
          
        case 'error':
          console.error('WebRTC error:', data.error);
          this.eventHandlers.onError?.(new Error(data.error.message));
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  // Send audio data
  sendAudio(audioData: ArrayBuffer) {
    if (!this.websocket || !this.session?.isConnected) {
      throw new Error('No active WebRTC connection');
    }

    // Convert audio data to base64
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData)));
    
    const message = {
      type: 'conversation.item.input_audio_buffer.append',
      audio: base64Audio,
    };

    this.websocket.send(JSON.stringify(message));
  }

  // Start recording
  startRecording() {
    if (!this.session?.isConnected) {
      throw new Error('No active session');
    }

    if (this.session) {
      this.session.isRecording = true;
    }
    this.eventHandlers.onRecordingChange?.(true);
  }

  // Stop recording
  stopRecording() {
    if (!this.session?.isConnected) {
      throw new Error('No active session');
    }

    if (this.session) {
      this.session.isRecording = false;
    }
    this.eventHandlers.onRecordingChange?.(false);

    // Send commit message to process the audio
    if (this.websocket) {
      this.websocket.send(JSON.stringify({
        type: 'conversation.item.input_audio_buffer.commit',
      }));
    }
  }

  // End the current session
  endSession() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.session) {
      this.session.isConnected = false;
      this.session.isRecording = false;
      this.session.isSpeaking = false;
    }
    this.eventHandlers.onConnectionChange?.(false);

    this.session = null;
  }

  // Get current session
  getCurrentSession(): VoiceSession | null {
    return this.session;
  }

  // Check if service is ready
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const voiceService = new VoiceService();

// Note: Types are exported from types/index.ts to avoid conflicts
