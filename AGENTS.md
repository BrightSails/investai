# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router resides in `app/` with `(auth)` and `(main)` route groups plus API handlers in `app/api/*`. Shared UI, state, and utilities live under `src/components`, `src/context`, and `src/lib`. Persistent JSON fixtures stay inside `data/` and can be reseeded anytime with `node scripts/init-db.js`. Reach for `prisma/schema.prisma` only when promoting the JSON storage to SQLite or another datasource; keep static files in `public/`.

## Build, Test, and Development Commands
- `npm run dev` – start the local Next.js 16 server on port 3000.
- `node scripts/init-db.js` – restore default users, profiles, projects, and recommendations from `data/`.
- `npm run build` – create the production bundle and validate route handlers.
- `npm run start` – serve the compiled build (used for preview or production).
- `npm run lint` – run the eslint-config-next core-web-vitals ruleset.

## Coding Style & Naming Conventions
TypeScript runs in `strict` mode—declare explicit types and prefer typed hooks over `any`. Keep 2-space indentation, single quotes, and arrow callbacks. Components and contexts use PascalCase (`src/components/ProjectModal.tsx`), helpers use camelCase, and route folders stay lowercase with hyphenated segments. Style with Tailwind utilities, add bespoke CSS only for recurring patterns, and rely on the `@/` alias instead of deep relative paths.

## Testing Guidelines
No automated test runner ships in `package.json`, so today’s minimum gate is `npm run lint` plus manual walkthroughs of `/dashboard`, `/projects`, `/recommend`, and `/history`. When adding critical logic, create React Testing Library or Next.js `next test` suites under `src/__tests__`, stub the JSON fixtures you rely on, and reseed via `node scripts/init-db.js` before assertions. Smoke-test API handlers and client components touched by each pull request.

## Commit & Pull Request Guidelines
This workspace is not yet an initialized Git repo, so adopt Conventional Commits (`feat:`, `fix:`, `chore:`) once Git history exists to keep changes searchable. Pull requests should summarize the business goal, list affected routes or modules, mention schema/seed changes, link related issues, and attach UI screenshots or terminal output showing `npm run dev` verification. Document any environment variables that must be set for reviewers.

## Security & Configuration Tips
Environment secrets (OpenAI keys, JWT secret, `DATABASE_URL`) belong in `.env.local`; derive it from `.env.example` and keep it untracked. If you enable Prisma, point `DATABASE_URL` to SQLite (`prisma/dev.db`) or a managed service before deploying. When switching users locally, clear the `token` and `user` keys from `localStorage` to avoid stale sessions.
