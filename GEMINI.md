# GeekMatch (Tinder for Geeks)

## Project Overview

GeekMatch is a production-ready MVP for a swipe-based dating application targeted at geeks and tech enthusiasts. The application features authentic Tinder-like swipe animations, user authentication, and real-time matching.

### Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4) + shadcn/ui inspired components + Framer Motion (animations)
- **Authentication:** Clerk
- **Database:** Neon Serverless Postgres
- **ORM:** Drizzle ORM
- **Testing:** Vitest + React Testing Library

### Directory Structure

- `src/app/`: Next.js App Router definitions.
  - `(auth)/`: Public routes for Clerk authentication (`/sign-in`, `/sign-up`).
  - `(protected)/`: Authenticated routes (`/swipe`, `/matches`) guarded by Clerk middleware.
- `src/actions/`: Next.js Server Actions for data mutations (e.g., `match.ts` for recording swipes and finding potential matches).
- `src/components/`: Reusable React components (e.g., `SwipeCard.tsx`).
- `src/db/`: Database configuration and Drizzle schema (`schema.ts`).
- `tests/`: Vitest unit tests for core logic.

## Building and Running

### Setup

1. Copy `.env.example` to `.env` or `.env.local` and fill in the required variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` (from Clerk)
   - `DATABASE_URL` (from Neon Postgres)
2. Install dependencies:
   ```bash
   npm install
   ```

### Database Migrations

Use Drizzle Kit to push schema changes directly to the database during prototyping:

```bash
npx drizzle-kit push
```

### Development Server

Start the Next.js development server:

```bash
npm run dev
```

### Testing

Run the Vitest test suite to validate business logic (e.g., matching engine):

```bash
npx vitest run
```

### Building for Production

```bash
npm run build
```

## Development Conventions

- **Server Components by Default:** Rely on Next.js Server Components. Only use `"use client"` directives for interactive islands (e.g., the `SwipeClient` or Framer Motion components).
- **Server Actions:** Perform database mutations within Server Actions (`src/actions`) instead of traditional API routes where possible.
- **Drizzle Integration:** Maintain all schema definitions explicitly in `src/db/schema.ts` and use the Drizzle relational query API for data retrieval when appropriate.
- **Authentication:** Utilize `@clerk/nextjs/server` to retrieve `auth()` server-side and `clerkMiddleware()` in `src/middleware.ts` to enforce route protection.
- **Testing:** Unit tests should be written in Vitest alongside core logic functions (e.g., `tests/match.test.ts`), mocking side-effects like database calls and external APIs.
- **Deployment:** The application is configured to be deployed seamlessly on Vercel. Ensure all environment variables are synced with the Vercel dashboard.
