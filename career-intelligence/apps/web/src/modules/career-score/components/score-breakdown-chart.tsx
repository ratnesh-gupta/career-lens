import type { ScoreBreakdown } from "@careerlens/shared-types";

import { cn } from "@/utils/cn";

export interface ScoreBreakdownChartProps {
  items: ScoreBreakdown[];
  className?: string;
}

export function ScoreBreakdownChart({ items, className }: ScoreBreakdownChartProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => {
        const pct = Math.min(100, Math.max(0, (item.score / item.maxScore) * 100));
        return (
          <li key={item.category}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-foreground">{item.label}</span>
              <span className="font-mono tabular-nums text-muted-foreground">{item.score}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ScoreBreakdownChart;
