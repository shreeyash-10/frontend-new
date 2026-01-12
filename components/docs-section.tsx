import { BookOpen, Layers, Terminal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const docHighlights = [
  {
    title: "Quickstarts",
    description: "Go from sandbox to production with guided flows and deploy-ready recipes.",
    href: "https://docs.induslabs.io/",
    icon: BookOpen,
  },
  {
    title: "API Reference",
    description: "Clear endpoints, versioned schemas, and webhooks for real-time voice ops.",
    href: "https://docs.induslabs.io/tts",
    icon: Terminal,
  },
  {
    title: "SDKs & Tools",
    description: "Ship faster with official SDKs, Postman collections, and sample apps.",
    href: "https://docs.induslabs.io/sdk",
    icon: Layers,
  },
]

const quickstartSnippet = `curl -X POST "https://voice.induslabs.io/v1/audio/speech" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello world from IndusLabs", "voice": "tara"}'`

export function DocsSection() {
  return (
    <section id="docs-section" className="w-full px-5 py-14 md:py-20">
      <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Docs</span>
          <h2 className="text-foreground text-3xl md:text-4xl font-semibold leading-tight">
            Docs that get your voice AI live fast
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground">
            Build with clear APIs, opinionated quickstarts, and production-first SDKs that keep your teams shipping.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="https://docs.induslabs.io/" target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Read the docs
              </Button>
            </Link>
            <Link href="https://docs.induslabs.io/tts" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full">
                API reference
              </Button>
            </Link>
            <Link href="https://docs.induslabs.io/sdk" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full">
                SDKs
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {docHighlights.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 transition hover:border-foreground/20 hover:bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-base font-semibold text-foreground">{item.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground">
                    Explore
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-[0px_16px_40px_-28px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>Quickstart</span>
            <span>cURL</span>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border/60 bg-background/60 p-4 text-xs text-foreground/80">
            <code>{quickstartSnippet}</code>
          </pre>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Latency-optimized voice pipelines</span>
          </div>
        </div>
      </div>
    </section>
  )
}
