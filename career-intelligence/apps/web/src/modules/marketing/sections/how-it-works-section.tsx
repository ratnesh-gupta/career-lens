import { cn } from "@/utils/cn";

import { LANDING } from "../content/landing-content";

export interface HowItWorksSectionProps {
  className?: string;
}

export function HowItWorksSection({ className }: HowItWorksSectionProps) {
  return (
    <section
      id={LANDING.howItWorks.id}
      className={cn("border-b border-border bg-background scroll-mt-20", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {LANDING.howItWorks.eyebrow}
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {LANDING.howItWorks.title}
        </h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {LANDING.howItWorks.steps.map((step) => (
            <li key={step.step} className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {step.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorksSection;
