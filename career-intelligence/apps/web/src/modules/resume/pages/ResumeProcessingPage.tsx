import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/feedback/error-state";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { captureEvent, EVENTS } from "@/utils/analytics";

import {
  mapStatusToStepIndex,
  ProcessingStepper,
} from "../components/processing-stepper";
import { UploadProgress } from "../components/upload-progress";
import { resumeApi } from "../services/resume-api";

export default function ResumeProcessingPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [completedLogged, setCompletedLogged] = useState(false);

  const statusQuery = useQuery({
    queryKey: ["resume-status", id],
    queryFn: () => resumeApi.getStatus(id),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "analyzed" || status === "failed") return false;
      return 2000;
    },
  });

  const status = statusQuery.data?.status;
  const progress = statusQuery.data?.progress ?? 0;

  useEffect(() => {
    if (status === "analyzed" && id) {
      if (!completedLogged) {
        captureEvent(EVENTS.RESUME_PROCESSING_COMPLETED, { resumeId: id });
        setCompletedLogged(true);
      }
      const t = window.setTimeout(() => {
        navigate(ROUTES.RESUME_ANALYSIS(id), { replace: true });
      }, 800);
      return () => window.clearTimeout(t);
    }
  }, [status, id, navigate, completedLogged]);

  if (!id) {
    return (
      <PageContainer title="Processing">
        <ErrorState title="Missing resume" description="No resume id in the URL." />
      </PageContainer>
    );
  }

  if (statusQuery.isError) {
    return (
      <PageContainer title="Processing">
        <ErrorState
          title="Processing failed"
          description="We couldn't check status. Retry or contact support."
          action={
            <div className="flex gap-2">
              <Button type="button" onClick={() => void statusQuery.refetch()}>
                Retry
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:support@careerlens.app">Contact support</a>
              </Button>
            </div>
          }
        />
      </PageContainer>
    );
  }

  if (status === "failed") {
    return (
      <PageContainer title="Processing">
        <ErrorState
          title="Analysis failed"
          description="Something went wrong while analyzing this resume."
          action={
            <div className="flex gap-2">
              <Button asChild>
                <Link to={ROUTES.RESUME_UPLOAD}>Upload again</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:support@careerlens.app">Contact support</a>
              </Button>
            </div>
          }
        />
      </PageContainer>
    );
  }

  const stepIndex = mapStatusToStepIndex(status ?? "pending", progress);

  return (
    <PageContainer title="Analyzing resume" description="This usually takes under a minute.">
      <div className="mx-auto max-w-2xl space-y-8">
        <ProcessingStepper currentIndex={stepIndex} />
        <UploadProgress progress={progress} label="Overall progress" />
        <p className="text-center text-sm text-muted-foreground">
          Status: <span className="capitalize text-foreground">{status ?? "loading"}</span>
        </p>
      </div>
    </PageContainer>
  );
}
