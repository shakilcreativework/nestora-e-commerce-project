# NESTORA --- Git Safety and Quality Gates

## 1. Non-negotiable Git boundary

The human owns all Git write operations. The agent must never: - Commit
or push. - Stage files automatically. - Merge or rebase. - Reset, clean,
or discard changes. - Delete branches or tags. - Force-push. - Publish
releases. - Deploy without explicit human approval.

The agent may perform safe read-only inspection if permitted, such as: -
`git status --short` - `git branch --show-current` - `git diff --stat` -
`git diff -- <approved paths>`

If there are existing user changes, preserve them. Do not assume all
changes in the working tree belong to the agent.

## 2. Human-led review and manual Git flow

1.  Agent implements exactly one task.
2.  Agent runs checks and reviews its diff.
3.  Agent reports results and stops at `AWAITING_HUMAN_REVIEW`.
4.  Human inspects the actual diff and tests the app.
5.  If changes are requested, task returns to `CHANGES_REQUESTED`; agent
    fixes only the requested scope.
6.  Once approved, human manually stages the intended files, reviews
    staged diff, commits, and pushes if desired.
7.  Human verifies remote/CI/deployment outcome where applicable.
8.  Human records the outcome in `PROJECT_TRACKER.md`.
9.  Only then may the next task begin.

Suggested manual commands (run only when you choose; review paths
carefully):

``` bash
git status --short
git diff --stat
git diff
# Stage only reviewed files:
git add path/to/reviewed-file
git diff --cached
git commit -m "feat(scope): concise task outcome"
git push
```

These commands are guidance for the human, not authorization for the
agent to execute them.

## 3. Verification gate

The exact commands depend on the repository. Inspect `package.json`,
lockfile, package manager, and project docs first. Do not assume `npm`
if the project uses `pnpm`, `yarn`, or `bun`.

Typical checks, only if corresponding scripts exist:

``` bash
# Example only; use the actual scripts/package manager in the repo
<package-manager> lint
<package-manager> typecheck
<package-manager> test
<package-manager> test:e2e
<package-manager> build
```

For database tasks: - Apply migrations only to a local/test database. -
Verify migration from an empty database where feasible. - Check
constraints, relations, indexes, transaction behavior, and rollback
expectations. - Never run migrations against production without explicit
human approval and a backup/rollback plan.

For authentication/authorization: - Test unauthenticated access. - Test
Customer access to own data. - Test Customer access to another
Customer's data. - Test Customer calls to Admin endpoints. - Test public
registration cannot grant Admin. - Test session expiry/failure where
feasible.

For checkout/payments/inventory: - Client-supplied totals are ignored. -
Invalid/expired coupons are rejected. - Failed payment never becomes
paid. - Unverified callback/webhook is rejected. - Duplicate event does
not double-process payment or stock. - Concurrent checkout cannot drive
stock negative. - Sandbox/test mode is clearly labeled and cannot
accidentally charge real money.

For UI: - Check target viewport sizes. - Test keyboard navigation and
focus. - Test loading, empty, error, disabled, and success states as
applicable. - Check browser console and network errors where tools
permit. - Ensure controls actually work.

## 4. Reporting truthfully

Use these labels: - `PASS` --- command ran and returned success, or
behavior was directly verified. - `FAIL` --- command ran and failed. -
`NOT RUN` --- not executed. - `BLOCKED` --- cannot run due to a stated
dependency/environment issue. - `PARTIAL` --- only some paths were
verified.

Never turn `NOT RUN` into `PASS`. Never remove or weaken a failing test
solely to obtain a green check. Report failures caused by pre-existing
code separately from regressions introduced by the task.

## 5. Definition of gate status

-   **Implementation gate:** acceptance criteria appear implemented.
-   **Verification gate:** required checks pass or limitations are
    explicitly documented.
-   **Human review gate:** human approves the diff and report.
-   **Git gate:** human records manual commit/push outcome.
-   **Task closed:** all required gates are satisfied.

A successful local build is necessary for many tasks but is not proof
that all application behavior is correct. Production environment,
sandbox providers, browser behavior, and remote CI may still require
verification.
