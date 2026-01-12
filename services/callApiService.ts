import { authService } from './authService';

export interface CallRequest {
  agent_id: string;
  language: string;
  sip_call_to: string;
  target_agent_id: string;
  user_name: string;
  voice_id: string;
}

export interface CallResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

class CallApiService {
  private baseUrl = ''; // Use proxy in development
  private directBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.induslabs.io";

  async initiateCall(phoneNumber: string, userName?: string): Promise<CallResponse> {
    try {
      console.log('Initiating call to:', phoneNumber);
      
      // Ensure we're authenticated
      if (!authService.isAuthenticated()) {
        console.log('Not authenticated, attempting auto-login...');
        const loginSuccess = await authService.autoLogin();
        if (!loginSuccess) {
          throw new Error('Authentication failed. Please check credentials.');
        }
      }

      // Prepare the call payload
      const callPayload: CallRequest = {
        agent_id: "AGT_312E66D3", // Default agent ID
        language: "hi", // Default to Hindi
        sip_call_to: phoneNumber,
        target_agent_id: "AGT_803146DB", // Default target agent ID
        user_name: userName || phoneNumber, // Use phone number as user name if not provided
        voice_id: "Indus-hi-Urvashi" // Default voice ID
      };

      console.log('Call payload:', callPayload);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const attemptRequest = async (baseUrl: string) =>
        fetch(`${baseUrl}/api/calls/call/demo/single`, {
          method: 'POST',
          headers: {
            ...authService.getAuthHeaders(),
            'Accept': 'application/json',
          },
          body: JSON.stringify(callPayload),
          signal: controller.signal
        });

      let response: Response | null = null;
      try {
        response = await attemptRequest(this.baseUrl);
      } catch (error) {
        console.warn('Proxy request failed, trying direct API.', error);
      }

      if (!response || !response.ok) {
        response = await attemptRequest(this.directBaseUrl);
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Call API failed:', response.status, response.statusText, errorText);
        throw new Error(`Call failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Call API Response:', data);

      return {
        success: true,
        data,
        message: 'Call initiated successfully'
      };
    } catch (error) {
      console.error('Call API error:', error);
      
      let errorMessage = 'Failed to initiate call';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('Authentication failed')) {
          errorMessage = 'Authentication failed. Please refresh the page and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to initiate call'
      };
    }
  }

  // Method to get available agents (for future use)
  async getAvailableAgents(): Promise<CallResponse> {
    try {
      if (!authService.isAuthenticated()) {
        const loginSuccess = await authService.autoLogin();
        if (!loginSuccess) {
          throw new Error('Authentication failed. Please check credentials.');
        }
      }

      const attemptRequest = async (baseUrl: string) =>
        fetch(`${baseUrl}/api/agents`, {
          method: 'GET',
          headers: authService.getAuthHeaders()
        });

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
        throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Agents fetched successfully'
      };
    } catch (error) {
      console.error('Get agents error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch agents'
      };
    }
  }

  // Method to get available voices (for future use)
  async getAvailableVoices(): Promise<CallResponse> {
    try {
      if (!authService.isAuthenticated()) {
        const loginSuccess = await authService.autoLogin();
        if (!loginSuccess) {
          throw new Error('Authentication failed. Please check credentials.');
        }
      }

      const attemptRequest = async (baseUrl: string) =>
        fetch(`${baseUrl}/api/voices`, {
          method: 'GET',
          headers: authService.getAuthHeaders()
        });

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
        throw new Error(`Failed to fetch voices: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Voices fetched successfully'
      };
    } catch (error) {
      console.error('Get voices error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch voices'
      };
    }
  }
}

// Export a singleton instance
export const callApiService = new CallApiService();
