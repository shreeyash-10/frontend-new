import { voiceService, type LanguageDefinition } from "../services/voiceService";
import { fetchWithFallback } from "./api";

export type SynthesisMode = "text" | "ssml";

interface SynthesisResult {
  audioUrl: string;
  duration: number;
  audioBlob?: Blob;
}

interface TTSApiResponse {
  audio_url?: string;
  audio_data?: string; // Base64 encoded audio
  duration?: number;
  error?: string;
  message?: string;
  // Handle different response formats
  data?: any;
  result?: any;
}

const FALLBACK_AUDIO = "https://cdn.pixabay.com/download/audio/2021/09/27/audio_0d3cb4ad68.mp3";

const estimateDuration = (text: string, defaultDuration: number): number => {
  if (defaultDuration > 0) {
    return defaultDuration;
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) {
    return 0;
  }
  const wordsPerMinute = 150;
  const minutes = words / wordsPerMinute;
  return Number((minutes * 60).toFixed(1));
};

const findVoice = async (voiceId: string) => {
  try {
    const languages = await voiceService.fetchVoices();
    for (const language of languages) {
      const match = language.voices.find((voice) => voice.id === voiceId);
      if (match) {
        return match;
      }
    }
  } catch (error) {
    console.warn('Failed to find voice in catalog:', error);
  }
  return undefined;
};

