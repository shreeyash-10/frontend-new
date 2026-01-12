#!/bin/bash

set -e

echo "🚀 Deploying Pointer AI landing page..."

if ! command -v pnpm >/dev/null 2>&1; then
  echo "❌ pnpm is required to build this project."
  exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "📦 Building application..."
pnpm build

echo "✅ Build completed successfully."

echo "⚙️ Nginx config available at nginx.conf"
echo "   Update server_name and upstream port, then reload nginx."

echo "✅ Deployment steps complete."
