import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { SeoHead } from "@/components/seo/head";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

import { AuthLayout } from "../components/auth-layout";
import { authApi } from "../services/auth-api";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await authApi.verifyEmail(token);
        if (!cancelled) setStatus("success");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <>
      <SeoHead title="Verify email — CareerLens" description="Confirm your CareerLens email." noIndex />
      <AuthLayout title="Verify your email">
        {status === "loading" ? (
          <p className="text-sm text-muted-foreground">Confirming your email…</p>
        ) : null}
        {status === "success" ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>Email verified. You're all set.</AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link to={ROUTES.DASHBOARD}>Go to dashboard</Link>
            </Button>
          </div>
        ) : null}
        {status === "error" ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                This verification link is invalid or has expired.
              </AlertDescription>
            </Alert>
            <Button asChild variant="outline" className="w-full">
              <Link to={ROUTES.LOGIN}>Back to sign in</Link>
            </Button>
          </div>
        ) : null}
      </AuthLayout>
    </>
  );
}
