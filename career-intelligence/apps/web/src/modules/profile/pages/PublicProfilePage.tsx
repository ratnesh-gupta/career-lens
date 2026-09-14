import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { SeoHead } from "@/components/seo/head";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { ScoreRing } from "@/modules/marketing/components/score-ring";

import { profileApi } from "../services/profile-api";

export default function PublicProfilePage() {
  const { slug = "" } = useParams<{ slug: string }>();

  const query = useQuery({
    queryKey: ["public-profile", slug],
    queryFn: () => profileApi.getPublic(slug),
    enabled: Boolean(slug),
  });

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
          title="Profile not found"
          description="This public profile is private or does not exist."
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
  const score = data.latestPublicScore;

  return (
    <>
      <SeoHead
        title={`${data.displayName ?? "Professional"} — CareerLens`}
        description={
          data.headline ??
          data.summary ??
          `Public career profile for ${data.displayName ?? "this professional"} on CareerLens.`
        }
        canonicalPath={ROUTES.PUBLIC_PROFILE(slug)}
      />
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">CareerLens</p>

          <div className="mt-6 flex flex-col items-center text-center">
            {data.profilePhoto ? (
              <img
                src={data.profilePhoto}
                alt=""
                className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                {(data.displayName ?? "?").charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="mt-4 text-xl font-bold text-foreground">{data.displayName}</h1>
            {data.headline ? (
              <p className="mt-1 text-sm text-muted-foreground">{data.headline}</p>
            ) : null}
            {data.location ? (
              <p className="mt-1 text-xs text-muted-foreground">{data.location}</p>
            ) : null}
            {data.isOpenToWork ? (
              <span className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-700">
                Open to work
              </span>
            ) : null}
          </div>

          {data.summary ? (
            <p className="mt-8 text-sm leading-relaxed text-foreground">{data.summary}</p>
          ) : null}

          <dl className="mt-8 grid grid-cols-2 gap-3 text-left text-sm">
            {data.currentJobTitle ? (
              <div>
                <dt className="text-xs text-muted-foreground">Role</dt>
                <dd className="font-medium text-foreground">{data.currentJobTitle}</dd>
              </div>
            ) : null}
            {data.yearsOfExperience != null ? (
              <div>
                <dt className="text-xs text-muted-foreground">Experience</dt>
                <dd className="font-medium text-foreground">{data.yearsOfExperience} yrs</dd>
              </div>
            ) : null}
            {data.industry ? (
              <div>
                <dt className="text-xs text-muted-foreground">Industry</dt>
                <dd className="font-medium text-foreground">{data.industry}</dd>
              </div>
            ) : null}
            {data.careerLevel ? (
              <div>
                <dt className="text-xs text-muted-foreground">Level</dt>
                <dd className="font-medium capitalize text-foreground">{data.careerLevel}</dd>
              </div>
            ) : null}
          </dl>

          {score ? (
            <div className="mt-10 rounded-xl border border-border bg-background/60 p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Public Career Score
              </p>
              <div className="mt-4 flex justify-center">
                <ScoreRing score={score.overallScore} size={120} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Grade {score.grade}
                {score.percentile != null ? ` · ${score.percentile}th percentile` : ""}
              </p>
              {score.shareToken ? (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to={ROUTES.PUBLIC_SCORE(score.shareToken)}>View full score card</Link>
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {data.linkedinUrl ? (
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                LinkedIn
              </a>
            ) : null}
            {data.githubUrl ? (
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                GitHub
              </a>
            ) : null}
            {data.portfolioUrl ? (
              <a
                href={data.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                Portfolio
              </a>
            ) : null}
          </div>

          <Button asChild className="mt-10 w-full">
            <Link to={ROUTES.REGISTER}>Get your free Career Score</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
