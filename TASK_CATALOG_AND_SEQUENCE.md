# NESTORA --- Task Catalog and Recommended Build Sequence

This catalog decomposes the approved PRD into small tasks. It is a
proposed sequence, not permission to execute the whole list
automatically. Antigravity must stop after each task and wait for human
approval.

## Task sizing rules

A good task should usually deliver one independently reviewable outcome,
ideally within a focused coding session. Split a task further if it
changes many unrelated concerns, touches more than one high-risk area,
or cannot be tested clearly. UI page work and business logic should be
separated when that makes review safer.

## Phase 0 --- Repository discovery and project plan

### NESTORA-000 --- Inspect repository and reconcile PRD

**Roles:** Context Engineer, Product Analyst, Code Reviewer\
**Scope:** Read-only inspection. Identify project structure, scripts,
dependencies, existing rules, tests, DB/auth setup, current
branch/worktree state, and PRD.\
**Must not:** Change code, install dependencies, create files, commit,
push.\
**Acceptance:** Report current state, conflicts, risks, and proposed
task order; wait for approval.

### NESTORA-001 --- Establish project rules and tracking files

**Roles:** Context Engineer, Documentation Engineer, Code Reviewer\
**Scope:** Add approved master rules, task template, tracker, and task
catalog to the agreed documentation paths.\
**Acceptance:** No runtime behavior changes; links and filenames
correct; diff limited to approved docs.

## Phase 1 --- Foundation

### NESTORA-010 --- Inspect and confirm stack versions

**Roles:** Context Engineer, Frontend Engineer, Backend Engineer\
**Scope:** Check Node/package manager/Next.js/React/TypeScript and
proposed stack compatibility against current repository. Research
version-specific docs only if necessary.\
**Acceptance:** Version and compatibility report; no changes unless
separately approved.

### NESTORA-011 --- Initialize or align Next.js application

**Roles:** Frontend Engineer, Code Reviewer\
**Scope:** Create or minimally align Next.js App Router + TypeScript
structure.\
**Acceptance:** App starts; no existing functionality removed;
lint/typecheck/build commands documented.\
**Risk:** Medium; plan first if repository already contains an app.

### NESTORA-012 --- Configure Tailwind CSS and HeroUI

**Roles:** UI/UX Designer, Frontend Engineer, QA Engineer\
**Scope:** Set up compatible styling dependencies and theme integration
using installed versions.\
**Acceptance:** A test UI renders; no conflicting CSS setup; responsive
baseline verified.

### NESTORA-013 --- Configure shared utility and design tokens

**Roles:** UI/UX Designer, Frontend Engineer\
**Scope:** Configure `clsx`, `tailwind-merge`, shared class utility,
minimal design tokens, typography and spacing conventions.\
**Acceptance:** Example component uses shared conventions; no broad page
redesign.

### NESTORA-014 --- Configure environment validation

**Roles:** Backend Engineer, Security Reviewer, QA Engineer\
**Scope:** Validate required environment variables safely, add
placeholder `.env.example`, document setup.\
**Acceptance:** Missing required env is reported clearly; no secrets
committed or exposed to client.

### NESTORA-015 --- Establish quality scripts and test harness

**Roles:** QA/Test Engineer, Frontend Engineer, Backend Engineer\
**Scope:** Configure or verify lint, typecheck, unit tests, and
production build scripts; add minimal smoke test.\
**Acceptance:** Commands are reproducible and results documented.

## Phase 2 --- Database and authentication

### NESTORA-020 --- Configure PostgreSQL connection

**Roles:** Database Engineer, Backend Engineer, Security Reviewer\
**Acceptance:** App can connect in local development using env config;
failure handled safely; no credentials in source.

### NESTORA-021 --- Configure Drizzle and migration workflow

**Roles:** Database Engineer, QA Engineer\
**Acceptance:** Migration generation/application workflow documented and
tested on a development database; never touch production data.

### NESTORA-022 --- Implement core schema in approved slices

