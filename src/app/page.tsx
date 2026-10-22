import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { categories, products, productImages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserNav } from "@/components/navigation/user-nav";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { ProductCard } from "@/components/products/product-card";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import {
  ShoppingBag,
  Heart,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Leaf,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch active categories from PostgreSQL
  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true));

  // 2. Fetch active and approved products (Enforcing Admin Approval Rule)
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      currency: products.currency,
      categoryId: products.categoryId,
      isFeatured: products.isFeatured,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.status, "ACTIVE"), eq(products.isApproved, true)));

  // 3. Fetch primary images for each product
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.sortOrder, 0));

  const imageMap = new Map<string, string>();
  for (const img of images) {
    imageMap.set(img.productId, img.url);
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col justify-between selection:bg-[#264E3A] selection:text-white dark:selection:bg-[#478466]">
      {/* Top Notification Bar */}
      <div className="w-full bg-[#264E3A] dark:bg-[#182C22] text-stone-100 text-[11px] xs:text-xs py-1.5 px-3 xs:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-[#B2834E] shrink-0" />
        <span className="truncate">
          Complimentary tracked worldwide shipping on all orders over $100.
        </span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--background)]/90 border-b border-black/5 dark:border-white/10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
          {/* Left: Mobile Drawer Trigger & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <MobileMenu cartCount={0} />

            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-[#264E3A] dark:bg-[#478466] flex items-center justify-center text-white font-serif font-bold text-base sm:text-xl shadow-xs shrink-0 group-hover:opacity-90 transition-opacity">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  NESTORA
                </span>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase text-[var(--muted-text)] font-mono -mt-1 hidden sm:block">
                  Home & Lifestyle
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop only) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)]" />
              <input
                type="text"
                placeholder="Search organizers, lighting, ceramics..."
                readOnly
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4 shrink-0">
            {/* Theme Toggle (Desktop only) */}
            <div className="hidden md:flex">
              <ThemeToggle />
            </div>

            {/* Wishlist Button (Desktop only) */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden md:flex p-2 sm:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--foreground)] transition-colors relative"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--muted-text)] hover:text-red-500 transition-colors" />
            </Link>

            {/* Cart Icon (Always visible) */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="p-1.5 xs:p-2 sm:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--foreground)] transition-colors relative flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="inline-flex items-center justify-center text-[10px] font-bold bg-[#264E3A] dark:bg-[#478466] text-white w-4 h-4 rounded-full">
                0
              </span>
            </Link>

            {/* User Account Navigation (Desktop only) */}
            <div className="hidden md:flex">
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Ultra-Premium Hero Showcase Section */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-20 lg:py-24 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full">
        {/* Ambient Glow Orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-0 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#264E3A]/15 dark:bg-[#478466]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-10 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-[#B2834E]/10 dark:bg-[#C79A63]/10 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Narrative & Action */}
          <div className="lg:col-span-7 space-y-4 xs:space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-full text-[10px] xs:text-xs font-semibold bg-[#264E3A]/10 dark:bg-[#478466]/20 text-[#264E3A] dark:text-[#67B58E] border border-[#264E3A]/20 dark:border-[#478466]/30 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autumn/Winter Small-Batch 04 • Single-Vendor Atelier</span>
            </div>

            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--foreground)] leading-[1.08]">
              Thoughtful living,{" "}
              <span className="italic font-normal text-[#264E3A] dark:text-[#67B58E]">
                quietly refined.
              </span>
            </h1>

            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-[var(--muted-text)] font-sans leading-relaxed max-w-2xl">
              A deliberate collection of solid Japanese oak desk stands, ambient brass lamps, and
              hand-thrown stoneware. Engineered for spaces that prioritize ergonomic calm and deep focus.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 xs:gap-3 sm:gap-4 pt-1 xs:pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-4 xs:px-6 sm:px-7 py-2.5 xs:py-3 sm:py-3.5 rounded-full bg-[#264E3A] dark:bg-[#478466] text-white text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-md shadow-[#264E3A]/20"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              </Link>
              <Link
                href="/category/workspace"
                className="inline-flex items-center justify-center gap-2 px-3.5 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3.5 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-colors"
              >
                <span>Desk Architecture</span>
              </Link>
            </div>

            {/* Trust Metrics Strip */}
            <div className="pt-3 xs:pt-4 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-wrap items-center gap-y-2 xs:gap-y-3 gap-x-4 xs:gap-x-6 text-[10px] xs:text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <span className="text-[#B2834E] font-bold">★★★★★</span>
                <span className="font-medium text-stone-700 dark:text-stone-300">4.9/5 Rating</span>
                <span className="text-stone-400 hidden xs:inline">(1,400+ homes)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Solid Certified Timber</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Plastic Packaging</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Flagship Showcase Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative group rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161716] shadow-xl">
              {/* Flagship Image Container */}
              <div className="relative aspect-4/3 sm:aspect-5/4 w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                <Image
                  src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85"
                  alt="Kanso Solid Oak Monitor Riser in curated workspace"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#B2834E]" />
                    <span>Flagship Piece • Kyoto White Oak</span>
                  </span>
                </div>

                {/* Bottom Card Tag */}
                <div className="absolute bottom-3.5 inset-x-3.5 p-3 rounded-2xl bg-white/90 dark:bg-black/75 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-between z-10">
                  <div>
                    <p className="font-serif text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                      Kanso Solid Oak Monitor Riser
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Natural hand-rubbed matte oil finish
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-[#264E3A] dark:text-[#67B58E]">
                      $125.00
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      In stock
                    </span>
                  </div>
                </div>
              </div>

              {/* Three Mini Feature Badges */}
              <div className="p-3.5 bg-stone-50/80 dark:bg-[#181918] border-t border-stone-200/80 dark:border-stone-800/80 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                <div className="p-1 rounded-lg bg-stone-200/50 dark:bg-stone-800/50">
                  🌿 100% Solid Oak
                </div>
                <div className="p-1 rounded-lg bg-stone-200/50 dark:bg-stone-800/50">
                  ⚡ Cable Route
                </div>
                <div className="p-1 rounded-lg bg-stone-200/50 dark:bg-stone-800/50">
                  📦 Cork Dampers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto w-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] py-8 xs:py-10 sm:py-12">
        <div className="flex items-center justify-between mb-4 xs:mb-6 sm:mb-8">
          <div>
            <span className="text-[9px] xs:text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#B2834E]">
              Explore by Category
            </span>
            <h2 className="font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)] mt-0.5 xs:mt-1">
              Curated Spaces
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs sm:text-sm font-semibold text-[#264E3A] dark:text-[#67B58E] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 md:gap-6">
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative h-36 xs:h-44 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/60 dark:border-stone-800/60 shadow-xs"
            >
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 xs:bottom-3 xs:left-3 xs:right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
                <p className="text-[9px] xs:text-[10px] font-mono uppercase tracking-wider text-stone-300">
                  Collection
                </p>
                <h3 className="font-serif text-xs xs:text-sm sm:text-base md:text-lg font-bold tracking-tight mt-0.5 group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section (Real Data from PostgreSQL) */}
      <section className="max-w-7xl mx-auto w-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] py-10 xs:py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 xs:mb-8 sm:mb-10">
          <div>
            <span className="text-[9px] xs:text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#B2834E]">
              Handcrafted Essentials
            </span>
            <h2 className="font-serif text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] mt-0.5 xs:mt-1">
              Featured Collection
            </h2>
            <p className="text-xs xs:text-sm text-[var(--muted-text)] mt-1 xs:mt-1.5 max-w-xl">
              Authentic pieces made from Japanese white oak, turned brass, and textured clay.
              Every item is verified and active in our database.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#264E3A] dark:text-[#67B58E] hover:underline shrink-0"
          >
            <span>Browse Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* Responsive Product Grid: 2 columns on mobile, sm, and md; 3 columns on lg; 4 columns on xl+ */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {allProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              currency={product.currency}
              categoryName={product.categoryName || undefined}
              imageUrl={
                imageMap.get(product.id) ||
                "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80"
              }
              isFeatured={product.isFeatured}
            />
          ))}
        </div>
      </section>

      {/* Brand Values Section */}
      <section className="w-full bg-stone-100/60 dark:bg-[#151615] border-y border-stone-200/80 dark:border-stone-800/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px]">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#264E3A]/10 dark:bg-[#478466]/20 text-[#264E3A] dark:text-[#67B58E] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--foreground)]">
                Tracked Global Delivery
              </h3>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                Direct dispatch with full tracking information provided on every international shipment.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#264E3A]/10 dark:bg-[#478466]/20 text-[#264E3A] dark:text-[#67B58E] flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--foreground)]">
                Honest Sustainable Materials
              </h3>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                FSC-certified timber, natural linen, and lead-free glazes. 100% plastic-free packaging.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#264E3A]/10 dark:bg-[#478466]/20 text-[#264E3A] dark:text-[#67B58E] flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--foreground)]">
                30-Day Calm Guarantee
              </h3>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                Experience the items in your home. Simple, hassle-free returns within 30 days.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#264E3A]/10 dark:bg-[#478466]/20 text-[#264E3A] dark:text-[#67B58E] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--foreground)]">
                Verified Single Vendor
              </h3>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                No third-party marketplace clutter. Every item curated and fulfilled directly by NESTORA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E-Commerce Footer */}
      <footer className="w-full bg-[var(--background)] border-t border-black/5 dark:border-white/10 pt-10 xs:pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 pb-10 border-b border-black/5 dark:border-white/10">
            {/* Brand column */}
            <div className="space-y-3 sm:col-span-2 lg:col-span-4 max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#264E3A] dark:bg-[#478466] flex items-center justify-center text-white font-serif font-bold text-base shadow-xs">
                  N
                </div>
                <span className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">
                  NESTORA
                </span>
              </div>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                A single-vendor home and lifestyle atelier dedicated to ergonomic calmness,
                architectural lighting, and intentional everyday objects.
              </p>
            </div>

            {/* Collections */}
            <div className="space-y-2.5 sm:col-span-1 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Collections
              </p>
              <ul className="space-y-1.5 text-xs text-[var(--muted-text)]">
                <li>
                  <Link href="/category/workspace" className="hover:text-[var(--foreground)] transition-colors">
                    Desk & Workspace
                  </Link>
                </li>
                <li>
                  <Link href="/category/lighting" className="hover:text-[var(--foreground)] transition-colors">
                    Ambient Lighting
                  </Link>
                </li>
                <li>
                  <Link href="/category/ceramics" className="hover:text-[var(--foreground)] transition-colors">
                    Handcrafted Ceramics
                  </Link>
                </li>
                <li>
                  <Link href="/category/storage" className="hover:text-[var(--foreground)] transition-colors">
                    Minimal Storage
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-2.5 sm:col-span-1 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Customer Care
              </p>
              <ul className="space-y-1.5 text-xs text-[var(--muted-text)]">
                <li>
                  <Link href="/shipping" className="hover:text-[var(--foreground)] transition-colors">
                    Shipping & Dispatch
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-[var(--foreground)] transition-colors">
                    30-Day Returns Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
                    Support & Atelier Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-2.5 sm:col-span-2 lg:col-span-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Newsletter
              </p>
              <p className="text-xs text-[var(--muted-text)]">
                Receive release notes for seasonal small-batch productions.
              </p>
              <NewsletterForm />
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-text)]">
            <p>© {new Date().getFullYear()} NESTORA Atelier Inc. All rights reserved.</p>
            <p className="font-mono text-[11px]">Next.js 16 • PostgreSQL • Drizzle ORM • Better Auth</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
