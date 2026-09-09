# Bruno

A mobile-optimized fitness & nutrition coaching web app — one app, two roles
(gym member / trainer), bilingual IT/EN, installable as a PWA on iOS/Android.

Built with Next.js (App Router), TypeScript, and Tailwind CSS. All data is
currently mocked client-side (no backend yet) so the whole product can be
tried immediately.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- Role switch (gym member / trainer) with separate flows for each
- Full IT/EN language toggle
- Live workout session: drag-to-set weight, rep counter, rest timer
- Meal log + mocked photo-capture flow with a draggable portion size
- Progress charts, PRs, adherence
- "Momentum" tab: streaks, daily habits, mood check-in, streak-freeze,
  weekly challenge leaderboard, badges
- Trainer flows: client list, plan builder, weekly review
- State persisted to `localStorage`
- Installable PWA: manifest, generated icons, offline-capable service worker

## Deploying

Import this repository into [Vercel](https://vercel.com/new) — zero config
needed, it's a standard Next.js app.

## Next steps

Real auth, a database, and live data (meals, chat, clients) can be added via
Next.js API routes without restructuring the app.
