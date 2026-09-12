import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FileUp } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";
import type { CareerScore, Resume } from "@careerlens/shared-types";

import { ActivityFeed } from "../components/activity-feed";
import { BiggestGapCard } from "../components/biggest-gap-card";
import { NextActionCard } from "../components/next-action-card";
import { ResumeHealthCard } from "../components/resume-health-card";
import { ScoreSummaryCard } from "../components/score-summary-card";
import { TopStrengthCard } from "../components/top-strength-card";

export default function DashboardPage() {
  const { user } = useAuth();

  const resumesQuery = useQuery({
    queryKey: ["resumes"],
    queryFn: () => http.get<Resume[]>(EP.RESUME_LIST),
  });

  const scoresQuery = useQuery({
    queryKey: ["scores"],
    queryFn: () => http.get<CareerScore[]>(EP.SCORE_LIST),
  });

  const isLoading = resumesQuery.isLoading || scoresQuery.isLoading;
  const isError = resumesQuery.isError || scoresQuery.isError;

  if (isLoading) {
    return (
      <PageContainer title="Dashboard">
        <LoadingState label="Loading your dashboard…" />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Dashboard">
        <ErrorState
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void resumesQuery.refetch();
                void scoresQuery.refetch();
              }}
            >
              Retry
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const resumes = resumesQuery.data ?? [];
  const scores = scoresQuery.data ?? [];
  const primaryResume = resumes.find((r) => r.isPrimary) ?? resumes[0] ?? null;
  const latestScore = scores[0] ?? null;
  const hasResume = resumes.length > 0;

  if (!hasResume) {
    return (
      <PageContainer
        title={`Welcome${user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}`}
        description="Get your free Career Score in under a minute."
      >
        <EmptyState
          icon={<FileUp className="h-10 w-10" aria-hidden />}
          title="Upload your resume to get started"
          description="We'll analyze it, estimate ATS fit, and generate your Career Score with strengths and gaps."
          action={
            <Button asChild>
              <Link to={ROUTES.RESUME_UPLOAD}>Upload resume</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const activity = [
    primaryResume
      ? {
          id: "1",
          label: `Resume analyzed: ${primaryResume.fileName}`,
          time: primaryResume.processedAt
            ? new Date(primaryResume.processedAt).toLocaleDateString()
            : "Recently",
        }
      : null,
    latestScore
      ? {
          id: "2",
          label: `Career Score generated: ${latestScore.overallScore}`,
          time: new Date(latestScore.generatedAt).toLocaleDateString(),
        }
      : null,
  ].filter(Boolean) as { id: string; label: string; time: string }[];

  return (
    <PageContainer
      title="Dashboard"
      description="Your career intelligence at a glance."
      actions={
        <Button asChild size="sm">
          <Link to={ROUTES.RESUME_UPLOAD}>Upload resume</Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ScoreSummaryCard score={latestScore} />
        <ResumeHealthCard resume={primaryResume} />
        <NextActionCard
          hasResume={hasResume}
          recommendation={latestScore?.recommendations[0] ?? null}
        />
        <TopStrengthCard strength={latestScore?.strengths[0] ?? null} />
        <BiggestGapCard gap={latestScore?.weaknesses[0] ?? null} />
        <ActivityFeed items={activity} />
      </div>
    </PageContainer>
  );
}
