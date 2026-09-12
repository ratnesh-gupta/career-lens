import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import type { LoginInput } from "@careerlens/shared-types";

import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/stores/auth.store";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unable to sign in. Please try again.";
}

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    ROUTES.DASHBOARD;

  async function onSubmit(values: LoginInput) {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return { onSubmit, error, isSubmitting };
}
