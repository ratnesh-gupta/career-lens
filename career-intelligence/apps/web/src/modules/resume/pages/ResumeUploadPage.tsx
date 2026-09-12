import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageContainer } from "@/components/layout/page-container";
import { ROUTES } from "@/config/routes";
import { captureEvent, EVENTS } from "@/utils/analytics";
import { formatFileSize } from "@/utils/format";

import { UploadDropzone } from "../components/upload-dropzone";
import { UploadProgress } from "../components/upload-progress";
import { resumeApi } from "../services/resume-api";

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function startUpload(selected: File) {
    setFile(selected);
    setError(null);
    setUploading(true);
    setProgress(10);
    captureEvent(EVENTS.RESUME_UPLOAD_STARTED, { fileName: selected.name, size: selected.size });

    try {
      // Simulated client progress while requesting upload URL + confirm (MSW)
      setProgress(35);
      const { resumeId } = await resumeApi.requestUploadUrl();
      setProgress(70);
      // In production: PUT file to uploadUrl. MSW skips real storage.
      await resumeApi.confirm(resumeId);
      setProgress(100);
      captureEvent(EVENTS.RESUME_UPLOAD_COMPLETED, { resumeId });
      navigate(ROUTES.RESUME_PROCESSING(resumeId), { replace: true });
    } catch {
      setError("Upload failed. Please try again.");
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <PageContainer
      title="Upload resume"
      description="PDF only · max 5 MB · text-based files work best."
    >
      <div className="mx-auto max-w-xl space-y-6">
        {!uploading ? (
          <UploadDropzone onFileAccepted={(f) => void startUpload(f)} />
        ) : (
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="text-sm font-medium text-foreground">{file?.name}</p>
            {file ? (
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            ) : null}
            <UploadProgress className="mt-4" progress={progress} label="Uploading…" />
          </div>
        )}
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </PageContainer>
  );
}
