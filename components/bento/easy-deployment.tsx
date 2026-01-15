import type React from "react"

const DeploymentEasy: React.FC = () => {
  const breakdown = [
    { label: "Call #2194", cost: "$0.42/min", latency: "214ms", model: "Groq + Eleven" },
    { label: "Call #2195", cost: "$0.38/min", latency: "201ms", model: "Claude + Murf" },
    { label: "Call #2196", cost: "$0.44/min", latency: "236ms", model: "OpenAI + Custom" },
  ]

  return (
    <div className="relative h-full w-full p-5" role="img" aria-label="Real-time cost and latency observability">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="relative flex h-full w-full flex-col gap-4 rounded-2xl border border-white/10 bg-background/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Live observability</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Live
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-white/10 bg-background/60 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Latency vs Cost per minute</span>
            <span>Last 60s</span>
          </div>
          <div className="relative flex-1 rounded-xl border border-white/10 bg-background/80 p-3">
            <svg className="h-full w-full" viewBox="0 0 320 120" aria-hidden="true">
              <polyline
                points="0,78 40,62 80,70 120,46 160,54 200,40 240,56 280,44 320,50"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
              <polyline
                points="0,92 40,86 80,90 120,80 160,88 200,72 240,82 280,76 320,78"
                fill="none"
                stroke="hsl(var(--foreground) / 0.4)"
                strokeWidth="2"
              />
            </svg>
            <span className="indus-graph-dot" />
          </div>

          <div className="grid gap-2 text-xs text-muted-foreground">
            {breakdown.map((row) => (
              <div key={row.label} className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-foreground/90">{row.label}</span>
                <span>{row.cost}</span>
                <span>{row.latency}</span>
                <span className="text-muted-foreground">{row.model}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          See cost per minute, latency spikes, and model usage live per call.
        </div>
      </div>
    </div>
  )
}

export default DeploymentEasy
