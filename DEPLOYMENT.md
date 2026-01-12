# Deployment Guide (Pointer AI Landing)

## Overview
This project is a Next.js 15 app with live voice APIs proxied to `api.induslabs.io`. For production, run the Next server and proxy `/api/*` via Nginx (provided in `nginx.conf`).

## Build & Run
```bash
pnpm install
pnpm build
pnpm start -- -p 3001
```

## Nginx
1) Copy `nginx.conf` to your server, update:
- `server_name`
- Upstream port (default assumes Next runs on `127.0.0.1:3001`)

2) Enable and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## API Notes
- `/api/*` should proxy to `https://api.induslabs.io`.
- This avoids CORS issues and keeps voice catalog/LiveKit auth working.

## Troubleshooting
- If `/api/voice/get-voices` returns 5xx locally, your dev server cannot reach the upstream. The client has a direct-API fallback, but in production Nginx should proxy those requests.
- Ensure your server can reach `https://api.induslabs.io` (firewall, DNS).
