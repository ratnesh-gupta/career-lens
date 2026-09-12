import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Gauge,
  Settings,
  Sparkles,
  History,
  CreditCard,
} from "lucide-react";

import { ROUTES } from "@/config/routes";
import { useUiStore } from "@/stores/ui.store";
import { cn } from "@/utils/cn";

const PRIMARY_NAV = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Career Profile", href: ROUTES.PROFILE, icon: User },
  { label: "Resumes", href: ROUTES.RESUMES, icon: FileText },
  { label: "Career Score", href: ROUTES.SCORE, icon: Gauge },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
] as const;

const R1B_NAV = [
  { label: "Optimization", href: ROUTES.OPTIMIZATION, icon: Sparkles },
  { label: "Versions", href: ROUTES.VERSIONS, icon: History },
  { label: "Billing", href: ROUTES.BILLING, icon: CreditCard },
] as const;

export function Sidebar() {
  const location = useLocation();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  function isActive(href: string) {
    if (href === ROUTES.DASHBOARD) return location.pathname === href;
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  }

  const navClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link
          to={ROUTES.DASHBOARD}
          className="text-lg font-semibold tracking-tight text-foreground"
          onClick={() => setMobileNavOpen(false)}
        >
          CareerLens
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="App">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={navClass(active)}
              aria-current={active ? "page" : undefined}
              onClick={() => setMobileNavOpen(false)}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Coming soon
        </p>
        {R1B_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(navClass(false), "opacity-70")}
              onClick={() => setMobileNavOpen(false)}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Soon
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden border-r border-border bg-surface md:flex md:flex-col",
          sidebarOpen ? "md:w-56" : "md:w-0 md:overflow-hidden",
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-surface shadow-lg">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}

export default Sidebar;
