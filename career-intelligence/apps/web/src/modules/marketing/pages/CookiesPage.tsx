import { SeoHead } from "@/components/seo/head";

import { FooterSection } from "../sections/footer-section";
import { NavbarSection } from "../sections/navbar-section";

export default function CookiesPage() {
  return (
    <>
      <SeoHead
        title="Cookies — CareerLens"
        description="How CareerLens uses cookies and similar technologies."
        canonicalPath="/cookies"
      />
      <div className="min-h-screen bg-background">
        <NavbarSection />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            This page explains how CareerLens uses cookies and similar technologies. Full legal
            wording will be finalized before public launch; the summary below reflects current
            product behaviour.
          </p>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">What are cookies?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help
              the site remember preferences, keep you signed in, and understand how the product is
              used.
            </p>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">How we use cookies</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Essential</span> — authentication
                (access token), session continuity, and security. These are required for the app to
                work.
              </li>
              <li>
                <span className="font-medium text-foreground">Preferences</span> — theme and UI
                choices where applicable.
              </li>
              <li>
                <span className="font-medium text-foreground">Analytics</span> — product usage
                (e.g. PostHog) to improve features and reliability. We avoid using analytics for
                advertising profiles.
              </li>
              <li>
                <span className="font-medium text-foreground">Error monitoring</span> — tools such
                as Sentry to diagnose crashes and performance issues.
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Third parties</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Payment processing (Razorpay) and infrastructure providers may set their own cookies
              when you complete checkout or load assets. Those parties process data under their own
              policies.
            </p>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Your choices</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>You can block or delete cookies in your browser settings.</li>
              <li>Blocking essential cookies may prevent sign-in and core features from working.</li>
              <li>
                For account deletion or data requests, use in-app settings or contact us via the
                channels listed on the Privacy Policy page.
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Related</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              See also our{" "}
              <a href="/privacy" className="text-primary underline underline-offset-2">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-primary underline underline-offset-2">
                Terms of Service
              </a>
              .
            </p>
          </section>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
