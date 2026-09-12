import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { captureEvent, EVENTS } from "@/utils/analytics";

import { AnalysisSummary } from "../components/analysis-summary";
import { resumeApi } from "../services/resume-api";

export default function ResumeAnalysisPage() {
  const { id = "" } = useParams<{ id: string }>();

  const analysisQuery = useQuery({
    queryKey: ["resume-analysis", id],
    queryFn: () => resumeApi.getAnalysis(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (analysisQuery.isSuccess) {
      captureEvent(EVENTS.RESUME_ANALYSIS_VIEWED, { resumeId: id });
    }
  }, [analysisQuery.isSuccess, id]);

  if (analysisQuery.isLoading) {
    return (
      <PageContainer title="Resume analysis">
        <LoadingState />
      </PageContainer>
    );
  }

  if (analysisQuery.isError || !analysisQuery.data) {
    return (
      <PageContainer title="Resume analysis">
        <ErrorState
          description="Analysis may still be running."
          action={
            <Button asChild>
              <Link to={ROUTES.RESUME_PROCESSING(id)}>Check processing</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const analysis = analysisQuery.data;

  return (
    <PageContainer
      title="Resume analysis"
      description="ATS fit, keywords, and content signals."
      actions={
        <Button asChild size="sm">
          <Link to={ROUTES.SCORE}>View Career Score</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <AnalysisSummary analysis={analysis} />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2">
                {analysis.keywords.map((k) => (
                  <li
                    key={k.term}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground"
                  >
                    {k.term}
                    {k.isInDemand ? (
                      <span className="ml-1 text-primary">· demand</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Missing keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {analysis.missingKeywords.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Formatting issues</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {analysis.formattingIssues.length === 0 ? (
                  <li>None detected</li>
                ) : (
                  analysis.formattingIssues.map((issue) => <li key={issue}>{issue}</li>)
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {analysis.contentSuggestions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
