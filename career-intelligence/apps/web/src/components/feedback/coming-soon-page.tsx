import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/routes";

interface ComingSoonPageProps {
  title?: string;
  description?: string;
}

export function ComingSoonPage({
  title = "Coming soon",
  description = "This feature is part of CareerLens Pro and will be available in a future release.",
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">R1b</div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>

      {submitted ? (
        <p className="text-sm text-success">Thanks — we'll notify you when this launches.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-2 flex w-full max-w-sm gap-2">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email for launch notification"
          />
          <Button type="submit" size="sm">
            Notify me
          </Button>
        </form>
      )}

      <Link
        to={ROUTES.DASHBOARD}
        className="mt-2 text-sm text-primary hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

export default ComingSoonPage;
