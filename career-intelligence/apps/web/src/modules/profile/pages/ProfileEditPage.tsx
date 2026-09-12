import { Link } from "react-router-dom";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export default function ProfileEditPage() {
  return (
    <PageContainer title="Edit profile" description="Update your career profile details.">
      <p className="text-sm text-muted-foreground">
        Profile editing UI will expand with experience, education, and skills in a later step.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link to={ROUTES.PROFILE}>Back to profile</Link>
      </Button>
    </PageContainer>
  );
}
