import { ScoreRing } from "@/modules/marketing/components/score-ring";
import { cn } from "@/utils/cn";

export interface ScoreGaugeProps {
  score: number;
  grade?: string;
  percentile?: number;
  className?: string;
}

export function ScoreGauge({ score, grade, percentile, className }: ScoreGaugeProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <ScoreRing score={score} size={200} strokeWidth={14} />
      <div className="mt-4 text-center">
        {grade ? (
          <p className="text-lg font-semibold text-foreground">Grade {grade}</p>
        ) : null}
        {typeof percentile === "number" ? (
          <p className="text-sm text-muted-foreground">{percentile}th percentile</p>
        ) : null}
      </div>
    </div>
  );
}

export default ScoreGauge;
