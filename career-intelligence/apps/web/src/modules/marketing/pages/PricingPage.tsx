import { Link } from "react-router-dom";

import { SeoHead } from "@/components/seo/head";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

import { FooterSection } from "../sections/footer-section";
import { NavbarSection } from "../sections/navbar-section";

export default function PricingPage() {
  return (
    <>
      <SeoHead
        title="Pricing — CareerLens"
        description="Career Score is free. Pro tools for target-role alignment and resume optimization coming soon."
        canonicalPath="/pricing"
      />
      <div className="min-h-screen bg-background">
        <NavbarSection />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple pricing
          </h1>
          <p className="mt-4 text-muted-foreground">
            Your Career Score is free. Paid optimization and target-role tools ship in a later
            release.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <article className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold text-foreground">Free</h2>
              <p className="mt-1 text-3xl font-bold text-foreground">$0</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Career Score</li>
                <li>Resume analysis</li>
                <li>Strengths & gaps</li>
                <li>Optional public score card</li>
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link to={ROUTES.REGISTER}>Get started</Link>
              </Button>
            </article>
            <article className="rounded-xl border border-border bg-surface p-6 opacity-90">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Pro</h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                  Coming soon
                </span>
              </div>
              <p className="mt-1 text-3xl font-bold text-foreground">—</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Target role alignment</li>
                <li>AI resume optimization</li>
                <li>Version history & export</li>
              </ul>
              <Button variant="outline" className="mt-6 w-full" disabled>
                Notify me
              </Button>
            </article>
          </div>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
