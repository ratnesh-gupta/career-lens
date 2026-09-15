import { RouterProvider } from "react-router-dom";

import { CookieConsentBanner } from "@/components/cookies/cookie-consent-banner";

import { ErrorBoundary } from "./error-boundary";
import { Providers } from "./providers";
import { router } from "./router";

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
        <CookieConsentBanner />
      </Providers>
    </ErrorBoundary>
  );
}
