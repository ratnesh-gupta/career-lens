import { SeoHead } from "@/components/seo/head";

import { AuthLayout } from "../components/auth-layout";
import { LoginForm } from "../components/login-form";

export default function LoginPage() {
  return (
    <>
      <SeoHead title="Sign in — CareerLens" description="Sign in to your CareerLens account." noIndex />
      <AuthLayout title="Welcome back" subtitle="Sign in to view your Career Score and resume insights.">
        <LoginForm />
      </AuthLayout>
    </>
  );
}
