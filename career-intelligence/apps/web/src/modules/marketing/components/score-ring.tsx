import { cn } from "@/utils/cn";

export interface ScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

/** Static SVG score ring — visual signature for CareerLens. */
export function ScoreRing({
  score,
  max = 100,
  size = 160,
  strokeWidth = 10,
  className,
  label,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(score, 0), max);
  const progress = clamped / max;
  const offset = circumference * (1 - progress);

  const tone =
    clamped >= 85
      ? "text-score-excellent"
      : clamped >= 70
        ? "text-score-good"
        : clamped >= 50
          ? "text-score-fair"
          : "text-score-poor";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Career Score ${clamped} out of ${max}`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(tone, "transition-[stroke-dashoffset] duration-700 ease-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-3xl font-bold tracking-tight tabular-nums", tone)}>
          {clamped}
        </span>
        <span className="text-xs text-muted-foreground">/{max}</span>
      </div>
    </div>
  );
}

export default ScoreRing;
