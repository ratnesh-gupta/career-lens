import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="auth-panel-mesh relative hidden flex-col justify-between overflow-hidden px-10 py-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
          aria-hidden
        />

        <Link to={ROUTES.HOME} className="relative z-10 inline-flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-xs font-bold backdrop-blur">
            CL
          </span>
          <span className="text-lg font-semibold tracking-tight">CareerLens</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            How does the job market see you?
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Upload your resume. Get a Career Score. Know exactly what to improve — before you apply.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              Free Career Score in about 60 seconds
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              ATS-style signals + clear next steps
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              Share a public score card when you want
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/55">No credit card required.</p>
      </aside>

      <div
        className={cn(
          "flex flex-col justify-center bg-background px-6 py-12 sm:px-10",
          className,
        )}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                CL
              </span>
              <span className="text-lg font-semibold text-foreground">CareerLens</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
