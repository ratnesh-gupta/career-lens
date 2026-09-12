import { cn } from "@/utils/cn";

import { ScoreRing } from "../components/score-ring";
import { LANDING } from "../content/landing-content";

export interface ScorePreviewSectionProps {
  className?: string;
}

export function ScorePreviewSection({ className }: ScorePreviewSectionProps) {
  const { scorePreview: s } = LANDING;

  return (
    <section
      id="score-preview"
      className={cn("border-b border-border bg-surface scroll-mt-20", className)}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">{s.eyebrow}</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {s.title}
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-8">
            <ScoreRing score={s.overall} max={s.max} size={160} />
            <p className="mt-3 text-sm font-medium text-foreground">
              Overall {s.overall}/{s.max}
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Breakdown
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {s.categories.map((cat) => (
                  <li
                    key={cat.label}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                  >
                    <span className="text-sm text-foreground">{cat.label}</span>
                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                      {cat.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-success">Strengths</h3>
                <ul className="mt-3 space-y-2">
                  {s.strengths.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-warning">Gaps</h3>
                <ul className="mt-3 space-y-2">
                  {s.gaps.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScorePreviewSection;
