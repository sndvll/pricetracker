#!/usr/bin/env bash
# deploy.sh <stage|prod>
# Bygg och deploya pricetracker till svc.orb.local.
set -euo pipefail

ENV="${1:-}"
if [[ "$ENV" != "stage" && "$ENV" != "prod" ]]; then
  echo "Usage: $0 <stage|prod>"
  exit 1
fi

# Branch guard: stage only from non-main, prod only from main
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
if [[ "$ENV" == "stage" && "$GIT_BRANCH" == "main" ]]; then
  echo "❌ Stage deploy blocked: currently on 'main'. Checkout a feature branch first."
  exit 1
fi
if [[ "$ENV" == "prod" && "$GIT_BRANCH" != "main" ]]; then
  echo "❌ Prod deploy blocked: currently on '$GIT_BRANCH'. Switch to 'main' first."
  exit 1
fi

SVC="emil@svc.orb.local"
APP="pricetracker"

case "$ENV" in
  stage)
    PORT=3456
    SERVICE=web-server-stage
    URL="https://web.stage.sndvll.dev"
    REMOTE_DIR="~/web/stage/$APP"
    BASE_HREF="/pricetracker/"
    ;;
  prod)
    echo "❌ Prod deploy via this script is not supported. Use GitHub Actions."
    exit 1
    ;;
esac

echo "→ Bygger $APP för $ENV..."

HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
COMMIT_COUNT=$(git rev-list --count HEAD ^origin/main 2>/dev/null || echo "0")
DEPLOY_VERSION=$(date +'%Y.%m').${COMMIT_COUNT}-dev

# Inject version + commit hash
sed -i "s/VERSION_PLACEHOLDER/$DEPLOY_VERSION/" src/environments/environment.prod.ts
sed -i "s/COMMIT_HASH/$HASH/" src/environments/environment.prod.ts

# Bygg med production config + base-href för subpath
echo "→ Bygg sndvll-lib-bibliotek..."
npm run lib:build 2>/dev/null || echo "(ibland redan byggda)"
echo "→ Kör npm run build -- --configuration production --base-href=\"$BASE_HREF\"..."
npm run build -- --configuration production --base-href="$BASE_HREF"

# Restore environment.prod.ts — återställ VERSION_PLACEHOLDER för nästa bygge
git checkout -- src/environments/environment.prod.ts

DEPLOY_DIR=$(mktemp -d)
echo "→ Förbereder deploy-katalog: $DEPLOY_DIR"

# Static files — Angular production output
cp -r dist "$DEPLOY_DIR/dist"

# Symlink: static → dist/pricetrckr (web-server använder static/)
ln -s dist/pricetrckr "$DEPLOY_DIR/static"

# Skapa deploy.json för metadata
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_MSG=$(git log -1 --pretty=%s 2>/dev/null || echo "")
COMMIT_COUNT=$(git rev-list --count HEAD ^origin/main 2>/dev/null || echo "0")
DEPLOY_VERSION=$(date +'%Y.%m').${COMMIT_COUNT}-dev
cat > "$DEPLOY_DIR/deploy.json" <<EOF
{
  "branch": "$GIT_BRANCH",
  "commit": "$GIT_COMMIT",
  "message": "$GIT_MSG",
  "version": "$DEPLOY_VERSION",
  "deployedAt": "$(date -Iseconds)"
}
EOF

echo "→ Rsynkar till $SVC:$REMOTE_DIR ..."
rsync -avz --delete "$DEPLOY_DIR/" "$SVC:$REMOTE_DIR/"

echo "→ Startar om $SERVICE på svc..."
ssh "$SVC" "sudo systemctl restart $SERVICE"

echo "→ Väntar på health check ($URL)..."
for i in {1..15}; do
  if curl -sf "http://svc.orb.local:$PORT/health" > /dev/null 2>&1; then
    echo "✅ $ENV redo — $URL"
    rm -rf "$DEPLOY_DIR"
    exit 0
  fi
  sleep 1
done

echo "❌ Health check misslyckades efter 15s — kolla med: ssh $SVC 'sudo journalctl -u $SERVICE -n 30 --no-pager'"
echo "   Deploy dir ($DEPLOY_DIR) finns kvar för felsökning"
exit 1
