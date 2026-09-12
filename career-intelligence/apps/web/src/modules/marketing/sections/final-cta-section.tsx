import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

import { LANDING } from "../content/landing-content";

export interface FinalCtaSectionProps {
  className?: string;
}

export function FinalCtaSection({ className }: FinalCtaSectionProps) {
  return (
    <section className={cn("border-b border-border bg-background", className)}>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {LANDING.finalCta.title}
        </h2>
        <p className="mt-4 text-muted-foreground">{LANDING.finalCta.description}</p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to={ROUTES.REGISTER}>{LANDING.finalCta.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;
