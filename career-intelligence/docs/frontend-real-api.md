# FE → real API (#10)

## Default mode

| Setting | Value |
|---------|--------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` |
| `VITE_ENABLE_MSW` | **`false`** (real Laravel) |
| Token key | `careerlens_access_token` |

## Run stack

```bash
# Infra
cd career-intelligence
docker compose up -d postgres redis minio minio-init

# API
cd apps/api
cp .env.example .env   # if needed
php artisan key:generate
php artisan migrate
php artisan serve      # :8000
php artisan queue:work # optional for resume jobs

# Web
cd ../web
cp .env.example .env.local
# ensure VITE_ENABLE_MSW=false
pnpm dev               # :5173
```

## Auth

Sanctum personal access tokens:

- `POST /auth/register` `{ email, password, displayName }`
- `POST /auth/login` `{ email, password }`
- `GET /auth/me` Bearer
- `POST /auth/logout` Bearer

Register also creates the **Career Profile** (canonical).

## MSW (optional offline)

```env
VITE_ENABLE_MSW=true
```

Only in Vite `DEV`. Production builds never start the worker.

## CORS

API allows `FRONTEND_URL` / localhost:5173 with Bearer tokens (`supports_credentials: false`).
