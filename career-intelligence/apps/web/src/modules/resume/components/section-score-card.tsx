import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export interface SectionScoreCardProps {
  title: string;
  score: number;
  description?: string;
  className?: string;
}

export function SectionScoreCard({ title, score, description, className }: SectionScoreCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="font-mono text-lg font-semibold tabular-nums">{score}</span>
      </CardHeader>
      {description ? (
        <CardContent>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

export default SectionScoreCard;
