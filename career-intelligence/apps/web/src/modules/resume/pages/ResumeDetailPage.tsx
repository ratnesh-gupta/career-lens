import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

import { ResumePreview } from "../components/resume-preview";
import { resumeApi } from "../services/resume-api";

export default function ResumeDetailPage() {
  const { id = "" } = useParams<{ id: string }>();

  const query = useQuery({
    queryKey: ["resume", id],
    queryFn: () => resumeApi.get(id),
    enabled: Boolean(id),
  });

  if (query.isLoading) {
    return (
      <PageContainer title="Resume">
        <LoadingState />
      </PageContainer>
    );
  }

  if (query.isError || !query.data) {
    return (
      <PageContainer title="Resume">
        <ErrorState action={<Button onClick={() => void query.refetch()}>Retry</Button>} />
      </PageContainer>
    );
  }

  const resume = query.data;

  return (
    <PageContainer
      title="Resume"
      actions={
        <div className="flex gap-2">
          {resume.status === "analyzed" ? (
            <Button asChild size="sm">
              <Link to={ROUTES.RESUME_ANALYSIS(resume.id)}>View analysis</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to={ROUTES.RESUME_PROCESSING(resume.id)}>Processing</Link>
            </Button>
          )}
        </div>
      }
    >
      <div className="max-w-md">
        <ResumePreview resume={resume} />
      </div>
    </PageContainer>
  );
}
