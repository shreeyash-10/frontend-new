"use client"

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const TOP_POINTS = "90 160 270 100 430 170 250 230"
const LEFT_POINTS = "90 160 250 230 250 260 90 190"
const RIGHT_POINTS = "270 100 430 170 430 200 270 130"

type CalloutProps = {
  title: string
  body?: string
  top: number
  style?: {
    opacity?: number | MotionValue<number>
    y?: number | MotionValue<number>
  }
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 8h8M9 4l3 4-3 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M20 42c6 6 18 4 24-4 5-7 2-16-7-17-7-1-12-6-10-12 2-7 13-9 21-3"
        stroke="#0F2F2C"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BaseWireframe() {
  return (
    <svg viewBox="0 0 520 320" className="h-full w-full" fill="none" aria-hidden="true">
      <polygon points={TOP_POINTS} stroke="#0F172A" strokeOpacity="0.25" strokeWidth="1" />
      <polygon points={LEFT_POINTS} stroke="#0F172A" strokeOpacity="0.22" strokeWidth="1" />
      <polygon points={RIGHT_POINTS} stroke="#0F172A" strokeOpacity="0.22" strokeWidth="1" />
    </svg>
  )
}

function IsometricLayer({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 520 320" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`top-${id}`} x1="90" y1="110" x2="430" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D9FFF6" />
          <stop offset="0.55" stopColor="#6FE7D7" />
          <stop offset="1" stopColor="#25C2B2" />
        </linearGradient>
        <linearGradient id={`highlight-${id}`} x1="110" y1="120" x2="360" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`left-${id}`} x1="90" y1="160" x2="250" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2E9F95" />
          <stop offset="1" stopColor="#1F716A" />
        </linearGradient>
        <linearGradient id={`right-${id}`} x1="270" y1="100" x2="430" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4FD9CB" />
          <stop offset="1" stopColor="#2FAFA2" />
        </linearGradient>
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#0B1F1F" floodOpacity="0.14" />
        </filter>
      </defs>
      <g filter={`url(#shadow-${id})`}>
        <polygon
          points={TOP_POINTS}
          fill={`url(#top-${id})`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1"
        />
        <polygon points={TOP_POINTS} fill={`url(#highlight-${id})`} />
        <polygon points={LEFT_POINTS} fill={`url(#left-${id})`} />
        <polygon points={RIGHT_POINTS} fill={`url(#right-${id})`} />
      </g>
    </svg>
  )
}

function Callout({ title, body, top, style }: CalloutProps) {
  return (
    <motion.div style={{ top: `${top}px`, ...style }} className="absolute right-0 w-[260px] text-left">
      <div className="relative pl-6">
        <span className="absolute -left-6 top-[11px] h-px w-6 bg-neutral-300" />
        <span className="absolute left-0 top-[7px] h-2 w-2 rounded-full border border-neutral-400 bg-white" />
        <p className="text-[10px] font-semibold tracking-[0.22em] text-neutral-500">{title}</p>
        {body ? <p className="mt-2 text-xs leading-relaxed text-neutral-500">{body}</p> : null}
      </div>
    </motion.div>
  )
}

function LeftCopy() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-4xl font-serif leading-tight text-neutral-900 md:text-5xl">
          Full Stack AI for
          <br />
          your Contact Center
        </h2>
        <p className="max-w-md text-base leading-relaxed text-neutral-500 md:text-lg">
          Unify telephony, analytics, and voice AI in a single modular stack built for scale, speed, and reliability.
        </p>
      </div>

      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {[
          { label: "Voice Agents", href: "#" },
          { label: "Text to Speech", href: "#" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center justify-between py-3 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
          >
            <span>{link.label}</span>
            <ArrowIcon />
          </a>
        ))}
      </div>
    </div>
  )
}

