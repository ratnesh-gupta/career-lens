import { Link } from "react-router-dom";

import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

import { LANDING } from "../content/landing-content";

export interface FooterSectionProps {
  className?: string;
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            {link.href.startsWith("http") ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : link.href.startsWith("#") ? (
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterSection({ className }: FooterSectionProps) {
  const { footer } = LANDING;

  return (
    <footer className={cn("bg-surface", className)}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link to={ROUTES.HOME} className="text-lg font-semibold text-foreground">
              {LANDING.brand.name}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">{LANDING.brand.tagline}</p>
          </div>
          <FooterColumn title={footer.product.title} links={footer.product.links} />
          <FooterColumn title={footer.company.title} links={footer.company.links} />
          <FooterColumn title={footer.legal.title} links={footer.legal.links} />
          <FooterColumn title={footer.social.title} links={footer.social.links} />
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
