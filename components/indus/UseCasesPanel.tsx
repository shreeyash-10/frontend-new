"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Section from "./Section";
import { voiceService, type LanguageDefinition, type VoiceDefinition } from "@/services/voiceService";
import { synthesize } from "@/utils/synthesize";
import { fetchWithFallback } from "@/utils/api";
import { Loader2 } from "lucide-react";
import SmallCallButton from "./call/SmallCallButton";

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
  th: "🇹🇭"
};

const getFlagEmoji = (code?: string, label?: string) => {
  if (code && FLAG_BY_CODE[code.toLowerCase()]) {
    return FLAG_BY_CODE[code.toLowerCase()];
  }
  if (label) {
    const normalized = label.toLowerCase();
    const match = Object.entries(FLAG_BY_CODE).find(([key]) => normalized.includes(key));
    if (match) return match[1];
  }
  return "🌍";
};

type UseCaseDefinition = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  description: string;
  impact: string;
  metric: string;
  defaultLanguageCode: string;
  voiceHint: string;
  script: string;
  commonAgentId: string;
  targetAgentId: string;
};

const USE_CASES: UseCaseDefinition[] = [
  {
    id: "trust",
    tag: "TRUST",
    title: "Banking KYC",
    summary: "Instant KYC verification with automatic language detection and secure OTP flows.",
    description:
      "Authenticate users in any Indian language with OTP confirmations, fraud detection, and humanlike explainers for every compliance step.",
    impact: "OTP-verified flows completed in under 90 seconds.",
    metric: "Secure verification",
    defaultLanguageCode: "hi",
    voiceHint: "maya",
    script:
      "Namaste, main IndusLabs KYC desk se bol rahi hoon. Aapke account ko verify karne ke liye ek OTP bheja gaya hai. Kripya code batayein aur main aapko turant agla kadam bataungi.",
    commonAgentId: "AGT_DE220651",
    targetAgentId: "AGT_9OF2BED5"
  },
  {
    id: "campaign",
    tag: "CAMPAIGN",
    title: "Political Campaigns",
    summary: "Engage voters bilingually, deliver campaign updates, and guide them through registration.",
    description:
      "Launch persuasive outreach that adapts tone, language, and regional issues in milliseconds to keep voter conversations authentic.",
    impact: "Bilingual voter outreach that doubles response rates.",
    metric: "Voter engagement",
    defaultLanguageCode: "hi",
    voiceHint: "menaka",
    script:
      "Namaskar! Main IndusLabs se aapke shetra ki campaign representative bol rahi hoon. Kya aapne apni matdata suchi ki jaanch kar li hai? Main turant link bhej sakti hoon jisse aap registration confirm kar sakein.",
    commonAgentId: "AGT_DE220651",
    targetAgentId: "AGT_E882B702"
  },
  {
    id: "growth",
    tag: "GROWTH",
    title: "Lead Generation",
    summary: "Qualify inbound leads in English and Hindi with contextual routing and upsell flows.",
    description:
      "Qualify and route every enquiry with pricing calculators, recommendations, and CRM-ready notes in one seamless conversation.",
    impact: "32% faster funnel velocity through contextual routing.",
    metric: "Conversion uplift",
    defaultLanguageCode: "en",
    voiceHint: "urvashi",
    script:
      "Hello! Thanks for exploring IndusLabs. May I know what product tier you are evaluating? I can share pricing, demos, and schedule a call with the right specialist immediately.",
    commonAgentId: "AGT_DE220651",
    targetAgentId: "AGT_0F28307C"
  },
  {
    id: "language",
    tag: "LANGUAGE",
    title: "Customer Support (CX)",
    summary: "Resolve tier-1 queries with CRM-connected agents that escalate intelligently.",
    description:
      "Deliver empathetic first-response support with live ticket syncing, troubleshooting flows, and soft handoffs to humans when needed.",
    impact: "Average handle times reduced by 45% for Tier-1 queries.",
    metric: "Tier-1 coverage",
    defaultLanguageCode: "en",
    voiceHint: "menaka",
    script:
      "Hi there! You're connected to the IndusLabs CX desk. Tell me what went wrong and I'll pull up your order history so we can resolve it right away.",
    commonAgentId: "AGT_DE220651",
    targetAgentId: "AGT_A52A070C"
  },
  {
    id: "order",
    tag: "ORDER",
    title: "Ordering System",
    summary: "Provide healthcare or product ordering assistance with instant availability checks.",
    description:
      "Guide patients or customers through stock lookups, dosage reminders, and last-mile delivery coordination without human effort.",
    impact: "Automated ordering that runs 24/7 across 80+ cities.",
    metric: "Instant availability",
    defaultLanguageCode: "hi",
    voiceHint: "maya",
    script:
      "Namaste! Main IndusLabs ordering assistant bol rahi hoon. Aapko kaun sa product ya dawa chahiye? Main inventory check karke delivery slot confirm kar dungi.",
    commonAgentId: "AGT_DE220651",
    targetAgentId: "AGT_803146DB"
  },
  {
    id: "collections",
    tag: "COLLECTIONS",
    title: "Loan Recovery",
    summary: "Empathetic yet firm repayment nudges with multilingual follow-ups.",
    description:
      "Combine outbound nudges, payment links, and regulator-approved scripts to increase RPCs without losing empathy.",
    impact: "40–60% increase in right-party contacts across Hindi + English flows.",
    metric: "RPC uplift",
    defaultLanguageCode: "hi",
    voiceHint: "maya",
    script:
      "Namaste, main IndusLabs collections desk se Jyoti bol rahi hoon. Aapke EMI par 3 din ka delay hai. Kya main aapko payment link bhej doon ya kisi agent se baat karni hai?",
    commonAgentId: "AGT_DE220651",
    targetAgentId: "AGT_0F28307C"
  },
  {
    id: "admissions",
    tag: "ADMISSIONS",
    title: "Education",
    summary: "Offer 24/7 admission helplines, fee guidance, and enquiry follow-ups.",
    description:
      "Answer prospect queries about programmes, scholarships, and campus life—then nudge them toward form completion instantly.",
    impact: "Inbound enquiry resolution in under 2 minutes for regional campaigns.",
    metric: "Faster onboarding",
    defaultLanguageCode: "en",
    voiceHint: "urvashi",
    script:
      "Hello! This is the IndusLabs admission helpline. Which course are you exploring? I can share eligibility, fees, and next steps right away.",
    commonAgentId: "AGT_DE220651",
    targetAgentId: "AGT_D5D92DEA"
  },
  {
    id: "care",
    tag: "CARE",
    title: "Healthcare",
    summary: "Automate appointment reminders, adherence, and outbound follow-ups.",
    description:
      "Keep patients informed with prescription instructions, reminder calls, and proactive escalations for critical cases.",
    impact: "92% adherence on chronic care programmes via bilingual reminders.",
    metric: "Patient retention",
    defaultLanguageCode: "hi",
    voiceHint: "menaka",
    script:
      "Namaste! IndusLabs patient desk bol raha hai. Kal aapki follow-up appointment hai. Kya main visit confirm kar doon ya remote consultation schedule karna hai?",
    commonAgentId: "AGT_DE220651",
    targetAgentId: "AGT_CB88DBD8"
  }
];