export function StackedScrollHero() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const pinnedRef = useRef<HTMLDivElement | null>(null)
  const [pinConfig, setPinConfig] = useState({ scrollRange: 1, pinDistance: 0 })

  // More predictable scroll mapping across browsers/layouts
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  // Layers
  const layer1Opacity = useTransform(smoothProgress, [0.20, 0.32], [0, 1])
  const layer1Y = useTransform(smoothProgress, [0.20, 0.32], [16, 0])
  const layer1Scale = useTransform(smoothProgress, [0.20, 0.32], [0.98, 1])

  const layer2Opacity = useTransform(smoothProgress, [0.45, 0.58], [0, 1])
  const layer2Y = useTransform(smoothProgress, [0.45, 0.58], [16, 0])
  const layer2Scale = useTransform(smoothProgress, [0.45, 0.58], [0.98, 1])

  const layer3Opacity = useTransform(smoothProgress, [0.70, 0.84], [0, 1])
  const layer3Y = useTransform(smoothProgress, [0.70, 0.84], [16, 0])
  const layer3Scale = useTransform(smoothProgress, [0.70, 0.84], [0.98, 1])

  // Callouts
  const baseOpacity = useTransform(smoothProgress, [0, 0.18], [1, 0])
  const callout1Opacity = useTransform(smoothProgress, [0.22, 0.34], [0, 1])
  const callout1Y = useTransform(smoothProgress, [0.22, 0.34], [8, 0])

  const callout2Opacity = useTransform(smoothProgress, [0.47, 0.60], [0, 1])
  const callout2Y = useTransform(smoothProgress, [0.47, 0.60], [8, 0])

  const callout3Opacity = useTransform(smoothProgress, [0.72, 0.86], [0, 1])
  const callout3Y = useTransform(smoothProgress, [0.72, 0.86], [8, 0])

  useEffect(() => {
    const update = () => {
      if (!sectionRef.current || !pinnedRef.current) return
      const sectionHeight = sectionRef.current.offsetHeight
      const pinnedHeight = pinnedRef.current.offsetHeight
      const topOffset = 80
      const scrollRange = Math.max(sectionHeight - window.innerHeight, 1)
      const pinDistance = Math.max(sectionHeight - pinnedHeight - topOffset, 0)
      setPinConfig({ scrollRange, pinDistance })
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const pinY = useTransform(scrollYProgress, (value) => {
    const scrollOffset = value * pinConfig.scrollRange
    return Math.min(scrollOffset, pinConfig.pinDistance)
  })

  return (
    <section className="relative w-full bg-white">
      {/* Scroll runway */}
      <div ref={sectionRef} className="relative h-[300vh]">
        {/* Desktop sticky story */}
        <motion.div ref={pinnedRef} style={{ y: pinY }} className="hidden md:block absolute left-0 right-0 top-20">
          <div className="mx-auto grid max-w-7xl grid-cols-12 items-center gap-12 px-6 py-24">
            <div className="col-span-4">
              <LeftCopy />
            </div>

            <div className="col-span-8 flex justify-center">
              <div className="relative h-[400px] w-full">
                {/* Stack area */}
                <div className="absolute left-0 bottom-0 h-[360px] w-[520px]">
                  <div className="relative h-full w-full">
                    <div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 z-0">
                      <BaseWireframe />
                    </div>

                    <motion.div
                      className="absolute bottom-[24px] left-1/2 w-full -translate-x-1/2 z-10"
                      style={{ opacity: layer1Opacity, y: layer1Y, scale: layer1Scale }}
                    >
                      <IsometricLayer id="layer-1" />
                    </motion.div>

                    <motion.div
                      className="absolute bottom-[56px] left-1/2 w-full -translate-x-1/2 z-20"
                      style={{ opacity: layer2Opacity, y: layer2Y, scale: layer2Scale }}
                    >
                      <IsometricLayer id="layer-2" />
                    </motion.div>

                    <motion.div
                      className="absolute bottom-[88px] left-1/2 w-full -translate-x-1/2 z-30"
                      style={{ opacity: layer3Opacity, y: layer3Y, scale: layer3Scale }}
                    >
                      <div className="relative">
                        <IsometricLayer id="layer-3" />
                        <motion.div
                          className="pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 -skew-x-12 opacity-70"
                          style={{ opacity: layer3Opacity }}
                        >
                          <LogoMark />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Callouts */}
                <div className="absolute right-0 top-0 h-full w-[260px]">
                  <Callout title="TELEPHONY ANALYTICS INTEGRATIONS" top={255} style={{ opacity: baseOpacity }} />

                  <Callout
                    title="VOICE AGENTIC PLATFORMS"
                    body="Deploy autonomous voice workflows with orchestration and safe handoffs."
                    top={180}
                    style={{ opacity: callout1Opacity, y: callout1Y }}
                  />

                  <Callout
                    title="ELECTRON INTELLIGENCE"
                    body="Enrich signals and compliance insights across every customer interaction."
                    top={105}
                    style={{ opacity: callout2Opacity, y: callout2Y }}
                  />

                  <Callout
                    title="LIGHTNING VOICE AI"
                    body="Low-latency synthesis and real-time personalization for every call."
                    top={30}
                    style={{ opacity: callout3Opacity, y: callout3Y }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile: non-sticky final state */}
        <div className="block md:hidden">
          <div className="mx-auto flex max-w-xl flex-col gap-10 px-6 py-16">
            <LeftCopy />

            <div className="relative h-[320px] w-full">
              <div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2">
                <BaseWireframe />
              </div>

              <div className="absolute bottom-[20px] left-1/2 w-full -translate-x-1/2">
                <IsometricLayer id="mobile-layer-1" />
              </div>

              <div className="absolute bottom-[44px] left-1/2 w-full -translate-x-1/2">
                <IsometricLayer id="mobile-layer-2" />
              </div>

              <div className="absolute bottom-[68px] left-1/2 w-full -translate-x-1/2">
                <div className="relative">
                  <IsometricLayer id="mobile-layer-3" />
                  <div className="pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 -skew-x-12 opacity-70">
                    <LogoMark />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              {[
                {
                  t: "TELEPHONY ANALYTICS INTEGRATIONS",
                },
                {
                  t: "VOICE AGENTIC PLATFORMS",
                  b: "Deploy autonomous voice workflows with orchestration and safe handoffs.",
                },
                {
                  t: "ELECTRON INTELLIGENCE",
                  b: "Enrich signals and compliance insights across every customer interaction.",
                },
                {
                  t: "LIGHTNING VOICE AI",
                  b: "Low-latency synthesis and real-time personalization for every call.",
                },
              ].map((x) => (
                <div key={x.t} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full border border-neutral-400 bg-white" />
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-neutral-500">{x.t}</p>
                    {x.b ? <p className="mt-2 text-xs leading-relaxed text-neutral-500">{x.b}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StackedScrollHero
