export interface VoiceDefinition {
  id: string;
  name: string;
  locale: string;
  gender: "female" | "male" | "neutral";
  quality: string;
  tags: string[];
  sampleUrl: string;
  sampleDuration?: number;
  voice_id?: string; // Add the actual voice_id from API
}

export interface LanguageDefinition {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  locale: string;
  flag: string;
  voices: VoiceDefinition[];
}

class VoiceService {
  private cache: Map<string, LanguageDefinition[]> = new Map();
  private readonly PRIMARY_API_URL = "/api/voices";
  private readonly LEGACY_API_URL = "/api/voice/get-voices";
  private readonly DIRECT_PRIMARY_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.induslabs.io"}/api/voices`;
  private readonly DIRECT_LEGACY_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.induslabs.io"}/api/voice/get-voices`;

  async fetchVoices(): Promise<LanguageDefinition[]> {
    const cacheKey = 'all_voices';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      console.log('Making API call to:', this.PRIMARY_API_URL);
      let response = await this.fetchWithTimeout(this.PRIMARY_API_URL, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Primary voices endpoint failed, trying legacy endpoint.');
        response = await this.fetchWithTimeout(this.LEGACY_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({})
        });
      }

      if (!response.ok) {
        console.warn('Proxy endpoints failed, trying direct API endpoints.');
        response = await this.fetchWithTimeout(this.DIRECT_PRIMARY_API_URL, {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });

        if (!response.ok) {
          response = await this.fetchWithTimeout(this.DIRECT_LEGACY_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
            },
            body: JSON.stringify({})
          });
        }
      }

      console.log('API response status:', response.status);

      if (!response.ok) {
        console.warn('Failed to fetch voices from API, using fallback. Status:', response.status);
        return this.getFallbackVoices();
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Process the API response - handle new format with data.hindi, data.english etc.
      const voicesByLanguage = this.processApiResponse(data);

      if (!voicesByLanguage.length) {
        console.warn('Voice catalog empty, using fallback data.');
        const fallback = this.getFallbackVoices();
        this.cache.set(cacheKey, fallback);
        return fallback;
      }

      this.cache.set(cacheKey, voicesByLanguage);
      return voicesByLanguage;
      
    } catch (error) {
      console.error('Error fetching voices:', error);
      console.log('Using fallback voices data due to API error');
      return this.getFallbackVoices();
    }
  }

  async forceRefresh(): Promise<LanguageDefinition[]> {
    // Clear cache and fetch fresh data
    this.cache.clear();
    return this.fetchVoices();
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 7000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private processApiResponse(apiData: any): LanguageDefinition[] {
    console.log('Processing API response:', apiData);
    
    // Handle new API response format: { message: "...", data: { hindi: [...], english: [...] } }
    if (apiData && apiData.data) {
      const result: LanguageDefinition[] = [];
      
      Object.entries(apiData.data).forEach(([languageKey, voices]: [string, any]) => {
        const languageCode = this.mapLanguageKey(languageKey);
        const languageInfo = this.getLanguageInfo(languageCode);
        
        if (Array.isArray(voices) && voices.length > 0) {
          result.push({
            id: languageCode,
            code: languageCode,
            name: languageInfo.name,
            nativeName: languageInfo.name, // Use same as name for now
            locale: languageInfo.locale,
            flag: languageInfo.flag,
            voices: voices.map((voice: any, index: number) => ({
              id: voice.voice_id || `voice-${languageCode}-${index}`,
              name: this.getShortVoiceName(voice.name || `Voice ${index + 1}`),
              locale: languageInfo.locale,
              gender: voice.gender || "female",
              quality: "Studio", // Default quality since API doesn't provide it
              tags: ["natural", "clear"], // Default tags
              sampleUrl: this.getSampleUrl(languageInfo.locale, index, voice.name || `Voice ${index + 1}`),
              sampleDuration: 8.4, // Default duration
              voice_id: voice.voice_id || `voice-${languageCode}-${index}` // Store the actual voice_id from API
            }))
          });
        }
      });
      
      console.log('Processed languages:', result);
      return result;
    }
    
    // Fallback for old format (direct array)
    if (apiData && Array.isArray(apiData)) {
      const languageMap = new Map<string, any[]>();
      
      apiData.forEach((voice: any) => {
        const language = voice.language || 'en';
        if (!languageMap.has(language)) {
          languageMap.set(language, []);
        }
        languageMap.get(language)!.push(voice);
      });

      const result: LanguageDefinition[] = [];
      
      for (const [languageCode, voices] of languageMap) {
        const languageInfo = this.getLanguageInfo(languageCode);
        
        result.push({
          id: languageCode,
          code: languageCode,
          name: languageInfo.name,
          nativeName: languageInfo.name,
          locale: languageInfo.locale,
          flag: languageInfo.flag,
          voices: voices.map((voice: any, index: number) => ({
            id: voice.voice_id || `voice-${languageCode}-${index}`,
            name: this.getShortVoiceName(voice.name || `Voice ${index + 1}`),
            locale: languageInfo.locale,
            gender: voice.gender || "female",
            quality: "Studio",
            tags: ["natural", "clear"],
            sampleUrl: this.getSampleUrl(languageInfo.locale, index, voice.name || `Voice ${index + 1}`),
            sampleDuration: 8.4,
            voice_id: voice.voice_id || `voice-${languageCode}-${index}`
          }))
        });
      }
      
      return result;
    }

    console.warn('Unexpected API response format, using fallback');
    return this.getFallbackVoices();
  }

  private mapLanguageKey(languageKey: string): string {
    // Map API language keys to our internal language codes
    const normalizedKey = languageKey.toLowerCase();
    const keyMap: Record<string, string> = {
      'hindi': 'hi',
      'english': 'en',
      'arabic': 'ar',
      'ar': 'ar',
      'tamil': 'ta',
      'telugu': 'te',
      'bengali': 'bn',
      'gujarati': 'gu',
      'kannada': 'kn',
      'malayalam': 'ml',
      'marathi': 'mr',
      'punjabi': 'pa',
      'maithili': 'mai',
      'mai': 'mai',
      'bhojpuri': 'bho',
      'bho': 'bho',
      'chhattisgarhi': 'hne',
      'chattisgarhi': 'hne',
      'hne': 'hne',
      'sinhala': 'si',
      'si': 'si',
      'nepali': 'ne',
      'ne': 'ne'
    };

    return keyMap[normalizedKey] || normalizedKey;
  }

  private getLanguageInfo(languageCode: string) {
    const languageMap: Record<string, { name: string; locale: string; flag: string }> = {
      'en': { name: 'English', locale: 'en-US', flag: 'EN' },
      'hi': { name: 'Hindi', locale: 'hi-IN', flag: 'HI' },
      'es': { name: 'Spanish', locale: 'es-ES', flag: 'ES' },
      'fr': { name: 'French', locale: 'fr-FR', flag: 'FR' },
      'de': { name: 'German', locale: 'de-DE', flag: 'DE' },
      'it': { name: 'Italian', locale: 'it-IT', flag: 'IT' },
      'pt': { name: 'Portuguese', locale: 'pt-PT', flag: 'PT' },
      'ru': { name: 'Russian', locale: 'ru-RU', flag: 'RU' },
      'ja': { name: 'Japanese', locale: 'ja-JP', flag: 'JP' },
      'ko': { name: 'Korean', locale: 'ko-KR', flag: 'KR' },
      'zh': { name: 'Chinese', locale: 'zh-CN', flag: 'CN' },
      'ar': { name: 'Arabic', locale: 'ar-SA', flag: 'SA' },
      'bn': { name: 'Bengali', locale: 'bn-BD', flag: 'BD' },
      'ta': { name: 'Tamil', locale: 'ta-IN', flag: 'IN' },
      'te': { name: 'Telugu', locale: 'te-IN', flag: 'IN' },
      'gu': { name: 'Gujarati', locale: 'gu-IN', flag: 'IN' },
      'kn': { name: 'Kannada', locale: 'kn-IN', flag: 'IN' },
      'ml': { name: 'Malayalam', locale: 'ml-IN', flag: 'IN' },
      'mr': { name: 'Marathi', locale: 'mr-IN', flag: 'IN' },
      'pa': { name: 'Punjabi', locale: 'pa-IN', flag: 'IN' },
      'mai': { name: 'Maithili', locale: 'mai-IN', flag: 'IN' },
      'bho': { name: 'Bhojpuri', locale: 'bho-IN', flag: 'IN' },
      'hne': { name: 'Chhattisgarhi', locale: 'hne-IN', flag: 'IN' },
      'si': { name: 'Sinhala', locale: 'si-LK', flag: 'LK' },
      'ne': { name: 'Nepali', locale: 'ne-NP', flag: 'NP' }
    };

    return languageMap[languageCode] || { name: 'English', locale: 'en-US', flag: 'EN' };
  }

  private getShortVoiceName(fullName: string): string {
    // Extract a shorter, more user-friendly name
    const parts = fullName.split('-');
    if (parts.length > 1) {
      return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
    }
    return fullName.charAt(0).toUpperCase() + fullName.slice(1);
  }

  private getSampleUrl(locale: string, index: number, voiceName?: string): string {
    // Map voice names to preview files in assets/preview voice folder
    if (voiceName) {
      const normalizedVoiceName = voiceName.toLowerCase();
      const availablePreviews = [
        'aahna', 'aditi', 'alivia', 'anant', 'arjun', 'chinmay', 
        'devi', 'kaajal', 'kaashvi', 'manisha', 'pawan', 'prerna', 
        'saakshi', 'saavi', 'sayan', 'surya'
      ];
      
      // Check if the voice name matches any available preview file
      const matchingPreview = availablePreviews.find(preview => 
        normalizedVoiceName.includes(preview) || preview.includes(normalizedVoiceName)
      );
      
      if (matchingPreview) {
        console.log(`Voice preview matched: ${voiceName} -> ${matchingPreview}.wav`);
        return `/assets/preview voice/${matchingPreview}.wav`;
      } else {
        console.log(`No preview file found for voice: ${voiceName}`);
      }
    }
    
    // Fallback to language-specific samples
    if (locale.includes('en') || locale.includes('English')) {
      return '/assets/samples/english sample.wav';
    } else if (locale.includes('hi') || locale.includes('Hindi')) {
      return '/assets/samples/hindi sample.wav';
    }
    
    // Final fallback to English sample
    return '/assets/samples/english sample.wav';
  }

  getFallbackVoices(): LanguageDefinition[] {
    return [
      {
        id: 'en',
        code: 'en',
        name: 'English',
        nativeName: 'English',
        locale: 'en-IN',
        flag: 'IN',
        voices: [
          {
            id: "Indus-en-urvashi",
            name: "Urvashi",
            locale: "en-IN",
            gender: "female",
            quality: "Studio",
            tags: ["natural", "clear"],
            sampleUrl: "/assets/preview voice/urvashi.wav",
            sampleDuration: 8.4,
            voice_id: "Indus-en-urvashi"
          },
          {
            id: "Indus-en-menaka",
            name: "Menaka",
            locale: "en-IN",
            gender: "female",
            quality: "Premium",
            tags: ["conversational", "friendly"],
            sampleUrl: "/assets/preview voice/menaka.wav",
            sampleDuration: 6.3,
            voice_id: "Indus-en-menaka"
          },
          {
            id: "Indus-en-maya",
            name: "Maya",
            locale: "en-IN",
            gender: "female",
            quality: "Studio",
            tags: ["professional", "clear"],
            sampleUrl: "/assets/preview voice/maya.wav",
            sampleDuration: 7.2,
            voice_id: "Indus-en-maya"
          }
        ]
      },
      {
        id: 'hi',
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिंदी',
        locale: 'hi-IN',
        flag: 'IN',
        voices: [
          {
            id: "Indus-hi-urvashi",
            name: "Urvashi",
            locale: "hi-IN",
            gender: "female",
            quality: "Studio",
            tags: ["natural", "clear"],
            sampleUrl: "/assets/preview voice/urvashi.wav",
            sampleDuration: 8.4,
            voice_id: "Indus-hi-urvashi"
          },
          {
            id: "Indus-hi-menaka",
            name: "Menaka",
            locale: "hi-IN",
            gender: "female",
            quality: "Premium",
            tags: ["conversational", "friendly"],
            sampleUrl: "/assets/preview voice/menaka.wav",
            sampleDuration: 6.3,
            voice_id: "Indus-hi-menaka"
          }
        ]
      }
    ];
  }

  async findVoice(voiceId: string): Promise<VoiceDefinition | null> {
    const allVoices = await this.fetchVoices();
    
    for (const language of allVoices) {
      const voice = language.voices.find(v => v.id === voiceId || v.voice_id === voiceId);
      if (voice) {
        return voice;
      }
    }
    
    return null;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const voiceService = new VoiceService();
export default voiceService;
