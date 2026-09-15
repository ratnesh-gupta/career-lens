import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, CreditCard, Loader2, Sparkles } from "lucide-react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ROUTES } from "@/config/routes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { billingApi } from "@/modules/billing/services/billing-api";
import type { ApiError } from "@careerlens/shared-types";

import { detectCountryCode, formatMoney } from "../lib/format-money";
import { openRazorpayCheckout } from "../lib/razorpay-checkout";

function usagePercent(used: number | null, limit: number | null, unlimited: boolean): number {
  if (unlimited || limit === null || limit <= 0) return 0;
  if (used === null) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export default function BillingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [country] = useState(() => detectCountryCode());
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [awaitingActivation, setAwaitingActivation] = useState(false);

  const entitlementsQuery = useQuery({
    queryKey: ["billing", "entitlements"],
    queryFn: () => billingApi.entitlements(),
  });

  const subscriptionQuery = useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: () => billingApi.subscription(),
  });

  const plansQuery = useQuery({
    queryKey: ["billing", "plans", country, interval],
    queryFn: () => billingApi.plans(country, interval),
  });

  const planCode = entitlementsQuery.data?.plan.code ?? "free";
  const isPro = planCode === "pro";

  const proPlan = useMemo(
    () => plansQuery.data?.items.find((p) => p.code === "pro"),
    [plansQuery.data],
  );

  const priceLabel = proPlan?.price
    ? formatMoney(proPlan.price.amountMinor, proPlan.price.currency)
    : null;

  const refreshBilling = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["billing", "entitlements"] }),
      queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] }),
    ]);
  }, [queryClient]);

  // After Razorpay success, poll until pro appears (webhook may lag slightly)
  useEffect(() => {
    if (!awaitingActivation) return;

    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      void refreshBilling().then(() => {
        const snap = queryClient.getQueryData<{ plan: { code: string } }>([
          "billing",
          "entitlements",
        ]);
        if (snap?.plan.code === "pro" || attempts >= 12) {
          window.clearInterval(id);
          setAwaitingActivation(false);
          if (snap?.plan.code === "pro") {
            toast({
              title: "Pro activated",
              description: "Your plan is upgraded. Entitlements are live.",
            });
          } else {
            toast({
              title: "Payment received",
              description: "Activation can take a moment. Refresh if limits do not update.",
            });
          }
        }
      });
    }, 1500);

    return () => window.clearInterval(id);
  }, [awaitingActivation, queryClient, refreshBilling, toast]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      setAwaitingActivation(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const checkoutMutation = useMutation({
    mutationFn: () =>
      billingApi.checkout({
        planCode: "pro",
        interval,
        countryCode: country === "*" ? undefined : country,
      }),
    onSuccess: async (payload) => {
      setCheckoutBusy(true);
      try {
        await openRazorpayCheckout({
          checkout: payload,
          prefill: {
            name: user?.displayName ?? undefined,
            email: user?.email ?? undefined,
          },
          onSuccess: () => {
            setAwaitingActivation(true);
            toast({
              title: "Payment successful",
              description: "Confirming your subscription…",
            });
          },
          onDismiss: () => {
            toast({
              title: "Checkout closed",
              description: "No charge was completed.",
              variant: "destructive",
            });
          },
        });
      } catch (err) {
        const message = (err as Error)?.message ?? "Could not open checkout";
        toast({ title: "Checkout failed", description: message, variant: "destructive" });
      } finally {
        setCheckoutBusy(false);
      }
    },
    onError: (err: ApiError) => {
      toast({
        title: "Unable to start checkout",
        description: err.message ?? "Please try again.",
        variant: "destructive",
      });
    },
  });

  const isLoading =
    entitlementsQuery.isLoading || subscriptionQuery.isLoading || plansQuery.isLoading;
  const isError = entitlementsQuery.isError || subscriptionQuery.isError;

  if (isLoading) {
    return (
      <PageContainer title="Billing">
        <LoadingState label="Loading billing…" />
      </PageContainer>
    );
  }

  if (isError || !entitlementsQuery.data) {
    return (
      <PageContainer title="Billing">
        <ErrorState
          action={
            <Button type="button" variant="outline" onClick={() => void refreshBilling()}>
              Retry
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const snapshot = entitlementsQuery.data;
  const subscription = subscriptionQuery.data;

  return (
    <PageContainer
      title="Billing"
      description="Plan, usage, and upgrades."
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to={ROUTES.PRICING}>View pricing</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-primary" aria-hidden />
              Current plan
            </CardTitle>
            <CardDescription>
              {subscription?.provider === "razorpay" ? "Billed via Razorpay" : "Free tier"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold capitalize">{snapshot.plan.name}</span>
              <Badge variant={isPro ? "default" : "secondary"}>{snapshot.plan.code}</Badge>
            </div>
            {subscription?.expiresAt && isPro && (
              <p className="text-sm text-muted-foreground">
                Access through {new Date(subscription.expiresAt).toLocaleDateString()}
              </p>
            )}
            <p className="text-sm text-muted-foreground">{snapshot.plan.description}</p>

            {!isPro && (
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={interval === "month" ? "default" : "outline"}
                    onClick={() => setInterval("month")}
                  >
                    Monthly
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={interval === "year" ? "default" : "outline"}
                    onClick={() => setInterval("year")}
                  >
                    Yearly
                  </Button>
                </div>
                {priceLabel && (
                  <p className="text-sm text-muted-foreground">
                    Pro {interval === "year" ? "yearly" : "monthly"}:{" "}
                    <span className="font-semibold text-foreground">{priceLabel}</span>
                    {country !== "*" && (
                      <span className="text-xs"> · priced for {country}</span>
                    )}
                  </p>
                )}
                <Button
                  type="button"
                  className="w-full"
                  disabled={checkoutBusy || checkoutMutation.isPending || awaitingActivation}
                  onClick={() => checkoutMutation.mutate()}
                >
                  {checkoutBusy || checkoutMutation.isPending || awaitingActivation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {awaitingActivation ? "Activating…" : "Opening checkout…"}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Payments are processed by Razorpay. Pro unlocks after webhook confirmation.
                </p>
              </div>
            )}

            {isPro && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                <Check className="h-4 w-4 text-primary" aria-hidden />
                You are on Pro. Manage renewal in Razorpay if needed.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Usage this period</CardTitle>
            <CardDescription>Period key: {snapshot.periodKey}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {snapshot.features.map((f) => {
              const pct = usagePercent(f.used, f.limit, f.unlimited);
              const label = f.unlimited
                ? "Unlimited"
                : f.limit === null
                  ? "—"
                  : `${f.used ?? 0} / ${f.limit}`;

              return (
                <div key={f.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{f.code.replaceAll("_", " ")}</span>
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                  {!f.unlimited && f.limit !== null && f.limit > 0 && (
                    <Progress value={pct} className="h-2" />
                  )}
                  {!f.allowed && (
                    <p className="text-xs text-destructive">Limit reached — upgrade for more.</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
