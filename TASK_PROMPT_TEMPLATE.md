# NESTORA --- Single-Task Prompt Template

> Copy this template for every task. Fill in known fields. Do not bundle
> unrelated features into one task.

## Task identity

-   **Task ID:** `NESTORA-PHASE-TASK`
-   **Title:**
-   **Phase:**
-   **Priority:** `P0 / P1 / P2`
-   **Risk:** `Low / Medium / High`
-   **Status before work:** `READY`
-   **Depends on:** task IDs already approved and closed
-   **Approval mode:** `PLAN_FIRST` (required for high-risk work) /
    `IMPLEMENT_THEN_REVIEW`

## 1. Product outcome

Describe the single user/business outcome this task must deliver:

## 2. Source context

-   PRD sections to read:
-   Relevant project rules:
-   Existing routes/components/services/schema/tests to inspect:
-   Design reference or screenshot, if any:
-   External docs/research required (version-specific facts only):

## 3. Active roles

Name the roles needed and what each is responsible for. Examples: -
Product Analyst: - UI/UX Designer: - Frontend Engineer: - Backend
Engineer: - Database Engineer: - Security Reviewer: - QA/Test
Engineer: - Code Reviewer:

Do not claim independent review unless it was actually independent.

## 4. Exact scope

### Must do

-   \[ \]
-   \[ \]

### Must not do

-   Do not implement unrelated features.
-   Do not refactor unrelated files.
-   Do not add packages or change the stack without approval.
-   Do not commit, push, merge, release, or deploy.
-   Additional exclusions:

### File boundaries

-   **Allowed to create/change:**
-   **Read-only context files:**
-   **Out of scope:**
-   **Potential contracts affected:** routes / API / DB / auth / shared
    UI / other

If a necessary change falls outside scope, stop and request approval.

## 5. Functional requirements

List observable behavior, inputs, outputs, business rules, edge cases,
and error handling:

## 6. UI/UX specification (complete for UI tasks)

-   **Route/page:**
-   **User and primary goal:**
-   **Layout and hierarchy:**
-   **Components to reuse/create:**
-   **Responsive behavior:** mobile / tablet / desktop
-   **Visual tokens:** use existing tokens; list any approved additions
-   **States:** default / hover / focus / active / disabled / loading /
    empty / error / success
-   **Form rules and copy:**
-   **Keyboard and accessibility:**
-   **Data loading and failure behavior:**
-   **Visual verification method:**
-   **Explicit non-goals:**

For a non-UI task, write `Not applicable` and explain if useful.

## 7. Technical specification

-   **Architecture/pattern to follow:**
-   **Input validation (Zod):**
-   **Authorization / ownership rules:**
-   **Database/API contracts:**
-   **State ownership (server vs Redux/client):**
-   **Logging/error behavior:**
-   **Performance/SEO concerns:**
-   **Security risks:**
-   **Migration/backward compatibility:**

Do not invent missing details. List assumptions and ask where they are
consequential.

## 8. Acceptance criteria

Write testable statements, not vague words such as "perfect" or
"user-friendly". - \[ \] Given ***, when ***, then ***. - \[ \] Given
***, when ***, then ***. - \[ \] No regression to \_\_\_. - \[ \] Only
approved files/behavior changed.

## 9. Verification plan

Inspect the actual `package.json` and repository before selecting
commands. Use the project's existing package manager/scripts.

-   [ ] Relevant unit tests:
-   [ ] Relevant integration tests:
-   [ ] E2E/browser checks:
-   [ ] Lint:
-   [ ] Type check:
-   [ ] Production build:
-   [ ] Migration/DB checks:
-   [ ] Responsive/accessibility checks:
-   [ ] Security/negative-path checks:
-   [ ] Diff/scope review:

Do not report a check as passed if it was not run. If unavailable, state
why and the alternative.

## 10. Execution protocol

1.  Read project rules, PRD sections, and relevant existing code.
2.  Inspect working-tree status; do not overwrite user changes.
3.  If `PLAN_FIRST`, return plan and wait for explicit approval.
4.  Implement only the approved task.
5.  Run the verification plan and fix regressions within scope.
6.  Inspect diff and confirm file scope.
7.  Return the completion report required by the master prompt.
8.  Set status to `AWAITING_HUMAN_REVIEW` and stop.
9.  Do not start the next task until the human approves it.
10. **Never commit or push. The human handles Git manually.**

## 11. Human approval

-   **Approval received for plan:** `Yes / No / Not required`
-   **Approval received for scope expansion:** `Yes / No / Not needed`
-   **Human reviewer notes:**

## 12. Completion report

The agent must fill this out: - **Status:** - **Implemented:** - **Not
implemented:** - **Files changed and why:** - **Out-of-scope changes:**
`None` or explain approved exception - **Checks run and results:** -
**Visual QA:** - **Security/data notes:** - **Known issues:** - **Manual
review checklist:** - **Git:** `No commit/push performed` - **Tracker
update proposal:** - **Wait state:** `Awaiting human approval`
