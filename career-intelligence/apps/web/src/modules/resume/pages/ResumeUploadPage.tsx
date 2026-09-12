import { PageContainer } from "@/components/layout/page-container";

export default function ResumeUploadPage() {
  return (
    <PageContainer title="Upload resume" description="PDF only · max 5 MB · Step 6 will add the dropzone.">
      <p className="text-sm text-muted-foreground">
        Upload dropzone and processing flow are built in Step 6.
      </p>
    </PageContainer>
  );
}
