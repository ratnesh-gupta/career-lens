import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Target, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/config/routes";
import { useToast } from "@/hooks/use-toast";
import { canUseFeature, useEntitlements } from "@/hooks/use-entitlements";
import type { ApiError, TargetRole } from "@careerlens/shared-types";

import { targetRoleApi } from "../services/target-role-api";

type FormState = {
  roleName: string;
  industry: string;
  seniority: string;
  location: string;
  notes: string;
};

const emptyForm: FormState = {
  roleName: "",
  industry: "",
  seniority: "",
  location: "",
  notes: "",
};

export default function TargetRolePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const entitlementsQuery = useEntitlements();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ["target-roles"],
    queryFn: () => targetRoleApi.list(),
  });

  const canAddMore = canUseFeature(entitlementsQuery.data, "target_roles_max");
  // Cap feature: allowed means under limit for "next" unit in snapshot;
  // also compare count to remaining when available.
  const feature = entitlementsQuery.data?.features.find((f) => f.code === "target_roles_max");
  const atCap =
    feature != null &&
    !feature.unlimited &&
    feature.limit != null &&
    (listQuery.data?.items.length ?? 0) >= feature.limit;

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["target-roles"] });
    void queryClient.invalidateQueries({ queryKey: ["billing", "entitlements"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        roleName: form.roleName.trim(),
        industry: form.industry.trim() || null,
        seniority: form.seniority.trim() || null,
        location: form.location.trim() || null,
        notes: form.notes.trim() || null,
      };
      if (editingId) {
        return targetRoleApi.update(editingId, payload);
      }
      return targetRoleApi.create(payload);
    },
    onSuccess: () => {
      toast({
        title: editingId ? "Target role updated" : "Target role added",
      });
      setForm(emptyForm);
      setEditingId(null);
      invalidate();
    },
    onError: (err: ApiError) => {
      toast({
        title: "Could not save",
        description: err.message ?? "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => targetRoleApi.remove(id),
    onSuccess: () => {
      toast({ title: "Target role removed" });
      if (editingId) {
        setEditingId(null);
        setForm(emptyForm);
      }
      invalidate();
    },
    onError: (err: ApiError) => {
      toast({
        title: "Could not delete",
        description: err.message ?? "Please try again.",
        variant: "destructive",
      });
    },
  });

  const startEdit = (role: TargetRole) => {
    setEditingId(role.id);
    setForm({
      roleName: role.roleName,
      industry: role.industry ?? "",
      seniority: role.seniority ?? "",
      location: role.location ?? "",
      notes: role.notes ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (listQuery.isLoading) {
    return (
      <PageContainer title="Target roles">
        <LoadingState label="Loading target roles…" />
      </PageContainer>
    );
  }

  if (listQuery.isError) {
    return (
      <PageContainer title="Target roles">
        <ErrorState
          action={
            <Button type="button" variant="outline" onClick={() => void listQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const items = listQuery.data?.items ?? [];

  return (
    <PageContainer
      title="Target roles"
      description="Roles you are optimizing toward. Used later for JD analysis and resume rewrite."
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "Edit target role" : "Add target role"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role title</Label>
              <Input
                id="roleName"
                value={form.roleName}
                onChange={(e) => setForm((f) => ({ ...f, roleName: e.target.value }))}
                placeholder="e.g. Senior Product Manager"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={form.industry}
                onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                placeholder="e.g. SaaS"
                maxLength={150}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seniority">Seniority</Label>
              <Input
                id="seniority"
                value={form.seniority}
                onChange={(e) => setForm((f) => ({ ...f, seniority: e.target.value }))}
                placeholder="e.g. Senior"
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Remote / Bengaluru"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Optional context for optimization"
                rows={3}
                maxLength={2000}
              />
            </div>

            {atCap && !editingId && (
              <p className="text-sm text-muted-foreground">
                Free plan limit reached.{" "}
                <Link to={ROUTES.BILLING} className="text-primary underline">
                  Upgrade to Pro
                </Link>{" "}
                to add more target roles.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={
                  !form.roleName.trim() ||
                  saveMutation.isPending ||
                  (atCap && !editingId)
                }
                onClick={() => saveMutation.mutate()}
              >
                <Plus className="mr-2 h-4 w-4" />
                {editingId ? "Save changes" : "Add role"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 lg:col-span-3">
          {items.length === 0 ? (
            <EmptyState
              icon={<Target className="h-10 w-10" aria-hidden />}
              title="No target roles yet"
              description="Add the job titles you want to align your resume with."
            />
          ) : (
            items.map((role) => (
              <Card key={role.id}>
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-foreground">{role.roleName}</p>
                    <p className="text-sm text-muted-foreground">
                      {[role.seniority, role.industry, role.location].filter(Boolean).join(" · ") ||
                        "No extra details"}
                    </p>
                    {role.notes && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">{role.notes}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Edit"
                      onClick={() => startEdit(role)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Delete"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`Remove “${role.roleName}”?`)) {
                          deleteMutation.mutate(role.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {feature && !feature.unlimited && feature.limit != null && (
            <p className="text-xs text-muted-foreground">
              {items.length} / {feature.limit} roles on your plan
              {!canAddMore || atCap ? " · limit reached" : ""}
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
