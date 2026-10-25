# NESTORA — Handcrafted Home & Living E-Commerce Atelier

> A quiet-luxury, single-vendor artisanal e-commerce web application engineered with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Drizzle ORM**, **PostgreSQL**, and **Better-Auth**.

---

## 🏛️ Executive Architecture & System Overview

NESTORA is designed as a production-grade, architectural e-commerce platform for handcrafted furniture, acoustic lighting, ceramics, and workspace objects. Built with high craftsmanship and modern web standards, it demonstrates clean separation of concerns, strict type safety, server-driven authorization, and resilient minor-unit financial calculations.

### Tech Stack & System Decisions

| Layer | Technology | Architectural Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** (App Router & Turbopack) | Fast Server Component rendering, streaming hydration, dynamic SEO metadata, and zero-bundle-cost Server Actions. |
| **UI & Styling** | **Tailwind CSS v4** & **Vanilla CSS Tokens** | Zero-runtime CSS variables, high-performance compilation, and full light/dark theme persistence via `next-themes`. |
| **State Management**| **Redux Toolkit** & **React-Redux 9** | Predictable local bag manipulation, drawer state, and instant optimistic UI feedback. |
| **Database & ORM** | **PostgreSQL** & **Drizzle ORM** | Schema-first DDL migrations (`drizzle-kit`), relational queries, connection pooling via `pg`, and zero runtime overhead. |
| **Authentication** | **Better Auth** | Cookie-based session management, credential hashing, and server-side Role-Based Access Control (**CUSTOMER** vs **ADMIN**). |
| **Unit Testing** | **Node.js Native Test Runner** (`node:test`) | Ultra-fast unit testing (23/23 tests in <400ms) for checkout math, stock caps, and coupon logic without heavy tooling. |
| **E2E & A11y Audit**| **Playwright Test** | Comprehensive end-to-end user journeys, checkout sandboxes, and automated 6-tier viewport audits (`xs` to `2xl`). |

---

## 📐 Relational Database Schema & Entities

