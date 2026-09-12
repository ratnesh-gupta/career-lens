import { SeoHead } from "@/components/seo/head";

import { AuthLayout } from "../components/auth-layout";
import { RegisterForm } from "../components/register-form";

export default function SignupPage() {
  return (
    <>
      <SeoHead
        title="Create account — CareerLens"
        description="Create a free CareerLens account and get your Career Score."
        noIndex
      />
      <AuthLayout
        title="Get your Career Score"
        subtitle="Free account. No credit card. Takes about a minute."
      >
        <RegisterForm />
      </AuthLayout>
    </>
  );
}
