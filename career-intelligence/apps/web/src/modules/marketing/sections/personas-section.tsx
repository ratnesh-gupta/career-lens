import { cn } from "@/utils/cn";

import { LANDING } from "../content/landing-content";

export interface PersonasSectionProps {
  className?: string;
}

export function PersonasSection({ className }: PersonasSectionProps) {
  return (
    <section className={cn("border-b border-border bg-surface", className)}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {LANDING.personas.eyebrow}
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {LANDING.personas.title}
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LANDING.personas.items.map((persona) => (
            <article
              key={persona.title}
              className="rounded-xl border border-border bg-background p-5 transition-shadow duration-150 hover:shadow-card"
            >
              <h3 className="text-sm font-semibold text-foreground">{persona.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {persona.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PersonasSection;
