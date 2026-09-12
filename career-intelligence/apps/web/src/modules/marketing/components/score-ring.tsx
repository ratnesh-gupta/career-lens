import { cn } from "@/utils/cn";

export interface ScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

/** SVG score ring — CareerLens visual signature. */
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
      <div
        className="pointer-events-none absolute inset-[12%] rounded-full opacity-40 blur-2xl"
        style={{
          background:
            clamped >= 70
              ? "radial-gradient(circle, rgba(22,163,74,0.35), transparent 70%)"
              : clamped >= 50
                ? "radial-gradient(circle, rgba(245,158,11,0.35), transparent 70%)"
                : "radial-gradient(circle, rgba(220,38,38,0.3), transparent 70%)",
        }}
        aria-hidden
      />
      <svg width={size} height={size} className="-rotate-90 drop-shadow-sm" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/80"
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
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          /{max}
        </span>
      </div>
    </div>
  );
}

export default ScoreRing;
