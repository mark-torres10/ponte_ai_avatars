// Voice Service for Parker Sports Extension
// Handles WebRTC connections and real-time voice interactions

import { apiService } from './api';
import { VoiceSession, VoiceEventHandlers, SportsContext, VoiceType, DifficultyLevel } from '../types';

// VoiceSession and VoiceEventHandlers are imported from types/index.ts

class VoiceService {
  private session: VoiceSession | null = null;
  private websocket: WebSocket | null = null; // Deprecated in favor of WebRTC
  private peerConnection: RTCPeerConnection | null = null;
  private micStream: MediaStream | null = null;
  private remoteAudioEl: HTMLAudioElement | null = null;
  private eventHandlers: VoiceEventHandlers = {};
  private isInitialized = false;

  constructor() {
    // Initialize will be called when first needed
  }

  private async initialize() {
    if (this.isInitialized) {
      console.log('🔍 DEBUG: Voice service already initialized');
      return;
    }
    
    try {
      console.log('🔍 DEBUG: Starting voice service initialization');
      console.log('🔍 DEBUG: About to call apiService.getHealth()');
      
      // Test API connection
      const healthResponse = await apiService.getHealth();
      console.log('🔍 DEBUG: Health check response:', healthResponse);
      
      this.isInitialized = true;
      console.log('✅ DEBUG: Voice service initialized successfully');
    } catch (error) {
      console.error('❌ DEBUG: Failed to initialize voice service:', error);
      console.error('❌ DEBUG: Error type:', typeof error);
      console.error('❌ DEBUG: Error message:', error instanceof Error ? error.message : String(error));
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
      console.log('🔍 DEBUG: startSession called with params:', { voice, difficulty, instructions, sportsContext });
      
      console.log('🔍 DEBUG: About to initialize voice service');
      await this.initialize();
      console.log('🔍 DEBUG: Voice service initialization completed');

      console.log('🔍 DEBUG: About to generate token from backend');
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

  // Connect to WebRTC using SDP negotiation with Authorization header
  private async connectWebRTC(): Promise<void> {
    if (!this.session) {
      throw new Error('No active session');
    }

    try {
      console.log('🔍 DEBUG: Requesting microphone access...');
      try {
        this.micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } as MediaTrackConstraints,
        });
        console.log('✅ DEBUG: Microphone access granted');
      } catch (err) {
        const e = err as DOMException;
        console.log('❌ DEBUG: getUserMedia failed', {
          name: e?.name,
          message: e?.message,
        });
        if (e && e.name === 'NotAllowedError') {
          console.log('❌ DEBUG: Permission dismissed or denied. Ask user to click Allow or use omnibox mic icon to enable.');
        }
        throw err;
      }

      console.log('🔍 DEBUG: Creating RTCPeerConnection');
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      // Play remote audio
      if (!this.remoteAudioEl) {
        this.remoteAudioEl = document.createElement('audio');
        this.remoteAudioEl.autoplay = true;
        this.remoteAudioEl.style.display = 'none';
        document.body.appendChild(this.remoteAudioEl);
      }

      this.peerConnection.ontrack = (event: RTCTrackEvent) => {
        console.log('🔍 DEBUG: ontrack fired. Streams:', event.streams?.length);
        const [remoteStream] = event.streams;
        if (this.remoteAudioEl) {
          this.remoteAudioEl.srcObject = remoteStream;
        }
          if (this.session) {
            this.session.isConnected = true;
          }
          this.eventHandlers.onConnectionChange?.(true);
      };

      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('🔍 DEBUG: ICE state:', this.peerConnection?.iceConnectionState);
      };

