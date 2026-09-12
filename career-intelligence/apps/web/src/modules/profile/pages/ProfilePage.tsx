import { Link } from "react-router-dom";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/modules/auth/hooks/use-auth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageContainer
      title="Career profile"
      description="Your public-facing career identity."
      actions={
        <Button asChild size="sm" variant="outline">
          <Link to={ROUTES.PROFILE_EDIT}>Edit</Link>
        </Button>
      }
    >
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">{user?.displayName ?? "Your profile"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{user?.email}</p>
          <p className="capitalize">Plan: {user?.role ?? "free"}</p>
          <p className="pt-2 text-xs">
            Full profile editor ships with resume intelligence in a later step.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
