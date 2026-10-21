# NESTORA — Home & Lifestyle E-Commerce Platform
## Product Requirements Document (PRD)

**Document type:** Full-stack portfolio project specification  
**Version:** 1.0  
**Product model:** Single-vendor e-commerce  
**Architecture:** Next.js full-stack application  
**Primary roles:** Customer and Admin  
**Payment approach:** Test/sandbox payments first  
**Target:** A polished, medium-sized project that one developer can build, test, deploy, and explain in a portfolio

---

## 1. Project Overview

NESTORA is a single-vendor online store for home and everyday lifestyle products such as desk organizers, lighting, kitchen essentials, storage solutions, reusable home accessories, and small decorative items.

The business owner controls the product catalog, inventory, promotions, orders, reviews, and store content. Customers can browse products, create accounts, maintain a wishlist and cart, place sandbox orders, manage their profiles and addresses, and view order history.

NESTORA is **not a marketplace**. Customers cannot become sellers, create storefronts, or list products for sale.

The project demonstrates practical full-stack engineering through a polished storefront, responsive UI, typed server-side logic, relational database design, secure authentication and authorization, inventory-aware checkout, order lifecycle management, and automated tests.

### Product positioning

**Brand promise:** Thoughtful essentials for a more comfortable, organized everyday life.

**Target customers:** People furnishing or organizing homes, apartments, workspaces, and everyday living areas. This is a product-design assumption for the portfolio project, not validated market research.

### Core product outcome

A customer should be able to discover a home/lifestyle product, understand its options and availability, add it to a cart, complete a sandbox checkout, and track the resulting order. An admin should be able to operate the store without editing the database manually.

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Build a credible, responsive, single-vendor e-commerce experience.
- Use Next.js App Router and TypeScript for the application.
- Use Redux Toolkit for shared client-side state where useful.
- Persist business data in PostgreSQL.
- Use Better Auth for authentication and session management.
- Use Zod to validate untrusted inputs at server boundaries.
- Provide a functional admin area for catalog, stock, orders, coupons, and reviews.
- Implement sandbox payment confirmation using verified provider events or a clearly isolated mock payment adapter.
- Include automated tests and a reproducible setup guide.
- Deploy a public demo with clearly labeled test-payment behavior.

### 2.2 Non-goals for the first release

Do not build these in the MVP:

- Multi-vendor selling, seller accounts, seller onboarding, or seller payouts.
- Native mobile applications.
- AI interior design, room visualization, or AI shopping assistants.
- Real-time chat, social feeds, or community forums.
- Multi-warehouse inventory, complex fulfillment routing, or carrier integrations.
- Multi-currency settlement, tax automation, customs calculation, or guaranteed worldwide shipping.
- Subscription billing, loyalty points, gift cards, or affiliate systems.
- A custom payment processor or storage of raw payment-card data.
- Live payment processing before the sandbox workflow is tested and deployment requirements are understood.

“Worldwide-oriented” means the storefront is designed for international visitors and supports configurable shipping countries, international address fields, a configured store currency, and clear shipping limitations. It does **not** imply the demo can ship to every country or process payments everywhere. Live operation requires separate validation of provider eligibility, tax, consumer-protection, privacy, shipping, and currency requirements.

---

## 3. Success Criteria

The MVP is successful when:

1. A visitor can browse and search active products without an account.
2. A customer can register, sign in, sign out, and access only their own protected data.
3. Cart and wishlist actions work reliably across navigation and refreshes according to documented persistence rules.
4. The server recalculates prices, validates stock, and creates a pending order without trusting client totals.
5. A sandbox payment can be completed and verified server-side before an order is marked paid.
6. Stock changes and order creation are handled safely under concurrent requests.
7. An admin can manage products, categories, inventory, orders, coupons, and review moderation.
8. Automated tests cover critical business rules and access control.
9. The app can be set up from the README using documented environment variables and migrations.
10. The deployed demo clearly indicates that checkout uses test payments and does not charge real money.

---

## 4. Roles and Permissions

Only two application roles are in scope.

### 4.1 Visitor

- Browse active products and categories.
- Search, filter, sort, and paginate products.
- View product details and published reviews.
- Register or sign in.
- Add items to a local cart before signing in.
- Cannot place an order until authenticated.
- Cannot access customer or admin dashboards.

### 4.2 Customer

- All visitor capabilities.
- Manage own profile and saved addresses.
- Manage own wishlist and cart.
- Complete checkout using the configured sandbox payment provider.
- View only own orders, order details, and payment status.
- Submit a review only for an eligible purchased product, subject to the review policy.
- Request cancellation only when the order is eligible under the cancellation rules.
- Cannot access admin APIs or another customer's information.

