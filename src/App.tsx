const SECTIONS = [
  {
    label: "app",
    items: [
      { file: "src/app/App.tsx", note: "Root: ErrorBoundary → Providers → RouterProvider" },
      { file: "src/app/router.tsx", note: "Data router — lazy R1a pages + R1b placeholders" },
      { file: "src/app/providers.tsx", note: "QueryClientProvider + Toaster + devtools" },
      { file: "src/app/error-boundary.tsx", note: "Class component, Sentry-ready" },
      { file: "src/app/bootstrap.ts", note: "MSW init (dev only)" },
    ],
  },
  {
    label: "styles",
    items: [
      { file: "src/styles/tokens.css", note: "All CSS vars · Google Fonts import" },
      { file: "src/styles/globals.css", note: "@tailwind directives + base layer" },
      { file: "tailwind.config.ts", note: "Token bridge + shadcn palette + animations" },
    ],
  },
  {
    label: "components/ui (23 shadcn primitives)",
    items: [
      { file: "button · input · textarea · select", note: "" },
      { file: "checkbox · radio-group · label · form", note: "" },
      { file: "dialog · sheet · dropdown-menu · popover", note: "" },
      { file: "tooltip · card · badge · avatar", note: "" },
      { file: "tabs · accordion · progress · skeleton", note: "" },
      { file: "separator · toast · toaster · alert", note: "" },
    ],
  },
  {
    label: "services",
    items: [
      { file: "src/services/api-client.ts", note: "Typed http.get/post/put/patch/delete wrappers" },
      { file: "src/services/interceptors.ts", note: "Bearer auth + 401 → /login redirect" },
      { file: "src/services/query-client.ts", note: "TanStack Query — stale times, retry rules" },
      { file: "src/services/endpoints.ts", note: "All EP.* constants — never hardcode paths" },
    ],
  },
  {
    label: "mocks (MSW)",
    items: [
      { file: "src/mocks/browser.ts", note: "setupWorker for browser" },
      { file: "src/mocks/server.ts", note: "setupServer for Vitest" },
      { file: "src/mocks/handlers/auth|resume|score", note: "Realistic delay + fixture data" },
      { file: "src/mocks/fixtures/index.ts", note: "mockUser · mockResume · mockCareerScore" },
    ],
  },
  {
    label: "config · stores · utils",
    items: [
      { file: "src/config/env.ts", note: "Zod-validated import.meta.env" },
      { file: "src/config/routes.ts", note: "ROUTES.* typed path constants" },
      { file: "src/config/feature-flags.ts", note: "R1b flags all false" },
      { file: "src/stores/auth.store.ts", note: "Zustand + persist" },
      { file: "src/utils/cn.ts", note: "clsx + tailwind-merge" },
      { file: "src/utils/format.ts", note: "date · number · currency · score" },
      { file: "src/utils/validation.ts", note: "email · password · resume file" },
      { file: "src/utils/analytics.ts", note: "PostHog wrappers + EVENTS.*" },
    ],
  },
  {
    label: "modules (9 — each has components/hooks/schemas/services/pages)",
    items: [
      { file: "marketing · auth · profile · resume", note: "R1a — stub pages ready" },
      { file: "career-score · dashboard", note: "R1a — stub pages ready" },
      { file: "optimization · billing · settings", note: "R1b — placeholder routes" },
    ],
  },
];

const CHECKS = [
  { label: "tsc --noEmit", ok: true, note: "0 errors" },
  { label: "vite build", ok: true, note: "1908 modules · 3.5s" },
  { label: "pnpm --filter web dev", ok: true, note: "ready on :5173" },
  { label: "shadcn/ui (23 primitives)", ok: true, note: "" },
  { label: "MSW handlers (auth · resume · score)", ok: true, note: "" },
  { label: "Step 3: pages & auth flow", ok: false, note: "" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col items-center justify-start py-12 px-6">
      <div className="w-full max-w-5xl space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs font-mono text-sky-500 uppercase tracking-widest mb-2">CareerLens · Step 2 of 6</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">apps/web Structure & Design Tokens</h1>
          <p className="mt-2 text-slate-400 text-sm">
            Vite · React 18 · TypeScript · Tailwind · shadcn/ui · TanStack Query · Zustand · MSW
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* Sections */}
          <div className="space-y-3">
            {SECTIONS.map((section) => (
              <div key={section.label} className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-[#1c2128] border-b border-[#30363d]">
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">{section.label}</span>
                </div>
                <div className="p-3 space-y-1">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-baseline gap-3 py-0.5">
                      <span className="font-mono text-[12px] text-slate-300 shrink-0">📄 {item.file}</span>
                      {item.note && (
                        <span className="text-[11px] text-slate-500 truncate">{item.note}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">

            {/* Checks */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Verification</p>
              <ul className="space-y-2">
                {CHECKS.map((c) => (
                  <li key={c.label} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] flex-shrink-0 ${c.ok ? "bg-emerald-500/20 text-emerald-400" : "bg-[#21262d] text-slate-600 border border-[#30363d]"}`}>
                      {c.ok ? "✓" : "○"}
                    </span>
                    <div>
                      <span className={c.ok ? "text-slate-300" : "text-slate-600"}>{c.label}</span>
                      {c.note && <span className="ml-2 text-slate-500 text-[11px]">{c.note}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Design tokens */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Design Tokens</p>
              <div className="space-y-2">
                {[
                  { label: "Primary", hex: "#4F46E5", cls: "bg-[#4F46E5]" },
                  { label: "Accent", hex: "#F59E0B", cls: "bg-[#F59E0B]" },
                  { label: "Success", hex: "#16A34A", cls: "bg-[#16A34A]" },
                  { label: "Danger", hex: "#DC2626", cls: "bg-[#DC2626]" },
                  { label: "Surface", hex: "#FFFFFF", cls: "bg-white border border-[#30363d]" },
                  { label: "Background", hex: "#FAFAF9", cls: "bg-[#FAFAF9] border border-[#30363d]" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded flex-shrink-0 ${t.cls}`} />
                    <span className="text-[12px] text-slate-300">{t.label}</span>
                    <span className="text-[11px] text-slate-500 font-mono ml-auto">{t.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commands */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Run it</p>
              <div className="space-y-1.5 font-mono text-[12px]">
                {[
                  "cd career-intelligence",
                  "pnpm --filter @careerlens/web dev",
                  "# or:",
                  "make dev",
                ].map((cmd, i) => (
                  <div key={i} className={`px-3 py-1.5 rounded ${cmd.startsWith("#") ? "text-slate-500" : "bg-[#0d1117] text-emerald-400"}`}>
                    {!cmd.startsWith("#") && <span className="text-slate-600 mr-2">$</span>}
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
