import { SeoHead } from "@/components/seo/head";
import { env } from "@/config/env";

import { LANDING } from "../content/landing-content";
import { FaqSection } from "../sections/faq-section";
import { FeaturesSection } from "../sections/features-section";
import { FinalCtaSection } from "../sections/final-cta-section";
import { FooterSection } from "../sections/footer-section";
import { HeroSection } from "../sections/hero-section";
import { HowItWorksSection } from "../sections/how-it-works-section";
import { NavbarSection } from "../sections/navbar-section";
import { PersonasSection } from "../sections/personas-section";
import { ProblemSection } from "../sections/problem-section";
import { ScorePreviewSection } from "../sections/score-preview-section";
import { TestimonialsSection } from "../sections/testimonials-section";

const origin = env.VITE_APP_URL.replace(/\/$/, "");

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: LANDING.brand.name,
    url: origin,
    description: LANDING.brand.tagline,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: LANDING.brand.name,
    url: origin,
    description: LANDING.seo.description,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: LANDING.brand.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: LANDING.seo.description,
  },
];

export default function LandingPage() {
  return (
    <>
      <SeoHead
        title={LANDING.seo.title}
        description={LANDING.seo.description}
        canonicalPath={LANDING.seo.canonicalPath}
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-background text-foreground">
        <NavbarSection />
        <main>
          <HeroSection />
          <ProblemSection />
          <HowItWorksSection />
          <ScorePreviewSection />
          <FeaturesSection />
          <PersonasSection />
          <TestimonialsSection />
          <FaqSection />
          <FinalCtaSection />
        </main>
        <FooterSection />
      </div>
    </>
  );
}
