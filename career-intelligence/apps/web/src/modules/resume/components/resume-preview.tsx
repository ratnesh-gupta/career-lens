import type { Resume } from "@careerlens/shared-types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatFileSize } from "@/utils/format";

export interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{resume.fileName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>Status: <span className="capitalize text-foreground">{resume.status}</span></p>
        <p>Size: {formatFileSize(resume.fileSize)}</p>
        {resume.pageCount != null ? <p>Pages: {resume.pageCount}</p> : null}
        {resume.wordCount != null ? <p>Words: {resume.wordCount}</p> : null}
        <p>Uploaded: {formatDate(resume.uploadedAt)}</p>
        {resume.isPrimary ? (
          <p className="text-xs font-medium text-primary">Primary resume</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default ResumePreview;
