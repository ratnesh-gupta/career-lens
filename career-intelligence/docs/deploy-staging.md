# Staging CI → deploy (#12)

Aligned with baseline §15–16:

```text
feature branch → PR → CI → develop → staging → production
```

Platform: **GitHub Actions**. Runtime: **Docker Compose on EC2** behind **Nginx + Let's Encrypt**.

## CI (`.github/workflows/ci.yml`)

Runs on PR / push to `main` and `develop`:

| Job | Checks |
|-----|--------|
| **openapi** | Validate `docs/api/openapi-v1.yaml` |
| **frontend** | pnpm install, typecheck, lint*, unit tests, production build |
| **backend** | Composer, migrate (sqlite), Pint*, Pest |
| **docker** | Image build smoke (push only) |

\* lint/pint may be `continue-on-error` until style debt is cleared.

## Deploy staging (`.github/workflows/deploy-staging.yml`)

Triggers:

- Push to **`develop`**
- Manual **workflow_dispatch**

### GitHub Environment `staging` secrets

| Secret | Purpose |
|--------|---------|
| `STAGING_HOST` | EC2 public host/IP |
| `STAGING_USER` | SSH user |
| `STAGING_SSH_KEY` | Private key (PEM) |
| `STAGING_DEPLOY_PATH` | Optional, default `/opt/careerlens` |
| `STAGING_API_URL` | Optional health URL, e.g. `https://api.staging.example.com` |

No long-lived AWS keys in the repo — app secrets live on the host in `deploy/.env.staging`.

### One-time server bootstrap

```bash
# On EC2
sudo mkdir -p /opt/careerlens
sudo chown $USER:$USER /opt/careerlens
cd /opt/careerlens
git clone git@github.com:ratnesh-gupta/career-lens.git .
cp career-intelligence/deploy/.env.staging.example career-intelligence/deploy/.env.staging
# fill APP_KEY, DB_*, AWS_*, etc.

# TLS (host nginx)
sudo apt install nginx certbot python3-certbot-nginx
# adapt deploy/nginx/staging-host.conf.example
sudo certbot --nginx -d staging.example.com -d api.staging.example.com
```

### Deploy script

`career-intelligence/deploy/scripts/staging-deploy.sh`:

1. `docker compose build`
2. `php artisan migrate --force`
3. `compose up -d`
4. Hit `/api/v1/health` and `/api/v1/ready`

## Branch model

| Branch | Role |
|--------|------|
| `feature/*` | PR → CI |
| `develop` | Integration + **auto staging deploy** |
| `main` | Production candidate (deploy workflow TBD) |

## Local parity

```bash
cd career-intelligence
docker compose up -d postgres redis minio minio-init
# apps use .env.example ports 5102/5103/5100
```
