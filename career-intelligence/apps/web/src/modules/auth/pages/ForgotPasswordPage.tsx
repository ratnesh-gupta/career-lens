import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

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
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth.schemas";
import { authApi } from "../services/auth-api";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setError(null);
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(values);
      setSent(true);
    } catch {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SeoHead title="Forgot password — CareerLens" description="Reset your CareerLens password." noIndex />
      <AuthLayout title="Reset your password" subtitle="We'll email you a link to choose a new one.">
        {sent ? (
          <Alert>
            <AlertDescription>
              If an account exists for that email, a reset link is on its way. Check your inbox.
            </AlertDescription>
          </Alert>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          </Form>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