### 4.3 Admin

- Access the protected admin dashboard.
- Create, edit, deactivate, and feature products.
- Manage categories and product variants.
- Adjust inventory and inspect stock changes.
- View and update orders according to allowed transitions.
- Create, update, deactivate, and expire coupons.
- Moderate reviews.
- Manage homepage featured products and basic store content.
- View summary metrics and recent activity.
- Cannot view or retrieve raw payment-card details; the provider handles payment information.

### 4.4 Role assignment

Public registration must always create a Customer. Never accept a role from a public registration payload. The initial Admin account must be provisioned through a documented server-side seed or controlled setup process. Authorization must be checked on the server for every protected operation; hiding admin links in the UI is not authorization.

---

## 5. Required Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Application | Next.js App Router | Routing, layouts, server rendering, server-side application logic |
| Language | TypeScript | Type safety across UI and server modules |
| Client state | Redux Toolkit | Cart, wishlist interaction state, and selected client-side UI state |
| Database | PostgreSQL | Persistent business records |
| ORM | **Drizzle ORM** | Typed SQL-oriented schema and queries, migrations, relational access |
| Authentication | Better Auth | Sign-in, sessions, password-based auth and supported account flows |
| Styling | Tailwind CSS | Utility-first styling and responsive layout |
| UI components | HeroUI | Accessible, consistent UI primitives |
| Class utilities | clsx + tailwind-merge | Conditional classes and conflict resolution |
| Validation | Zod | Validate request bodies, query parameters, environment variables, and forms |
| Testing | Vitest + Testing Library; Playwright | Unit, component, and end-to-end testing |
| Payment | Provider sandbox or isolated mock adapter | Test-only payment flow |
| Image storage | Managed image host or local development fixtures | Product image URLs and responsive product imagery |
| Deployment | Next.js-compatible hosting + managed PostgreSQL | Public demo and persistent database |

### Why Drizzle ORM?

Use Drizzle because its schema and query style remain close to SQL, making PostgreSQL relationships, constraints, indexes, and transactions easier to understand and explain in a portfolio interview. It provides TypeScript-first schema definitions and migration tooling while keeping the data layer relatively lightweight.

Prisma would also be a valid choice, particularly if the developer prefers its generated client and schema workflow. Do not use both ORMs. This PRD standardizes on Drizzle.

### Redux boundaries

Redux Toolkit is for client-side shared state, not a replacement for PostgreSQL or server-side data fetching.

Use Redux for:
- Cart line items and cart drawer state.
- Wishlist interaction state when it must be shared across components.
- Optional non-sensitive UI preferences and filter-panel state.

Use the server/database as the source of truth for:
- Product prices and stock.
- Orders, payments, coupon validity, and user permissions.
- Persistent account data and order history.

Do not store passwords, session tokens, or other secrets in Redux. Avoid duplicating server-fetched catalog data in Redux without a clear requirement.

### Next.js architecture

Use one Next.js application rather than a separate Express server. Organize code by domain. Use Server Components for initial catalog/product rendering where practical; use Client Components for interactive widgets such as cart controls, filters, and dialogs. Use Route Handlers or server-only service functions for mutations. All database access must occur in server-only modules and never be bundled into client code.

---

## 6. MVP Scope

### 6.1 Included

- Responsive public storefront.
- Product catalog with categories, search, filtering, sorting, and pagination.
- Product details, variants, stock availability, and related products.
- Registration, sign-in, sign-out, and protected customer routes.
- Cart, wishlist, and saved addresses.
- Checkout with server-side price/stock validation.
- Sandbox payment confirmation.
- Order history and order details.
- Admin dashboard.
- Product, category, inventory, coupon, order, and review management.
- Product reviews with purchase eligibility checks.
- Basic SEO metadata, canonical URLs where applicable, Open Graph metadata, sitemap, and robots configuration.
- Loading, empty, success, and error states.
- Unit/integration tests for critical business rules and an end-to-end happy path.
- README, `.env.example`, seed script, migration instructions, and deployment instructions.

### 6.2 Deferred

- AI room design, augmented reality, and personalized recommendation engines.
- Advanced analytics and downloadable reports.
- Email marketing campaigns.
- Full localization and translated content.
- Live shipping label purchase and carrier tracking APIs.
- Live payment processing.
- Advanced inventory forecasting.
- Multi-currency payment settlement.
- Complex returns/refunds workflows beyond a basic admin status.
- Native apps and marketplace functionality.

