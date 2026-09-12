import { cn } from "@/utils/cn";

import { LANDING } from "../content/landing-content";

export interface ProblemSectionProps {
  className?: string;
}

export function ProblemSection({ className }: ProblemSectionProps) {
  return (
    <section className={cn("border-b border-border bg-surface", className)}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {LANDING.problem.eyebrow}
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {LANDING.problem.title}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING.problem.items.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-border bg-background p-6 transition-shadow duration-150 hover:shadow-card"
            >
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
