import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

import { SeoHead } from "@/components/seo/head";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/routes";

import { AuthLayout } from "../components/auth-layout";
import { PasswordStrength } from "../components/password-strength";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth.schemas";
import { authApi } from "../services/auth-api";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = form.watch("password");

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ token, newPassword: values.password });
      setDone(true);
    } catch {
      setError("Unable to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SeoHead title="Set new password — CareerLens" description="Choose a new CareerLens password." noIndex />
      <AuthLayout title="Choose a new password">
        {done ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>Your password has been updated. You can sign in now.</AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link to={ROUTES.LOGIN}>Sign in</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <PasswordStrength password={password} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating…" : "Update password"}
              </Button>
            </form>
          </Form>
        )}
      </AuthLayout>
    </>
  );
}
