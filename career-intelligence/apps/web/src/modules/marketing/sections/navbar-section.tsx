import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

import { LANDING } from "../content/landing-content";

export interface NavbarSectionProps {
  className?: string;
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-sm">
        CL
      </span>
      <span className="text-base font-semibold tracking-tight">{LANDING.brand.name}</span>
    </span>
  );
}

export function NavbarSection({ className }: NavbarSectionProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border/80 bg-surface/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-surface/75"
          : "bg-transparent",
        className,
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Primary"
      >
        <Link to={ROUTES.HOME} className="transition-opacity hover:opacity-80">
          <BrandMark />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LANDING.nav.links.map((link) => (
            <li key={link.href}>
              {link.href.startsWith("#") ? (
                <a
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to={ROUTES.LOGIN}>Sign in</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full px-4">
            <Link to={ROUTES.REGISTER}>{LANDING.nav.cta}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-muted md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen ? (
        <div className="border-b border-border bg-surface/95 px-4 py-5 backdrop-blur md:hidden">
          <ul className="flex flex-col gap-1">
            {LANDING.nav.links.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("#") ? (
                  <a
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="mt-3 grid gap-2 border-t border-border pt-4">
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button asChild className="w-full rounded-full">
                <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>
                  {LANDING.nav.cta}
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

export default NavbarSection;
