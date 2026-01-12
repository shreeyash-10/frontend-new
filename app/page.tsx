import { HeroSection } from "@/components/hero-section"
import { SocialProof } from "@/components/social-proof"
import { BentoSection } from "@/components/bento-section"
import { LargeTestimonial } from "@/components/large-testimonial"
import { PricingSection } from "@/components/pricing-section"
import { TestimonialGridSection } from "@/components/testimonial-grid-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { FooterSection } from "@/components/footer-section"
import { AnimatedSection } from "@/components/animated-section"
import { DocsSection } from "@/components/docs-section"
import { SecurityLogosSection } from "@/components/security-logos-section"
import VoiceWorkbenchSection from "@/components/indus/VoiceWorkbenchSection"
import UseCasesPanel from "@/components/indus/UseCasesPanel"
import { StackedScrollHero } from "@/components/StackedScrollHero"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      <div className="relative z-10">
        <main className="relative w-full">
          <HeroSection />
        </main>
        <AnimatedSection className="relative z-10 mt-6" delay={0.1}>
          <VoiceWorkbenchSection />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 w-full px-6 mt-8" delay={0.1}>
          <SocialProof />
        </AnimatedSection>
        <AnimatedSection id="features-section" className="relative z-10 w-full mt-16" delay={0.2}>
          <BentoSection />
        </AnimatedSection>
        <StackedScrollHero />
        <AnimatedSection className="relative z-10 w-full mt-8 md:mt-16" delay={0.2}>
          <UseCasesPanel />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 w-full mt-8 md:mt-16" delay={0.2}>
          <LargeTestimonial />
        </AnimatedSection>
        <AnimatedSection
          id="pricing-section"
          className="relative z-10 w-full mt-8 md:mt-16"
          delay={0.2}
        >
          <PricingSection />
        </AnimatedSection>
        <AnimatedSection
          id="testimonials-section"
          className="relative z-10 w-full mt-8 md:mt-16"
          delay={0.2}
        >
          <TestimonialGridSection />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 w-full mt-8 md:mt-16" delay={0.2}>
          <SecurityLogosSection />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 w-full mt-8 md:mt-16" delay={0.2}>
          <DocsSection />
        </AnimatedSection>
        <AnimatedSection id="faq-section" className="relative z-10 w-full mt-8 md:mt-16" delay={0.2}>
          <FAQSection />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 w-full mt-8 md:mt-16" delay={0.2}>
          <CTASection />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 w-full mt-8 md:mt-16" delay={0.2}>
          <FooterSection />
        </AnimatedSection>
      </div>
    </div>
  )
}
