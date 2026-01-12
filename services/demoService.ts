import { authService } from "./authService";

export interface DemoTokenResponse {
  token: string;
  ws_url: string;
  host: string;
}

export interface DemoCallRequest {
  agent_id: string;
  target_agent_id: string;
  voice_id: string;
  language: string;
  agent_prompt: string;
  starting_instructions: string;
}

export const voiceMapping = {
  english: [
    { name: "Urvashi", voice_id: "Indus-hi-Urvashi" },
    { name: "Menaka", voice_id: "Indus-hi-menka" },
  ],
  hindi: [
    { name: "Urvashi", voice_id: "Indus-hi-Urvashi" },
    { name: "Menaka", voice_id: "Indus-hi-menka" },
  ],
};

export const languageCodeMap: Record<string, string> = {
  English: "en",
  Hindi: "hi",
  "हिंदी": "hi",
  Arabic: "ar",
  "العربية": "ar",
  Tamil: "ta",
  "தமிழ்": "ta",
  Telugu: "te",
  "తెలుగు": "te",
  Bengali: "bn",
  "বাংলা": "bn",
  Gujarati: "gu",
  "ગુજરાતી": "gu",
  Kannada: "kn",
  "ಕನ್ನಡ": "kn",
  Malayalam: "ml",
  "മലയാളം": "ml",
  Marathi: "mr",
  "मराठी": "mr",
  Punjabi: "pa",
  "ਪੰਜਾਬੀ": "pa",
  Maithili: "mai",
  "मैथिली": "mai",
  Chhattisgarhi: "hne",
  Chattisgarhi: "hne",
  "छत्तीसगढ़ी": "hne",
  Bhojpuri: "bho",
  "भोजपुरी": "bho",
};

class DemoService {
  private baseUrl = ""; // Use proxy in development
  private directBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.induslabs.io";

  async fetchDemoToken(
    agentId: string,
    targetAgentId: string,
    voiceId: string,
    language: string,
    agent_prompt: string,
    starting_instructions: string
  ): Promise<DemoTokenResponse> {
    try {
      if (!authService.isAuthenticated()) {
        console.log("Not authenticated, attempting auto-login...");
        const loginSuccess = await authService.autoLogin();
        if (!loginSuccess) {
          throw new Error("Authentication failed. Please check credentials.");
        }
      }

      const payload: DemoCallRequest = {
        agent_id: agentId,
        target_agent_id: targetAgentId,
        voice_id: voiceId,
        language,
        agent_prompt,
        starting_instructions,
      };

      console.log("Sending demo token request:", payload);

      const attemptRequest = async (baseUrl: string) => {
        let response = await fetch(`${baseUrl}/api/calls/demo-token/${agentId}`, {
          method: "POST",
          headers: authService.getAuthHeaders(),
          body: JSON.stringify(payload),
        });

        if (!response.ok && response.status === 401) {
          console.log("Token expired, re-authenticating...");
          authService.logout();
          const loginSuccess = await authService.autoLogin();
          if (!loginSuccess) {
            throw new Error("Re-authentication failed");
          }

          response = await fetch(`${baseUrl}/api/calls/demo-token/${agentId}`, {
            method: "POST",
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(payload),
          });
        }

        return response;
      };

      let response: Response | null = null;
      try {
        response = await attemptRequest(this.baseUrl);
      } catch (error) {
        console.warn("Proxy request failed, trying direct API.", error);
      }

      if (!response || !response.ok) {
        response = await attemptRequest(this.directBaseUrl);
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch demo token: ${response.status} ${response.statusText}`);
      }

      const data: DemoTokenResponse = await response.json();
      console.log("Demo token API response:", data);

      return data;
    } catch (error) {
      console.error("Error fetching demo token:", error);
      throw error;
    }
  }

  getVoicesForLanguage(language: string): Array<{ name: string; voice_id: string }> {
    const languageKey = language.toLowerCase();
    return voiceMapping[languageKey as keyof typeof voiceMapping] || [];
  }

  getLanguageCode(language: string): string {
    return languageCodeMap[language] || language.toLowerCase();
  }
}

export const demoService = new DemoService();