**Roles:** Database Engineer, Product Analyst, Code Reviewer\
**Scope:** Add schema in small groups rather than one enormous
migration: Better Auth-compatible tables;
categories/products/images/variants; customer addresses/wishlists;
orders/items/payments; coupons/reviews/inventory movements/audit
logs/store settings as needed.\
**Acceptance:** Constraints, relations, indexes, and money
representation follow PRD; migrations work from an empty test database.
Each group is a separate task if it cannot be reviewed safely together.

### NESTORA-023 --- Integrate Better Auth

**Roles:** Authentication Engineer, Backend Engineer, Security Reviewer,
QA Engineer\
**Risk:** High; plan and approval required.\
**Acceptance:** Register/sign-in/sign-out/session flow works for
Customer; installed-version docs and schema are respected; secrets
remain server-only.

### NESTORA-024 --- Enforce Customer/Admin authorization

**Roles:** Authentication Engineer, Security Reviewer, QA Engineer\
**Risk:** High; plan and approval required.\
**Acceptance:** Public signup cannot assign Admin; server-side guards
enforce role and ownership; negative tests cover unauthorized access.

### NESTORA-025 --- Build protected account/admin layouts

**Roles:** UI/UX Designer, Frontend Engineer, Authentication Engineer\
**Acceptance:** Protected pages handle loading, unauthenticated,
forbidden, and error states without relying on UI hiding alone.

## Phase 3 --- Design system and storefront

### NESTORA-030 --- Approve design direction and storefront shell

**Roles:** Product Analyst, UI/UX Designer, Frontend Engineer\
**Scope:** Header, navigation, footer, container/grid, typography,
responsive rules, global states.\
**Acceptance:** Human approves visual direction before the system is
repeated across pages.

### NESTORA-031 --- Build reusable product card

**Roles:** UI/UX Designer, Frontend Engineer, Accessibility Reviewer\
**Acceptance:** Responsive card with image behavior, product name,
price, stock/availability indicator as needed, clear action, accessible
focus; no fake controls.

### NESTORA-032 --- Build home page sections

**Roles:** Product Analyst, UI/UX Designer, Frontend Engineer, SEO
Reviewer\
**Acceptance:** Approved sections render with real/seed data or clearly
labeled placeholders; responsive and accessible.

### NESTORA-033 --- Build shop/catalog page

**Roles:** UI/UX Designer, Frontend Engineer, Backend Engineer, QA
Engineer\
**Acceptance:** Active products only; loading/error/empty states;
pagination works; no client trust for price/availability.

### NESTORA-034 --- Add category navigation and category page

**Roles:** Frontend Engineer, Backend Engineer, QA Engineer\
**Acceptance:** Active categories and products only; unknown/disabled
category handled appropriately.

### NESTORA-035 --- Add search, filter, sort, and pagination

**Roles:** Backend Engineer, Frontend Engineer, QA Engineer,
Performance/SEO Reviewer\
**Acceptance:** Query params validated; server query is correct; invalid
values handled; no unbounded product query.

### NESTORA-036 --- Build product detail page

**Roles:** UI/UX Designer, Frontend Engineer, Backend Engineer,
Accessibility Reviewer\
**Acceptance:** Images, description, price, variants, availability,
quantity constraints, and add-to-cart states work; inactive items cannot
be purchased.

### NESTORA-037 --- Add metadata and basic SEO

**Roles:** SEO Reviewer, Frontend Engineer\
**Acceptance:** Relevant titles/descriptions/canonical behavior where
appropriate; no false structured data or invented claims.

## Phase 4 --- Cart, wishlist, customer account

### NESTORA-040 --- Define and implement cart state policy

**Roles:** Frontend Engineer, Product Analyst, QA Engineer\
**Scope:** Decide guest/user cart persistence and sign-in merge behavior
from PRD; document source of truth.\
**Acceptance:** Policy is explicit before implementation; Redux is not
treated as trusted price/stock authority.

### NESTORA-041 --- Implement cart interactions