const createAudioBlob = async (audioUrl: string): Promise<Blob | null> => {
  try {
    console.log('Fetching audio from URL:', audioUrl);
    const response = await fetch(audioUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    if (blob.size === 0) {
      throw new Error('Received empty audio blob');
    }
    
    console.log('Successfully created audio blob, size:', blob.size, 'type:', blob.type);
    return blob;
  } catch (error) {
    console.error('Failed to create audio blob:', error);
    return null;
  }
};

const base64ToBlob = (base64Data: string, mimeType: string = 'audio/mp3'): Blob => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const synthesize = async (
  script: string,
  voiceId: string,
  mode: SynthesisMode
): Promise<SynthesisResult> => {
  try {
    // Validate input
    if (!script || typeof script !== 'string') {
      throw new Error('Script text is required and must be a string');
    }
    
    const trimmedScript = script.trim();
    if (!trimmedScript) {
      throw new Error('Script text cannot be empty');
    }
    
    if (!voiceId) {
      throw new Error('Voice ID is required');
    }

    // Find the voice to get the actual voice_id for the API
    const voice = await findVoice(voiceId);
    if (!voice) {
      throw new Error(`Voice with ID ${voiceId} not found`);
    }
    
    // Use the actual voice_id from the API response
    const actualVoiceId = voice.voice_id || voice.id;
    console.log('Debug - Using voice ID:', actualVoiceId);

    // Prepare the text for the API
    const textForApi = mode === "ssml" ? trimmedScript : trimmedScript;
    
    console.log('Debug - script parameter:', script);
    console.log('Debug - trimmedScript:', trimmedScript);
    console.log('Debug - textForApi:', textForApi);
    console.log('Debug - voiceId:', voiceId);
    console.log('Debug - mode:', mode);
    
    // Final validation
    if (!textForApi || textForApi.length === 0) {
      throw new Error('Text content is empty after processing');
    }
    
    console.log('TTS API Parameters:', {
      text: textForApi,
      voice: actualVoiceId,
      output_format: 'mp3',
      model: 'indus-tts-v1'
    });
    
    // Make the API call to the TTS endpoint
    const apiUrl = '/api/credits/demo/free/tts';
    console.log('Debug - Making API call to:', apiUrl);
    
    // Convert payload to URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('text', textForApi);
    formData.append('voice', actualVoiceId);
    formData.append('output_format', 'mp3');
    formData.append('model', 'indus-tts-v1');
    
    const requestBody = formData.toString();
    console.log('Debug - Request body (form data):', requestBody);
    console.log('Debug - Request body length:', requestBody.length);
    console.log('Debug - Request body type:', typeof requestBody);
    
    const response = await fetchWithFallback(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'audio/mp3, application/json',
      },
      body: requestBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Debug - Response status:', response.status);
      console.log('Debug - Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Debug - Error response body:', errorText);
      throw new Error(`TTS API error: ${response.status} - ${errorText}`);
    }

    // Check if the response is audio/mp3 (direct binary response)
    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (contentType && contentType.includes('audio/mp3')) {
      // The API returns the audio file directly as binary data
      console.log('Received audio/mp3 binary response');
      
      const audioBlob = await response.blob();
      
      if (audioBlob.size === 0) {
        throw new Error('Received empty audio file');
      }
      
      console.log('Audio blob created:', {
        size: audioBlob.size,
        type: audioBlob.type
      });
      
      // Create object URL from the blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Estimate duration from blob size (rough estimate)
      const estimatedDuration = estimateDuration(script, 0);
      
      return {
        audioUrl,
        duration: estimatedDuration,
        audioBlob
      };
    } else {
      // Handle JSON response (fallback for other API formats)
      const result: TTSApiResponse = await response.json();
      console.log('TTS API JSON Response:', result);

      // Handle the response based on the format
      let audioUrl: string;
      let audioBlob: Blob | undefined;

      if (result.audio_url) {
        // If the API returns a URL, use it directly
        audioUrl = result.audio_url;
        console.log('Using audio_url from API:', audioUrl);
        
        // Validate the URL
        if (!audioUrl || typeof audioUrl !== 'string' || !audioUrl.startsWith('http')) {
          throw new Error('Invalid audio URL received from API');
        }
        
        const blob = await createAudioBlob(audioUrl);
        audioBlob = blob || undefined;
      } else if (result.audio_data) {
        // If the API returns base64 data, convert it to a blob and create a URL
        console.log('Using audio_data from API (base64)');
        audioBlob = base64ToBlob(result.audio_data, 'audio/mp3');
        audioUrl = URL.createObjectURL(audioBlob);
      } else if (result.data?.audio_url) {
        // Handle nested data structure
        audioUrl = result.data.audio_url;
        console.log('Using audio_url from data field:', audioUrl);
        
        if (!audioUrl || typeof audioUrl !== 'string' || !audioUrl.startsWith('http')) {
          throw new Error('Invalid audio URL in data field');
        }
        
        const blob = await createAudioBlob(audioUrl);
        audioBlob = blob || undefined;
      } else if (result.data?.audio_data) {
        // Handle nested base64 data
        console.log('Using audio_data from data field (base64)');
        audioBlob = base64ToBlob(result.data.audio_data, 'audio/mp3');
        audioUrl = URL.createObjectURL(audioBlob);
      } else if (typeof result === 'string' && (result as string).startsWith('http')) {
        // Handle case where the API returns just a URL string
        audioUrl = result;
        console.log('Using direct URL string from API:', audioUrl);
        const blob = await createAudioBlob(audioUrl);
        audioBlob = blob || undefined;
      } else {
        console.error('Unexpected API response format:', result);
        throw new Error('No valid audio data received from TTS API');
      }

      // Final validation
      if (!audioUrl) {
        throw new Error('Failed to obtain valid audio URL');
      }

      console.log('Final audio URL:', audioUrl);
      console.log('Audio blob available:', !!audioBlob);

      const duration = result.duration || estimateDuration(script, voice.sampleDuration ?? 0);

      return {
        audioUrl,
        duration,
        audioBlob
      };
    }

  } catch (error) {
    console.error('TTS synthesis failed:', error);
    
    // Don't use fallback URLs - throw the error so the UI can handle it properly
    throw error;
  }
};

// Utility function to download audio
export const downloadAudio = (audioBlob: Blob, filename: string = 'tts-output.mp3') => {
  const url = URL.createObjectURL(audioBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
