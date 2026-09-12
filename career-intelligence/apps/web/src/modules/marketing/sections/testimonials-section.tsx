import { cn } from "@/utils/cn";

import { LANDING } from "../content/landing-content";

export interface TestimonialsSectionProps {
  className?: string;
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  return (
    <section className={cn("border-b border-border bg-background", className)}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {LANDING.testimonials.eyebrow}
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {LANDING.testimonials.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{LANDING.testimonials.disclaimer}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {LANDING.testimonials.items.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col rounded-xl border border-border bg-surface p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 border-t border-border pt-4">
                <cite className="not-italic">
                  <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
