"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"

const COUNTS = [1, 10, 1000, 50000]
const GPU_LEVELS = [18, 32, 58, 86]

const formatCount = (value: number) => {
  if (value >= 1000) {
    return value.toLocaleString("en-US")
  }
  return String(value)
}

const ParallelCodingAgents: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COUNTS.length)
    }, 1700)

    return () => clearInterval(id)
  }, [])

  const count = COUNTS[activeIndex]
  const gpuLevel = GPU_LEVELS[activeIndex]
  const activeBars = useMemo(() => Math.max(2, Math.round(gpuLevel / 12.5)), [gpuLevel])

  return (
    <div
      className="relative h-full w-full p-5"
      role="img"
      aria-label="Massive concurrent call handling with GPU autoscaling"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="relative flex h-full w-full flex-col gap-4 rounded-2xl border border-white/10 bg-background/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Concurrent calls</p>
          <span className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">GPU autoscale</span>
        </div>

        <div className="flex flex-1 flex-col justify-between rounded-2xl border border-white/10 bg-background/60 p-4">
          <div>
            <div className="text-4xl font-semibold text-foreground md:text-5xl">{formatCount(count)}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">simultaneous calls</div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>GPU load</span>
              <span>{gpuLevel}%</span>
            </div>
            <div className="mt-3 grid grid-cols-10 items-end gap-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <span
                  key={`gpu-${index}`}
                  className={`indus-gpu-bar ${index < activeBars ? "bg-primary/70" : "bg-white/10"}`}
                  style={{ animationDelay: `${index * 0.12}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Handle tens of thousands of simultaneous voice conversations with predictable latency.
        </div>
      </div>
    </div>
  )
}

export default ParallelCodingAgents
