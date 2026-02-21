---
name: vercel-deploy-skill
description: Rules for Vercel deployment, environment variable management, and production readiness. Use this when preparing the application for deployment or configuring CI/CD.
---
# Vercel Deployment Skill

This skill provides guidelines for deploying Next.js applications to Vercel and managing environments.

## Core Directives

1. **Environment Variables:** Maintain a `.env.example` file with all required keys (without secrets). Never commit `.env` or `.env.local` to source control. Configure all required environment variables (e.g., `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) in the Vercel dashboard.
2. **Build Process:** Ensure `npm run build` executes without TypeScript errors or ESLint warnings. Treat warnings as errors during the CI/CD pipeline.
3. **Edge compatibility:** Be aware of Vercel Edge Runtime limitations. Only use Edge Runtime for specific API routes or middleware where Node.js APIs (like `fs`) are not required.
4. **Caching & Revalidation:** Utilize Next.js caching correctly to minimize database load. Use `revalidatePath` or `revalidateTag` in Server Actions to invalidate Vercel's Data Cache after mutations.
5. **Preview Deployments:** Ensure the application works in preview environments. Handle preview environment database connections gracefully (e.g., using branching in Neon).