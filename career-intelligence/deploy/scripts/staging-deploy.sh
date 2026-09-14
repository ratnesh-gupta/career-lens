#!/usr/bin/env bash
# Run on the staging host from the repo root (or DEPLOY_PATH).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "==> CareerLens staging deploy"
echo "    root: $ROOT"

if [ ! -f deploy/.env.staging ] && [ ! -f .env.staging ]; then
  echo "Missing deploy/.env.staging (or .env.staging) on host — abort"
  exit 1
fi

ENV_FILE="deploy/.env.staging"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE=".env.staging"
fi

echo "==> Building images"
docker compose -f deploy/docker-compose.staging.yml --env-file "$ENV_FILE" build

echo "==> Migrating database"
docker compose -f deploy/docker-compose.staging.yml --env-file "$ENV_FILE" run --rm api php artisan migrate --force

echo "==> Restarting stack"
docker compose -f deploy/docker-compose.staging.yml --env-file "$ENV_FILE" up -d --remove-orphans

echo "==> Health"
sleep 3
curl -fsS "http://127.0.0.1:8000/api/v1/health" || true
curl -fsS "http://127.0.0.1:8000/api/v1/ready" || true

echo "==> Done"
