# NESTORA — Multi-Device Adaptive Responsive Design System Rule

## 1. Core Principle
In NESTORA E-Commerce, **no UI element may use static, non-responsive default sizing**. 
Small smartphones, medium tablets, laptops, and ultra-wide desktop monitors have radically different physical screen dimensions, viewing distances, and input modalities (touch vs. mouse pointer).

Every single component, heading, button, badge, padding, and layout grid MUST be explicitly scaled across all 6 responsive tiers:
- **`xs` (375px):** Compact smartphones (iPhone SE, iPhone 14/15/16, Android standards).
- **`sm` (640px):** Large smartphones in landscape, compact phablets.
- **`md` (768px):** Medium tablets (iPad 10th gen, iPad Air, Galaxy Tab).
- **`lg` (1024px):** Laptops, split-screen desktop windows with DevTools docked.
- **`xl` (1280px):** Standard Full HD desktop monitors (1080p).
- **`2xl` (1536px+):** Ultra-wide & 2K/4K large displays.

---

## 2. Adaptive Typography Hierarchy

| UI Element | `< xs` (<375px) | `xs` (375px) | `sm` (640px) | `md` (768px) | `lg` (1024px) | `xl` & `2xl` (1280px+) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `text-2xl` | `text-3xl` | `text-4xl` | `text-5xl` | `text-6xl` | `text-7xl` |
| **Section Heading** | `text-lg` | `text-xl` | `text-2xl` | `text-3xl` | `text-3xl` | `text-4xl` |
| **Card Title** | `text-xs` | `text-sm` | `text-sm` | `text-base` | `text-base` | `text-lg` |
| **Price / Value** | `text-xs` | `text-sm` | `text-sm` | `text-base` | `text-base` | `text-lg` |
| **Micro-Label / Overline** | `text-[9px]` | `text-[10px]` | `text-[10px]` | `text-xs` | `text-xs` | `text-xs font-mono` |
| **Body Paragraph** | `text-xs` | `text-sm` | `text-base` | `text-base` | `text-lg` | `text-xl leading-relaxed` |

---

## 3. Adaptive Badges & Micro-Pills

Never use oversized desktop badges on compact mobile cards:
- **Mobile (`< xs` & `xs`):** `text-[9px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider`
- **Small (`sm`):** `text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider`
- **Medium (`md`):** `text-[11px] px-2.5 py-1 rounded-md font-semibold`
- **Desktop (`lg` / `xl`):** `text-xs px-3 py-1.5 rounded-full font-semibold shadow-xs`

---

## 4. Adaptive Buttons & Interactive Touch Targets

Adhere to modern mobile touch ergonomics (minimum 38-44px touch targets on handheld devices) while scaling to elegant luxury proportions on desktop:
- **Mobile (`xs`):** `py-2 px-3 text-xs rounded-lg min-h-[38px] font-semibold`
- **Small (`sm`):** `py-2.5 px-4 text-xs sm:text-sm rounded-xl min-h-[42px]`
- **Medium (`md`):** `py-3 px-5 text-sm rounded-xl min-h-[44px]`
- **Desktop (`lg`):** `py-3.5 px-6 text-sm rounded-full min-h-[48px] hover:shadow-md transition-all`
- **Large Desktop (`xl` / `2xl`):** `py-4 px-7 text-base rounded-full min-h-[52px]`

---

## 5. Storefront Grid Progression Standards

1. **Product Cards Grid:**
   - **Mobile (`< xs`, `xs`), `sm`, `md` (`<1024px`):** STRICTLY **2 columns** (`grid-cols-2 md:grid-cols-2`). Never 1 column on mobile or tablet.
   - **Laptop (`lg: 1024px`):** STRICTLY **3 columns** (`lg:grid-cols-3`).
   - **Wide Desktop (`xl: 1280px+`):** STRICTLY **4 columns** (`xl:grid-cols-4`).
   - Utility declaration: `grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6`

2. **Category Cards Grid (`Curated Spaces`):**
   - **Mobile & Tablet (`<1024px`):** 2 columns (`grid-cols-2`).
   - **Desktop (`1024px+`):** 4 columns (`md:grid-cols-4`).

---

## 6. Layout Containers & Spacing Standards

- **Horizontal Page Gutter:** `px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full`
- **Section Vertical Rhythm:** `py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24`
- **Horizontal Overflow Protection:** Every page container MUST enforce `w-full overflow-x-hidden` at the root `<main>` or layout tag.
