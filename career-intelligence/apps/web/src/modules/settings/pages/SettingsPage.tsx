import { NavLink, Outlet } from "react-router-dom";

import { PageContainer } from "@/components/layout/page-container";
import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

const TABS = [
  { label: "Account", href: ROUTES.SETTINGS_ACCOUNT },
  { label: "Privacy", href: ROUTES.SETTINGS_PRIVACY },
] as const;

export default function SettingsPage() {
  return (
    <PageContainer title="Settings" description="Manage your account and privacy preferences.">
      <div className="mb-6 flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <NavLink
            key={tab.href}
            to={tab.href}
            className={({ isActive }) =>
              cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </PageContainer>
  );
}
