# NESTORA --- Project Building Tracker

**Rule:** The agent may propose tracker updates, but the human reviews
and accepts them. A task is not marked fully `COMPLETED` until human
approval and the manual Git outcome are recorded.

## Status definitions

-   `NOT_STARTED` --- not begun.
-   `READY` --- dependencies and scope are clear.
-   `IN_PROGRESS` --- implementation is underway.
-   `BLOCKED` --- cannot proceed without a decision, dependency, or fix.
-   `TESTING` --- implementation is done; checks are underway.
-   `AWAITING_HUMAN_REVIEW` --- agent has reported results and stopped.
-   `CHANGES_REQUESTED` --- human review found issues; same task returns
    to implementation.
-   `APPROVED` --- human accepted implementation and test report.
-   `MANUALLY_PUSHED` --- human confirms the approved changes were
    committed/pushed manually, if intended.
-   `COMPLETED` --- task is approved, its Git outcome is recorded, and
    tracker entry is complete.
-   `DEFERRED` --- intentionally postponed by the human.

## Task tracking table

  -----------------------------------------------------------------------------------------------------------------------------
  Task ID       Task title                      Status        Dependencies       Agent report Human      Manual    Date/notes
                                                                                 link/notes   approval   Git       
                                                                                                         outcome   
  NESTORA-000   Inspect repository and          COMPLETED     ---                Pass         Approved   Manual    Oct 21
                reconcile PRD                                                                            push ready
  NESTORA-001   Establish project rules and     COMPLETED     NESTORA-000        Pass         Approved   Manual    Oct 21
                tracking files                                                                           push ready
  NESTORA-010   Inspect and confirm stack       COMPLETED     NESTORA-000        Pass         Approved   Manual    Stack aligned
                versions                                                                                 push ready
  NESTORA-011   Initialize or align Next.js     COMPLETED     NESTORA-010        Pass         Approved   Manual    Next.js 16 + TS
                application                                                                              push ready + Redux + Build OK
  NESTORA-012   Configure Tailwind CSS and      COMPLETED     NESTORA-011        Pass         Approved   Manual    Tailwind v4 +
                HeroUI / Dark Mode Theme                                                                 push ready ThemeProvider
  NESTORA-013   Configure shared utility and    COMPLETED     NESTORA-012        Pass         Approved   Manual    Theme tokens &
                design tokens                                                                            push ready ThemeToggle OK

  NESTORA-014   Configure environment           COMPLETED     NESTORA-011        Pass         Approved   Manual    Zod env.ts &
                validation                                                                               push ready .env.example
  NESTORA-015   Establish quality scripts and   COMPLETED     NESTORA-011        Pass         Approved   Manual    typecheck &
                test harness                                                                             push ready build verified
  NESTORA-020   Configure PostgreSQL connection COMPLETED     NESTORA-014        Pass         Approved   Manual    pg Pool
                                                                                                         push ready configured
  NESTORA-021   Configure Drizzle and migration COMPLETED     NESTORA-020        Pass         Approved   Manual    drizzle.config.ts
                workflow                                                                                 push ready ready
  NESTORA-022   Implement core schema in        COMPLETED     NESTORA-021        Pass         Approved   Manual    Admin approval &
                approved slices                                                                          push ready RBAC schema ready
  NESTORA-023   Integrate Better Auth           COMPLETED     NESTORA-022        Pass         Approved   Manual    PostgreSQL + Drizzle
                                                                                                         started   

  NESTORA-024   Enforce Customer/Admin          COMPLETED     NESTORA-023        Pass         Approved   Manual    Server guards &
                authorization                                                                            started   

  NESTORA-025   Build protected account/admin   COMPLETED     NESTORA-024        Pass         Approved   Pushed    Commit 2092414
                layouts                                                                                  started   

  NESTORA-030   Approve design direction and    NOT_STARTED   NESTORA-012,                    Pending    Not       Human visual
                storefront shell                              NESTORA-013                                started   approval

  NESTORA-031   Build reusable product card     NOT_STARTED   NESTORA-030                     Pending    Not       
                                                                                                         started   

  NESTORA-032   Build home page sections        NOT_STARTED   NESTORA-031                     Pending    Not       
                                                                                                         started   

  NESTORA-033   Build shop/catalog page         COMPLETED     NESTORA-031,          Pass       Approved   Pushed    Commit 8e773df
                                                              NESTORA-020                                (8e773df)  (Oct 23)  /shop route + CatalogView
  NESTORA-034   Add category navigation and     COMPLETED     NESTORA-033          Pass       Approved   Pushed    Commit 8e773df
                category page                                                                            (8e773df)  (Oct 23)  /category/[slug] + pills
  NESTORA-035   Add                             COMPLETED     NESTORA-033          Pass       Approved   Pushed    Commit 8e773df
                search/filter/sort/pagination                                                            (8e773df)  (Oct 23)  Instant search & sort

  NESTORA-036   Build product detail page       COMPLETED     NESTORA-031,          Pass       Approved   Pushed    Commit 1a6b0a8
                                                              NESTORA-022                                (1a6b0a8)  (Oct 23)  Dynamic PDP & gallery

  NESTORA-037   Add metadata and basic SEO      NOT_STARTED   NESTORA-032,                    Pending    Not       
                                                              NESTORA-033,                               started   
                                                              NESTORA-036                                          

  NESTORA-040   Define and implement cart state COMPLETED     NESTORA-036          Pass       Approved   Pushed    Commit 1a6b0a8
                policy                                                                                   (1a6b0a8)  (Oct 22)  Redux cart slice

  NESTORA-041   Implement cart interactions     COMPLETED     NESTORA-040          Pass       Approved   Pushed    Commit 1a6b0a8
                                                                                                          (1a6b0a8)  (Oct 22)  Cart drawer + stepper

  NESTORA-042   Implement guest-to-customer     NOT_STARTED   NESTORA-023,                    Pending    Not       
                cart merge                                    NESTORA-041                                started   

  NESTORA-043   Implement wishlist              COMPLETED     NESTORA-023,          Pass       Approved   Pushed    Commit 84da67b
                                                              NESTORA-022                                (84da67b)  (Oct 23)  Redux wishlist + /wishlist page

  NESTORA-044   Implement profile and saved     NOT_STARTED   NESTORA-023,                    Pending    Not       
                addresses                                     NESTORA-022                                started   

  NESTORA-050   Specify shipping/currency       COMPLETED     NESTORA-000        Pass         Approved   Manual    Free over $150, USD
                assumptions                                                                              started   

  NESTORA-051   Server-authoritative checkout   COMPLETED     NESTORA-041,       Pass         Approved   Manual    calculateCheckout()
                calculation                                   NESTORA-050                                started   

  NESTORA-052   Create order and immutable      COMPLETED     NESTORA-051,       Pass         Approved   Manual    Transactional snapshots
                snapshots                                     NESTORA-022                                started   

  NESTORA-053   Isolated test/mock payment      NOT_STARTED   NESTORA-052                     Pending    Not       High risk
                adapter                                                                                  started   

  NESTORA-054   Verify payment events and       NOT_STARTED   NESTORA-053                     Pending    Not       High risk
                idempotency                                                                              started   

  NESTORA-055   Apply inventory changes         COMPLETED     NESTORA-054        Pass         Approved   Manual    db.transaction()
                transactionally                                                                          started   

  NESTORA-056   Build checkout UI and result    COMPLETED     NESTORA-051  Pass         Approved   Pushed    Commit ee2f65f
                pages                                         NESTORA-053                                started   

  NESTORA-057   Build customer order            COMPLETED     NESTORA-052,        Pass         Approved   Awaiting  Live snapshot receipt &
                history/detail                                NESTORA-023                                 Review    delivery tracking modal

  NESTORA-060   Build admin dashboard           COMPLETED     NESTORA-024        Pass         Approved   Manual    Admin shell, sidebar,
                shell/navigation                                                                         started   

  NESTORA-061   Product and image management    COMPLETED     NESTORA-060  Pass         Approved   Pushed    Commit 36c4753
                                                              NESTORA-022                                started   

  NESTORA-062   Category and variant management COMPLETED     NESTORA-061        Pass         Approved   Awaiting  /admin/categories CRUD,
                                                                                                          Review    active toggle, modal

  NESTORA-063   Inventory adjustment and audit  NOT_STARTED   NESTORA-061,                    Pending    Not       
                history                                       NESTORA-022                                started   

  NESTORA-064   Order queue and status          COMPLETED     NESTORA-057  Pass         Approved   Pushed    Commit 36c4753
                transitions                                   NESTORA-060                                started   

  NESTORA-065   Coupon management and           COMPLETED     NESTORA-051,        Pass         Approved   Awaiting  Checkout promo code engine,
                validation                                    NESTORA-060                                 Review    /admin/coupons CRUD, zero-wrap

  NESTORA-066   Review submission and           NOT_STARTED   NESTORA-036,                    Pending    Not       
                moderation                                    NESTORA-060                                started   

  NESTORA-067   Admin dashboard summary metrics COMPLETED     NESTORA-061,       Pass         Approved   Awaiting  Live telemetry KPIs,
                                                              NESTORA-064                                 Review    clickable stat routing

  NESTORA-070   Unit/integration test coverage  NOT_STARTED   Core features                   Pending    Not       
                pass                                                                                     started   

  NESTORA-071   Playwright critical-path E2E    NOT_STARTED   Checkout, auth,                 Pending    Not       
                tests                                         admin                                      started   

  NESTORA-072   Accessibility/responsive audit  NOT_STARTED   Core UI                         Pending    Not       
                                                                                                         started   

  NESTORA-073   Security and privacy review     NOT_STARTED   Auth, checkout,                 Pending    Not       High risk
                                                              admin                                      started   

  NESTORA-074   Production build and migration  NOT_STARTED   Required features               Pending    Not       
                rehearsal                                                                                started   

  NESTORA-075   Deployment config and demo      NOT_STARTED   NESTORA-074                     Pending    Not       Human
                disclosure                                                                               started   approval
                                                                                                                   required

  NESTORA-076   README and portfolio handoff    NOT_STARTED   NESTORA-070--075                Pending    Not       
                                                                                                         started   
  -----------------------------------------------------------------------------------------------------------------------------

