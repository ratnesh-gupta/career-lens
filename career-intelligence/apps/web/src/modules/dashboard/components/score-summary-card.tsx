import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { ScoreRing } from "@/modules/marketing/components/score-ring";
import type { CareerScore } from "@careerlens/shared-types";

interface ScoreSummaryCardProps {
  score: CareerScore | null;
}

export function ScoreSummaryCard({ score }: ScoreSummaryCardProps) {
  if (!score) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Career Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Upload a resume to generate your first Career Score.
          </p>
          <Button asChild className="mt-4 rounded-full" size="sm">
            <Link to={ROUTES.RESUME_UPLOAD}>Upload resume</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-primary/10 bg-gradient-to-br from-surface to-primary/[0.03] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Career Score</CardTitle>
        <Link
          to={ROUTES.SCORE}
          className="text-xs font-medium text-primary hover:underline"
        >
          View details
        </Link>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <ScoreRing score={score.overallScore} size={100} strokeWidth={8} />
        <div>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {score.overallScore}
          </p>
          <p className="text-sm text-muted-foreground">
            Grade {score.grade} · {score.percentile}th percentile
          </p>
          <p className="mt-1 text-xs capitalize text-muted-foreground">
            {score.marketReadiness.replace(/-/g, " ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
