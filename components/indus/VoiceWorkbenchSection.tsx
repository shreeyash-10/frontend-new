"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Mic } from "lucide-react";
import { defaultScriptPresets } from "@/data/ttsCatalog";
import { voiceService, type LanguageDefinition, type VoiceDefinition } from "@/services/voiceService";
import { synthesize } from "@/utils/synthesize";
import { convertToWav } from "@/utils/audioConverter";
import { demoService } from "@/services/demoService";
import { callService } from "@/services/callService";
import { fetchWithFallback } from "@/utils/api";


type HeroTab = "tts" | "stt" | "bot";

type BuilderTemplate = {
  id: string;
  label: string;
  prompt: string;
  instructions: string;
  language: string;
};

type HeroTtsTabProps = {
  catalog: LanguageDefinition[];
  isLoading: boolean;
  errorMessage: string | null;
};

type HeroBotTabProps = {
  catalog: LanguageDefinition[];
  isLoadingCatalog: boolean;
  catalogError: string | null;
};

const FLAG_BY_CODE: Record<string, string> = {
  en: "🌍",
  hi: "🇮🇳",
  hinglish: "🇮🇳",
  ta: "🇮🇳",
  te: "🇮🇳",
  kn: "🇮🇳",
  ml: "🇮🇳",
  gu: "🇮🇳",
  mr: "🇮🇳",
  pa: "🇮🇳",
  mai: "🇮🇳",
  bho: "🇮🇳",
  hne: "🇮🇳",
  bn: "🇧🇩",
  ar: "🇸🇦",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇵🇹",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
  ru: "🇷🇺",
  tr: "🇹🇷",
  th: "🇹🇭",
};

const FALLBACK_LANGUAGES = [
  { code: "hi", name: "Hindi" },
  { code: "hinglish", name: "Hinglish" },
  { code: "en", name: "English" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "gu", name: "Gujarati" },
  { code: "mr", name: "Marathi" },
  { code: "pa", name: "Punjabi" },
  { code: "bn", name: "Bengali" },
  { code: "ar", name: "Arabic" },
  { code: "es", name: "Spanish" },
];

const getFlagEmoji = (code?: string, name?: string) => {
  if (code && FLAG_BY_CODE[code.toLowerCase()]) {
    return FLAG_BY_CODE[code.toLowerCase()];
  }
  if (name) {
    const found = FALLBACK_LANGUAGES.find((lang) => lang.name.toLowerCase() === name.toLowerCase());
    if (found) {
      return FLAG_BY_CODE[found.code] ?? "🌍";
    }
  }
  return "🌍";
};

const HERO_VOICE_PRESETS = [
  { id: "maya-hindi", label: "Maya · Hindi", match: "maya", preferredLanguage: "hi" },
  { id: "vaani-hinglish", label: "Vaani · Hinglish", match: "vaani", preferredLanguage: "en" },
  { id: "rasha-english", label: "Rasha · English", match: "rasha", preferredLanguage: "en" },
] as const;

const STT_LANGUAGES = [
  { label: "Auto language", code: "auto" },
  { label: "Hindi", code: "hi" },
  { label: "Hinglish", code: "hinglish" },
  { label: "English", code: "en" },
] as const;

const BUILDER_CHANNELS = ["Phone (SIP)", "WhatsApp", "Web widget"] as const;

const BUILDER_TEMPLATES: BuilderTemplate[] = [
  {
    id: "collections",
    label: "Loan Collections",
    language: "Hindi",
    prompt:
      "You are a bilingual voice agent for a fintech lender. Keep borrowers calm, verify identity, share payment plans, and document next steps with empathy.",
    instructions:
      "Namaste, you are speaking with IndusLabs on behalf of RiverFin. I am here about your upcoming EMI and can help with extensions or payments.",
  },
  {
    id: "admissions",
    label: "Admissions Counselor",
    language: "English",
    prompt:
      "You guide prospective students through program selection, entry criteria, scholarships, and follow-up reminders for a fast-growing university.",
    instructions:
      "Hello! Thanks for calling Indus University. Which program or campus are you most excited to explore today?",
  },
  {
    id: "support",
    label: "Customer Support",
    language: "English",
    prompt:
      "You run tier-1 support for a national e-commerce brand. Diagnose issues, trigger replacements or refunds, and summarize every case back to the CRM.",
    instructions:
      "Hey there, you are through to the IndusLabs help desk. Tell me what went wrong and I will fix it right away.",
  },
  {
    id: "custom",
    label: "Custom...",
    language: "English",
    prompt:
      "You are a configurable IndusLabs agent. Mirror the caller's tone, capture intent precisely, and hand off seamlessly to human teams when needed.",
    instructions:
      "Hi, this is your IndusLabs pilot agent. What kind of workflow should we build together?",
  },
];

