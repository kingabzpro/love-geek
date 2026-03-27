# GeekMatch — CLAUDE.md

## Project Overview
GeekMatch: dark-mode-first dating app for geeks ("Find Your Player 2"). Next.js 16 App Router, Clerk auth, Drizzle ORM + Neon PostgreSQL, Framer Motion animations, Tailwind CSS v4.

## Commands
```bash
npm run dev            # Dev server (http://localhost:3000)
npm run build          # Production build
npm run lint           # ESLint
npx drizzle-kit push   # Apply schema changes to Neon (dev/prototyping)
npx drizzle-kit generate # Generate SQL migration files → ./supabase/migrations/
npx vitest run         # Run unit tests
```

## Architecture
- **Server Components by default** — `'use client'` only for interactive islands
- **Server Actions for ALL mutations** — no `/api` routes for data
- **Lazy user sync** — `ensureUserInDb()` called in protected layout; no webhooks needed
- **Tailwind v4** — design tokens in `src/app/globals.css` `@theme inline` block (NO `tailwind.config.js`)
- **React Compiler ON** — do NOT add `useMemo`/`useCallback`/`memo` manually
- Route groups: `(auth)` for Clerk pages, `(protected)` for authenticated app shell
- DB migrations output: `./supabase/migrations`

## Directory Structure
```
src/
  app/
    globals.css           # Tailwind v4 @theme tokens — ALL design tokens go here
    layout.tsx            # Root layout: ClerkProvider + Geist fonts
    page.tsx              # Landing page (public)
    (auth)/               # Clerk sign-in/sign-up (no layout.tsx)
    (protected)/          # Authenticated shell
      layout.tsx          # Phone-frame shell, header, BottomNav
      swipe/              # Swipe page — SwipeClient.tsx is 'use client'
      matches/            # Matches grid
      profile/            # User's own profile page
    onboarding/           # Multi-step onboarding (redirects to /swipe when done)
  actions/
    match.ts              # recordSwipe, getPotentialMatches, getMatches
    profile.ts            # updateProfile, getProfileStats
  components/
    SwipeCard.tsx         # 'use client' — Framer Motion swipe card
    BottomNav.tsx         # 'use client' — usePathname active state nav
    InterestBadge.tsx     # Reusable interest tag (static + toggle variants)
    MatchCard.tsx         # Match grid card with shared interests
    LandingHero.tsx       # 'use client' — animated cycling taglines
  db/
    schema.ts             # Single source of truth for DB schema
    index.ts              # Drizzle + Neon client
    seed.ts               # Dev seed script
  lib/
    user-sync.ts          # ensureUserInDb() lazy Clerk sync
    rate-limit.ts         # In-memory rate limiter
    interests.ts          # GEEK_INTERESTS canonical list
```

## Design System
- **Dark space palette**: bg `#050b14`, surface `#0d1520`, card `#111d2e`
- **Neon accents**: cyan `#00d4ff`, purple `#a855f7`
- **Monospace font** (`font-mono`) for tags, badges — gives terminal feel
- **Glow effects** via custom CSS shadow values
- Mobile-first, `max-w-md mx-auto` phone-frame on desktop

## Key Tailwind Patterns
```
Card:           bg-card border border-border rounded-2xl
Hover glow:     hover:border-accent/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]
Interest badge: font-mono text-xs px-2.5 py-1 rounded-md bg-accent/10 text-accent border border-accent/20
Primary button: bg-accent text-background font-bold rounded-xl px-6 py-3
Ghost button:   border border-border text-text-muted rounded-xl hover:border-accent hover:text-accent
Input:          bg-surface border border-border-subtle rounded-xl px-4 py-3 focus:border-accent
Gradient text:  bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent
```

## Don't
- No shadcn/ui or external component libraries — pure Tailwind
- No `tailwind.config.js` — Tailwind v4 is config-free, tokens go in `globals.css`
- No manual `useMemo`/`useCallback` — React Compiler handles optimization
- No `/api` routes for data mutations — use Server Actions
- Never use `notInArray` with an empty array (Drizzle bug) — guard with `.length > 0` check
- Don't modify Clerk auth pages or `middleware.ts`
