import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import type { Recommendation } from "@careerlens/shared-types";

interface NextActionCardProps {
  recommendation: Recommendation | null;
  hasResume: boolean;
}

export function NextActionCard({ recommendation, hasResume }: NextActionCardProps) {
  if (!hasResume) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Next step</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Upload your resume to unlock your Career Score and personalized recommendations.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link to={ROUTES.RESUME_UPLOAD}>Upload resume</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recommended next step</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendation ? (
          <>
            <p className="font-medium text-foreground">{recommendation.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{recommendation.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Est. impact +{recommendation.estimatedImpact} · {recommendation.timeToImplement}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Check your score for recommendations.</p>
        )}
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to={ROUTES.SCORE}>View Career Score</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
