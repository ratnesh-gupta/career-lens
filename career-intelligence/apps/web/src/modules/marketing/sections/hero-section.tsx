import { Link } from "react-router-dom";

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
        "relative overflow-hidden border-b border-border bg-background",
        className,
      )}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="flex flex-col items-start text-left">
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {LANDING.hero.headline}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground sm:text-xl">
            {LANDING.hero.subheadline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to={ROUTES.REGISTER}>{LANDING.hero.primaryCta}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#score-preview">{LANDING.hero.secondaryCta}</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{LANDING.hero.trustLine}</p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-card">
            <ScoreRing score={LANDING.hero.sampleScore} size={180} strokeWidth={12} />
            <p className="mt-4 text-center text-sm font-medium text-foreground">Career Score</p>
            <p className="text-center text-xs text-muted-foreground">Sample preview</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
