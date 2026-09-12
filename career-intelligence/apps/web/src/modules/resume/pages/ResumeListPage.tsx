import { Link } from "react-router-dom";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export default function ResumeListPage() {
  return (
    <PageContainer
      title="Resumes"
      description="Manage uploaded resumes."
      actions={
        <Button asChild size="sm">
          <Link to={ROUTES.RESUME_UPLOAD}>Upload</Link>
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground">
        Full resume list and analysis UI ships in Step 6.
      </p>
    </PageContainer>
  );
}