---

## 7. Site Map and Pages

### 7.1 Public pages

- `/` — Home
- `/shop` — All active products
- `/categories/[slug]` — Category products
- `/products/[slug]` — Product detail
- `/search` — Search results
- `/about` — Brand story
- `/contact` — Contact information/form
- `/cart` — Shopping cart
- `/checkout` — Protected checkout
- `/checkout/success` — Payment/order result
- `/login` — Sign in
- `/register` — Create account
- `/forgot-password` and reset flow, if supported by configured auth/email setup
- `/privacy` and `/terms` — Demo policy pages with clearly editable content
- Not-found and general error pages

### 7.2 Customer-protected pages

- `/account` — Account overview
- `/account/profile` — Profile details
- `/account/addresses` — Saved addresses
- `/account/orders` — Order history
- `/account/orders/[orderId]` — Order detail
- `/account/wishlist` — Saved products
- `/account/reviews` — Customer's reviews

### 7.3 Admin-protected pages

- `/admin` — Overview metrics
- `/admin/products` — Product list
- `/admin/products/new` — Create product
- `/admin/products/[productId]/edit` — Edit product
- `/admin/categories` — Category management
- `/admin/inventory` — Stock overview and adjustments
- `/admin/orders` — Order queue
- `/admin/orders/[orderId]` — Order details and status updates
- `/admin/coupons` — Coupon management
- `/admin/reviews` — Review moderation
- `/admin/content` — Featured products and homepage content
- `/admin/settings` — Basic store settings and admin profile

Use query parameters for search, sorting, pagination, and filter state rather than creating separate pages for every filter combination.

---

## 8. Core Workflows

### 8.1 Browse and discover

1. Visitor opens the home or shop page.
2. Server loads active products and categories.
3. Visitor searches, filters, sorts, or paginates.
4. The server validates query parameters and queries PostgreSQL.
5. Visitor opens a product detail page.
6. Only active products are publicly visible.

### 8.2 Registration and sign-in

1. User submits the registration form.
2. Zod validates submitted fields.
3. Better Auth handles authentication and session creation.
4. Public registration assigns Customer role only.
5. Protected server operations verify the current session and role.
6. Errors are presented without unnecessarily leaking sensitive account information.

### 8.3 Cart and wishlist

1. Customer adds a product and selected variant to the cart.
2. Redux Toolkit updates the client cart.
3. Guest cart persistence uses a documented browser-local mechanism and contains no secrets.
4. At checkout, the server re-fetches product price and availability.
5. The client may display estimated totals, but the server computes authoritative totals.
6. Wishlist data for signed-in users is stored in PostgreSQL.
7. Guest cart items can be merged after sign-in, with duplicate lines combined and quantities capped by current availability.

### 8.4 Checkout and sandbox payment

1. Customer must be authenticated and provide a valid shipping address.
2. Client submits product/variant IDs, quantities, address ID or validated address snapshot, and an optional coupon code. It does not submit an authoritative price or total.
3. Server validates the request with Zod.
4. Server loads current product prices, active status, variants, stock, and coupon eligibility.
5. Server calculates subtotal, discount, shipping fee, and final total.
6. Server creates an order in `PENDING_PAYMENT` and creates immutable order-item snapshots.
7. Server creates a sandbox checkout session or starts the isolated mock payment adapter.
8. Payment is confirmed only by a verified provider webhook or trusted server-side mock adapter event. A browser redirect alone must never mark an order paid.
9. The confirmation handler is idempotent: processing the same event more than once must not duplicate payment records or deduct stock twice.
10. On verified success, the order becomes paid and confirmed according to the chosen status model, payment is recorded, and inventory is adjusted atomically.
11. On failure or expiration, the order remains unpaid and may be marked `PAYMENT_FAILED` or `EXPIRED`.
12. The result page fetches authoritative order status from the server.

**Inventory approach for MVP:** Do not decrement stock merely because the customer opens checkout. At payment confirmation, use a database transaction with conditional stock updates. If inventory cannot be fulfilled, do not falsely mark the order as successfully fulfilled; record the exception and provide an explicit admin-resolution path. A later iteration may add short-lived stock reservations.

### 8.5 Order fulfillment

Suggested order statuses:

- `PENDING_PAYMENT`
- `CONFIRMED`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `PAYMENT_FAILED`
- `EXPIRED`

Allowed transitions must be defined in server-side business logic. Admins can advance eligible paid orders through fulfillment states. Customers may request cancellation only before the order enters `SHIPPED`; whether cancellation is automatic or requires admin approval must be consistent with the UI. Do not allow arbitrary status assignment from client input.

