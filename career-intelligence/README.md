# CareerLens — Personal Career Intelligence Platform

> **How does the job market see you?**

Upload a resume → get a **Career Score** → see strengths, gaps, and what to improve next.

---

## Current status (2026-09-12)

| Area | Status |
|------|--------|
| **Frontend R1a (Steps 1–6)** | ✅ Complete on `main` |
| **Backend (Laravel modular monolith)** | ❌ Not started |
| **Production deploy** | ❌ Not started |
| **R1b (optimization, versions, billing)** | Placeholders only |

### What’s done

| Step | Scope | Status |
|------|--------|--------|
| **1** | Monorepo, packages, tooling | ✅ |
| **2** | Design tokens, shadcn/ui, shared types | ✅ |
| **3** | App shell, router, guards, MSW, providers | ✅ |
| **4** | Marketing landing (all sections + SEO) | ✅ |
| **5** | Auth flows, AppShell, dashboard, settings | ✅ |
| **6** | Resume upload → processing → analysis, Career Score, share, public score | ✅ |

### Happy path (MSW mocks)

1. Landing `/`
2. Register `/register` (any valid email + password ≥ 8 chars)
3. Dashboard with score / resume cards
4. Upload PDF `/resumes/upload`
5. Processing poll → analysis
6. Career Score `/score` + share link
7. Public card `/score/shr_abc123xyz`

---

## Quick start

```bash
# Prerequisites: Node ≥ 20, pnpm ≥ 9
cd career-intelligence
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @careerlens/web dev
```

Open **http://localhost:5173**

MSW mocks the API when `VITE_ENABLE_MSW=true` (default in `.env.example`).

### Useful commands

```bash
pnpm --filter @careerlens/web dev          # Vite + MSW
pnpm --filter @careerlens/web build        # Production build
pnpm --filter @careerlens/web typecheck
pnpm --filter @careerlens/web test         # Vitest
pnpm --filter @careerlens/web lint
```

Or from monorepo root: `make dev` / `make test` / `make typecheck` (if Makefile targets exist).

---

## Environment (`apps/web/.env.local`)

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | API base (default `http://localhost:8000/api/v1`) |
| `VITE_ENABLE_MSW` | Mock API in browser (`true` for local UI work) |
| `VITE_APP_URL` | Canonical URL for SEO + share links |
| `VITE_SENTRY_DSN` | Optional error tracking |
| `VITE_POSTHOG_KEY` | Optional product analytics |

---

## Repository layout

```
career-intelligence/
├── apps/web/                    # React 18 + Vite frontend (R1a complete)
│   └── src/
│       ├── app/                 # Router, providers, bootstrap
│       ├── components/          # UI, layout, auth guards, feedback
│       ├── modules/
│       │   ├── marketing/       # Landing + content
│       │   ├── auth/            # Login, register, password flows
│       │   ├── dashboard/
│       │   ├── resume/          # Upload → process → analysis
│       │   ├── career-score/    # Score, breakdown, public share
│       │   ├── settings/
│       │   └── profile/
│       ├── mocks/               # MSW handlers + fixtures
│       ├── services/            # HTTP client + endpoints
│       └── stores/              # Zustand (auth, UI, flags)
├── packages/
│   ├── shared-types/            # API / domain TypeScript contracts
│   └── shared-config/           # Shared tooling config
└── docs/                        # Product & engineering docs
```

Root of the GitHub repo may also contain a Figma Make scaffold; **the product app lives under `career-intelligence/`**.

---

## Stack (locked for R1a)

- **UI:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide
- **Data:** TanStack Query, Zustand, Axios
- **Forms:** React Hook Form + Zod
- **Routing:** React Router v6 (lazy routes + guards)
- **Mocks:** MSW
- **Observability:** Sentry + PostHog (optional keys)
- **Tests:** Vitest + Testing Library; Playwright script present

---

## Product scope

### R1a (shipped in frontend)

- Marketing site + SEO
- Auth (register, login, forgot/reset, verify)
- Resume PDF upload (≤ 5 MB, text PDF preferred)
- Processing stepper + analysis summary
- Career Score, breakdown, strengths / gaps / recommendations
- Share link + public score page
- Settings (account / privacy UI)
- R1b routes gated as “Coming soon”

### R1b (not built)

- Resume optimization against target roles
- Version history, export packs
- Billing / Pro entitlements

### Backend (next major track)

Laravel modular monolith: auth, resume pipeline, scoring, share tokens, real storage.

---

## Design system notes

- **Primary:** indigo (`#4f46e5`)
- **Score accent:** amber / traffic-light score tones
- **Surfaces:** warm stone neutrals (`#fafaf9` background)
- **Type:** Inter + JetBrains Mono
- Tokens: `apps/web/src/styles/tokens.css`

---

## Known gaps

- Backend API not implemented — UI runs entirely on MSW locally
- Playwright e2e scenarios not fully filled in
- Lighthouse should be measured on a production build before launch
- Profile editor is intentionally thin until more domain data exists
- Share image export (`html-to-image`) not added; share is URL + Web Share API

---

## License / ownership

Private product repository — CareerLens.
