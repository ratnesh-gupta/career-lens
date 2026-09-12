import { SeoHead } from "@/components/seo/head";

import { FooterSection } from "../sections/footer-section";
import { NavbarSection } from "../sections/navbar-section";

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title="About — CareerLens"
        description="CareerLens helps you understand how the job market sees you — with a free Career Score and clear next steps."
        canonicalPath="/about"
      />
      <div className="min-h-screen bg-background">
        <NavbarSection />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">About</h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            CareerLens is a personal career intelligence platform. We answer one question clearly:
            how does the job market see you?
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Upload your resume, get a Career Score with strengths and gaps, and leave with a plan —
            not another vague tip list.
          </p>
        </main>
        <FooterSection />
      </div>
    </>
  );
}
