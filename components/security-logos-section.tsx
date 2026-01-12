import Image from "next/image"

const securityLogos = [
  { src: "/logos/indus/security/DPDPA-logo.png", alt: "DPDPA logo" },
  { src: "/logos/indus/security/VAPT-logo.png", alt: "VAPT certification logo" },
  { src: "/logos/indus/security/AICPA-logo.png", alt: "AICPA SOC logo" },
  { src: "/logos/indus/security/gptw-logo.png", alt: "Great Place to Work logo" },
  { src: "/logos/indus/security/ISO-logo.png", alt: "ISO 27001 logo" },
  { src: "/logos/indus/security/GDPR-logo.png", alt: "GDPR logo" },
]

export function SecurityLogosSection() {
  return (
    <section id="security-section" className="w-full px-5 py-12 md:py-16">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Security & Compliance</span>
          <h2 className="text-foreground text-3xl md:text-4xl font-semibold leading-tight">
            Enterprise-grade security, audit-ready by design
          </h2>
          <p className="max-w-2xl text-sm md:text-base text-muted-foreground">
            Trusted frameworks, continuous monitoring, and privacy-first controls keep every voice workflow compliant.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center justify-items-center rounded-2xl border border-border bg-card/50 px-6 py-8 shadow-[0px_10px_30px_-25px_rgba(0,0,0,0.6)]">
          {securityLogos.map((logo) => (
            <div key={logo.src} className="flex h-10 w-28 items-center justify-center md:h-12 md:w-32">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={64}
                className="h-full w-auto object-contain opacity-80"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
