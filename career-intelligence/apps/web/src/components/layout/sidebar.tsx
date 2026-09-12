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
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-border/80 px-4">
        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex items-center gap-2"
          onClick={() => setMobileNavOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
            CL
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">CareerLens</span>
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

        <p className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Coming soon
        </p>
        {R1B_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(navClass(false), "opacity-75")}
              onClick={() => setMobileNavOpen(false)}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
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
      <aside
        className={cn(
          "hidden border-r border-border/80 bg-surface md:flex md:flex-col",
          sidebarOpen ? "md:w-60" : "md:w-0 md:overflow-hidden",
        )}
      >
        {content}
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-border bg-surface shadow-xl">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}

export default Sidebar;