**Roles:** Frontend Engineer, UI/UX Designer, QA Engineer\
**Acceptance:** Add/remove/update quantity, clear cart, subtotal
display, empty/loading/error states; quantity bounds enforced.

### NESTORA-042 --- Implement guest-to-customer cart merge

**Roles:** Frontend Engineer, Backend Engineer, QA Engineer\
**Acceptance:** Merge is deterministic, handles deleted/inactive items
and quantity limits, and does not trust client totals.

### NESTORA-043 --- Implement wishlist

**Roles:** Frontend Engineer, Backend Engineer, Database Engineer, QA
Engineer\
**Acceptance:** Customer-owned wishlist persists; authorization and
duplicate prevention enforced; guest behavior clearly defined.

### NESTORA-044 --- Implement profile and saved addresses

**Roles:** Frontend Engineer, Backend Engineer, Security Reviewer, QA
Engineer\
**Acceptance:** Customer can manage own profile/addresses only;
validation and empty/error states present.

## Phase 5 --- Checkout and sandbox payment

### NESTORA-050 --- Specify shipping/currency assumptions

**Roles:** Product Analyst, Backend Engineer, Security Reviewer\
**Risk:** Medium/High depending on pricing implications.\
**Acceptance:** Supported countries, store currency, shipping rules, and
limitations are explicit; no claim of universal shipping.

### NESTORA-051 --- Implement server-authoritative checkout calculation

**Roles:** Backend Engineer, Database Engineer, QA Engineer, Security
Reviewer\
**Risk:** High; plan and approval required.\
**Acceptance:** Server recalculates price, discount, shipping, and
totals; client totals are ignored; invalid coupon/stock rejected.

### NESTORA-052 --- Create order and immutable snapshots

**Roles:** Backend Engineer, Database Engineer, QA Engineer\
**Risk:** High.\
**Acceptance:** Order items and shipping address snapshots are
preserved; transaction behavior and failure rollback tested.

### NESTORA-053 --- Implement isolated test/mock payment adapter

**Roles:** Payments Engineer, Backend Engineer, Security Reviewer, QA
Engineer\
**Risk:** High; plan and approval required.\
**Acceptance:** Test-only behavior is clearly labeled and isolated;
cannot accidentally charge real money; no raw card data stored.

### NESTORA-054 --- Verify payment events and idempotency

**Roles:** Payments Engineer, Backend Engineer, Security Reviewer, QA
Engineer\
**Risk:** High; plan and approval required.\
**Acceptance:** Only trusted verification changes payment state;
duplicate events are safe; failure cases tested.

### NESTORA-055 --- Apply inventory changes transactionally

**Roles:** Database Engineer, Payments Engineer, QA Engineer\
**Risk:** High; plan and approval required.\
**Acceptance:** Stock cannot become negative; repeated events cannot
double-deduct; concurrency and rollback are considered.

### NESTORA-056 --- Build checkout UI and result pages

**Roles:** UI/UX Designer, Frontend Engineer, Payments Engineer,
Accessibility Reviewer\
**Acceptance:** Address, summary, test-payment disclosure, validation,
pending/success/failure states, and retry behavior are clear.

### NESTORA-057 --- Build customer order history and order detail

**Roles:** Frontend Engineer, Backend Engineer, Security Reviewer, QA
Engineer\
**Acceptance:** Authenticated customer sees only their orders; status
and details reflect server state.

## Phase 6 --- Admin and fulfillment

### NESTORA-060 --- Build admin dashboard shell and navigation

**Roles:** UI/UX Designer, Frontend Engineer, Authentication Engineer\
**Acceptance:** Server-side role protection; responsive navigation; no
sensitive data leaks in shell.

### NESTORA-061 --- Product and image management

**Roles:** Frontend Engineer, Backend Engineer, Database Engineer,
Security Reviewer, QA Engineer\
**Acceptance:** Create/edit/deactivate/feature product; validation, safe
image policy, and authorization enforced.

