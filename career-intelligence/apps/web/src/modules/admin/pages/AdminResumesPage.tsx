import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

import { adminApi } from "../services/admin-api";

const FILTERS = ["all", "failed", "processing", "pending", "analyzed"] as const;

export default function AdminResumesPage() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "failed";
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "resumes", status],
    queryFn: () => adminApi.resumes(status === "all" ? undefined : status),
  });

  const reprocess = useMutation({
    mutationFn: (id: string) => adminApi.reprocess(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "resumes"] });
      void qc.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link to={ROUTES.ADMIN}>← Admin</Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Resumes</h1>
          <p className="text-sm text-muted-foreground">Reprocess failed or stuck jobs</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={status === f ? "default" : "outline"}
            onClick={() => setParams(f === "failed" ? {} : { status: f })}
          >
            {f}
          </Button>
        ))}
      </div>

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState title="Could not load resumes" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Failure</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {(query.data ?? []).map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{row.fileName}</div>
                    <div className="font-mono text-xs text-muted-foreground">{row.id.slice(0, 8)}…</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{row.status}</span>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs text-muted-foreground">
                    {row.failureReason ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={reprocess.isPending}
                      onClick={() => reprocess.mutate(row.id)}
                    >
                      Reprocess
                    </Button>
                  </td>
                </tr>
              ))}
              {(query.data ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No resumes for this filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