const CHARACTER_LIMIT = 300;
const SCRIPT_PRESETS = Object.values(defaultScriptPresets);
const DEFAULT_TTS_TEXT =
  "Hi, this is IndusLabs. I create natural, low-latency voice AI for calls, apps, and agents in Hindi, Hinglish, and 10+ Indian languages.";
const BUILDER_AGENT_ID = "AGT_DE220651";

const normalizeLanguageCode = (code: string) => (code === "hinglish" ? "en" : code);

const getVoiceId = (voice?: VoiceDefinition) => voice?.voice_id || voice?.id || "";

const TabPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active ? "bg-foreground text-background" : "text-foreground/60 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
};

const VoiceWorkbenchSection = () => {
  const [activeTab, setActiveTab] = useState<HeroTab>("tts");
  const [catalog, setCatalog] = useState<LanguageDefinition[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadVoices = async () => {
      try {
        const voices = await voiceService.fetchVoices();
        if (mounted) {
          setCatalog(voices);
          setCatalogError(null);
        }
      } catch (error) {
        console.error("Failed to load voices for voice workbench", error);
        if (mounted) {
          setCatalogError("We are having trouble loading the voice catalog.");
        }
      } finally {
        if (mounted) {
          setCatalogLoading(false);
        }
      }
    };

    loadVoices();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full px-5 py-12">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Voice AI Workbench
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
            Test TTS, STT, and Live Agents
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Try IndusLabs voice APIs directly from the browser. Generate speech, transcribe audio, and launch live agent
            previews in seconds.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-border bg-card px-4 py-5 text-left shadow-sm sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-full bg-muted p-1 text-xs sm:text-sm">
                <TabPill label="Test TTS" active={activeTab === "tts"} onClick={() => setActiveTab("tts")} />
                <TabPill label="Test STT" active={activeTab === "stt"} onClick={() => setActiveTab("stt")} />
                <TabPill label="Build a Bot" active={activeTab === "bot"} onClick={() => setActiveTab("bot")} />
              </div>

              <div className="ml-auto flex items-center gap-2 text-[11px] font-medium text-emerald-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span>Realtime - ~90ms latency</span>
              </div>
            </div>

            {activeTab === "tts" && (
              <HeroTtsTab catalog={catalog} isLoading={catalogLoading} errorMessage={catalogError} />
            )}
            {activeTab === "stt" && <HeroSttTab />}
            {activeTab === "bot" && (
              <HeroBotTab catalog={catalog} isLoadingCatalog={catalogLoading} catalogError={catalogError} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

function HeroTtsTab({ catalog, isLoading, errorMessage }: HeroTtsTabProps) {
  const [script, setScript] = useState(DEFAULT_TTS_TEXT);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>("hi");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeObjectUrlRef = useRef<string | null>(null);
  const streamingSupported = () =>
    typeof window !== "undefined" && typeof window.MediaSource !== "undefined" && typeof ReadableStream !== "undefined";

  const languageOptions = useMemo(() => {
    if (catalog.length) {
      return catalog.map((language) => ({
        code: language.code,
        label: `${getFlagEmoji(language.code, language.name)} ${language.name}`,
      }));
    }
    return FALLBACK_LANGUAGES.map((language) => ({
      code: language.code,
      label: `${getFlagEmoji(language.code, language.name)} ${language.name}`,
    }));
  }, [catalog]);

  const heroVoices = useMemo(() => {
    if (!catalog.length) return [];
    return HERO_VOICE_PRESETS.map((preset) => {
      const preferred = preset.preferredLanguage;
      const languageMatch = catalog.find(
        (lang) => lang.code === preferred || lang.name.toLowerCase().includes(preferred)
      );
      const resolvedLanguage = languageMatch ?? catalog[0];
      const voiceMatch = resolvedLanguage?.voices.find((voice) => voice.name.toLowerCase().includes(preset.match));
      const fallbackVoice = resolvedLanguage?.voices[0];
      const resolvedVoice = voiceMatch ?? fallbackVoice;

      return {
        id: preset.id,
        label: preset.label,
        voiceId: getVoiceId(resolvedVoice),
        languageCode: resolvedLanguage?.code ?? "en",
        disabled: !resolvedVoice,
      };
    });
  }, [catalog]);

  useEffect(() => {
    if (!selectedVoiceId && heroVoices.length) {
      const firstAvailable = heroVoices.find((voice) => voice.voiceId);
      if (firstAvailable) {
        setSelectedVoiceId(firstAvailable.voiceId);
        setSelectedLanguageCode(firstAvailable.languageCode);
      }
    }
  }, [heroVoices, selectedVoiceId]);

  useEffect(() => {
    if (!catalog.length) return;
    const hasLanguage = catalog.some((language) => language.code === selectedLanguageCode);
    if (!hasLanguage) {
      setSelectedLanguageCode(catalog[0].code);
    }
  }, [catalog, selectedLanguageCode]);

  useEffect(() => {
    const resolvedCode = normalizeLanguageCode(selectedLanguageCode);
    const language = catalog.find((lang) => lang.code === resolvedCode);
    if (!language) return;
    const hasVoice = language.voices.some((voice) => getVoiceId(voice) === selectedVoiceId);
    if (!hasVoice && language.voices.length > 0) {
      setSelectedVoiceId(getVoiceId(language.voices[0]));
    }
  }, [catalog, selectedLanguageCode, selectedVoiceId]);

  useEffect(() => {
    return () => {
      if (activeObjectUrlRef.current) {
        URL.revokeObjectURL(activeObjectUrlRef.current);
        activeObjectUrlRef.current = null;
      }
      if (audioUrl && audioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const streamTtsAudio = useCallback(
    async (scriptText: string, voiceId: string) => {
      if (!audioRef.current || !streamingSupported()) {
        return false;
      }

      const mediaSource = new MediaSource();
      const audioElement = audioRef.current;
      let objectUrl: string | null = null;

      try {
        objectUrl = URL.createObjectURL(mediaSource);
        audioElement.pause();
        if (audioUrl && audioUrl.startsWith("blob:")) {
          URL.revokeObjectURL(audioUrl);
          setAudioUrl(null);
        }
        if (activeObjectUrlRef.current) {
          URL.revokeObjectURL(activeObjectUrlRef.current);
        }
        activeObjectUrlRef.current = objectUrl;
        audioElement.src = objectUrl;

        const apiUrl = "/api/credits/demo/free/tts";
        const formData = new URLSearchParams();
        formData.append("text", scriptText.trim());
        formData.append("voice", voiceId);
        formData.append("output_format", "mp3");
        formData.append("model", "indus-tts-v1");

        const response = await fetchWithFallback(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "audio/mp3, application/json",
          },
          body: formData.toString(),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`TTS API error: ${response.status} - ${errorText}`);
        }

        if (!response.body) {
          return false;
        }

        const reader = response.body.getReader();

        await new Promise<void>((resolve, reject) => {
          const handleSourceOpen = () => {
            let sourceBuffer: SourceBuffer;
            try {
              sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
            } catch (error) {
              reject(error as Error);
              return;
            }

            const appendChunk = (chunk: ArrayBuffer) =>
              new Promise<void>((res, rej) => {
                const tryAppend = () => {
                  if (sourceBuffer.updating) {
                    sourceBuffer.addEventListener("updateend", tryAppend, { once: true });
                    return;
                  }
                  try {
                    sourceBuffer.appendBuffer(chunk);
                  } catch (error) {
                    rej(error as Error);
                    return;
                  }
                  sourceBuffer.addEventListener("updateend", () => res(), { once: true });
                };
                tryAppend();
              });

            const pump = async () => {
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  const finalize = () => {
                    if (mediaSource.readyState === "open") {
                      try {
                        mediaSource.endOfStream();
                      } catch (error) {
                        console.warn("Failed to end MediaSource stream", error);
                      }
                    }
                    resolve();
                  };

                  if (sourceBuffer.updating) {
                    sourceBuffer.addEventListener("updateend", finalize, { once: true });
                  } else {
                    finalize();
                  }
                  break;
                }

                if (value) {
                  const chunk = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
                  await appendChunk(chunk);
                  if (audioElement.paused) {
                    audioElement.play().catch(() => undefined);
                  }
                }
              }
            };

            pump().catch(reject);
          };

          mediaSource.addEventListener("sourceopen", handleSourceOpen, { once: true });
          mediaSource.addEventListener("error", () => reject(new Error("MediaSource error")), {
            once: true,
          });
        });

        return true;
      } catch (error) {
        console.error("Streaming TTS failed", error);
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        if (audioElement) {
          audioElement.pause();
          audioElement.removeAttribute("src");
          audioElement.load();
        }
        try {
          if (mediaSource.readyState === "open") {
            mediaSource.endOfStream();
          }
        } catch (streamError) {
          console.warn("Error while closing MediaSource", streamError);
        }
        activeObjectUrlRef.current = null;
        return false;
      }
    },
    [audioRef, audioUrl]
  );

  const currentLanguageVoices = useMemo(() => {
    const resolvedCode = normalizeLanguageCode(selectedLanguageCode);
    const language = catalog.find((lang) => lang.code === resolvedCode);
    return language?.voices ?? [];
  }, [catalog, selectedLanguageCode]);

  const handleScriptChange = (value: string) => {
    setScript(value.slice(0, CHARACTER_LIMIT));
  };

  const handlePlay = async () => {
    if (!selectedVoiceId || !script.trim()) return;
    setIsSynthesizing(true);
    setTtsError(null);
    try {
      const streamed = await streamTtsAudio(script.trim(), selectedVoiceId);
      if (!streamed) {
        const result = await synthesize(script.trim(), selectedVoiceId, "text");
        if (audioUrl && audioUrl.startsWith("blob:")) {
          URL.revokeObjectURL(audioUrl);
        }
        if (activeObjectUrlRef.current) {
          URL.revokeObjectURL(activeObjectUrlRef.current);
          activeObjectUrlRef.current = null;
        }
        setAudioUrl(result.audioUrl);
        if (audioRef.current) {
          audioRef.current.src = result.audioUrl;
          await audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("TTS synthesis failed", error);
      setTtsError(
        error instanceof Error ? error.message : "Unable to generate audio right now. Please try again."
      );
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleRandomScript = () => {
    const next = SCRIPT_PRESETS[Math.floor(Math.random() * SCRIPT_PRESETS.length)];
    handleScriptChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background px-3 py-3 sm:px-4 sm:py-4">
        <textarea
          value={script}
          maxLength={CHARACTER_LIMIT}
          onChange={(event) => handleScriptChange(event.target.value)}
          className="h-28 w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            {script.length} / {CHARACTER_LIMIT} characters
          </span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => handleScriptChange("")}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Language
          <select
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/40"
            value={selectedLanguageCode}
            onChange={(event) => setSelectedLanguageCode(event.target.value)}
            disabled={!languageOptions.length}
          >
            {!languageOptions.length && <option>Loading languages...</option>}
            {languageOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Voice
          <select
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/40"
            value={selectedVoiceId}
            onChange={(event) => setSelectedVoiceId(event.target.value)}
          >
            {currentLanguageVoices.length === 0 && <option>No voices available</option>}
            {currentLanguageVoices.map((voice) => (
              <option key={voice.id} value={getVoiceId(voice)}>
                {voice.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePlay}
          disabled={isSynthesizing || !selectedVoiceId || !script.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSynthesizing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground text-[11px]">
              ▶
            </span>
          )}
          {isSynthesizing ? "Generating" : "Play sample"}
        </button>
        <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={handleRandomScript}>
          Random script
        </button>
      </div>

      {(ttsError || errorMessage) && <p className="text-xs text-rose-500">{ttsError || errorMessage}</p>}

      <p className="text-[11px] text-muted-foreground">
        Powered by IndusTTS - Ideal for calls, agents, and product voices.
      </p>

      <audio ref={audioRef} hidden />
    </div>
  );
}

function HeroSttTab() {
  const [selectedLanguage, setSelectedLanguage] = useState<(typeof STT_LANGUAGES)[number]["code"]>(
    STT_LANGUAGES[0].code
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeBlob(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setStatus("Listening...");
      setError(null);
    } catch (err) {
      console.error("Microphone permission denied", err);
      setError("Microphone access is required.");
      setStatus("Idle");
    }
  };

  const transcribeBlob = async (blob: Blob) => {
    setIsProcessing(true);
    setStatus("Processing...");
    try {
      const wavBlob = await convertToWav(blob);
      const file = new File([wavBlob], "live-input.wav", { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", file);
      const apiLanguage = normalizeLanguageCode(selectedLanguage);
      formData.append("language", apiLanguage);

      const response = await fetchWithFallback("/api/credits/demo/free/stt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`STT API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const text = result?.data?.text || result?.text || "Your words will appear here instantly...";
      setTranscript(text);
      setStatus("Ready");
    } catch (err) {
      console.error("Transcription error", err);
      setError(err instanceof Error ? err.message : "Transcription failed");
      setStatus("Idle");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={() => {
              if (isRecording) {
                setIsRecording(false);
                stopRecording();
              } else {
                startRecording();
              }
            }}
            className={`inline-flex flex-col items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-6 text-foreground shadow-sm transition ${
              isRecording ? "ring-4 ring-emerald-300/40 bg-emerald-500/10" : "hover:shadow-md"
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isRecording ? "bg-emerald-500 text-white" : "bg-foreground text-background"
              }`}
            >
              <Mic className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide">
              {isRecording ? "Listening" : "Start recording"}
            </span>
          </button>
        </div>

        <div className="flex-1 rounded-2xl border border-border bg-background p-3 sm:p-4">
          <p className="mb-1 text-[11px] text-muted-foreground">Live transcript</p>
          <div className="h-24 overflow-y-auto text-sm text-foreground">
            {transcript ? <span>{transcript}</span> : <span className="text-muted-foreground">Your words will appear here instantly...</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <select
          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-foreground/40"
          value={selectedLanguage}
          onChange={(event) =>
            setSelectedLanguage(event.target.value as (typeof STT_LANGUAGES)[number]["code"])
          }
        >
          {STT_LANGUAGES.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="ml-auto text-[11px] text-muted-foreground">
          {isProcessing ? "Transcribing in realtime..." : status}
        </p>
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <p className="text-[11px] text-muted-foreground">
        Streaming ASR for realtime captions, QA, and analytics.
      </p>
    </div>
  );
}

function HeroBotTab({ catalog, isLoadingCatalog, catalogError }: HeroBotTabProps) {
  const [activeTemplate, setActiveTemplate] = useState(BUILDER_TEMPLATES[0]);
  const [channel, setChannel] = useState<typeof BUILDER_CHANNELS[number]>(BUILDER_CHANNELS[0]);
  const [language, setLanguage] = useState<string>(BUILDER_TEMPLATES[0].language);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Preview ready. Launch a call in seconds.");
  const [error, setError] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState(activeTemplate.prompt);
  const [instructionInput, setInstructionInput] = useState(activeTemplate.instructions);

  const builderLanguageOptions = useMemo(() => {
    if (catalog.length) {
      return catalog.map((lang) => ({
        label: `${getFlagEmoji(lang.code, lang.name)} ${lang.name}`,
        value: lang.name,
      }));
    }
    const fallback = Array.from(new Set(FALLBACK_LANGUAGES.map((lang) => lang.name)));
    return fallback.map((name) => ({
      label: `${getFlagEmoji(undefined, name)} ${name}`,
      value: name,
    }));
  }, [catalog]);

  useEffect(() => {
    setPromptInput(activeTemplate.prompt);
    setInstructionInput(activeTemplate.instructions);

    if (
      builderLanguageOptions.length &&
      activeTemplate.language &&
      builderLanguageOptions.some((option) => option.value === activeTemplate.language)
    ) {
      setLanguage(activeTemplate.language);
    }
  }, [activeTemplate, builderLanguageOptions]);

  useEffect(() => {
    if (!builderLanguageOptions.length) return;
    const matches = builderLanguageOptions.some((option) => option.value === language);
    if (!matches) {
      setLanguage(builderLanguageOptions[0].value);
    }
  }, [builderLanguageOptions, language]);

  useEffect(() => {
    return () => {
      callService.endCall().catch(() => undefined);
    };
  }, []);

  const findVoiceForLanguage = (target: string) => {
    const resolvedCode = normalizeLanguageCode(target.toLowerCase());
    const match = catalog.find(
      (lang) =>
        lang.code === resolvedCode ||
        lang.name.toLowerCase() === target.toLowerCase() ||
        lang.nativeName.toLowerCase() === target.toLowerCase()
    );
    return match?.voices[0];
  };

  const handleLaunch = async () => {
    if (!catalog.length) {
      setError("Voice catalog is still loading. Try again in a moment.");
      return;
    }

    const voice = findVoiceForLanguage(language) || findVoiceForLanguage("English");
    if (!voice) {
      setError("No compatible voice available for this language yet.");
      return;
    }

    if (!promptInput.trim() || !instructionInput.trim()) {
      setError("Please provide both a system prompt and a starting instruction.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    setStatusMessage(`Connecting over ${channel}...`);

    try {
      const response = await demoService.fetchDemoToken(
        BUILDER_AGENT_ID,
        "",
        getVoiceId(voice),
        demoService.getLanguageCode(language),
        promptInput,
        instructionInput
      );

      let livekitUrl = response.host || response.ws_url;
      if (!livekitUrl) {
        throw new Error("LiveKit server details missing in response");
      }

      try {
        const parsed = new URL(livekitUrl);
        livekitUrl = `${parsed.protocol}//${parsed.host}`;
      } catch {
        if (!livekitUrl.startsWith("wss://") && !livekitUrl.startsWith("ws://")) {
          livekitUrl = `wss://${livekitUrl}`;
        }
      }

      await callService.connectToCall(response.token, livekitUrl);
      setIsConnected(true);
      setStatusMessage(`Connected on ${channel}. You can hang up anytime.`);
    } catch (err) {
      console.error("Failed to open builder preview", err);
      setError(err instanceof Error ? err.message : "Unable to open the builder right now.");
      setStatusMessage("Preview unavailable. Please retry.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEnd = async () => {
    try {
      await callService.endCall();
    } catch (err) {
      console.error("Error ending preview call", err);
    } finally {
      setIsConnected(false);
      setStatusMessage("Preview ready. Launch a call in seconds.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-[11px] text-muted-foreground">Choose a template</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {BUILDER_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setActiveTemplate(template)}
              className={`rounded-full px-3 py-1 font-medium transition ${
                activeTemplate.id === template.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground/60 hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">Channel</p>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-foreground/40"
            value={channel}
            onChange={(event) => setChannel(event.target.value as typeof BUILDER_CHANNELS[number])}
          >
            {BUILDER_CHANNELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">Language</p>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-foreground/40"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {builderLanguageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-xs">
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">Starting instruction</p>
          <textarea
            className="min-h-[56px] w-full rounded-2xl border border-border bg-background p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground/40"
            value={instructionInput}
            onChange={(event) => setInstructionInput(event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">System prompt</p>
          <textarea
            className="min-h-[140px] w-full rounded-2xl border border-border bg-background p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground/40"
            value={promptInput}
            onChange={(event) => setPromptInput(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={isConnected ? handleEnd : handleLaunch}
          disabled={isConnecting || isLoadingCatalog}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground text-[11px]">
              ⚙
            </span>
          )}
          {isConnected ? "End preview" : "Open in Builder"}
        </button>
        <p className="text-[11px] text-muted-foreground">{catalogError ? catalogError : statusMessage}</p>
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <p className="text-[11px] text-muted-foreground">
        No code required. Customize persona, flows, and CRM hooks in the IndusLabs Studio.
      </p>
    </div>
  );
}

export default VoiceWorkbenchSection;
