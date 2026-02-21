---
name: drizzle-neon-skill
description: Guidelines for Drizzle ORM with Neon Postgres. Use when defining database schemas, running migrations, querying the database, or setting up the database connection.
---
# Drizzle ORM + Neon Postgres Skill

This skill dictates how to interact with the PostgreSQL database using Drizzle ORM and Neon.

## Core Directives

1. **Connection:** Use `@neondatabase/serverless` with Drizzle's `neon` connector to interact with the Neon Postgres database over HTTP/WebSockets. Ensure `DATABASE_URL` is used from the environment.
2. **Schema Definition:** Define schemas explicitly in `schema.ts` (or under a `db/schema/` directory). Export all tables and relations. Use appropriate PostgreSQL types (e.g., `varchar`, `timestamp`, `uuid`, `jsonb`).
3. **Relations:** Define relations explicitly using Drizzle's `relations` API (e.g., one-to-many, many-to-many) to enable relational queries.
4. **Querying:** Prefer Drizzle's relational query API (`db.query...`) for nested data fetches, and standard SQL-like API (`db.select().from()`) for flat queries or aggregations.
5. **Migrations:** Manage migrations using `drizzle-kit`. Run `drizzle-kit generate` to create SQL migration files and `drizzle-kit push` (for prototyping) or run the migrator script for production. Ensure `drizzle.config.ts` is properly configured with the Neon connection string.