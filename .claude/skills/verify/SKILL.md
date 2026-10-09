---
name: verify
description: Run the project's checks (typecheck, lint, tests, builds, migrations, smoke test) before declaring work done or committing. Use at the end of every code change.
---

# Verify

Run only what the change touches, but never skip a touched area.

## Backend (`backend/`)

```bash
npm run typecheck
npm run lint
npm test
npm run build            # api, worker, bot
```

If entities or migrations changed: DB up (`docker compose up -d` at repo root),
`npm run migration:run`, then `npm run migration:generate --name=Check` must report
no changes (remove any file it creates).

If endpoints changed: start the API (`npm run start:api` in the background, wait for
`/api/health`), sign in as admin (`POST /api/admin/auth/sign-in` with ADMIN_EMAIL /
ADMIN_PASSWORD from `.env`), and curl the changed routes: happy path, validation error
(400), missing permission (403), no token (401).

## Admin (`admin/`)

```bash
npx ng build
```

For UI changes: `npm start -- --port 4300` with the API running, then click through
or delegate to the `e2e-tester` agent (Playwright, Chromium at `/opt/pw-browsers`).

## UI

For any changed screen run `.claude/skills/ui-ux/responsive-check.mjs` and review
the screenshots (see the `ui-ux` skill).

## Report

State exactly what ran and its result. If something fails or was skipped, say so
with the error — don't call it done. Stop background processes you started
(by PID, not `pkill -f` with broad patterns).
