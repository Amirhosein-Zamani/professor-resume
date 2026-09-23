#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.production.yml"
ENV_FILE="$ROOT_DIR/.env.production"
ENV_EXAMPLE="$ROOT_DIR/.env.production.example"

on_error() {
  local exit_code=$?
  echo "[ERROR] Deployment failed at line $1 (exit code $exit_code)." >&2
  echo "Inspect logs with: sudo ./manage.sh logs" >&2
  exit "$exit_code"
}
trap 'on_error $LINENO' ERR

compose() {
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[ERROR] Required command is missing: $1" >&2
    exit 1
  }
}

env_value() {
  local key="$1"
  awk -F= -v key="$key" '
    $1 == key {
      sub(/^[^=]*=/, "")
      sub(/\r$/, "")
      print
      exit
    }
  ' "$ENV_FILE"
}

set_env_value() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" "$ENV_FILE"; then
    sed -i "s|^${key}=.*$|${key}=${value}|" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >>"$ENV_FILE"
  fi
}

generate_secret_if_needed() {
  local key="$1"
  local bytes="$2"
  local value
  value="$(env_value "$key")"
  if [[ -z "$value" || "$value" == CHANGE_ME* ]]; then
    set_env_value "$key" "$(openssl rand -hex "$bytes")"
    echo "[INFO] Generated $key."
  fi
}

validate_environment() {
  local required=(
    POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD
    WEB_ORIGIN NEXT_PUBLIC_API_URL NEXT_PUBLIC_SITE_URL
    JWT_SECRET OTP_HASH_SECRET COOKIE_SECURE
    SEED_MODE SEED_ADMIN_EMAIL
    SMTP_HOST SMTP_PORT SMTP_SECURE SMTP_USER SMTP_PASS SMTP_FROM
  )
  local key value

  for key in "${required[@]}"; do
    value="$(env_value "$key")"
    if [[ -z "$value" ]]; then
      echo "[ERROR] $key is required in $ENV_FILE." >&2
      exit 1
    fi
    if [[ "$value" == *CHANGE_ME* || "$value" == *SERVER_IP* ]]; then
      echo "[ERROR] Replace the placeholder value for $key in $ENV_FILE." >&2
      exit 1
    fi
  done

  if [[ "$(env_value SEED_ADMIN_EMAIL)" == *example.com ]]; then
    echo "[ERROR] Set a real SEED_ADMIN_EMAIL in $ENV_FILE." >&2
    exit 1
  fi
  if [[ "$(env_value SMTP_USER)" == *example.com || "$(env_value SMTP_FROM)" == *example.com ]]; then
    echo "[ERROR] Set real SMTP_USER and SMTP_FROM values in $ENV_FILE." >&2
    exit 1
  fi
  if [[ "$(env_value WEB_ORIGIN)" == *localhost* || "$(env_value NEXT_PUBLIC_API_URL)" == *localhost* ]]; then
    echo "[ERROR] Production browser URLs must not use localhost." >&2
    exit 1
  fi
  if [[ "$(env_value WEB_ORIGIN)" != "$(env_value NEXT_PUBLIC_SITE_URL)" ]]; then
    echo "[ERROR] WEB_ORIGIN and NEXT_PUBLIC_SITE_URL must be identical." >&2
    exit 1
  fi
  if [[ "$(env_value NEXT_PUBLIC_API_URL)" != */api ]]; then
    echo "[ERROR] NEXT_PUBLIC_API_URL must end with /api." >&2
    exit 1
  fi

  local secure origin
  secure="$(env_value COOKIE_SECURE)"
  origin="$(env_value WEB_ORIGIN)"
  if [[ "$origin" == https://* && "$secure" != "true" ]]; then
    echo "[ERROR] COOKIE_SECURE must be true when WEB_ORIGIN uses HTTPS." >&2
    exit 1
  fi
  if [[ "$origin" == http://* && "$secure" != "false" ]]; then
    echo "[ERROR] COOKIE_SECURE must be false for plain HTTP/IP testing." >&2
    exit 1
  fi
  if [[ ! "$(env_value SEED_MODE)" =~ ^(auto|always|never)$ ]]; then
    echo "[ERROR] SEED_MODE must be auto, always, or never." >&2
    exit 1
  fi
}

wait_for_health() {
  local service="$1"
  local attempts="${2:-60}"
  local container_id status

  for ((i = 1; i <= attempts; i++)); do
    container_id="$(compose ps -q "$service")"
    if [[ -n "$container_id" ]]; then
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")"
      if [[ "$status" == "healthy" || "$status" == "running" ]]; then
        echo "[OK] $service is $status."
        return 0
      fi
      if [[ "$status" == "unhealthy" || "$status" == "exited" || "$status" == "dead" ]]; then
        echo "[ERROR] $service entered state: $status" >&2
        compose logs --tail=100 "$service" >&2
        return 1
      fi
    fi
    sleep 2
  done

  echo "[ERROR] Timed out waiting for $service readiness." >&2
  compose logs --tail=100 "$service" >&2
  return 1
}

run_seed_if_needed() {
  local mode user_count
  mode="$(env_value SEED_MODE)"
  [[ "$mode" == "never" ]] && return 0

  if [[ "$mode" == "auto" ]]; then
    user_count="$(compose exec -T db psql \
      -U "$(env_value POSTGRES_USER)" \
      -d "$(env_value POSTGRES_DB)" \
      -tAc 'SELECT COUNT(*) FROM users;' | tr -d '[:space:]')"
    if [[ "$user_count" != "0" ]]; then
      echo "[INFO] Seed skipped: users table already contains data."
      return 0
    fi
  fi

  echo "[INFO] Running the idempotent Prisma seed."
  compose run --rm migrate pnpm prisma:seed
}

main() {
  require_command docker
  require_command openssl
  require_command awk
  require_command grep
  require_command sed
  require_command tr
  docker compose version >/dev/null

  if [[ ! -f "$ENV_FILE" ]]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    echo "[INFO] Created $ENV_FILE from the safe example."
  fi

  generate_secret_if_needed POSTGRES_PASSWORD 24
  generate_secret_if_needed JWT_SECRET 32
  generate_secret_if_needed OTP_HASH_SECRET 32
  chmod 600 "$ENV_FILE"
  validate_environment

  echo "[INFO] Validating Docker Compose configuration."
  compose config --quiet

  echo "[INFO] Building production images."
  compose build

  echo "[INFO] Starting PostgreSQL."
  compose up -d db
  wait_for_health db

  echo "[INFO] Applying production Prisma migrations."
  compose run --rm migrate
  run_seed_if_needed

  echo "[INFO] Starting API."
  compose up -d --no-deps api
  wait_for_health api

  echo "[INFO] Starting Web."
  compose up -d --no-deps web
  wait_for_health web

  compose ps
  echo "[SUCCESS] Professor Resume is ready."
  echo "Web: $(env_value NEXT_PUBLIC_SITE_URL)"
  echo "API health: $(env_value NEXT_PUBLIC_API_URL)/health"
  echo "Swagger: $(env_value NEXT_PUBLIC_API_URL)/docs"
}

main "$@"
