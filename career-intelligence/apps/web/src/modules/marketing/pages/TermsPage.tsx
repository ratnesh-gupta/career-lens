import { SeoHead } from "@/components/seo/head";

import { FooterSection } from "../sections/footer-section";
import { NavbarSection } from "../sections/navbar-section";

export default function TermsPage() {
  return (
    <>
      <SeoHead
        title="Terms — CareerLens"
        description="Terms of service for CareerLens."
        canonicalPath="/terms"
      />
      <div className="min-h-screen bg-background">
        <NavbarSection />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-sm text-muted-foreground">
            Placeholder terms for R1a. Full legal copy will be published before public launch.
          </p>
          <ul className="mt-8 list-disc space-y-3 pl-5 text-muted-foreground">
            <li>CareerLens is provided as-is during early access.</li>
            <li>Scores are informational and not a guarantee of hiring outcomes.</li>
            <li>You retain ownership of your resume content.</li>
            <li>Abuse or misuse of the service may result in account suspension.</li>
          </ul>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
