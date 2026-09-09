# Bruno

A mobile-optimized fitness & nutrition coaching web app — one app, two roles
(gym member / trainer), bilingual IT/EN, installable as a PWA on iOS/Android.

Real accounts, a private trainer↔client chat, real photo uploads with manual
food search, and persisted workouts/meals/habits — backed by Postgres,
Auth.js, and Vercel Blob storage.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **Postgres** via Prisma (works with Neon / Vercel Postgres)
- **Auth.js** (NextAuth v5) — email/password accounts, JWT sessions
- **Vercel Blob** for meal-photo storage (falls back to local disk in dev)

## Required setup before this works for real

This app needs a database and (for photo uploads) blob storage. Neither
requires touching code — set them up once from the Vercel dashboard for the
project this repo is deployed to:

1. **Database** — Project → Storage → Create Database → Postgres (Neon).
   Connect it to this project. Vercel automatically adds `DATABASE_URL` and
   `DIRECT_URL` as environment variables — no copy-pasting connection
   strings needed.
2. **Photo storage** — Project → Storage → Create Database → Blob. Connect
   it to this project the same way; this injects `BLOB_READ_WRITE_TOKEN`.
   Without this, photo uploads fail in production (Vercel's serverless
   functions can't write to local disk) — everything else still works.
3. **Auth secret** — Project → Settings → Environment Variables → add
   `AUTH_SECRET` with a random value (generate one with
   `openssl rand -base64 32`).
4. **Redeploy.** The build (`prisma generate && prisma migrate deploy && next build`)
   applies database migrations automatically on every deploy — the schema
   stays in sync with no manual step.
5. **Seed the food catalog once**, from your machine, pointed at the
   production database (pull the env vars first: `vercel env pull .env.local`):
   ```bash
   npm install
   npm run db:seed
   ```
   This only needs to run once (it upserts, so it's safe to re-run).

## Run locally

Requires a local Postgres database.

```bash
cp .env.example .env   # fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET
npm install
npm run db:migrate     # creates tables
npm run db:seed        # loads the food catalog
npm run dev
```

Open http://localhost:3000 — you'll land on the signup page. Create a
trainer account first (it generates a shareable trainer code shown on its
Profile screen), then create a gym-member account and enter that code to
link the two.

## How the two roles connect

- A **trainer** signup generates a unique code (e.g. `DANA-4417`), shown on
  their Profile screen.
- A **gym member** enters that code at signup (or later, from Profile) to
  link to that trainer. Once linked: the trainer sees them in Clients, can
  build their workout plan, and the two get a private chat only they can see.

## What's real vs. still a placeholder

Real, persisted per account: auth, workout plan + live session logging,
meal photos + food search + logged macros, daily habits/mood/streak-freeze,
streak calculation, and private trainer↔client chat.

Still illustrative (not wired to real history yet — would need more usage
data or additional tracking to compute honestly): the weekly volume chart,
bodyweight/adherence stat cards, and personal records on the Progress
screen. The Momentum screen's weekly gym-wide challenge/leaderboard was
removed rather than shown with invented other users; badges only unlock
when honestly earned (currently just the 7-day streak one — the rest need
lifetime stats this version doesn't track yet).

## Project structure

- `app/` — routes, layouts, API route handlers (`app/api/*`)
- `components/screens/` — one component per app screen
- `lib/BrunoContext.tsx` — client-side state, synced with the API
- `prisma/schema.prisma` — data model
- `auth.ts` / `auth.config.ts` / `proxy.ts` — Auth.js setup and route protection
