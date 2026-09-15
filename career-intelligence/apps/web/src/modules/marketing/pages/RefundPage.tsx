import { Link } from "react-router-dom";

import { SeoHead } from "@/components/seo/head";
import { ROUTES } from "@/config/routes";

import { FooterSection } from "../sections/footer-section";
import { NavbarSection } from "../sections/navbar-section";

export default function RefundPage() {
  return (
    <>
      <SeoHead
        title="Refund & Cancellation — CareerLens"
        description="Refund and cancellation policy for CareerLens Pro subscriptions."
        canonicalPath="/refund"
      />
      <div className="min-h-screen bg-background">
        <NavbarSection />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            This policy applies to paid CareerLens plans (e.g. Pro) once billing is live. Free Career
            Score access has no charge and no refund applies. Formal legal wording will be finalized
            before public paid launch.
          </p>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Subscriptions</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Pro and other paid plans are billed in advance for the selected billing period
                (monthly or annual, as shown at checkout).
              </li>
              <li>
                Payments are processed by our payment provider (Razorpay). Currency and tax may vary
                by country as shown on the pricing page.
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Cancellation</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                You may cancel a subscription at any time from account / billing settings. Cancellation
                stops future renewals.
              </li>
              <li>
                After cancellation, you retain access to paid features until the end of the current
                paid period.
              </li>
              <li>We do not automatically refund the remaining unused portion of a period on cancel.</li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Refunds</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Cooling-off</span> — If you purchase Pro
                and have not meaningfully used paid features, you may request a full refund within 7
                days of the charge.
              </li>
              <li>
                <span className="font-medium text-foreground">Duplicate or erroneous charges</span> —
                Contact support; we will investigate and refund valid duplicates.
              </li>
              <li>
                <span className="font-medium text-foreground">Service outage</span> — Extended paid
                feature outages may qualify for a pro-rata credit or refund at our discretion.
              </li>
              <li>
                Refunds, when approved, are returned to the original payment method and may take
                several business days depending on your bank or card issuer.
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">How to request</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use the{" "}
              <Link to={ROUTES.CONTACT} className="text-primary underline underline-offset-2">
                Contact / Support
              </Link>{" "}
              page or in-app billing support with your account email and transaction reference. We aim
              to respond within a few business days.
            </p>
          </section>

          <section className="mt-10 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Related</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <Link to={ROUTES.TERMS} className="text-primary underline underline-offset-2">
                Terms of Service
              </Link>
              {" · "}
              <Link to={ROUTES.PRICING} className="text-primary underline underline-offset-2">
                Pricing
              </Link>
              {" · "}
              <Link to={ROUTES.CONTACT} className="text-primary underline underline-offset-2">
                Contact
              </Link>
            </p>
          </section>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
