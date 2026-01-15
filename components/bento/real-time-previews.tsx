"use client"

import type React from "react"
import { useEffect, useState } from "react"

const STREAM_STATES = ["Listening", "Thinking", "Speaking"]

const RealtimeCodingPreviews: React.FC = () => {
  const [activeState, setActiveState] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveState((prev) => (prev + 1) % STREAM_STATES.length)
    }, 1600)

    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative h-full w-full p-5" role="img" aria-label="Streaming speech-to-speech pipeline">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="relative flex h-full w-full flex-col gap-4 rounded-2xl border border-white/10 bg-background/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Streaming pipeline</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Live
          </div>
        </div>

        <div className="flex flex-1 gap-4">
          <div className="flex flex-1 flex-col justify-between rounded-xl border border-white/10 bg-background/60 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Continuous waveform
              </p>
              <div className="mt-3 flex items-end gap-1">
                {Array.from({ length: 18 }).map((_, index) => (
                  <span
                    key={`stream-wave-${index}`}
                    className="indus-wave-bar indus-wave-bar--dense"
                    style={{ animationDelay: `${index * 0.06}s`, height: `${8 + (index % 6) * 5}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
                <span className="indus-stream-pulse" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">No turn breaks. No awkward pauses.</div>
            </div>
          </div>

          <div className="flex w-36 flex-col gap-2">
            {STREAM_STATES.map((state, index) => (
              <div
                key={state}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  index === activeState
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/10 text-muted-foreground"
                }`}
              >
                {state}...
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">True streaming STT -> LLM -> TTS with human-like flow.</div>
      </div>
    </div>
  )
}

export default RealtimeCodingPreviews
