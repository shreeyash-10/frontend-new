import { DecryptingText } from "@/components/DecryptingText"

const NEWS_ITEMS = [
  "IndusLabs ships 120-B voice LLM for low-latency calls",
  "Realtime call previews now average 90 ms latency",
  "Build Your Own Bot Studio opens beta for 12 languages",
  "Indus V1 voice stack scales to 4.5M minutes",
  "New enterprise rollouts added across 6 regions",
]

const renderStaticNews = (text: string) => {
  const parts = text.split(/(\d+(?:\.\d+)?)/g)
  return parts.map((part, index) => {
    if (/^\d/.test(part)) {
      return (
        <span key={`news-digit-${index}`} className="text-sm md:text-base font-semibold text-foreground">
          {part}
        </span>
      )
    }
    return <span key={`news-text-${index}`}>{part}</span>
  })
}

export function NewsMarquee() {
  return (
    <div className="w-full pb-6">
      <div className="mx-auto w-full max-w-[1320px] px-6">
        <div className="rounded-full border border-white/10 bg-background/60 px-4 py-2 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground md:text-xs">
            <span className="text-primary font-semibold">Latest</span>
            <div
              className="relative flex-1 overflow-hidden"
              style={{
                maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
              }}
            >
              <div className="flex w-max items-center gap-6 whitespace-nowrap animate-[indus-marquee_28s_linear_infinite] motion-reduce:animate-none">
                {NEWS_ITEMS.map((item) => (
                  <span key={`news-${item}`} className="flex items-center gap-3 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                    <DecryptingText
                      text={item}
                      className="text-foreground/90 text-xs md:text-sm font-medium normal-case tracking-normal"
                      highlightDigits
                      highlightDigitsClassName="text-sm md:text-base font-semibold text-foreground"
                    />
                  </span>
                ))}
                {NEWS_ITEMS.map((item) => (
                  <span key={`news-dup-${item}`} className="flex items-center gap-3 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                    <span className="text-foreground/70 text-xs md:text-sm font-medium normal-case tracking-normal">
                      {renderStaticNews(item)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