### 8.6 Reviews

- Only signed-in customers can submit reviews.
- A review requires an eligible delivered or otherwise completed order item for that product.
- Enforce the chosen one-review-per-order-item policy with a database constraint.
- New reviews start as `PENDING` if moderation is enabled.
- Only approved reviews appear publicly.
- Admins can approve, reject, or hide reviews.

### 8.7 Admin product management

1. Admin creates or edits a product with title, slug, SKU, description, category, price, images, variants, stock, and publication status.
2. Zod validates the request.
3. Server checks uniqueness of slug/SKU and validates referenced categories.
4. Product and variant changes are saved in a transaction where needed.
5. Deactivating a product hides it from the public catalog but does not delete historical order snapshots.
6. Stock adjustments are recorded in an inventory movement table with actor, quantity delta, reason, and timestamp.

---

## 9. Business Rules

1. Only Admin can create, edit, deactivate, feature, or delete eligible catalog records.
2. Public registration cannot assign the Admin role.
3. A customer can access only their own profile, addresses, wishlist, reviews, and orders.
4. Blocked or disabled customers cannot create new orders or perform protected customer actions.
5. Inactive products and categories are not publicly discoverable or purchasable.
6. Products with zero available stock cannot be purchased.
7. Variant stock is authoritative when a product has variants; avoid maintaining conflicting stock totals without a defined rule.
8. The backend computes prices, discounts, shipping, and totals.
9. Coupons must be active, within their date window, below usage limits, and satisfy minimum-order rules.
10. Coupon usage must be counted safely under concurrent checkouts and according to the chosen policy; successful payment only is recommended.
11. Payment status is updated only by verified server-side confirmation.
12. Webhook processing must be idempotent and validate event authenticity.
13. Stock deduction and paid-order transition must be transactionally consistent.
14. Order items retain product name, SKU, selected variant, unit price, and quantity snapshots.
15. Historical orders must not change when a product's title or price changes.
16. Store currency is a configured ISO currency code for MVP. Displaying converted estimates does not mean the store can settle payments in every currency.
17. Shipping countries and shipping fees are configurable; unsupported destinations must be rejected clearly.
18. Product images must use validated URLs or an approved upload provider. Do not accept arbitrary server filesystem paths.
19. All admin mutations must be authorized server-side and should record meaningful audit events.
20. Do not store raw card numbers, security codes, or payment credentials.

---

## 10. PostgreSQL Data Model

Use UUID primary keys (or another consistent generated identifier strategy), timestamps, foreign keys, appropriate unique constraints, and indexes. Exact naming can follow ORM conventions as long as relationships and constraints are preserved.

### 10.1 Better Auth tables

Use Better Auth's required user, session, account, and verification schema as defined by the selected version and plugins. Extend the user record with application-specific fields such as:

- `role` (`CUSTOMER` or `ADMIN`, default `CUSTOMER`)
- `isBlocked` (boolean, default false)
- `phone` (nullable)
- `createdAt`, `updatedAt`

Follow the installed Better Auth version's official schema and migration instructions. Do not hand-roll session tables that conflict with Better Auth's required schema.

### 10.2 Application tables

#### `categories`

- `id`
- `name`
- `slug` (unique)
- `description` (nullable)
- `imageUrl` (nullable)
- `isActive`
- `createdAt`, `updatedAt`

#### `products`

- `id`
- `name`
- `slug` (unique)
- `sku` (unique)
- `shortDescription`
- `description`
- `categoryId` (FK)
- `brand` (nullable)
- `price` (integer minor units, e.g. cents; do not use floating point)
- `compareAtPrice` (nullable integer minor units)
- `currency` (ISO code, normally store-configured for MVP)
- `status` (`DRAFT`, `ACTIVE`, `ARCHIVED`)
- `isFeatured`
- `seoTitle` (nullable)
- `seoDescription` (nullable)
- `createdAt`, `updatedAt`

#### `product_images`

- `id`
- `productId` (FK)
- `url`
- `altText`
- `sortOrder`
- `createdAt`

#### `product_variants`

- `id`
- `productId` (FK)
- `sku` (unique)
- `name` (e.g. size or finish label)
- `attributes` (JSONB for flexible attributes such as color, dimensions, material)
- `priceOverride` (nullable integer minor units)
- `stockQuantity` (integer, non-negative)
- `isActive`
- `createdAt`, `updatedAt`