The relational database is modeled cleanly in `src/lib/db/schema.ts` and managed via Drizzle DDL migrations:

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ ACCOUNTS : links
    USERS ||--o{ ADDRESSES : saves
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REVIEWS : writes
    CATEGORIES ||--o{ PRODUCTS : categorizes
    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS ||--o{ PRODUCT_IMAGES : displays
    PRODUCTS ||--o{ REVIEWS : receives
    PRODUCT_VARIANTS ||--o{ INVENTORY_AUDIT_LOGS : audits
    PRODUCT_VARIANTS ||--o{ ORDER_ITEMS : snapshotted_in
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ PAYMENTS : records
    COUPONS ||--o{ ORDERS : applies_to
```

### Core Entities:
1. **Users & Auth:** `users` (with role enum: `CUSTOMER` / `ADMIN`), `sessions`, `accounts`, `verifications`.
2. **Catalog & Inventory:** `categories`, `products`, `product_variants` (with SKU, minor-unit prices, stock quantity), `product_images`, `inventory_audit_logs`.
3. **Checkout & Orders:** `orders` (with order status enum, customer snapshot, immutable totals), `order_items` (with price & variant snapshot), `payments` (with transaction ID, idempotency key, card brand, card last 4 digits).
4. **Marketing & Engagement:** `coupons` (percentage or fixed discount, ceiling cap, minimum order threshold), `reviews` (star rating, customer commentary, admin moderation queue), `addresses` (customer address book).

---

## 💎 Key Features & Implementation Highlights

### 1. Storefront Discovery & Quiet-Luxury Visuals
- Curated catalog with filterable collections (`/shop`, `/category/[slug]`).
- Product Detail Pages (PDP) with high-resolution imagery, variant switches, stock indicator badges, tabbed material care specifications, and verified customer reviews.
- Slide-over cart drawer with live subtotal calculation, threshold progress indicator, and zero layout shift.

### 2. Resilient Financial Engine & Two-Phase Checkout
- **Strict Minor Units:** All monetary values stored as integer cents (e.g., `$150.00` = `15000` cents) to eliminate floating-point calculation errors.
- **Dynamic Shipping Threshold:** Automated complimentary Standard Courier eligibility for subtotals over `$150.00`, with `$25.00` Express Air Freight option.
- **Coupon Validation Engine:** Enforces expiration dates, total redemption quota caps, and discount ceilings.
- **Stock Guard & Cart Merge:** Aggregates duplicate items and strictly caps requested quantities against live warehouse availability.
- **Idempotency Engine:** Prevents duplicate charges by hashing checkout idempotency keys in payment records.

### 3. Isolated Sandbox Payment Gateway
Simulates real-world credit card transactions with an interactive scenario selector:
- `4242 •••• •••• 4242` — Visa (Instant Success & Order Confirmation).
- `4000 •••• •••• 0002` — Bank Decline (Insufficient Funds).
- `4000 •••• •••• 0003` — Bank Decline (Expired Card).
- **Zero PAN/CVV Policy:** No raw card PAN or CVV is ever stored or logged.

### 4. Enterprise Admin Backoffice (`/admin`)
Full administration suite protected by strict server-side RBAC:
- **Telemetry Overview:** Real-time KPI cards (Gross Revenue, Total Orders, Active Customers, Low-Stock Alerts).
- **Product & Variant Catalog:** Add/edit products, manage multiple variants, image galleries, and draft/active visibility toggles.
- **Order Queue & Fulfillment:** Transition orders through `PENDING_PAYMENT` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED` with full timeline tracking.
- **Live Inventory Ledger:** Real-time stock adjustments with mandatory reason codes (`RESTOCK`, `DAMAGED`, `AUDIT_RECONCILIATION`, `CUSTOMER_RETURN`, `CORRECTION`).
- **Coupons & Promo Engine:** Create and toggle discount campaigns.
- **Review Moderation:** Approve or reject customer reviews before they appear on PDP.

### 5. Full Accessibility (WCAG a11y) & 6-Tier Responsive Layouts
- **Zero Horizontal Overflow:** Verified across all 6 breakpoint tiers: `xs` (375px), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).
- **Semantic HTML & Screen-Reader Support:** Single `<h1>` per page, descriptive `alt` tags on all product imagery, accessible `aria-label` tags on icon buttons, and full keyboard ergonomics (Escape key dismisses modals and drawers).

### 6. Search Engine Optimization (SEO) & Social Graph
- Dynamic `sitemap.xml` generating live URLs for all active categories and products.
- `robots.txt` disallowing `/admin/*`, `/account/*`, and `/checkout/*` while allowing public indexing.
- Rich OpenGraph and Twitter card metadata on every route.
- Schema.org JSON-LD structured data (`Product`, `Offer`, `AggregateRating`) on PDPs.

---

## 🛡️ Security & Privacy Hardening

- **Enterprise HTTP Security Headers:**
  - `X-Frame-Options: DENY` (Mitigates clickjacking).
  - `X-Content-Type-Options: nosniff` (Prevents MIME sniffing).
  - `Referrer-Policy: strict-origin-when-cross-origin` (Safeguards internal URLs).
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` (Disables unauthorized hardware access).
- **Data Isolation:** All customer data routes (`/account`) are strictly scoped to the authenticated session (`where(eq(orders.userId, user.id))`).
- **Privilege Escalation Protection:** Better Auth configured with `role: { input: false }` to prevent client-injected role tampering during registration.
- **Zero Sensitive Leak:** Client HTML bundles are verified via automated tests to ensure database URLs, auth secrets, and passwords are never leaked.

---

## 🧪 Testing Pyramid & Quality Gates

The repository is guarded by four layers of automated verification:

```bash
# 1. Run Node.js Native Unit Tests (23/23 PASS ~350ms)
npm test

# 2. Run Playwright E2E, A11y & Security Test Suite (21/21 PASS)
npm run test:e2e

# 3. TypeScript Static Typecheck (0 errors)
npm run typecheck

# 4. Production Build & Static Page Generation (0 errors)
npm run build
```

### Test Coverage Highlights:
- **`tests/checkout-calculation.test.mjs`:** Minor-unit math, $150 free shipping boundary conditions ($149.99 vs $150.00), express courier fee calculations.
- **`tests/coupon-validation.test.mjs`:** Percentage caps, fixed dollar reductions, minimum spend gates, expiration dates, and quota exhaustion.
- **`tests/cart-merge-stock-capping.test.mjs`:** Item deduplication, warehouse stock capping (`Math.min`), out-of-stock item ejection.
- **`tests/idempotency-engine.test.mjs`:** Idempotency key caching, double charge prevention, mock gateway approval and decline matrix.
- **`tests/e2e/critical-paths.spec.ts`:** Complete storefront browse ➔ PDP ➔ Cart drawer ➔ Checkout ➔ Order confirmation ➔ RBAC guards.
- **`tests/e2e/accessibility-responsive.spec.ts`:** Multi-viewport layout testing across all 6 breakpoint tiers, zero horizontal scroll, semantic headings, and ARIA labels.
- **`tests/e2e/security-privacy.spec.ts`:** Enterprise HTTP headers, client DOM leak verification, zero raw card storage, customer data isolation, and admin RBAC enforcement.

---

## 🚀 Local Development Quickstart

### Prerequisites
- **Node.js** 20.x or later
- **PostgreSQL** 15+ running locally or on a managed cloud instance (e.g. Neon, Supabase)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shakilcreativework/nestora-e-commerce-project.git
cd "nestora e-commerce project"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your PostgreSQL database credentials and a 32+ character auth secret:
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestora_db
BETTER_AUTH_SECRET=your_super_secret_better_auth_key_min_32_characters_here
BETTER_AUTH_URL=http://localhost:3000
PAYMENT_PROVIDER=sandbox
```

### 3. Database Migrations & Administration
Generate and verify Drizzle migrations:
```bash
# Verify schema parity
npm run db:check

# Push migrations to your PostgreSQL database
npm run db:migrate

# (Optional) Open Drizzle Studio visual GUI
npm run db:studio
```

To promote an existing registered user to Administrator:
```bash
node scripts/promote-admin.js admin@nestora.com
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📢 Portfolio Demonstration Disclosure

> **Notice:** NESTORA is developed as a comprehensive engineering demonstration.
> - **Simulated Orders:** Orders placed in the storefront are processed using the sandbox payment adapter. No real money or credit card numbers are charged.
> - **Simulated Logistics:** Order dispatch, package tracking IDs, and fulfillment statuses are managed within the admin backoffice to demonstrate complete end-to-end e-commerce lifecycle workflows.

---

## 📜 License & Acknowledgments

Engineered with craftsmanship for architectural calmness and digital elegance.  
© 2026 NESTORA Atelier Inc. All rights reserved.
