import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { Sparkles, ChevronRight, ArrowRight, Layers, Compass } from "lucide-react";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Curated Spaces & Collections — NESTORA Atelier",
  description:
    "Explore our deliberate collections designed for architectural desk setups, serene ambient lighting, handcrafted ceramics, and minimal storage.",
  alternates: {
    canonical: `${baseUrl}/category`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${baseUrl}/category`,
    title: "Curated Spaces & Collections — NESTORA Atelier",
    description:
      "Explore our deliberate collections designed for architectural desk setups, serene ambient lighting, handcrafted ceramics, and minimal storage.",
    siteName: "NESTORA",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&h=630&q=85",
        width: 1200,
        height: 630,
        alt: "NESTORA Curated Spaces Anthology",
      },
    ],
  },
};

export default async function CategoriesPage() {
  // 1. Fetch all active categories from PostgreSQL
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      imageUrl: categories.imageUrl,
    })
    .from(categories)
    .where(eq(categories.isActive, true));

  // 2. Fetch product counts for each category (Active & Admin-Approved only)
  const productCounts = await db
    .select({
      categoryId: products.categoryId,
      count: sql<number>`count(${products.id})::int`,
    })
    .from(products)
    .where(and(eq(products.status, "ACTIVE"), eq(products.isApproved, true)))
    .groupBy(products.categoryId);

  const countMap = new Map<string, number>();
  for (const pc of productCounts) {
    if (pc.categoryId) {
      countMap.set(pc.categoryId, Number(pc.count));
    }
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
      <StorefrontHeader />

      {/* Main Page Container */}
      <div className="py-6 xs:py-8 sm:py-10 md:py-12 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 text-xs text-[var(--muted-text)] flex items-center gap-1.5">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-[var(--foreground)] font-medium">
            Curated Spaces
          </span>
        </nav>

        {/* Page Hero Header */}
        <div className="mb-8 xs:mb-10 sm:mb-12 border-b border-black/5 dark:border-white/10 pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#264E3A]/10 dark:bg-[#478466]/20 text-[#264E3A] dark:text-[#67B58E] border border-[#264E3A]/20 dark:border-[#478466]/30 mb-3 sm:mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Atelier Spaces • Mindfully Curated Environments</span>
          </div>

          <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            Curated Spaces & Collections
          </h1>

          <p className="text-xs xs:text-sm sm:text-base text-[var(--muted-text)] mt-2 sm:mt-3 max-w-2xl leading-relaxed">
            Deliberate arrangements crafted from honest materials — solid Japanese white oak, turned brass, and tactile stoneware. Discover architectural essentials tailored to specific zones of everyday living.
          </p>
        </div>

        {/* Categories Showcase Grid: 2 cols on mobile/tablet, 3 cols on desktop, 4 on 2xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {allCategories.map((cat) => {
            const count = countMap.get(cat.id) || 0;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-stone-200/90 dark:border-stone-800/90 bg-stone-50/50 dark:bg-stone-900/40 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container with Ambient Overlay */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <Layers className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Top Space Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-xs">
                      Space
                    </span>
                  </div>

                  {/* Product Count Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-md bg-white/90 dark:bg-black/80 text-stone-900 dark:text-stone-100 backdrop-blur-md shadow-xs">
                      {count} {count === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-stone-300">
                      Collection
                    </p>
                    <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                {/* Card Content & Action */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                  <p className="text-xs sm:text-sm text-[var(--muted-text)] line-clamp-2 leading-relaxed">
                    {cat.description ||
                      `Thoughtfully designed pieces and tactile lifestyle objects for your ${cat.name.toLowerCase()} space.`}
                  </p>

                  <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#264E3A] dark:text-[#67B58E] group-hover:underline">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back Link to Complete Catalog */}
        <div className="mt-12 sm:mt-16 text-center pt-8 border-t border-black/5 dark:border-white/10">
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mb-3">
            Prefer to explore every handcrafted piece across all collections at once?
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#264E3A] hover:bg-[#1f3f2f] text-white shadow-xs transition-colors"
          >
            <span>Browse Complete Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <StorefrontFooter />
    </main>
  );
}
