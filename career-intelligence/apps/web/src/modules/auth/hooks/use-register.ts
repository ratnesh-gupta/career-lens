import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { RegisterInput } from "@careerlens/shared-types";

import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/stores/auth.store";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unable to create account. Please try again.";
}

export function useRegister() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: RegisterInput) {
    setError(null);
    setIsSubmitting(true);
    try {
      await register(values);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return { onSubmit, error, isSubmitting };
}
