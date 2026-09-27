import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import { SeoHead } from "@/components/seo/head";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { detectCountryCode, formatMoney } from "@/modules/billing/lib/format-money";
import { billingApi } from "@/modules/billing/services/billing-api";

import { FooterSection } from "../sections/footer-section";
import { NavbarSection } from "../sections/navbar-section";

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const [interval, setInterval] = useState<"month" | "year">("month");
  const country = useMemo(() => detectCountryCode(), []);

  const plansQuery = useQuery({
    queryKey: ["billing", "plans", country, interval],
    queryFn: () => billingApi.plans(country, interval),
  });

  const free = plansQuery.data?.items.find((p) => p.code === "free");
  const pro = plansQuery.data?.items.find((p) => p.code === "pro");
  const proPrice = pro?.price
    ? formatMoney(pro.price.amountMinor, pro.price.currency)
    : null;

  return (
    <>
      <SeoHead
        title="Pricing — CareerLens"
        description="Free Career Score. Pro unlocks target-role optimization, higher quotas, and exports."
        canonicalPath="/pricing"
      />
      <div className="min-h-screen bg-background">
        <NavbarSection />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple pricing
          </h1>
          <p className="mt-4 text-muted-foreground">
            Career Score stays free. Pro adds optimization quotas and exports — priced for your
            region when available.
          </p>

          <div className="mt-6 flex gap-2">
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <article className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-foreground">{free?.name ?? "Free"}</h2>
              <p className="mt-1 text-3xl font-bold text-foreground">$0</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {(free?.entitlements ?? []).slice(0, 4).map((e) => (
                  <li key={e.featureCode}>
                    {e.featureCode.replaceAll("_", " ")}
                    {e.unlimited ? ": unlimited" : e.limit != null ? `: ${e.limit}` : ""}
                  </li>
                ))}
                {(!free?.entitlements || free.entitlements.length === 0) && (
                  <>
                    <li>Career Score</li>
                    <li>Resume analysis</li>
                    <li>Strengths & gaps</li>
                  </>
                )}
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER}>
                  {isAuthenticated ? "Go to dashboard" : "Get started"}
                </Link>
              </Button>
            </article>

            <article className="rounded-xl border border-primary/30 bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">{pro?.name ?? "Pro"}</h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                  Paid
                </span>
              </div>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {proPrice ?? (plansQuery.isLoading ? "…" : "—")}
                {proPrice && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / {interval === "year" ? "year" : "month"}
                  </span>
                )}
              </p>
              {country !== "*" && (
                <p className="mt-1 text-xs text-muted-foreground">Shown for region {country}</p>
              )}
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {(pro?.entitlements ?? []).slice(0, 5).map((e) => (
                  <li key={e.featureCode}>
                    {e.featureCode.replaceAll("_", " ")}
                    {e.unlimited ? ": unlimited" : e.limit != null ? `: ${e.limit}` : ""}
                  </li>
                ))}
                {(!pro?.entitlements || pro.entitlements.length === 0) && (
                  <>
                    <li>Target role alignment</li>
                    <li>AI resume optimization</li>
                    <li>Version history & export</li>
                  </>
                )}
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link to={isAuthenticated ? ROUTES.BILLING : ROUTES.REGISTER}>
                  {isAuthenticated ? "Upgrade in billing" : "Create account to upgrade"}
                </Link>
              </Button>
            </article>
          </div>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
