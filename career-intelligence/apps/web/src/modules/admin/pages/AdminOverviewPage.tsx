import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

import { adminApi } from "../services/admin-api";

export default function AdminOverviewPage() {
  const query = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => adminApi.overview(),
  });

  if (query.isLoading) {
    return (
      <div className="p-8">
        <LoadingState />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="p-8">
        <ErrorState title="Admin overview unavailable" description="Check that your account is super_admin." />
      </div>
    );
  }

  const d = query.data;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <p className="text-sm text-muted-foreground">Platform ops · R1a</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={ROUTES.ADMIN_RESUMES}>Resumes</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={ROUTES.ADMIN_USERS}>Users</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Users" value={d.users} />
        <Stat label="Profiles" value={d.profiles} />
        <Stat label="Scores" value={d.scores} />
        <Stat label="Resumes" value={d.resumes.total} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground">Resume pipeline</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Pending" value={d.resumes.pending} compact />
          <Stat label="Processing" value={d.resumes.processing} compact />
          <Stat label="Analyzed" value={d.resumes.analyzed} compact />
          <Stat label="Failed" value={d.resumes.failed} compact />
        </div>
        {d.resumes.failed > 0 ? (
          <Button asChild className="mt-6" size="sm">
            <Link to={`${ROUTES.ADMIN_RESUMES}?status=failed`}>Review failed resumes</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  compact,
}: {
  label: string;
  value: number;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "rounded-xl border border-border bg-surface p-4"}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}
