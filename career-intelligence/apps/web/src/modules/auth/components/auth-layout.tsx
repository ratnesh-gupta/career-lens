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
      {/* Marketing panel */}
      <aside className="relative hidden flex-col justify-between bg-primary px-10 py-12 text-primary-foreground lg:flex">
        <Link to={ROUTES.HOME} className="text-xl font-semibold tracking-tight">
          CareerLens
        </Link>
        <div>
          <p className="text-3xl font-bold leading-tight tracking-tight">
            How does the job market see you?
          </p>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/80">
            Upload your resume. Get a Career Score. Know exactly what to improve.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">No credit card. Takes 60 seconds.</p>
      </aside>

      {/* Form panel */}
      <div className={cn("flex flex-col justify-center px-6 py-12 sm:px-10", className)}>
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to={ROUTES.HOME} className="text-lg font-semibold text-foreground">
              CareerLens
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
