# NESTORA --- UI/UX Design Brief

## 1. Brand and product intent

**Brand:** NESTORA\
**Category:** Home and lifestyle single-vendor store\
**Brand promise:** Thoughtful essentials for a more comfortable,
organized everyday life.\
**Design goal:** A polished, trustworthy, calm, product-led shopping
experience that feels credible on desktop and mobile.

This is a design direction, not a claim of validated market research.
Human approval is required before the visual system is applied broadly.

## 2. Visual principles

-   **Calm and purposeful:** generous but not wasteful whitespace; clear
    hierarchy; no visual clutter.
-   **Product-first:** product imagery, name, price, availability, and
    next action should be easy to scan.
-   **Consistent:** use shared tokens and reusable components rather
    than one-off styling.
-   **Accessible:** sufficient contrast, visible focus, semantic
    headings, keyboard operation, labels, and meaningful alt text.
-   **Responsive:** mobile is a first-class layout, not a compressed
    desktop page.
-   **Honest:** no fake ratings, false scarcity, fake reviews,
    unimplemented controls, unsupported delivery promises, or unverified
    discount claims.
-   **Fast-feeling:** useful loading states and stable layouts; optimize
    images and avoid layout shifts.

## 3. Suggested visual direction

Use a restrained warm-neutral base inspired by natural materials, with
one dark ink color and one restrained botanical/earth accent. Confirm
exact hex values through a design task before adding tokens. Do not
apply arbitrary new colors to individual pages.

-   Backgrounds: warm white or soft neutral.
-   Main text: high-contrast charcoal/ink.
-   Accent: muted olive, forest, or earthy green.
-   Supporting surfaces: subtle neutral tint and borders.
-   Status colors: semantic and accessible; do not rely on color alone.
-   Typography: readable modern sans-serif with clear heading/body
    contrast.
-   Corners and shadows: consistent, restrained, functional.
-   Motion: short and purposeful; respect reduced-motion preferences.

## 4. Core page patterns

### Storefront shell

-   Header with brand, primary navigation, search entry point, account,
    wishlist/cart entry points.
-   Clear mobile navigation with keyboard-accessible controls.
-   Footer with real navigation, store information, support/contact
    placeholders only if explicitly labeled and intended.
-   Consistent content max-width and responsive gutters.

### Home page

-   A clear headline and one primary shopping action.
-   Curated categories or collections.
-   Featured products based on actual product data.
-   Helpful value propositions only when the store can support them.
-   No fabricated testimonials, review counts, shipping guarantees, or
    "best seller" claims.

### Catalog/shop

-   Page title and useful result count when available.
-   Search, filters, sort, and pagination with query state that is
    understandable and testable.
-   Product cards with stable image aspect ratio, readable name/price,
    and clear action.
-   Empty state with a clear reset path.
-   Loading skeleton that preserves layout.
-   Error state with retry where appropriate.

### Product details

-   Product image gallery with meaningful alt text.
-   Product title, price, availability, description, variant selection
    if applicable, quantity control, and add-to-cart action.
-   Clear validation for unavailable or invalid variants.
-   Do not show purchase controls for inactive products.
-   Do not imply inventory counts or ratings that are not supported by
    data.

### Cart and checkout

-   Clearly listed line items, quantity controls, remove action,
    subtotal, discounts/shipping if applicable, and server-calculated
    final total.
-   Explain when totals or shipping are still being calculated.
-   Checkout clearly labels sandbox/test payment.
-   Success, pending, failure, and retry paths must be distinguishable.
-   Do not request or store raw card details in the mock-payment flow.

### Customer account

-   Clear navigation between profile, addresses, wishlist, and orders.
-   Helpful empty states and form validation.
-   Data must be scoped to the signed-in customer.

### Admin

-   Operational rather than promotional design.
-   Clear table/list hierarchy, filters, status indicators,
    confirmations for consequential actions, and visible validation
    errors.
-   Destructive actions require explicit confirmation.
-   Inventory changes should capture a reason and provide a history.
-   Admin routes and mutations must be protected on the server.

## 5. Component states checklist

Every interactive component must consider applicable states: - Default -
Hover - Focus-visible - Active/pressed - Disabled - Loading - Empty -
Error - Success - Unavailable/out of stock - Permission denied

Avoid buttons that do nothing. If an action is not implemented, do not
present it as functional.

## 6. Responsive and accessibility baseline

Verify at a minimum: - Small mobile width around 320--375 px. - Common
mobile width around 390--430 px. - Tablet around 768 px. - Desktop
around 1280--1440 px.

These are test targets, not hard-coded breakpoints. Follow existing
responsive conventions if established.

Check: - No horizontal overflow. - Navigation and forms work by
keyboard. - Focus is visible and not trapped incorrectly. - Labels and
errors are associated with fields. - Images have appropriate alt text. -
Text and interactive elements have adequate contrast and target sizes. -
Headings and landmarks are semantic. - Motion respects reduced-motion
settings when motion is present. - Screen-reader announcements are
appropriate for important async updates.

## 7. Visual task approval process

For a new major page or design system: 1. Agent researches current
project patterns and proposes a design plan. 2. Agent shows a concise
component/layout spec and any available screenshot/reference. 3. Human
approves the direction. 4. Agent implements one shell/component/page
slice. 5. Agent checks mobile/tablet/desktop and states. 6. Agent
reports screenshots/URLs only if they were actually captured and
available. 7. Human reviews before the next UI task.

Never claim pixel-perfect verification without an actual visual
comparison.
