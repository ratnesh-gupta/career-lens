import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

import { ScoreCategoryCard } from "../components/score-category-card";
import { scoreApi } from "../services/score-api";

export default function ScoreBreakdownPage() {
  const query = useQuery({
    queryKey: ["scores"],
    queryFn: () => scoreApi.list(),
  });

  const score = query.data?.[0];

  if (query.isLoading) {
    return (
      <PageContainer title="Score breakdown">
        <LoadingState />
      </PageContainer>
    );
  }

  if (query.isError || !score) {
    return (
      <PageContainer title="Score breakdown">
        <ErrorState
          action={
            <Button asChild>
              <Link to={ROUTES.SCORE}>Back to score</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Score breakdown"
      description={`Overall ${score.overallScore} · Grade ${score.grade}`}
      actions={
        <Button asChild size="sm" variant="outline">
          <Link to={ROUTES.SCORE}>Back</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {score.breakdown.map((item) => (
          <ScoreCategoryCard key={item.category} item={item} />
        ))}
      </div>
    </PageContainer>
  );
}
