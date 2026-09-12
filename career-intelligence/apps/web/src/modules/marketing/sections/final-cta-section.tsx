import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

import { LANDING } from "../content/landing-content";

export interface FinalCtaSectionProps {
  className?: string;
}

export function FinalCtaSection({ className }: FinalCtaSectionProps) {
  return (
    <section className={cn("border-t border-border/60 px-4 py-20 sm:px-6", className)}>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground shadow-glow-primary sm:px-12">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {LANDING.finalCta.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
          {LANDING.finalCta.subheadline}
        </p>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="mt-8 h-12 gap-2 rounded-full px-8 text-foreground"
        >
          <Link to={ROUTES.REGISTER}>
            {LANDING.finalCta.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default FinalCtaSection;
