import { SeoHead } from "@/components/seo/head";

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
          <p className="mt-6 text-sm text-muted-foreground">
            Placeholder policy for R1a. Full legal copy will be published before public launch.
          </p>
          <ul className="mt-8 list-disc space-y-3 pl-5 text-muted-foreground">
            <li>Your resume is private by default.</li>
            <li>We process uploads to generate your Career Score and analysis.</li>
            <li>Public score sharing is optional and controlled by you.</li>
            <li>You may request deletion of your account and associated data.</li>
          </ul>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