Recommended: every purchasable product has at least one variant, including a default variant for products without selectable options. This gives stock a single source of truth.

#### `addresses`

- `id`
- `userId` (FK)
- `recipientName`
- `phone`
- `addressLine1`
- `addressLine2` (nullable)
- `city`
- `region` (nullable)
- `postalCode` (nullable depending on country)
- `countryCode` (ISO 3166-1 alpha-2)
- `isDefault`
- `createdAt`, `updatedAt`

#### `wishlists`

- `id`
- `userId` (FK, unique for one wishlist per user)
- `createdAt`, `updatedAt`

#### `wishlist_items`

- `id`
- `wishlistId` (FK)
- `productId` (FK)
- `createdAt`
- Unique constraint on `(wishlistId, productId)`

#### `coupons`

- `id`
- `code` (normalized, unique)
- `discountType` (`PERCENTAGE`, `FIXED_AMOUNT`)
- `discountValue` (integer; units defined by discount type)
- `minimumSubtotal` (nullable integer minor units)
- `usageLimit` (nullable integer)
- `usageCount` (integer, default 0)
- `startsAt`, `expiresAt` (nullable)
- `isActive`
- `createdAt`, `updatedAt`

#### `orders`

- `id`
- `orderNumber` (unique, non-sequential or otherwise designed not to expose sensitive information)
- `userId` (FK)
- `status`
- `paymentStatus` (`UNPAID`, `PAID`, `FAILED`, `REFUNDED`)
- `currency`
- `subtotal` (integer minor units)
- `discountAmount` (integer minor units)
- `shippingAmount` (integer minor units)
- `totalAmount` (integer minor units)
- `couponId` (nullable FK)
- Shipping address snapshot fields (recipient, address lines, city, region, postal code, country code)
- `customerNote` (nullable)
- `createdAt`, `updatedAt`, `paidAt` (nullable)

#### `order_items`

- `id`
- `orderId` (FK)
- `productId` (nullable FK to preserve history if product is removed)
- `variantId` (nullable FK)
- `productNameSnapshot`
- `skuSnapshot`
- `variantSnapshot` (JSONB or text)
- `unitPrice` (integer minor units)
- `quantity` (positive integer)
- `lineTotal` (integer minor units)

#### `payments`

- `id`
- `orderId` (FK)
- `provider`
- `providerSessionId` (nullable, unique where present)
- `providerTransactionId` (nullable, unique where present)
- `amount` (integer minor units)
- `currency`
- `status`
- `providerEventId` (nullable, unique where present for idempotency)
- `paidAt` (nullable)
- `createdAt`, `updatedAt`

Do not store card details or secret payment credentials.

#### `reviews`

- `id`
- `userId` (FK)
- `productId` (FK)
- `orderItemId` (FK, unique if enforcing one review per order item)
- `rating` (integer 1–5)
- `title` (nullable)
- `comment` (nullable)
- `status` (`PENDING`, `APPROVED`, `REJECTED`)
- `createdAt`, `updatedAt`

#### `inventory_movements`

- `id`
- `variantId` (FK)
- `quantityDelta` (integer, non-zero)
- `reason` (e.g. `INITIAL_STOCK`, `RESTOCK`, `ORDER_PAID`, `MANUAL_ADJUSTMENT`, `ORDER_CANCELLED`)
- `referenceType` and `referenceId` (nullable)
- `actorUserId` (nullable FK to user)
- `createdAt`

#### `store_settings`

- `id`
- `storeName`
- `defaultCurrency`
- `supportedShippingCountries` (text array or normalized related table)
- `defaultShippingFee` (integer minor units)
- `freeShippingThreshold` (nullable integer minor units)
- `updatedAt`

#### `audit_logs` (MVP-light)

- `id`
- `actorUserId` (nullable FK)
- `action`
- `entityType`
- `entityId` (nullable)
- `metadata` (JSONB with safe, non-secret fields only)
- `createdAt`

### 10.3 Relationships and indexes

- Category 1—many Products.
- Product 1—many Images and Variants.
- User 1—many Addresses and Orders.
- User 1—one Wishlist; Wishlist 1—many Wishlist Items.
- Order 1—many Order Items and Payments.
- Product 1—many Reviews.
- Variant 1—many Inventory Movements.

Create indexes for:
- Product `status`, `categoryId`, `createdAt`, and commonly filtered price fields.
- Case-insensitive product name search or PostgreSQL full-text search, depending on scope.
- Order `(userId, createdAt)`, `status`, and unique `orderNumber`.
- Review `(productId, status)`.
- Foreign keys and unique identifiers where PostgreSQL does not automatically provide the needed query index.

