"use client"

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react"
import { Loader2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { callApiService } from "@/services/callApiService"
import { countryService, type CountryCode } from "@/services/countryService"

type FormStatus = "idle" | "loading" | "success" | "error"

const COUNTRY_FLAG_MAP: Record<string, string> = {
  india: "IN",
  "united states": "US",
  "united states of america": "US",
  "united kingdom": "GB",
  uk: "GB",
  uae: "AE",
  "united arab emirates": "AE",
  singapore: "SG",
  germany: "DE",
}

const toFlagEmoji = (countryName: string) => {
  const code = COUNTRY_FLAG_MAP[countryName.toLowerCase()]
  if (!code) return "🌍"
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("")
}

export function CallIndusForm() {
  const [countries, setCountries] = useState<CountryCode[]>([])
  const [countryCode, setCountryCode] = useState("+91")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [status, setStatus] = useState<FormStatus>("idle")
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadCountries = async () => {
      const response = await countryService.fetchCountryCodes()
      if (!mounted) return
      const options = response.data ?? []
      setCountries(options)

      const defaultCode = options.find((country) => country.country === "India")?.code ?? options[0]?.code
      if (defaultCode) {
        setCountryCode(defaultCode)
      }
    }

    loadCountries()
    return () => {
      mounted = false
    }
  }, [])

  const formattedCountries = useMemo(() => {
    return countries.map((country) => ({
      label: `${toFlagEmoji(country.country)} ${country.country} (${country.code})`,
      value: country.code,
    }))
  }, [countries])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    const normalizedNumber = phoneNumber.replace(/[^\d]/g, "")
    if (!normalizedNumber || normalizedNumber.length < 6) {
      setStatus("error")
      setMessage("Enter a valid phone number to receive the call.")
      return
    }

    const normalizedCode = countryCode.startsWith("+") ? countryCode : `+${countryCode}`
    const fullNumber = `${normalizedCode}${normalizedNumber}`

    setStatus("loading")
    const response = await callApiService.initiateCall(fullNumber)

    if (response.success) {
      setStatus("success")
      setMessage("Calling you now. Please pick up in a moment.")
    } else {
      setStatus("error")
      setMessage(response.error || "Unable to place the call right now.")
    }
  }

  const helperText =
    status === "success"
      ? "Calling you now. Please pick up in a moment."
      : "Enter your number and we will call you with an IndusLabs demo."

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
    if (status !== "loading") {
      setStatus("idle")
      setMessage(null)
    }
  }

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(event.target.value)
    if (status !== "loading") {
      setStatus("idle")
      setMessage(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-background/70 px-3 py-2 text-sm text-foreground backdrop-blur">
          <select
            className="w-24 shrink-0 bg-transparent text-sm text-foreground outline-none"
            value={countryCode}
            onChange={handleCountryChange}
            aria-label="Country code"
          >
            {formattedCountries.length === 0 ? (
              <option value="+91">India (+91)</option>
            ) : (
              formattedCountries.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            )}
          </select>
          <span className="h-5 w-px bg-white/10" aria-hidden="true" />
          <input
            type="tel"
            inputMode="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
          Call Indus
        </Button>
      </div>

      <p className={`text-xs ${status === "error" ? "text-rose-400" : "text-muted-foreground"}`}>
        {message ?? helperText}
      </p>
    </form>
  )
}
