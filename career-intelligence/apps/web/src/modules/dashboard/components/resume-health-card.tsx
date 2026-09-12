import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import type { Resume } from "@careerlens/shared-types";

interface ResumeHealthCardProps {
  resume: Resume | null;
}

export function ResumeHealthCard({ resume }: ResumeHealthCardProps) {
  if (!resume) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resume health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
          <Button asChild className="mt-4" size="sm" variant="outline">
            <Link to={ROUTES.RESUME_UPLOAD}>Upload PDF</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const ats = resume.analysis?.atsScore;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Resume health</CardTitle>
        <Link to={ROUTES.RESUMES} className="text-xs text-primary hover:underline">
          Manage
        </Link>
      </CardHeader>
      <CardContent>
        <p className="truncate text-sm font-medium text-foreground">{resume.fileName}</p>
        <p className="mt-1 text-xs capitalize text-muted-foreground">Status: {resume.status}</p>
        {typeof ats === "number" ? (
          <p className="mt-3 text-sm text-muted-foreground">
            ATS estimate: <span className="font-semibold text-foreground">{ats}</span>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
