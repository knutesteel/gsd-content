# Implementation Plan

## Milestone 1 — Foundation

- Create a runnable Next.js application and environment contract.
- Commit the reviewed Supabase schema with RLS and audit history.
- Document feature parity and migration reconciliation rules.

Exit criteria: lint, typecheck, and production build pass; schema is ready for a named Supabase project.

## Milestone 2 — Data Migration

- Export current application data and the operational Google Sheet.
- Normalize identifiers, variants, statuses, timestamps, and URLs.
- Produce one result per source row: merged, app-only, sheet-only, duplicate, conflict, invalid, or failed with reason.
- Import only after the reconciliation report is approved.

Exit criteria: every source record is accounted for and identifiers remain stable.

## Milestone 3 — Content Workflows

- Implement create, edit, duplicate, archive, restore, favorite, search, filter, and sort.
- Implement optimistic concurrency through `record_version`.
- Implement immutable generation runs and explicit promotion of approved output.
- Add source ingestion and multiple-URL result reporting.

Exit criteria: parity checklist passes in staging.

## Milestone 4 — Supporting Modules

- Migrate collaborations, channels, retail plan, online sales, metrics, and instructions.
- Add private asset storage and export tools.

Exit criteria: all current top-level navigation and operational records are represented.

## Milestone 5 — Validation and Cutover

- Run V1 and V2 in parallel.
- Reconcile counts, identifiers, statuses, and posted timestamps.
- Freeze V1 writes, import the final delta, and promote V2.
- Retain V1 and the final Sheet export as read-only archives.

Exit criteria: no production request reads from or writes to Google Sheets.