### NESTORA-062 --- Category and variant management

**Roles:** Frontend Engineer, Backend Engineer, Database Engineer, QA
Engineer\
**Acceptance:** Relations and variant stock/pricing rules are valid;
invalid changes rejected.

### NESTORA-063 --- Inventory adjustment and audit history

**Roles:** Database Engineer, Backend Engineer, Security Reviewer, QA
Engineer\
**Acceptance:** Adjustments record actor, reason, quantity change, and
timestamp; no silent stock mutation.

### NESTORA-064 --- Order queue and status transitions

**Roles:** Frontend Engineer, Backend Engineer, Product Analyst, QA
Engineer\
**Acceptance:** Only allowed transitions; admin action recorded;
customer cannot mutate order state.

### NESTORA-065 --- Coupon management and validation

**Roles:** Backend Engineer, Database Engineer, QA Engineer, Security
Reviewer\
**Acceptance:** Expiry, usage limits, eligibility, and concurrent use
handled server-side.

### NESTORA-066 --- Review submission and moderation

**Roles:** Frontend Engineer, Backend Engineer, Security Reviewer, QA
Engineer\
**Acceptance:** Review eligibility follows PRD; moderation is enforced;
input is safely rendered.

### NESTORA-067 --- Admin dashboard summary metrics

**Roles:** Product Analyst, Frontend Engineer, Backend Engineer, QA
Engineer\
**Acceptance:** Metrics are accurately calculated from persisted data
and do not expose unauthorized customer data.

## Phase 7 --- Hardening, deployment, and portfolio

### NESTORA-070 --- Unit and integration test coverage pass

**Roles:** QA/Test Engineer, relevant domain engineers\
**Acceptance:** Core business rules and negative
access/payment/inventory cases covered; no tests weakened to force a
pass.

### NESTORA-071 --- Playwright critical-path E2E tests

**Roles:** QA/Test Engineer, Frontend Engineer, Backend Engineer\
**Acceptance:** Browse → product → cart → sandbox checkout → order
history; admin workflow; unauthorized access checks.

### NESTORA-072 --- Accessibility and responsive audit

**Roles:** Accessibility Reviewer, UI/UX Designer, QA Engineer\
**Acceptance:** Key pages keyboard-tested and checked at agreed
mobile/tablet/desktop sizes; issues fixed within scoped tasks.

### NESTORA-073 --- Security and privacy review

**Roles:** Security Reviewer, Authentication Engineer, Payments
Engineer\
**Risk:** High; plan first.\
**Acceptance:** Authorization, ownership, validation, secrets, webhook
handling, logs, and personal-data exposure reviewed; residual risks
documented.

### NESTORA-074 --- Production build and migration rehearsal

**Roles:** Release Engineer, Database Engineer, QA Engineer\
**Acceptance:** Clean build; migrations apply to a fresh test database;
rollback/backup considerations documented; no production mutation
without approval.

### NESTORA-075 --- Deployment configuration and demo disclosure

**Roles:** Release Engineer, Security Reviewer, Product Analyst\
**Acceptance:** Environment variables configured safely; test payment
clearly disclosed; shipping limitations honest; deployment only after
explicit approval.

### NESTORA-076 --- README and portfolio handoff

**Roles:** Documentation Engineer, Code Reviewer\
**Acceptance:** Setup, stack decisions, architecture, schema, tests,
demo credentials policy, sandbox limitations, screenshots, and known
limitations documented without secrets.

## Phase exit gates

A phase is not complete just because its tasks were implemented. The
human must review each task and record manual Git operations. Phase exit
requires: - All required tasks approved and manually pushed or
explicitly marked not pushed. - Relevant tests and quality gates pass. -
No unresolved blocker hidden as complete. - Tracker updated and reviewed
by the human.

## First task recommendation

Start with `NESTORA-000 — Inspect repository and reconcile PRD`. It is
read-only and establishes facts before any code changes. Do not begin
with a full-app generation prompt.