      // Add local mic tracks
      this.micStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.micStream!);
      });
      console.log('✅ DEBUG: Added local audio tracks to RTCPeerConnection');

      // Create SDP offer
      const offer = await this.peerConnection.createOffer({ offerToReceiveAudio: true });
      console.log('🔍 DEBUG: Created SDP offer. SDP length:', offer.sdp?.length);
      await this.peerConnection.setLocalDescription(offer);
      console.log('✅ DEBUG: setLocalDescription completed');

      // Wait for ICE gathering to complete for a full SDP (non-trickle)
      await new Promise<void>((resolve) => {
        if (!this.peerConnection) { resolve(); return; }
        if (this.peerConnection.iceGatheringState === 'complete') {
          console.log('✅ DEBUG: ICE gathering already complete');
          resolve();
        } else {
          console.log('🔍 DEBUG: Waiting for ICE gathering to complete...');
          const checkState = () => {
            if (!this.peerConnection) { resolve(); return; }
            console.log('🔍 DEBUG: ICE gathering state:', this.peerConnection.iceGatheringState);
            if (this.peerConnection.iceGatheringState === 'complete') {
              this.peerConnection.removeEventListener('icegatheringstatechange', checkState);
              console.log('✅ DEBUG: ICE gathering complete');
              resolve();
            }
          };
          this.peerConnection.addEventListener('icegatheringstatechange', checkState);
        }
      });

      // Send SDP to OpenAI Realtime endpoint with Authorization: Bearer <client_secret>
      const originalWebRtcUrl = this.session.webRtcUrl;
      let webRtcUrl = originalWebRtcUrl;
      try {
        const parsed = new URL(originalWebRtcUrl);
        console.log('🔍 DEBUG: Original web_rtc_url parts:', {
          protocol: parsed.protocol,
          host: parsed.host,
          pathname: parsed.pathname,
          search: parsed.search,
        });
        // Normalize scheme: wss -> https, ws -> http
        if (parsed.protocol === 'wss:') parsed.protocol = 'https:';
        if (parsed.protocol === 'ws:') parsed.protocol = 'http:';
        // Ensure model param present (fallback to session voice/model config)
        if (!parsed.searchParams.has('model')) {
          // Attempt to add model from session voice/model (model not stored; using gpt-realtime by contract)
          parsed.searchParams.set('model', 'gpt-realtime');
        }
        webRtcUrl = parsed.toString();
        console.log('🔍 DEBUG: Normalized SDP POST URL:', webRtcUrl);
      } catch (e) {
        console.log('❌ DEBUG: Failed to parse/normalize web_rtc_url. Using original.', e);
      }
      const clientSecret = this.session.clientSecret;
      console.log('🔍 DEBUG: About to POST SDP to OpenAI Realtime endpoint');
      console.log('🔍 DEBUG: POST URL scheme check:', { startsWithHttps: webRtcUrl.startsWith('https://') });
      console.log('🔍 DEBUG: Headers presence flags before POST:', {
        authorization: !!clientSecret,
        contentTypeSdp: true,
        acceptSdp: true,
      });

      const sdpResponse = await fetch(webRtcUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          'Content-Type': 'application/sdp',
          Accept: 'application/sdp',
        },
        body: offer.sdp || '',
      });

      console.log('🔍 DEBUG: SDP POST response status:', sdpResponse.status);
      console.log('🔍 DEBUG: SDP POST response headers:', Object.fromEntries(sdpResponse.headers.entries()));
      if (!sdpResponse.ok) {
        const text = await sdpResponse.text();
        console.log('❌ DEBUG: SDP POST failed. Body:', text);
        throw new Error(`SDP POST failed: ${sdpResponse.status}`);
      }

      const answerSdp = await sdpResponse.text();
      console.log('✅ DEBUG: Received SDP answer. Length:', answerSdp.length);

      await this.peerConnection.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      console.log('✅ DEBUG: setRemoteDescription completed');
    } catch (error) {
      console.error('❌ DEBUG: WebRTC negotiation failed:', error);
      // Bubble up detailed error
      this.eventHandlers.onError?.(error as Error);
      throw error;
    }
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
  sendAudio(_audioData: ArrayBuffer) {
    // With WebRTC, audio is sent via MediaStream track; this method is no-op
    if (!this.session?.isConnected) {
      throw new Error('No active WebRTC connection');
    }
    console.log('🔍 DEBUG: sendAudio called - no-op in WebRTC mode');
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
      try { this.websocket.close(); } catch {}
      this.websocket = null;
    }
    if (this.peerConnection) {
      try { this.peerConnection.close(); } catch {}
      this.peerConnection = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    if (this.remoteAudioEl) {
      try { this.remoteAudioEl.srcObject = null; } catch {}
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
