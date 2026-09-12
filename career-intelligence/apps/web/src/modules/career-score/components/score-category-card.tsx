import type { ScoreBreakdown } from "@careerlens/shared-types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ScoreCategoryCardProps {
  item: ScoreBreakdown;
}

export function ScoreCategoryCard({ item }: ScoreCategoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
        <span className="font-mono text-lg font-semibold tabular-nums">{item.score}</span>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  );
}

export default ScoreCategoryCard;