Use database constraints for uniqueness, positive quantities, non-negative stock, and valid references. Keep migrations in version control.

---

## 11. Application Structure

Suggested single-repository structure:

```text
nestora/
├── src/
│   ├── app/
│   │   ├── (storefront)/
│   │   ├── (auth)/
│   │   ├── account/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── products/
│   │   ├── cart/
│   │   └── admin/
│   ├── features/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   └── ui/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── validations/
│   │   ├── payments/
│   │   └── utils/
│   ├── server/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── policies/
│   └── store/
├── drizzle/
├── public/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── drizzle.config.ts
├── .env.example
├── README.md
└── package.json
```

Keep server-only database and payment modules separate from client imports. Add a `server-only` guard to sensitive modules where appropriate. Avoid premature generic abstractions.

---

## 12. API / Server Action Design

Use Next.js Route Handlers for operations that need a stable HTTP interface, webhooks, or explicit request/response contracts. Server Actions may be used for suitable same-app form mutations, but they must enforce the same authorization and validation. Do not implement the same business operation twice.

### Public catalog

- `GET /api/products` — query, category, min/max price, availability, sort, page, pageSize
- `GET /api/products/[slug]` — active product detail
- `GET /api/categories` — active categories
- `GET /api/search/suggestions?q=...` — optional simple suggestions

### Customer

- `GET /api/account`
- `PATCH /api/account/profile`
- `GET /api/account/addresses`
- `POST /api/account/addresses`
- `PATCH /api/account/addresses/[id]`
- `DELETE /api/account/addresses/[id]`
- `GET /api/account/wishlist`
- `POST /api/account/wishlist/items`
- `DELETE /api/account/wishlist/items/[productId]`
- `GET /api/account/orders`
- `GET /api/account/orders/[orderId]`
- `POST /api/checkout` — validate cart and create pending order/payment session
- `POST /api/orders/[orderId]/cancel` — if eligible
- `POST /api/products/[productId]/reviews` — eligible purchasers only

### Admin

