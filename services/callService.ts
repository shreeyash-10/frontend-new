import { Room, RoomEvent, RemoteParticipant, Track, RemoteTrack } from 'livekit-client';
import { authService } from './authService';

// Language mapping to 2-letter codes
const languageCodeMap: Record<string, string> = {
  "English": "en",
  "Hindi": "hi"
};

export interface CallTokenResponse {
  token: string;
  ws_url: string;
  host: string;
}

export interface CallState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  room: Room | null;
}

class CallService {
  private room: Room | null = null;
  private baseUrl = ''; // Use proxy in development
  private directBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.induslabs.io";
  private callbacks: {
    onStateChange?: (state: CallState) => void;
    onParticipantConnected?: (participant: RemoteParticipant) => void;
    onParticipantDisconnected?: (participant: RemoteParticipant) => void;
    onTrackSubscribed?: (track: RemoteTrack, participant: RemoteParticipant) => void;
  } = {};

  async fetchCallToken(commonAgentId: string, targetAgentId: string, language?: string, voice?: string): Promise<CallTokenResponse> {
    try {
      // Ensure we're authenticated
      if (!authService.isAuthenticated()) {
        console.log('Not authenticated, attempting auto-login...');
        const loginSuccess = await authService.autoLogin();
        if (!loginSuccess) {
          throw new Error('Authentication failed. Please check credentials.');
        }
      }

      // Convert language to 2-letter code
      const languageCode = language ? languageCodeMap[language] || language : undefined;
      
      const attemptRequest = async (baseUrl: string) => {
        let response = await fetch(`${baseUrl}/api/calls/token/${commonAgentId}`, {
          method: 'POST',
          headers: authService.getAuthHeaders(),
          body: JSON.stringify({
            agent_id: commonAgentId,
            common_agent_id: commonAgentId,
            target_agent_id: targetAgentId,
            language: languageCode,
            voice: voice
          })
        });

        if (!response.ok && response.status === 401) {
          console.log('Token expired, re-authenticating...');
          authService.logout();
          const loginSuccess = await authService.autoLogin();
          if (!loginSuccess) {
            throw new Error('Re-authentication failed');
          }

          response = await fetch(`${baseUrl}/api/calls/token/${commonAgentId}`, {
            method: 'POST',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify({
              agent_id: commonAgentId,
              common_agent_id: commonAgentId,
              target_agent_id: targetAgentId,
              language: languageCode,
              voice: voice
            })
          });
        }

        return response;
      };

      let response: Response | null = null;
      try {
        response = await attemptRequest(this.baseUrl);
      } catch (error) {
        console.warn('Proxy request failed, trying direct API.', error);
      }

      if (!response || !response.ok) {
        response = await attemptRequest(this.directBaseUrl);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch call token: ${response.status} ${response.statusText}`);
      }

      const data: CallTokenResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching call token:', error);
      throw error;
    }
  }

  async connectToCall(token: string, wsUrl: string): Promise<void> {
    try {
      console.log('Connecting to call with:', { token: token.substring(0, 20) + '...', wsUrl });
      this.updateState({ isConnecting: true, error: null });

      // Request microphone permission BEFORE connecting
      try {
        console.log('Requesting microphone permission...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        console.log('Microphone permission granted');
        // Stop the stream as we'll get a new one from LiveKit
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Microphone permission denied:', error);
        this.updateState({ 
          isConnected: false, 
          isConnecting: false, 
          error: 'Microphone permission is required for calls' 
        });
        throw new Error('Microphone permission is required for calls');
      }

      // Create a new room instance with minimal configuration for demo
      this.room = new Room({
        adaptiveStream: false,
        dynacast: false,
        // Remove video configuration for audio-only demo
      });

      // Set up event listeners
      this.setupRoomEventListeners();

      // Connect to the room
      console.log('Attempting to connect to LiveKit with:', {
        wsUrl,
        tokenLength: token.length,
        tokenStart: token.substring(0, 20) + '...',
        tokenEnd: '...' + token.substring(token.length - 20)
      });
      
      // Add connection timeout
      const connectPromise = this.room.connect(wsUrl, token);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout after 30 seconds')), 30000);
      });
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('Room connected successfully to:', wsUrl);
      
      // Enable microphone after connection
      try {
        await this.room.localParticipant.setMicrophoneEnabled(true);
        console.log('Microphone enabled successfully');
      } catch (error) {
        console.error('Failed to enable microphone:', error);
      }
      
      // Force state update after connection
      setTimeout(() => {
        this.updateState({ 
          isConnected: true, 
          isConnecting: false, 
          room: this.room 
        });
      }, 100);

    } catch (error) {
      console.error('Error connecting to call:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to connect to call';
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'LiveKit server not found. Please check the WebSocket URL.';
        } else if (error.message.includes('signal connection')) {
          errorMessage = 'Could not establish connection to LiveKit signaling server.';
        } else if (error.message.includes('token')) {
          errorMessage = 'Invalid or expired token. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      this.updateState({ 
        isConnected: false, 
        isConnecting: false, 
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
  }

  private setupRoomEventListeners(): void {
    if (!this.room) return;

    this.room.on(RoomEvent.Connected, () => {
      console.log('Connected to room');
      this.updateState({ 
        isConnected: true, 
        isConnecting: false, 
        room: this.room 
      });
    });

    this.room.on(RoomEvent.Disconnected, (reason) => {
      console.log('Disconnected from room:', reason);
      this.updateState({ 
        isConnected: false, 
        isConnecting: false, 
        room: null 
      });
    });

    this.room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      console.log('Participant connected:', participant.identity);
      this.callbacks.onParticipantConnected?.(participant);
    });

    this.room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      console.log('Participant disconnected:', participant.identity);
      this.callbacks.onParticipantDisconnected?.(participant);
    });

    this.room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: any, participant: RemoteParticipant) => {
      console.log('Track subscribed:', track.kind, 'from', participant.identity);
      
      // Handle audio tracks
      if (track.kind === Track.Kind.Audio) {
        const audioElement = track.attach();
        audioElement.autoplay = true;
        audioElement.volume = 1.0;
        document.body.appendChild(audioElement);
        console.log('Audio track attached and playing');
      }
      
      this.callbacks.onTrackSubscribed?.(track, participant);
    });

    this.room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, publication: any, participant: RemoteParticipant) => {
      console.log('Track unsubscribed:', track.kind, 'from', participant.identity);
      track.detach().forEach(element => element.remove());
    });

    this.room.on(RoomEvent.TrackMuted, (publication: any, participant: any) => {
      console.log('Track muted:', publication.kind, 'from', participant.identity);
    });

    this.room.on(RoomEvent.TrackUnmuted, (publication: any, participant: any) => {
      console.log('Track unmuted:', publication.kind, 'from', participant.identity);
    });
  }

  async startCall(commonAgentId: string, targetAgentId: string, language?: string, voice?: string): Promise<void> {
    try {
      console.log('Starting call with:', { commonAgentId, targetAgentId, language, voice });
      // Fetch the call token
      const { token, ws_url } = await this.fetchCallToken(commonAgentId, targetAgentId, language, voice);
      
      // Connect to the call
      await this.connectToCall(token, ws_url);
      
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async endCall(): Promise<void> {
    if (this.room) {
      // Disable microphone
      await this.room.localParticipant.setMicrophoneEnabled(false);
      
      // Clean up audio elements
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(element => element.remove());
      
      // Disconnect from room
      await this.room.disconnect();
      this.room = null;
      
      this.updateState({ 
        isConnected: false, 
        isConnecting: false, 
        room: null 
      });
      
      console.log('Call ended and cleaned up');
    }
  }

  private updateState(updates: Partial<CallState>): void {
    const currentState: CallState = {
      isConnected: this.room?.state === 'connected' || false,
      isConnecting: false,
      error: null,
      room: this.room
    };

    const newState = { ...currentState, ...updates };
    console.log('Updating call state:', newState);
    this.callbacks.onStateChange?.(newState);
  }

  setCallbacks(callbacks: typeof this.callbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  getCurrentState(): CallState {
    return {
      isConnected: this.room?.state === 'connected' || false,
      isConnecting: false,
      error: null,
      room: this.room
    };
  }
}

// Export the class and a singleton instance
export { CallService };
export const callService = new CallService();
