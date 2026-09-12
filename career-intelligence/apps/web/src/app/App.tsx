import { RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "./error-boundary";
import { Providers } from "./providers";
import { router } from "./router";

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  );
}
