import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { captureEvent, EVENTS } from "@/utils/analytics";

import { RecommendationCard } from "../components/recommendation-card";
import { ScoreBreakdownChart } from "../components/score-breakdown-chart";
import { ScoreGauge } from "../components/score-gauge";
import { ShareCard } from "../components/share-card";
import { StrengthsList } from "../components/strengths-list";
import { WeaknessesList } from "../components/weaknesses-list";
import { scoreApi } from "../services/score-api";

export default function CareerScorePage() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["scores"],
    queryFn: () => scoreApi.list(),
  });

  const score = query.data?.[0] ?? null;

  useEffect(() => {
    if (score) {
      captureEvent(EVENTS.CAREER_SCORE_VIEWED, { scoreId: score.id, overall: score.overallScore });
    }
  }, [score]);

  if (query.isLoading) {
    return (
      <PageContainer title="Career Score">
        <LoadingState />
      </PageContainer>
    );
  }

  if (query.isError) {
    return (
      <PageContainer title="Career Score">
        <ErrorState action={<Button onClick={() => void query.refetch()}>Retry</Button>} />
      </PageContainer>
    );
  }

  if (!score) {
    return (
      <PageContainer title="Career Score">
        <EmptyState
          title="No score yet"
          description="Upload and analyze a resume to generate your Career Score."
          action={
            <Button asChild>
              <Link to={ROUTES.RESUME_UPLOAD}>Upload resume</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Career Score"
      description="How the job market sees you — at a glance."
      actions={
        <Button asChild size="sm" variant="outline">
          <Link to={ROUTES.SCORE_BREAKDOWN}>Full breakdown</Link>
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6">
          <ScoreGauge score={score.overallScore} grade={score.grade} percentile={score.percentile} />
          <ShareCard
            score={score.overallScore}
            grade={score.grade}
            shareToken={score.shareToken}
            displayName={user?.displayName}
          />
        </div>
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Breakdown
            </h2>
            <ScoreBreakdownChart items={score.breakdown} />
          </section>
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Strengths
            </h2>
            <StrengthsList items={score.strengths} />
          </section>
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Gaps
            </h2>
            <WeaknessesList items={score.weaknesses} />
          </section>
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recommendations
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {score.recommendations.map((r) => (
                <RecommendationCard key={r.id} item={r} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
