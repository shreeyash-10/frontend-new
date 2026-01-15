import type React from "react"

const LATENCY_STAGES = ["Waveform", "STT", "LLM", "TTS"]

const AiCodeReviews: React.FC = () => {
  return (
    <div className="relative h-full w-full p-5" role="img" aria-label="Ultra-low latency voice pipeline timeline">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="relative flex h-full w-full flex-col gap-4 rounded-2xl border border-white/10 bg-background/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Avg end-to-end latency: 180-280ms
          </div>
          <span className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">Ultra-Low</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Live speech</p>
          <div className="mt-3 flex items-end gap-1">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={`wave-${index}`}
                className="indus-wave-bar"
                style={{ animationDelay: `${index * 0.08}s`, height: `${10 + (index % 5) * 6}px` }}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-2">
          <div className="absolute left-4 right-4 top-3 h-px bg-white/10" />
          <div className="grid grid-cols-4 gap-4 text-center text-xs text-muted-foreground">
            {LATENCY_STAGES.map((stage) => (
              <div key={stage} className="flex flex-col items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-primary/40 bg-primary/20 shadow-[0_0_12px_rgba(120,252,214,0.3)]" />
                <span>{stage}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Sub-300ms response time from user speech to AI voice reply.
        </div>
      </div>
    </div>
  )
}

export default AiCodeReviews
