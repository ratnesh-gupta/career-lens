import type { Recommendation } from "@careerlens/shared-types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RecommendationCardProps {
  item: Recommendation;
}

export function RecommendationCard({ item }: RecommendationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{item.title}</CardTitle>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
            {item.priority}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>{item.description}</p>
        <p className="text-xs">
          Impact +{item.estimatedImpact} · {item.timeToImplement}
        </p>
      </CardContent>
    </Card>
  );
}

export default RecommendationCard;
