"use client"

import { useEffect, useMemo, useState } from "react"

type DecryptingTextProps = {
  text: string
  className?: string
  durationMs?: number
  delayMs?: number
  highlightDigits?: boolean
  highlightDigitsClassName?: string
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

const scrambleText = (value: string) =>
  value
    .split("")
    .map((char) => {
      if (char === " ") return " "
      if (!/[A-Za-z0-9]/.test(char)) return char
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    })
    .join("")

const renderWithHighlightedDigits = (value: string, highlightDigitsClassName?: string) => {
  const parts = value.split(/(\d+(?:\.\d+)?)/g)
  return parts.map((part, index) => {
    if (/^\d/.test(part)) {
      return (
        <span key={`digit-${index}`} className={highlightDigitsClassName}>
          {part}
        </span>
      )
    }
    return <span key={`text-${index}`}>{part}</span>
  })
}

export function DecryptingText({
  text,
  className,
  durationMs = 900,
  delayMs = 0,
  highlightDigits = false,
  highlightDigitsClassName = "font-semibold",
}: DecryptingTextProps) {
  const [displayText, setDisplayText] = useState(() => scrambleText(text))

  const output = useMemo(() => {
    if (!highlightDigits) return displayText
    return renderWithHighlightedDigits(displayText, highlightDigitsClassName)
  }, [displayText, highlightDigits, highlightDigitsClassName])

  useEffect(() => {
    let frameId: number
    let startTime: number | null = null
    let cancelled = false

    setDisplayText(scrambleText(text))

    const step = (timestamp: number) => {
      if (cancelled) return
      if (startTime === null) {
        startTime = timestamp
      }
      const elapsed = timestamp - startTime
      if (elapsed < delayMs) {
        frameId = requestAnimationFrame(step)
        return
      }

      const progress = Math.min((elapsed - delayMs) / durationMs, 1)
      const revealedCount = Math.floor(progress * text.length)

      const next = text
        .split("")
        .map((char, index) => {
          if (index < revealedCount) return char
          if (char === " ") return " "
          if (!/[A-Za-z0-9]/.test(char)) return char
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        })
        .join("")

      setDisplayText(next)

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setDisplayText(text)
      }
    }

    frameId = requestAnimationFrame(step)

    return () => {
      cancelled = true
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [delayMs, durationMs, text])

  return <span className={className}>{output}</span>
}
