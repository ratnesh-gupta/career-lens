import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

import { SeoHead } from "@/components/seo/head";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { ScoreRing } from "@/modules/marketing/components/score-ring";
import { captureEvent, EVENTS } from "@/utils/analytics";

import { scoreApi } from "../services/score-api";

export default function PublicScorePage() {
  const { slug = "" } = useParams<{ slug: string }>();

  const query = useQuery({
    queryKey: ["public-score", slug],
    queryFn: () => scoreApi.getPublic(slug),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (query.isSuccess) {
      captureEvent(EVENTS.SHARE_LINK_OPENED, { token: slug });
    }
  }, [query.isSuccess, slug]);

  if (query.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <ErrorState
          title="Score not found"
          description="This share link may be invalid or expired."
          action={
            <Button asChild>
              <Link to={ROUTES.HOME}>Go to CareerLens</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const data = query.data;

  return (
    <>
      <SeoHead
        title={`${data.ownerDisplayName}'s Career Score — CareerLens`}
        description={`Career Score ${data.overallScore}, grade ${data.grade}. See how the job market sees ${data.ownerDisplayName}.`}
        canonicalPath={ROUTES.PUBLIC_SCORE(slug)}
      />
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">CareerLens</p>
          <h1 className="mt-2 text-xl font-bold text-foreground">{data.ownerDisplayName}</h1>
          <div className="mt-8 flex justify-center">
            <ScoreRing score={data.overallScore} size={160} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Grade {data.grade} · {data.percentile}th percentile
          </p>
          {data.topStrengths?.length ? (
            <div className="mt-8 text-left">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Strengths
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {data.topStrengths.map((s) => (
                  <li key={s.title}>· {s.title}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {data.improvementArea ? (
            <p className="mt-6 text-left text-sm text-muted-foreground">
              Focus area: <span className="text-foreground">{data.improvementArea}</span>
            </p>
          ) : null}
          <Button asChild className="mt-10 w-full">
            <Link to={ROUTES.REGISTER}>Get your free Career Score</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
