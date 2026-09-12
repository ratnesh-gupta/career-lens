import { flags } from "@/config/feature-flags";

export async function bootstrap(): Promise<void> {
  if (flags.MSW_ENABLED) {
    const { worker } = await import("../mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: "/mockServiceWorker.js" },
    });
    console.warn("[MSW] Mock API enabled — using local fixtures");
  }
}