- `GET /api/admin/summary`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/[productId]`
- `DELETE /api/admin/products/[productId]` — prefer archive/deactivate when historical references exist
- `GET/POST/PATCH /api/admin/categories`
- `GET /api/admin/inventory`
- `POST /api/admin/inventory/adjustments`
- `GET /api/admin/orders`
- `GET /api/admin/orders/[orderId]`
- `PATCH /api/admin/orders/[orderId]/status`
- `GET/POST/PATCH /api/admin/coupons`
- `GET /api/admin/reviews`
- `PATCH /api/admin/reviews/[reviewId]`
- `PATCH /api/admin/content/featured-products`
- `PATCH /api/admin/settings`

### Payment

- `POST /api/payments/webhook` — verify provider signature against the raw request body, process idempotently, and return the provider-required response.
- Sandbox session creation should run on the server, never in client code with secrets.

The exact paths may be adjusted to the chosen payment provider and Better Auth version, but the security and business behavior must remain equivalent.

---

## 13. Validation, Errors, and UX States

- Use Zod schemas for every untrusted body, query parameter, path parameter, and relevant environment variable.
- Share compatible schemas between client and server when useful, but always validate on the server.
- Return consistent error shapes with a safe message, stable error code, and field errors where appropriate.
- Never return stack traces, SQL errors, secrets, or provider credentials to the browser.
- Provide loading, empty, success, validation-error, network-error, and not-found states.
- Disable repeated checkout submission while a request is pending, but do not rely on the UI for duplicate-order protection.
- Use server-side idempotency or a stable checkout request key where appropriate.
- Provide accessible form labels, keyboard interaction, visible focus, and sufficient contrast.
- Ensure filters and pagination are reflected in URL query parameters for shareable results.

---

## 14. Security and Privacy Requirements

1. Use Better Auth's supported password/session mechanisms; do not implement a parallel homemade auth system.
2. Verify the session on the server for protected pages and every protected mutation.
3. Check user role and resource ownership inside the operation, not only in middleware or client UI.
4. Public signup must not set or update a user's role.
5. Validate and normalize inputs with Zod and database constraints.
6. Use parameterized ORM queries; never concatenate untrusted strings into SQL.
7. Apply rate limiting to sign-in, registration, coupon validation, checkout, reviews, and other abuse-prone routes where supported by deployment infrastructure.
8. Protect against CSRF according to the selected auth and request mechanism; use appropriate same-site cookie settings.
9. Validate webhook signatures and make payment event handling idempotent.
10. Never trust client-supplied prices, discounts, stock, order status, or payment status.
11. Keep secrets in environment variables; do not prefix server secrets with `NEXT_PUBLIC_`.
12. Do not store cardholder data.
13. Restrict image uploads to allowed formats and sizes if uploads are supported; otherwise use trusted hosted image URLs.
14. Avoid exposing customer email, phone, address, or order information in public APIs or logs.
15. Use generic public order identifiers and verify ownership before returning order details.
16. Use secure headers and HTTPS in deployment.
17. Define a retention policy for demo data and provide a way to delete or anonymize test customer data if needed.
18. Seed demo accounts only in non-production or through a controlled deployment setup; never commit real passwords.

This is a portfolio-grade security baseline, not a claim of legal compliance or a production security audit.

---

## 15. Testing Strategy

### Unit tests

- Price and discount calculations.
- Coupon eligibility and usage limits.
- Order status transition rules.
- Quantity validation and stock rules.
- Cart merge behavior.
- Role and ownership policy helpers.
- Currency/minor-unit calculations.

### Integration tests

- Database constraints and repository/service functions.
- Customer cannot read another customer's order.
- Customer cannot access admin operations.
- Public registration cannot create an Admin.
- Inactive product cannot be purchased.
- Checkout ignores client-supplied totals.
- Duplicate payment events do not duplicate stock deduction.
- Inventory cannot become negative during concurrent checkout attempts.
- Review submission requires an eligible order item.

### End-to-end tests (Playwright)

1. Visitor browses and filters products.
2. Customer registers or signs in.
3. Customer adds a product to the cart and checks out in sandbox mode.
4. Verified test payment updates the order and stock.
5. Customer sees the order in order history.
6. Admin creates a product and updates an eligible order status.
7. Unauthenticated users cannot access protected pages.
8. Customer cannot access admin pages or another customer's order.

### Quality gates

- TypeScript check passes.
- Linter passes.
- Unit and integration tests pass.
- Critical Playwright flow passes in the test environment.
- Database migrations apply from an empty database.
- Production build succeeds.
- No secrets are committed.
- Manual keyboard and responsive checks are completed on key pages.

---

## 16. Development Milestones

Build in small, verifiable increments. Do not generate the entire application in one coding-agent task.

### Phase 1 — Foundation

- Initialize Next.js, TypeScript, Tailwind CSS, HeroUI, Redux Toolkit, Zod, Drizzle, and Better Auth.
- Configure PostgreSQL and environment validation.
- Create base layout, navigation, design tokens, and error/loading patterns.
- Add README and `.env.example`.
- **Exit criteria:** App starts locally, database connects, migrations run, lint/typecheck/build pass.

### Phase 2 — Data model and authentication

- Create Drizzle schema and initial migrations.
- Integrate Better Auth using its version-specific schema and configuration.
- Add Customer/Admin authorization helpers and controlled admin seeding.
- Build registration, login, logout, and protected account/admin layouts.
- **Exit criteria:** Auth works; public signup cannot assign Admin; protected server operations enforce roles.

### Phase 3 — Catalog and storefront

- Seed categories and realistic sample products.
- Build home, shop, category, product detail, and search pages.
- Implement server-side filtering, sorting, and pagination.
- Add responsive product cards and empty/loading/error states.
- **Exit criteria:** Catalog queries are correct, inactive products are hidden, key pages work on mobile and desktop.

### Phase 4 — Cart, wishlist, and customer account

- Add Redux cart slice and persistence rules.
- Add cart quantity updates and remove actions.
- Implement database-backed wishlist and saved addresses.
- Merge guest cart on sign-in.
- **Exit criteria:** Cart survives refresh according to the chosen persistence policy; wishlist and addresses are scoped to the customer.

### Phase 5 — Checkout and sandbox payment

- Implement server-authoritative totals, coupons, and shipping calculations.
- Create pending orders and immutable item/address snapshots.
- Integrate a provider sandbox or isolated mock adapter.
- Verify callbacks/webhooks and implement idempotency.
- Apply stock changes transactionally.
- **Exit criteria:** Successful test payment updates payment/order state once; failed payment does not falsely mark the order paid; stock cannot go negative.

### Phase 6 — Admin and fulfillment

- Build product/category/variant CRUD.
- Add stock adjustment history.
- Implement order queue and validated status transitions.
- Add coupons, review moderation, and featured-product management.
- **Exit criteria:** Admin can operate the catalog and orders; customers cannot call admin mutations.

### Phase 7 — Hardening and deployment

- Add unit/integration/E2E tests.
- Improve metadata, accessibility, responsive layouts, and performance.
- Deploy the app and managed PostgreSQL database.
- Configure environment variables and migrations.
- Add demo banner, sample data, architecture diagram, and screenshots.
- **Exit criteria:** Clean production build, passing critical tests, reproducible setup, and documented sandbox-only checkout.

---

## 17. Acceptance Criteria

### Storefront

- [ ] Home, shop, category, product detail, search, cart, and account pages work.
- [ ] Search, filters, sorting, and pagination use validated query parameters.
- [ ] Only active products and categories are public.
- [ ] Product variants and stock availability are clear.
- [ ] Layout is responsive and usable with keyboard navigation.

### Authentication and access control

- [ ] Customer can register, sign in, and sign out.
- [ ] Session validation occurs on the server.
- [ ] Public registration cannot assign Admin.
- [ ] Customer A cannot read or mutate Customer B's orders, addresses, or wishlist.
- [ ] Customer cannot access admin mutations even by calling the endpoint directly.

### Cart and checkout

- [ ] Cart supports add, remove, quantity update, and empty states.
- [ ] Server recomputes all totals and validates stock before order creation.
- [ ] Invalid or expired coupon codes are rejected server-side.
- [ ] Order items and shipping address are snapshotted.
- [ ] Sandbox checkout is clearly labeled and cannot charge real money.
- [ ] Only verified payment confirmation marks an order paid.
- [ ] Repeated payment events are safe and idempotent.
- [ ] Stock never becomes negative.

### Admin

- [ ] Admin can create, edit, deactivate, and feature products.
- [ ] Admin can manage categories, variants, and inventory.
- [ ] Admin can process orders using permitted status transitions.
- [ ] Admin can manage coupons and moderate reviews.
- [ ] Inventory adjustments and important admin actions are recorded.

### Engineering and delivery

- [ ] PostgreSQL schema and migrations are committed.
- [ ] README explains setup, environment variables, seed data, testing, and deployment.
- [ ] `.env.example` contains placeholders only.
- [ ] Typecheck, lint, tests, and production build pass.
- [ ] Critical end-to-end customer and admin flows are tested.
- [ ] No secrets or raw payment-card details are stored in source control or the database.
- [ ] Public demo states actual supported shipping/payment limitations honestly.

---

## 18. Environment Variables

Use an `.env.example` containing placeholder values, for example:

```dotenv
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional sandbox provider: configure only if selected
PAYMENT_PROVIDER=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=

