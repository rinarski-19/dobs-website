# DOBS Website — Handoff Notes

Last updated: 2026-08-30 · Branch `master` @ `fa39589`

---

## 1. Locations

### Code
| What | Where |
|---|---|
| Working repo | `/Users/Kristine/Documents/SEO WORK/Tin/dobs-website-fresh` |
| GitHub | https://github.com/rinarski-19/dobs-website (`master` is the deploy branch; a stale `main` also exists on origin) |
| Live site | https://dobs-website.vercel.app/ |
| Sanity Studio | `/studio` route on the site, plus hosted at studioHost `diocese-baguio` |

### Obsidian vaults
| Vault | Path | Contents |
|---|---|---|
| **DOBS (main)** | `/Users/Kristine/Documents/DOBS` | The project knowledge base — see below |
| SEO WORK (config only) | `/Users/Kristine/Documents/SEO WORK/.obsidian` | Obsidian config folder only, no DOBS notes |
| LensLock SEO (split off) | `~/Downloads/LensLock SEO/LensLock` | Moved out of the DOBS vault on 2026-08-02 |

**DOBS vault contents:**
```
/Users/Kristine/Documents/DOBS/
├── Welcome.md                                  ← vault index
├── Web Development Process.md                  ← standard 3-phase process
├── List of Schools.md                          ← 21 member schools (HS / Elem / Pre-school)
├── informations needed in the sanity schema.md ← per-school field list
├── Diocese of Baguio Schools Website/
│   ├── ... - Project Plan.md                   ← this project
│   └── ... - Brand Definition.md               ← colors, type, logo status
├── DOBS CMS Manual/
│   ├── ... - Project Plan.md                   ← separate app (teachers/principals manual)
│   ├── ... - Search Design.md
│   └── ... - Video Hosting Setup.md
└── DOBS CMS/                                   ← empty
```

---

## 2. Stack

- **Next.js 16** (App Router, webpack build: `next build --webpack`), React 19, TypeScript
- **Tailwind 3** + styled-components (the latter comes in via Sanity Studio)
- **Sanity v6** — project `3tjt9t85`, dataset `production`, embedded Studio at `/studio`
- **Vercel** — deploys on push to `master` via `.github/workflows/deploy.yml`

### Commands
```bash
npm run dev     # local dev
npm run build   # production build
npm run lint
```

### Env vars
All Sanity values fall back to hardcoded defaults in [lib/sanity.ts](lib/sanity.ts), so the site builds with **no `.env.local`**. Optional overrides:
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`.

GitHub Actions secrets required for deploy: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

---

## 3. What is built

### Routes ([app/](app/))
`/` · `/about` · `/programs` · `/schools` · `/schools/[slug]` · `/events` · `/news` · `/news/[slug]` · `/enrollment` · `/contact` · `/studio`

Detail pages (`/news/[slug]`, `/schools/[slug]`) use ISR with `revalidate = 60`; other pages fetch with `cache: 'no-store'`.

### Sanity schemas ([schemas/](schemas/))
Singleton page docs — `homePage`, `aboutPage`, `programsPage`, `schoolsPage`, `eventsPage`, `newsPage`, `enrollmentPage`, `contactPage` — plus repeatable `school`, `newsPost`, `event`, and shared `pageFields`.

⚠️ **The singletons are pinned to specific document IDs** in [sanity.config.ts](sanity.config.ts) so Studio and the site edit the same document. If a singleton is ever deleted and recreated, its new `_id` must be pasted back into that list or Studio will open an empty doc while the site keeps reading the old one.

### Components ([components/](components/))
`Navbar`, `Footer`, `AnnouncementBar`, `Hero`, `Features`, `HomeSections`, `StatsCounter`, `SchoolCarousel`, `FeaturedEvent`, `EventViewSwitcher`.

### Seeding
[scripts/seed-schools.mjs](scripts/seed-schools.mjs) bulk-imports the school list. Needs an Editor token:
```bash
SANITY_TOKEN=<token> node scripts/seed-schools.mjs
# token from https://sanity.io/manage/project/3tjt9t85 → API → Tokens
```

---

## 4. Open items / known gaps

1. **Forms are non-functional.** The contact and enrollment forms in [app/contact/page.tsx](app/contact/page.tsx) and [app/enrollment/page.tsx](app/enrollment/page.tsx) render fields but have no `action` or submit handler — nothing is sent anywhere. The plan calls for a Cloudflare Worker → email (Resend or Cloudflare Email Routing). Not started.
2. **Brand colors are placeholders.** Official color is confirmed to be "a shade of blue" but the exact hex is still TBD. Files to update when confirmed: `tailwind.config.ts`, `components/Features.tsx`, `components/StatsCounter.tsx`, `components/FeaturedEvent.tsx`, `app/globals.css`.
3. **Logo and favicon still pending from the client.** Navbar shows a text placeholder.
4. **Planned pages not built:** `/faculty` and `/facilities` from the project plan. `/schools` (a directory of the 21 member schools) was built instead — the plan predates the shift to a multi-school diocesan site and is out of date on this point.
5. **Sample content is live.** Several recent commits added placeholder news, events, and images (`4d2809e`, `bc706d9`, `4bba3e2`). Replace with real content before launch.
6. **`dist/` / `.sanity/` generated Studio output is noisy.** The working tree may show many uncommitted changes after builds, mostly Studio build churn under `dist/static/` and `.sanity/runtime/`. Do not commit this accidentally; either ignore it properly or commit a Studio rebuild deliberately.
7. **Stale `main` branch on origin** — `master` is the real branch; consider deleting `main`.

---

## 5. Content source of truth

- School list and types → `List of Schools.md` in the vault (note: "DON BOSCO SCHOOL OF BAGUIO CITY, INC., ELEMENTARY DEPARTMENT" is duplicated there, and "SSAN ISIDRO" is a typo for "SAN ISIDRO").
- Per-school fields → `informations needed in the sanity schema.md`: address, phone, email, logo, cover photo, 2–3 sentence about.
- Office email in use on the site: `dioceseofbaguio2004@gmail.com`.
