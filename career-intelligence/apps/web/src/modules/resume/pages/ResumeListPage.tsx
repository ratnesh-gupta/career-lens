import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { formatDate, formatFileSize } from "@/utils/format";

import { resumeApi } from "../services/resume-api";

export default function ResumeListPage() {
  const query = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumeApi.list(),
  });

  if (query.isLoading) {
    return (
      <PageContainer title="Resumes">
        <LoadingState />
      </PageContainer>
    );
  }

  if (query.isError) {
    return (
      <PageContainer title="Resumes">
        <ErrorState action={<Button onClick={() => void query.refetch()}>Retry</Button>} />
      </PageContainer>
    );
  }

  const resumes = query.data ?? [];

  return (
    <PageContainer
      title="Resumes"
      description="Manage uploaded resumes and analyses."
      actions={
        <Button asChild size="sm">
          <Link to={ROUTES.RESUME_UPLOAD}>Upload</Link>
        </Button>
      }
    >
      {resumes.length === 0 ? (
        <EmptyState
          title="No resumes yet"
          description="Upload a PDF resume to generate your Career Score."
          action={
            <Button asChild>
              <Link to={ROUTES.RESUME_UPLOAD}>Upload resume</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {resumes.map((resume) => (
            <li key={resume.id}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="truncate text-base">{resume.fileName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p className="capitalize">Status: {resume.status}</p>
                  <p>
                    {formatFileSize(resume.fileSize)} · {formatDate(resume.uploadedAt)}
                  </p>
                  {resume.isPrimary ? (
                    <p className="text-xs font-medium text-primary">Primary</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={ROUTES.RESUME_DETAIL(resume.id)}>Open</Link>
                    </Button>
                    {resume.status === "analyzed" ? (
                      <Button asChild size="sm" variant="ghost">
                        <Link to={ROUTES.RESUME_ANALYSIS(resume.id)}>Analysis</Link>
                      </Button>
                    ) : resume.status === "processing" || resume.status === "pending" ? (
                      <Button asChild size="sm" variant="ghost">
                        <Link to={ROUTES.RESUME_PROCESSING(resume.id)}>Processing</Link>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