# Optional image hosting provider
IMAGE_HOST=
IMAGE_HOST_API_KEY=
```

Use the exact variable names required by the selected provider and Better Auth configuration. Keep server-only values private. Never put actual credentials in the repository or public build variables.

---

## 19. Portfolio Presentation

The deployed project should include:

- A concise product story and intended customer.
- Public storefront demo with realistic seed products.
- A clearly labeled test-payment checkout.
- Customer and Admin demo paths that do not expose production data.
- Screenshots of storefront, product detail, cart, checkout result, order history, and admin dashboard.
- A README architecture diagram and data-model overview.
- A short explanation of decisions: why Next.js full-stack, why Redux is limited to client state, why Drizzle, how Better Auth integrates, and how checkout idempotency and inventory consistency are handled.
- Known limitations and future improvements.

Do not claim actual sales, validated market demand, production payment processing, or worldwide shipping unless those have genuinely been implemented and verified.

---

## 20. Future Enhancements (After MVP)

Prioritize only after the acceptance criteria are met:

1. Email notifications for order confirmation and shipping updates.
2. Product comparison and recently viewed items.
3. Admin CSV export for products and orders.
4. A return/refund request workflow.
5. Additional locale support and localized content.
6. Carrier tracking integration for supported destinations.
7. Live payments after provider eligibility, compliance, and operational requirements are reviewed.
8. Search improvements and basic sales analytics.

---

## Final Scope Statement

NESTORA is a **single-vendor, medium-sized, full-stack home and lifestyle e-commerce application**. Its MVP includes customer shopping, authentication, cart and wishlist, sandbox checkout, order history, and an admin workflow for products, stock, orders, coupons, and reviews. It uses Next.js App Router, TypeScript, Redux Toolkit, PostgreSQL, Drizzle ORM, Better Auth, Tailwind CSS, HeroUI, clsx, tailwind-merge, and Zod.

The project is complete when the end-to-end workflows are reliable, security rules are enforced server-side, tests pass, setup is documented, and the deployed demo communicates its test-payment and shipping limitations clearly.
