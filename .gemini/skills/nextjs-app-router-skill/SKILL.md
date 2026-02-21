---
name: nextjs-app-router-skill
description: Enforce Next.js App Router and React Server Components (RSC) best practices. Use this when writing or refactoring Next.js code to ensure optimal performance, proper data fetching, and adherence to the App Router paradigm.
---
# Next.js App Router Skill

This skill enforces strict adherence to Next.js App Router and React Server Components (RSC) best practices.

## Core Directives

1. **Default to Server Components:** Every component is a Server Component by default. Only add `"use client"` when necessary for interactivity (hooks like `useState`, `useEffect`, event listeners, or browser APIs).
2. **Data Fetching:** Fetch data on the server in Server Components. Avoid `useEffect` for data fetching. Use `fetch` API for automatic caching and revalidation where possible.
3. **Boundary Placement:** Push `"use client"` down the component tree as far as possible. Do not wrap entire pages or large sections in Client Components unnecessarily.
4. **Server Actions:** Use Server Actions for data mutations instead of API routes when appropriate. Place server actions in separate files (e.g., `actions.ts`) with `"use server"` at the top, or inline in Server Components.
5. **UI Library:** Use Tailwind CSS for styling and `shadcn/ui` components for consistent, accessible UI elements. Ensure `shadcn/ui` components (often Client Components) are imported correctly.
6. **Routing:** Follow App Router conventions strictly (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`). Use route handlers (`route.ts`) for external API endpoints or webhooks.