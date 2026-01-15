import type React from "react"

const REGIONS = [
  { label: "US-East", left: "18%", top: "42%" },
  { label: "EU-West", left: "46%", top: "36%" },
  { label: "India", left: "62%", top: "52%" },
  { label: "SEA", left: "72%", top: "58%" },
]

const OneClickIntegrationsIllustration: React.FC = () => {
  return (
    <div className="relative h-full w-full p-5" role="img" aria-label="Carrier-grade call stability with global failover">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="relative flex h-full w-full flex-col gap-4 rounded-2xl border border-white/10 bg-background/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Global uptime</p>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            99.95% uptime
          </span>
        </div>

        <div className="relative flex-1 rounded-2xl border border-white/10 bg-background/60 p-4">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 180" aria-hidden="true">
            <path
              className="indus-failover-line"
              d="M60 85 C120 40, 200 40, 260 70"
              fill="none"
              stroke="hsl(var(--primary) / 0.6)"
              strokeWidth="2"
            />
            <path
              className="indus-failover-line"
              d="M80 110 C150 130, 220 125, 280 100"
              fill="none"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="2"
            />
          </svg>

          {REGIONS.map((region) => (
            <div
              key={region.label}
              className="absolute flex flex-col items-center gap-2"
              style={{ left: region.left, top: region.top }}
            >
              <span className="indus-node" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {region.label}
              </span>
            </div>
          ))}

          <div className="absolute bottom-3 left-4 text-xs text-muted-foreground">
            Primary to backup failover with jitter buffering.
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Automatic failover, packet-loss recovery, and carrier-grade routing.
        </div>
      </div>
    </div>
  )
}

export default OneClickIntegrationsIllustration
