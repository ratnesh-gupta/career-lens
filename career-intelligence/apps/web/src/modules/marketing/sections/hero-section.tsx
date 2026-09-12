import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

import { ScoreRing } from "../components/score-ring";
import { LANDING } from "../content/landing-content";

export interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "hero-mesh relative overflow-hidden border-b border-border/60",
        className,
      )}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-32">
        <div className="flex flex-col items-start text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Free Career Score in under a minute
          </span>
          <h1 className="mt-5 max-w-xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            {LANDING.hero.headline}
          </h1>
          <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {LANDING.hero.subheadline}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 gap-2 rounded-full px-7 shadow-glow-primary">
              <Link to={ROUTES.REGISTER}>
                {LANDING.hero.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-6">
              <a href="#score-preview">{LANDING.hero.secondaryCta}</a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{LANDING.hero.trustLine}</p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[1.75rem] bg-primary/5 blur-2xl"
              aria-hidden
            />
            <div className="relative rounded-[1.25rem] border border-border/80 bg-surface/90 p-8 shadow-card backdrop-blur-sm sm:p-10">
              <p className="section-label mb-6 text-center">Sample score</p>
              <ScoreRing score={LANDING.hero.sampleScore} size={200} strokeWidth={12} />
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border/80 pt-5 text-center">
                <div>
                  <p className="text-lg font-semibold tabular-nums text-foreground">A-</p>
                  <p className="text-[11px] text-muted-foreground">Grade</p>
                </div>
                <div>
                  <p className="text-lg font-semibold tabular-nums text-foreground">72nd</p>
                  <p className="text-[11px] text-muted-foreground">Percentile</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Ready</p>
                  <p className="text-[11px] text-muted-foreground">Market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