const USE_CASE_VIDEOS: Record<string, string> = {
  trust: "/assets/videos/banking.mp4",
  campaign: "/assets/videos/political.mp4",
  growth: "/assets/videos/leadgen.mp4",
  language: "/assets/videos/20260115_1910_New Video_simple_compose_01kf0y6aw6fk4afxpecfhb5va2.mp4",
  order: "/assets/videos/20260115_1910_New Video_simple_compose_01kf0y6aw6fk4afxpecfhb5va2.mp4",
  collections: "/assets/videos/recovery.mp4",
  admissions: "/assets/videos/education.mp4",
  care: "/assets/videos/healthcare.mp4"
};

type UseCaseTestState = {
  languageCode: string;
  voiceId: string;
  script: string;
};

const UseCasesPanel = () => {
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string>(USE_CASES[0]?.id ?? "");
  const [languages, setLanguages] = useState<LanguageDefinition[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [testStates, setTestStates] = useState<Record<string, UseCaseTestState>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeObjectUrlRef = useRef<string | null>(null);

  const streamingSupported = () =>
    typeof window !== "undefined" && typeof window.MediaSource !== "undefined" && typeof ReadableStream !== "undefined";

  useEffect(() => {
    return () => {
      if (activeObjectUrlRef.current) {
        URL.revokeObjectURL(activeObjectUrlRef.current);
        activeObjectUrlRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
    };
  }, []);

  const streamTtsAudio = useCallback(
    async (script: string, voiceId: string) => {
      if (!audioRef.current || !streamingSupported()) {
        return false;
      }

      const mediaSource = new MediaSource();
      const audioElement = audioRef.current;
      let objectUrl: string | null = null;

      try {
        objectUrl = URL.createObjectURL(mediaSource);
        if (activeObjectUrlRef.current) {
          URL.revokeObjectURL(activeObjectUrlRef.current);
        }
        activeObjectUrlRef.current = objectUrl;
        audioElement.pause();
        audioElement.src = objectUrl;

        const apiUrl = "/api/credits/demo/free/tts";
        const formData = new URLSearchParams();
        formData.append("text", script.trim());
        formData.append("voice", voiceId);
        formData.append("output_format", "mp3");
        formData.append("model", "indus-tts-v1");

        const response = await fetchWithFallback(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "audio/mp3, application/json"
          },
          body: formData.toString()
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
                        console.warn("Failed to close MediaSource", error);
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
                  const chunk = value.buffer.slice(
                    value.byteOffset,
                    value.byteOffset + value.byteLength
                  );
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
            once: true
          });
        });

        return true;
      } catch (error) {
        console.error("Streaming preview failed", error);
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        activeObjectUrlRef.current = null;
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
          console.warn("Error ending stream", streamError);
        }
        return false;
      }
    },
    []
  );

  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsLoadingVoices(true);
        setVoiceError(null);
        const catalog = await voiceService.fetchVoices();
        setLanguages(catalog);
      } catch (error) {
        console.error("Failed to load voices", error);
        setVoiceError("Could not load voice catalog. Please try again later.");
      } finally {
        setIsLoadingVoices(false);
      }
    };
    loadVoices();
  }, []);

  const findLanguageByCode = (code?: string): LanguageDefinition | undefined => {
    if (!languages.length) return undefined;
    if (!code) return languages[0];
    const normalized = code.toLowerCase();
    return languages.find(
      (lang) => lang.code === normalized || lang.name.toLowerCase().includes(normalized)
    );
  };

  const findVoiceForLanguage = (language: LanguageDefinition | undefined, hint: string) => {
    if (!language || !language.voices.length) return undefined;
    const normalized = hint.toLowerCase();
    return (
      language.voices.find((voice) => voice.name.toLowerCase().includes(normalized)) ??
      language.voices[0]
    );
  };

  useEffect(() => {
    if (!languages.length) return;
    setTestStates((prev) => {
      const next: Record<string, UseCaseTestState> = { ...prev };
      USE_CASES.forEach((useCase) => {
        if (!next[useCase.id]) {
          const language = findLanguageByCode(useCase.defaultLanguageCode) ?? languages[0];
          const voice = findVoiceForLanguage(language, useCase.voiceHint);
          next[useCase.id] = {
            languageCode: language?.code ?? "",
            voiceId: voice?.id ?? "",
            script: useCase.script
          };
        }
      });
      return next;
    });
  }, [languages]);

  const handleLanguageChange = (useCaseId: string, newCode: string) => {
    const language = findLanguageByCode(newCode) ?? findLanguageByCode();
    const voice = findVoiceForLanguage(language, "");
    setTestStates((prev) => ({
      ...prev,
      [useCaseId]: {
        ...prev[useCaseId],
        languageCode: language?.code ?? newCode,
        voiceId: voice?.id ?? "",
        script: prev[useCaseId]?.script ?? USE_CASES.find((c) => c.id === useCaseId)?.script ?? ""
      }
    }));
  };

  const handleVoiceChange = (useCaseId: string, voiceId: string) => {
    setTestStates((prev) => ({
      ...prev,
      [useCaseId]: {
        ...prev[useCaseId],
        voiceId
      }
    }));
  };

  const handleScriptChange = (useCaseId: string, value: string) => {
    setTestStates((prev) => ({
      ...prev,
      [useCaseId]: {
        ...prev[useCaseId],
        script: value
      }
    }));
  };

  const handlePlaySample = async (useCaseId: string) => {
    const state = testStates[useCaseId];
    if (!state || !state.voiceId || !state.script.trim()) {
      setPlayError("Please select a voice and enter a script.");
      return;
    }
    setPlayError(null);
    setPlayingId(useCaseId);
    try {
      const streamed = await streamTtsAudio(state.script.trim(), state.voiceId);
      if (!streamed) {
        const result = await synthesize(state.script.trim(), state.voiceId, "text");
        if (activeObjectUrlRef.current) {
          URL.revokeObjectURL(activeObjectUrlRef.current);
          activeObjectUrlRef.current = null;
        }
        if (audioRef.current) {
          audioRef.current.src = result.audioUrl;
          await audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("Failed to synthesize sample", error);
      setPlayError(error instanceof Error ? error.message : "Unable to play sample right now.");
    } finally {
      setPlayingId(null);
    }
  };

  const selectedCase = useMemo(
    () => USE_CASES.find((useCase) => useCase.id === selectedUseCaseId) ?? USE_CASES[0],
    [selectedUseCaseId]
  );

  const selectedState = selectedCase ? testStates[selectedCase.id] : undefined;
  const selectedLanguage = selectedState
    ? findLanguageByCode(selectedState.languageCode)
    : undefined;
  const voicesForSelectedLanguage: VoiceDefinition[] = selectedLanguage?.voices ?? [];
  const selectedVideo = selectedCase
    ? USE_CASE_VIDEOS[selectedCase.id] ?? USE_CASE_VIDEOS.trust
    : USE_CASE_VIDEOS.trust;
  const backgroundVideos = useMemo(
    () => Array.from(new Set(Object.values(USE_CASE_VIDEOS))),
    []
  );

  return (
    <Section id="use-cases" padding="lg" className="relative overflow-hidden">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 left-1/2 h-full w-screen -translate-x-1/2">
          {backgroundVideos.map((video) => (
            <video
              key={video}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                selectedVideo === video ? "opacity-55" : "opacity-0"
              }`}
              src={video}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          ))}
          <div className="absolute inset-0 bg-background/70" />
        </div>

        <div className="relative z-10 flex flex-col gap-8 rounded-[36px] border border-white/10 bg-background/60 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              INDUSLABS USE CASES
            </p>
            <h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              Built for every conversation that matters
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
            <div className="rounded-[28px] border border-white/10 bg-background/60 p-4 backdrop-blur">
              <div className="flex flex-col divide-y divide-white/10">
                {USE_CASES.map((useCase) => {
                  const isActive = selectedUseCaseId === useCase.id;
                  return (
                    <button
                      key={useCase.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setSelectedUseCaseId(useCase.id)}
                      className={`flex flex-col gap-1 px-4 py-3 text-left text-sm transition ${
                        isActive ? "bg-white/10" : "bg-transparent hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                          {useCase.tag}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{useCase.metric}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{useCase.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-background/60 p-5 backdrop-blur sm:p-6">
              {selectedCase ? (
                <>
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
                      {selectedCase.tag}
                    </span>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-3xl font-semibold text-foreground sm:text-4xl">
                        {selectedCase.title}
                      </h3>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
                        {selectedCase.metric}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-base text-muted-foreground">{selectedCase.description}</p>
                  <p className="mt-3 text-sm text-emerald-400">{selectedCase.impact}</p>

                  <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-background/70 p-4 text-foreground/80">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      Tailored TTS preview
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="flex flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Language
                        <select
                          className="rounded-2xl border border-white/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/40"
                          value={selectedState?.languageCode ?? ""}
                          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                            handleLanguageChange(selectedCase.id, event.target.value)
                          }
                          disabled={!languages.length || isLoadingVoices}
                        >
                          {!languages.length && <option>Loading languages…</option>}
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {getFlagEmoji(lang.code, lang.name)} {lang.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Voice
                        <select
                          className="rounded-2xl border border-white/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/40"
                          value={selectedState?.voiceId ?? ""}
                          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                            handleVoiceChange(selectedCase.id, event.target.value)
                          }
                          disabled={!voicesForSelectedLanguage.length}
                        >
                          {!voicesForSelectedLanguage.length && <option>No voices available</option>}
                          {voicesForSelectedLanguage.map((voice) => (
                            <option key={voice.id} value={voice.id}>
                              {voice.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Script
                      <textarea
                        className="min-h-[110px] rounded-2xl border border-white/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/40"
                        value={selectedState?.script ?? selectedCase.script}
                        onChange={(event) => handleScriptChange(selectedCase.id, event.target.value)}
                      />
                    </label>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handlePlaySample(selectedCase.id)}
                        disabled={playingId === selectedCase.id || !selectedState?.voiceId}
                        className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {playingId === selectedCase.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground text-[11px]">
                            ▶
                          </span>
                        )}
                        Play preview
                      </button>
                      <SmallCallButton
                        commonAgentId={selectedCase.commonAgentId}
                        targetAgentId={selectedCase.targetAgentId}
                        language={selectedLanguage?.name}
                        voice={selectedState?.voiceId}
                        className="shadow-none"
                      />
                      {playError && <p className="text-xs text-rose-600">{playError}</p>}
                      {voiceError && <p className="text-xs text-rose-600">{voiceError}</p>}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-muted-foreground">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Explore a use case
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Select a use case on the left to preview a live demo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} hidden />
    </Section>
  );
};

export default UseCasesPanel;
