---
name: clerk-auth-skill
description: Best practices for implementing Clerk authentication in a Next.js App Router application. Use this when adding protected routes, middleware, or server-side/client-side authentication checks.
---
# Clerk Auth Skill

This skill outlines rules for integrating and using Clerk for authentication in Next.js.

## Core Directives

1. **Middleware:** Always use Clerk's `clerkMiddleware` in `middleware.ts`. Explicitly define which routes are public using `createRouteMatcher` and protect all others by default, or explicitly protect required routes.
2. **Server-Side Auth:** In Server Components and Server Actions, use `auth()` or `currentUser()` from `@clerk/nextjs/server` to check authentication status. NEVER trust client-side claims for sensitive operations.
3. **Client-Side Auth:** In Client Components, use hooks like `useAuth()` and `useUser()` from `@clerk/nextjs`. Use `<SignedIn>`, `<SignedOut>`, and `<UserButton />` components for auth-conditional UI.
4. **Data Association:** Store the Clerk `userId` in your database (via Drizzle) to associate application data with the user. Treat the `userId` as the primary identifier across the system.
5. **Webhooks:** For syncing user data to your local database, use Svix to securely verify incoming Clerk webhooks (e.g., `user.created`, `user.deleted`) in a Next.js Route Handler.