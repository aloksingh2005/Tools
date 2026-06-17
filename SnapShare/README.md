# SnapShare

SnapShare is an Express + Vite app for short-lived file sharing with password protection, auto-expiry, optional one-time view, and optional download blocking.

## Prerequisites

- Node.js 20+
- npm

## Local Development

1. Install dependencies:
   `npm install`
2. Create a local env file from `.env.example` and set values as needed.
3. Start dev server:
   `npm run dev`

## Production Build

1. Build:
   `npm run build`
2. Start:
   `npm run start`

The server binds to `process.env.PORT` (falls back to `3000`) and listens on `0.0.0.0`.

## Deploy on Render (Node Web Service)

Use these exact service settings:

- Name: `SnapShare`
- Branch: `main`
- Root Directory: leave blank
- Build Command: `npm install; npm run build`
- Start Command: `npm run start`
- Region: any
- Environment Variables:
  - `NODE_ENV=production`
  - `GEMINI_API_KEY` (only if your app uses Gemini API routes)

You can either:

- configure manually in the Render form, or
- deploy from `render.yaml` in this repo.

## Important Hosting Caveat

Current storage is ephemeral:

- uploads are written to local filesystem (`uploads/`)
- transfer/session state is kept in in-memory maps

On Render, this means data is lost on restarts/redeploys, and free tier does not provide durable disk for this workload.

## Required Next Step for Real Production Durability

1. Move file storage to object storage (S3, R2, Supabase Storage, etc.).
2. Move transfer/session metadata to a persistent store (Postgres/Redis).
3. Keep this server as stateless API + frontend host.