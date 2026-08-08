# GSD Content

V2 of the Hank and the Squirrel content application. PostgreSQL is the source of truth; Google Sheets is an optional export only.

## Milestone 1

- Runnable Next.js 16 application
- Supabase client contract and versioned database schema
- Row-level security for all exposed tables
- Content versioning, status history, generation runs, assets, sources, metrics, and job history
- Migration and feature-parity specifications

## Milestone 2

- Supabase-backed server and browser clients
- Private single-admin access for `knutesteel@gmail.com`
- Google OAuth login with a server-side admin allowlist
- Read-only CSV/JSON migration reconciliation
- Production and preview environments connected to Supabase
- Vercel project connected to the GitHub repository

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and publishable key.
3. Run `npm install` and `npm run dev`.

The initial schema is in `supabase/migrations/0001_initial_schema.sql`. It is committed for review but should only be applied after the target Supabase organization and project are confirmed.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

See `docs/implementation-plan.md` and `docs/parity-checklist.md` for the execution sequence and acceptance criteria.
