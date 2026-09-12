import type { ReactNode } from "react";

import { FooterSection } from "@/modules/marketing/sections/footer-section";
import { NavbarSection } from "@/modules/marketing/sections/navbar-section";

interface MarketingShellProps {
  children: ReactNode;
}

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <NavbarSection />
      <main>{children}</main>
      <FooterSection />
    </div>
  );
}

export default MarketingShell;
