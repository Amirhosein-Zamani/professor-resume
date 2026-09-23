#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.production.yml"
ENV_FILE="$ROOT_DIR/.env.production"

[[ -f "$ENV_FILE" ]] || {
  echo "[ERROR] $ENV_FILE does not exist. Run sudo ./install.sh first." >&2
  exit 1
}

compose() {
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

env_value() {
  local key="$1"
  awk -F= -v key="$key" '$1 == key { sub(/^[^=]*=/, ""); sub(/\r$/, ""); print; exit }' "$ENV_FILE"
}

wait_for_health() {
  local service="$1"
  local container_id status
  for ((i = 1; i <= 60; i++)); do
    container_id="$(compose ps -q "$service")"
    if [[ -n "$container_id" ]]; then
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")"
      if [[ "$status" == "healthy" || "$status" == "running" ]]; then
        echo "[OK] $service is $status."
        return 0
      fi
      if [[ "$status" == "unhealthy" || "$status" == "exited" || "$status" == "dead" ]]; then
        compose logs --tail=100 "$service" >&2
        return 1
      fi
    fi
    sleep 2
  done
  echo "[ERROR] Timed out waiting for $service." >&2
  return 1
}

start_stack() {
  compose up -d db
  wait_for_health db
  compose run --rm migrate
  compose up -d --no-deps api
  wait_for_health api
  compose up -d --no-deps web
  wait_for_health web
  compose ps
}

backup_stack() {
  local backup_dir="$ROOT_DIR/backups"
  local timestamp db_file assets_file
  timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
  db_file="$backup_dir/database-$timestamp.dump"
  assets_file="$backup_dir/assets-$timestamp.tar.gz"
  mkdir -p "$backup_dir"
  chmod 700 "$backup_dir"

  compose exec -T db pg_dump \
    -U "$(env_value POSTGRES_USER)" \
    -d "$(env_value POSTGRES_DB)" \
    --format=custom >"$db_file"
  compose run --rm --no-deps --entrypoint tar api \
    -C /app/assets -czf - . >"$assets_file"
  chmod 600 "$db_file" "$assets_file"
  echo "[SUCCESS] Database backup: $db_file"
  echo "[SUCCESS] Assets backup: $assets_file"
}

restore_stack() {
  local db_file="${1:-}"
  local assets_file="${2:-}"
  if [[ -z "$db_file" || ! -f "$db_file" ]]; then
    echo "Usage: CONFIRM_RESTORE=YES sudo ./manage.sh restore <database.dump> [assets.tar.gz]" >&2
    exit 1
  fi
  if [[ "${CONFIRM_RESTORE:-}" != "YES" ]]; then
    echo "[ERROR] Restore replaces current database objects. Set CONFIRM_RESTORE=YES." >&2
    exit 1
  fi
  if [[ -n "$assets_file" && ! -f "$assets_file" ]]; then
    echo "[ERROR] Assets archive not found: $assets_file" >&2
    exit 1
  fi

  compose up -d db
  wait_for_health db
  compose stop web api >/dev/null 2>&1 || true
  compose exec -T db pg_restore \
    -U "$(env_value POSTGRES_USER)" \
    -d "$(env_value POSTGRES_DB)" \
    --clean --if-exists --no-owner <"$db_file"

  if [[ -n "$assets_file" ]]; then
    compose run --rm --no-deps --entrypoint tar api \
      -C /app/assets -xzf - <"$assets_file"
  fi
  start_stack
  echo "[SUCCESS] Restore completed."
}

command="${1:-status}"
shift || true

case "$command" in
  start)
    start_stack
    ;;
  stop)
    compose down
    ;;
  restart)
    compose restart api web
    wait_for_health api
    wait_for_health web
    ;;
  status)
    compose ps
    ;;
  health)
    wait_for_health db
    wait_for_health api
    wait_for_health web
    ;;
  logs)
    compose logs --tail=200 -f "$@"
    ;;
  update)
    exec "$ROOT_DIR/install.sh"
    ;;
  backup)
    backup_stack
    ;;
  restore)
    restore_stack "$@"
    ;;
  *)
    echo "Usage: sudo ./manage.sh {start|stop|restart|status|health|logs|update|backup|restore}" >&2
    exit 1
    ;;
esac
