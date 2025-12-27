# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router resides in `app/` with `(auth)` and `(main)` route groups plus API handlers under `app/api/*`. Shared UI, state, and utilities live inside `src/components`, `src/context`, and `src/lib`, where `kvdb.ts` wraps the Neon Postgres database via `@vercel/postgres`. The `data/` folder only contains legacy JSON fixtures you can import manually if needed, and static assets remain in `public/`.

## Build, Test, and Development Commands
- `npm run dev` – start the local Next.js 16 server on port 3000.
- `vercel env pull .env.local` – sync the `POSTGRES_URL*` credentials from Vercel/Neon to your workstation.
- `npm run build` – create the production bundle and validate Route Handlers.
- `npm run start` – serve the compiled build (used for preview or production).
- `npm run lint` – run the eslint-config-next core-web-vitals ruleset.

## Coding Style & Naming Conventions
TypeScript runs in `strict` mode—declare explicit types and prefer typed hooks over `any`. Keep 2-space indentation, single quotes, and arrow callbacks. Components and contexts use PascalCase (`src/components/ProjectModal.tsx`), helpers use camelCase, and route folders stay lowercase with hyphenated segments. Style with Tailwind utilities, add bespoke CSS only for recurring patterns, and rely on the `@/` alias instead of deep relative paths.

## Testing Guidelines
No automated test runner ships in `package.json`, so today’s minimum gate is `npm run lint` plus manual walkthroughs of `/dashboard`, `/projects`, `/recommend`, and `/history`. When adding critical logic, create React Testing Library or Next.js `next test` suites under `src/__tests__`, back Postgres with a disposable database (or run `TRUNCATE ... RESTART IDENTITY CASCADE` before assertions), and ensure API handlers plus form flows are exercised end-to-end.

## Commit & Pull Request Guidelines
This workspace is not yet an initialized Git repo, so adopt Conventional Commits (`feat:`, `fix:`, `chore:`) once Git history exists to keep changes searchable. Pull requests should summarize the business goal, list affected routes or modules, mention schema/seed changes, link related issues, and attach UI screenshots or terminal output showing `npm run dev` verification. Document any environment variables that must be set for reviewers.

## Security & Configuration Tips
Environment secrets (OpenAI keys, JWT secret, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_PRISMA_URL`) belong in `.env.local`; derive them with `vercel env pull` or copy from the Neon console and keep the file untracked. Rotate credentials if they leak, and clear the `token` / `user` pair in `localStorage` before switching accounts to avoid stale sessions.
