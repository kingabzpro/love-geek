---
name: vitest-testing-skill
description: Guidelines for writing unit tests with Vitest. Use this when testing core logic, utilities, edge cases, and isolated components.
---
# Vitest Testing Skill

This skill enforces standards for writing reliable unit and integration tests using Vitest.

## Core Directives

1. **Test Location:** Place tests alongside the code they test (e.g., `utils.test.ts` next to `utils.ts`) or in a dedicated `__tests__` directory.
2. **Mocking:** Use `vi.mock()` sparingly. Prefer testing pure functions. When mocking is necessary (e.g., for database calls, Clerk auth), mock the module boundaries clearly.
3. **Test Structure:** Use `describe` blocks to group related tests and `it`/`test` for individual assertions. Follow the Arrange-Act-Assert pattern within tests.
4. **Edge Cases:** Write tests not just for the happy path, but specifically for edge cases, null states, missing permissions, and invalid inputs.
5. **Configuration:** Ensure `vitest.config.ts` is configured to handle TypeScript paths (`tsconfigPaths()`) and any required setup files.
6. **Execution:** Tests must be fast and reproducible. Do not rely on shared global state between tests.