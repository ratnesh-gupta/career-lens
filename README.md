# CareerLens

Personal career intelligence platform — **"How does the job market see you?"**

## Where the product lives

The **R1a web app** is in:

```
career-intelligence/
```

See **[career-intelligence/README.md](./career-intelligence/README.md)** for setup, status, and architecture.

## Status (2026-09-12)

| Track | Status |
|-------|--------|
| Frontend Steps 1–6 (landing → auth → resume → score → share) | ✅ Done |
| Backend Laravel API | Not started |
| R1b (optimization, billing) | Placeholders |

```bash
cd career-intelligence
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @careerlens/web dev
```

Open http://localhost:5173
