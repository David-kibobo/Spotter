#!/bin/bash

# === Usage ===
# ./deploy_oracle.sh production [--build]

# === CONFIGURATION ===
ENVIRONMENT=$1
FORCE_BUILD=$2
PROJECT_NAME="SPOTTER"
LOCAL_DIR="/home/davkirash/Desktop/$PROJECT_NAME"
FRONTEND_ROOT="$LOCAL_DIR/frontend"
FRONTEND_DIR="$FRONTEND_ROOT/spotter"
BACKEND_DIR="$LOCAL_DIR/backend"
BACKEND_PROJECT_DIR="$BACKEND_DIR/eld_tracker"
REMOTE_USER="ubuntu"
REMOTE_IP="129.153.57.235"
REMOTE_DIR="/var/www/spotter"
ENV_FILE=".env.production"
PRIVATE_KEY="/home/davkirash/.ssh/oracle-key.pem"
BACKUP_DIR="$REMOTE_DIR/backup_directory"

# === CHECKS ===
if [ -z "$ENVIRONMENT" ]; then
  echo "❌ Please specify the environment (e.g., production)"
  exit 1
fi

if [ ! -d "$LOCAL_DIR" ]; then
  echo "❌ Local project directory not found: $LOCAL_DIR"
  exit 1
fi

if [ ! -f "$PRIVATE_KEY" ]; then
  echo "❌ Private key not found: $PRIVATE_KEY"
  exit 1
fi

if ! ssh-add -l | grep -q "$PRIVATE_KEY"; then
  echo "🔑 Adding SSH key to agent..."
  ssh-add "$PRIVATE_KEY"
fi

# === FRONTEND BUILD ===
cd "$FRONTEND_DIR" || { echo "❌ Frontend dir missing"; exit 1; }

if git diff --quiet HEAD -- "$FRONTEND_DIR/src" "$FRONTEND_DIR/package.json" && [ "$FORCE_BUILD" != "--build" ]; then
  echo "✅ No frontend changes. Skipping build."
else
  echo "⚙️ Building frontend for $ENVIRONMENT..."

  rm -rf build && echo "🗑️ Removed old build"
  npm install

  if ! command -v env-cmd &> /dev/null; then
    echo "📦 Installing env-cmd globally..."
    npm install -g env-cmd
  fi

  if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Env file not found: $ENV_FILE"
    exit 1
  fi

  env-cmd -f "$ENV_FILE" npm run build

  if [ ! -d "build" ]; then
    echo "❌ Build failed!"
    exit 1
  fi

  mkdir -p "$BACKEND_PROJECT_DIR/staticfiles"
  sudo chmod -R 755 "$BACKEND_PROJECT_DIR/staticfiles"
  sudo chown -R "$USER:$USER" "$BACKEND_PROJECT_DIR/staticfiles"

  rm -rf "$BACKEND_PROJECT_DIR/staticfiles/build"
  mv build "$BACKEND_PROJECT_DIR/staticfiles/"

  echo "✅ Frontend build copied to backend staticfiles."
fi

# === DEPLOY TO ORACLE ===
echo "📤 Uploading project to Oracle server..."

# Clean up backup directory first if needed
ssh -i "$PRIVATE_KEY" $REMOTE_USER@$REMOTE_IP "rm -rf $BACKUP_DIR && mkdir -p $BACKUP_DIR"

rsync -az --delete \
  --exclude=frontend/ \
  --exclude=frontend/spotter/node_modules/ \
  --exclude=*.pyc \
  --exclude=__pycache__/ \
  --exclude=venv/ \
  --exclude=.env \
  --include='backend/**/migrations/*.py' \
  --include='backend/**/migrations/' \
  --include='backend/**/staticfiles/build/**' \
  --backup \
  --backup-dir="$BACKUP_DIR" \
  -e "ssh -i $PRIVATE_KEY" \
  "$LOCAL_DIR/" "$REMOTE_USER@$REMOTE_IP:$REMOTE_DIR/"

if [ $? -ne 0 ]; then
  echo "❌ Rsync failed!"
  exit 1
fi

echo "✅ Files uploaded."

# === RUN MIGRATIONS, COLLECT STATIC & RESTART SERVICES ===
echo "⚙️ Running migrations, collectstatic and restarting services..."

ssh -i "$PRIVATE_KEY" $REMOTE_USER@$REMOTE_IP << EOF
  set -e
  cd $REMOTE_DIR/
  source venv/bin/activate

  cd backend/
  pip install -r requirements.txt

  cd eld_tracker/
  python manage.py migrate --noinput
  python manage.py collectstatic --noinput

  echo "🔁 Restarting services..."
  sudo systemctl restart gunicorn_spotter || echo "⚠️ Gunicorn Spotter service not configured correctly"

  sudo nginx -t && sudo systemctl reload nginx

  deactivate
EOF

if [ $? -ne 0 ]; then
  echo "❌ Migration or service restart failed."
  exit 1
fi

# === FINAL CHECK ===
if [ ! -d "$BACKEND_PROJECT_DIR/staticfiles/build" ]; then
  echo "❌ Build folder missing after deployment!"
  exit 1
fi

echo "✅ Deployment static files exist."

# === CLEAN OLD BACKUPS ===
echo "🧹 Cleaning up backups older than 7 days..."
ssh -i "$PRIVATE_KEY" $REMOTE_USER@$REMOTE_IP "find $BACKUP_DIR -type f -mtime +7 -delete"

echo "🎉 Deployment to Oracle server ($REMOTE_IP) complete!"
