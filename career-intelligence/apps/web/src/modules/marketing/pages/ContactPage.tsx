import { Link } from "react-router-dom";

import { SeoHead } from "@/components/seo/head";
import { ROUTES } from "@/config/routes";

import { FooterSection } from "../sections/footer-section";
import { NavbarSection } from "../sections/navbar-section";

const SUPPORT_EMAIL = "support@careerlens.app";

export default function ContactPage() {
  return (
    <>
      <SeoHead
        title="Contact & Support — CareerLens"
        description="Get help with CareerLens: account, billing, privacy, and product questions."
        canonicalPath="/contact"
      />
      <div className="min-h-screen bg-background">
        <NavbarSection />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contact & Support
          </h1>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            We are happy to help with account access, Career Score questions, billing, privacy
            requests, and product feedback.
          </p>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Email</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Write to{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-primary underline underline-offset-2"
              >
                {SUPPORT_EMAIL}
              </a>
              . Include your account email and a short description of the issue. For billing or
              refunds, add the payment reference if you have it.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We aim to respond within 1–3 business days during early access.
            </p>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Common topics</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Account & login</span> — password reset,
                email verification, account deletion.
              </li>
              <li>
                <span className="font-medium text-foreground">Resume & score</span> — upload errors,
                processing delays, score questions.
              </li>
              <li>
                <span className="font-medium text-foreground">Billing</span> — Pro plans, invoices,
                cancellation, and refunds (see{" "}
                <Link to={ROUTES.REFUND} className="text-primary underline underline-offset-2">
                  Refund & Cancellation
                </Link>
                ).
              </li>
              <li>
                <span className="font-medium text-foreground">Privacy</span> — data access or deletion
                requests (see{" "}
                <Link to={ROUTES.PRIVACY} className="text-primary underline underline-offset-2">
                  Privacy Policy
                </Link>
                ).
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Self-serve</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <Link to={ROUTES.PRICING} className="text-primary underline underline-offset-2">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="text-primary underline underline-offset-2">
                  About
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TERMS} className="text-primary underline underline-offset-2">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to={ROUTES.COOKIES} className="text-primary underline underline-offset-2">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </section>

          <section className="mt-10 rounded-lg border border-border bg-surface p-4 sm:p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prefer not to email? Sign in and use account settings where available. In-app support
              channels will expand as we grow.
            </p>
          </section>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
