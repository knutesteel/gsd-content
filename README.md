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

## Milestones 3–4

- Database-backed content dashboard and version-safe editing
- Multi-URL discovery with explicit per-URL outcomes
- Server-side AI generation with immutable run history and stale-write protection
- Scheduled discovery and daily CSV backups
- Metrics entry, history, and on-demand export
- Editable Instructions and operational Collaborations, Channels, Retail Plan, and Online Sales modules
- Database-backed checklists, statuses, links, notes, and collaborator follower counts

AI generation requires `OPENAI_API_KEY`. Scheduled jobs require `CRON_SECRET` and `SUPABASE_SECRET_KEY` in Vercel. These values are server-only and must never use a `NEXT_PUBLIC_` prefix.

## Automated Instagram Insights

The Instagram Insights page connects through Meta's Instagram API with Instagram Login, stores encrypted access tokens, and snapshots account and media performance in Supabase. Vercel refreshes connected accounts every six hours; an administrator can also use Refresh Now.

Configure `META_APP_ID`, `META_APP_SECRET`, and a random 32-byte `META_TOKEN_ENCRYPTION_KEY` in Vercel. Register `https://gsd-content.vercel.app/api/instagram/callback` as the exact OAuth redirect URI and optionally set it as `META_REDIRECT_URI`. The Meta app needs `instagram_business_basic` and `instagram_business_manage_insights`.

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
