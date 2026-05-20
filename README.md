# venice-50k-challenge

Editorial dare landing page for **venice50kchallenge.com** — the destination for every outbound DM, SMS, postcard, and LinkedIn pitch that uses the Venice $50K hook.

> *"I bet we find you at least $50,000 hiding in your business."* — Dave Ivery, Ownly ONCE LLC.

## Stack

Next.js 16 (App Router · Turbopack) · React 19 · Tailwind v4 (Ownly editorial tokens) · Framer Motion · TypeScript · Runway-generated hero stills + 5-sec loops.

## Run

```bash
npm install
cp .env.example .env.local   # fill in DBC / Quo / Resend / Apollo creds
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## Asset pipeline

All hero + tile + backdrop images and both video loops are Runway-generated
via the wrapper at `../tools/runway_gen.py`. To regenerate, run:

```bash
python3 ../tools/runway_gen.py text-to-image --name venice-hero --ratio 1920:1080 "<prompt>"
python3 ../tools/runway_gen.py image-to-video --name venice-hero-pan _runway_out/venice-hero.png "<prompt>"
```

Then `cp _runway_out/*.png public/venice/` and `cp _runway_out/*.mp4 public/loops/`.

## Intake → DBC + Quo + Resend

`/app/api/intake/route.ts` is the single intake endpoint. It:

1. POSTs a contact to **DBC** (DREAMS Business Cloud / GHL whitelabel) with tags `ownly_venice_50k` + `ownly_source_landing`.
2. Sends Dave a Quo SMS: `NEW VENICE WAGER — <name>, <biz>, <phone>`.
3. Triggers a Resend transactional confirmation email in editorial voice.

Each integration no-ops when its env var is missing — the route still returns 200 and routes the visitor to mplannerpro for the scan.

## Concierge frame

`components/concierge-frame.tsx` intercepts every `data-frame="modal"` link. Frame-friendly hosts (mplannerpro, calendly, ownly-gap-audit, ownly-business-credit-builder, ownly-web-studio, dreamsscore.biz, campbellwa, venice50kchallenge) load inside a full-bleed editorial iframe. Everything else opens in a new tab with a discreet toast.

## Deploy

Auto-deploys to Vercel on push to `main`.
Domain: `venice50kchallenge.com` + `www.venice50kchallenge.com`.

---

© 2026 Ownly ONCE LLC · VOL.I · NO.01 · MMXXVI
