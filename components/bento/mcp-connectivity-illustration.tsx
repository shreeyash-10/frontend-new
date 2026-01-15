"use client"

import type React from "react"
import { useEffect, useState } from "react"

const LLM_OPTIONS = ["Groq", "OpenAI", "Claude"]
const TTS_OPTIONS = ["Murf", "Eleven", "Custom Voice"]

const McpConnectivityIllustration: React.FC = () => {
  const [activeLlm, setActiveLlm] = useState(0)
  const [activeTts, setActiveTts] = useState(0)

  useEffect(() => {
    const llmInterval = setInterval(() => {
      setActiveLlm((prev) => (prev + 1) % LLM_OPTIONS.length)
    }, 2200)

    const ttsInterval = setInterval(() => {
      setActiveTts((prev) => (prev + 1) % TTS_OPTIONS.length)
    }, 2600)

    return () => {
      clearInterval(llmInterval)
      clearInterval(ttsInterval)
    }
  }, [])

  return (
    <div className="relative h-full w-full p-5" role="img" aria-label="Multi-LLM and multi-TTS hot switching">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="relative flex h-full w-full flex-col gap-4 rounded-2xl border border-white/10 bg-background/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Hot switching</p>
          <span className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">Per call</span>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">LLM routing</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {LLM_OPTIONS.map((option, index) => (
                <span
                  key={option}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    index === activeLlm
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-white/10 text-muted-foreground"
                  }`}
                >
                  {option}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Swapping per cost tier and language.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">TTS voice stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TTS_OPTIONS.map((option, index) => (
                <span
                  key={option}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    index === activeTts
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-white/10 text-muted-foreground"
                  }`}
                >
                  {option}
                </span>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Switch without redeploying or reindexing calls.
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">Instantly swap models per call, per language, per cost tier.</div>
      </div>
    </div>
  )
}

export default McpConnectivityIllustration
