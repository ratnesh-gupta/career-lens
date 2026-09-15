import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/utils/cn";

const STORAGE_KEY = "careerlens_cookie_consent";

export type CookieConsentValue = "accepted" | "essential";

function readConsent(): CookieConsentValue | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "accepted" || raw === "essential") return raw;
  } catch {
    // ignore (private mode / blocked storage)
  }
  return null;
}

function writeConsent(value: CookieConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore
  }
}

/**
 * Fixed bottom banner. Essential cookies always run; "Accept all" opts into
 * analytics/error-monitoring style cookies. Preference is stored in localStorage.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  const dismiss = useCallback((value: CookieConsentValue) => {
    writeConsent(value);
    setVisible(false);
    // Optional: dispatch for analytics bootstrap to respect choice later
    window.dispatchEvent(new CustomEvent("careerlens:cookie-consent", { detail: value }));
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-sm",
        "sm:p-5",
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium text-foreground">We use cookies</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Essential cookies keep you signed in and the product secure. We also use limited
            analytics and error monitoring. See our{" "}
            <a
              href={ROUTES.COOKIES}
              className="text-primary underline underline-offset-2 hover:text-primary/90"
            >
              Cookie Policy
            </a>{" "}
            for details.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => dismiss("essential")}>
            Essential only
          </Button>
          <Button type="button" size="sm" onClick={() => dismiss("accepted")}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
