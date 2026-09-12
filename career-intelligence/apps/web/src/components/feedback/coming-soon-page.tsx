import { Link } from "react-router-dom";

import { ROUTES } from "@/config/routes";

interface ComingSoonPageProps {
  title?: string;
  description?: string;
}

export function ComingSoonPage({
  title = "Coming soon",
  description = "This feature is part of CareerLens Pro and will be available in a future release.",
}: ComingSoonPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        R1b
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

export default ComingSoonPage;
