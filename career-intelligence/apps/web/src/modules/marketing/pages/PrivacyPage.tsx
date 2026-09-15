import { Link } from "react-router-dom";

import { SeoHead } from "@/components/seo/head";
import { ROUTES } from "@/config/routes";

import { FooterSection } from "../sections/footer-section";
import { NavbarSection } from "../sections/navbar-section";

export default function PrivacyPage() {
  return (
    <>
      <SeoHead
        title="Privacy — CareerLens"
        description="How CareerLens handles your resume and personal data."
        canonicalPath="/privacy"
      />
      <div className="min-h-screen bg-background">
        <NavbarSection />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            Placeholder policy for early access. Full legal copy will be published before public
            launch. The summary below reflects how CareerLens currently handles data.
          </p>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Account details (email, name) when you register.</li>
              <li>Resume files you upload, used to generate your Career Score and analysis.</li>
              <li>Usage and diagnostic data (e.g. analytics, error reports) to run and improve the product.</li>
              <li>Billing-related data when you subscribe (processed by our payment provider).</li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">How we use it</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Your resume is private by default.</li>
              <li>We process uploads to generate your Career Score, strengths, gaps, and recommendations.</li>
              <li>Public score or profile sharing is optional and controlled by you.</li>
              <li>We do not sell your personal data.</li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use essential cookies for sign-in and security, plus limited analytics and error
              monitoring. See our{" "}
              <Link to={ROUTES.COOKIES} className="text-primary underline underline-offset-2">
                Cookie Policy
              </Link>{" "}
              for details.
            </p>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Your rights</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>You may request access, correction, or deletion of your account and associated data.</li>
              <li>You can stop public sharing at any time from your settings.</li>
              <li>Contact us through the channels we publish on the site for privacy requests.</li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Related</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <Link to={ROUTES.TERMS} className="text-primary underline underline-offset-2">
                Terms of Service
              </Link>
              {" · "}
              <Link to={ROUTES.COOKIES} className="text-primary underline underline-offset-2">
                Cookie Policy
              </Link>
            </p>
          </section>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