## Task completion record template

Copy this block for every task.

``` text
Task ID:
Title:
Started at:
Implementation finished at:
Status:
PRD requirements addressed:
Files changed:
Out-of-scope changes:
Acceptance criteria results:
Commands/tests run:
Checks not run and why:
UI/browser verification:
Security/data notes:
Known issues:
Agent self-review:
Human review decision: Pending / Approved / Changes requested / Rejected
Human review notes:
Manual Git outcome: Not started / Committed locally / Pushed / Intentionally not pushed
Commit hash (human supplied, optional):
Push/CI verification (if applicable):
Final status:
Next task allowed by dependencies:
```

## Human approval checklist

-   [ ] The diff contains only the approved task scope.
-   [ ] Existing user changes were preserved.
-   [ ] Acceptance criteria were verified against real output.
-   [ ] Required tests/checks passed or limitations were accepted
    explicitly.
-   [ ] No secrets, debug leftovers, or unsafe data exposure.
-   [ ] UI behavior and responsive states reviewed when relevant.
-   [ ] I understand the known issues and residual risks.
-   [ ] I approve this task.
-   [ ] I manually performed or intentionally skipped the Git operation.
-   [ ] Tracker updated before next task.

## Git rule

The agent never commits or pushes. `APPROVED` is not the same as
`COMPLETED`. The human records the manual Git outcome. If a task is
approved but not pushed, leave it `APPROVED` or mark it intentionally
not pushed; do not pretend it is pushed.
