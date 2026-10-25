import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { categories, products, productImages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { CatalogView } from "@/components/products/catalog-view";
import { Sparkles, ChevronRight } from "lucide-react";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "All Collections — NESTORA Atelier",
  description:
    "Explore the complete anthology of architectural desk organizers, calm ambient lighting, and master-crafted ceramics.",
  alternates: {
    canonical: `${baseUrl}/shop`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${baseUrl}/shop`,
    title: "All Collections — NESTORA Atelier",
    description:
      "Explore the complete anthology of architectural desk organizers, calm ambient lighting, and master-crafted ceramics.",
    siteName: "NESTORA",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&h=630&q=85",
        width: 1200,
        height: 630,
        alt: "NESTORA Full Catalog Anthology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Collections — NESTORA Atelier",
    description:
      "Explore the complete anthology of architectural desk organizers, calm ambient lighting, and master-crafted ceramics.",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&h=630&q=85",
    ],
  },
};

export default async function ShopPage() {
  // 1. Fetch all active categories from PostgreSQL
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .where(eq(categories.isActive, true));

  // 2. Fetch all approved & active products (Enforcing Admin Approval Rule)
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      currency: products.currency,
      isFeatured: products.isFeatured,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.status, "ACTIVE"), eq(products.isApproved, true)));

  // 3. Fetch primary images
  const images = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(eq(productImages.sortOrder, 0));

  const imageMap = new Map<string, string>();
  for (const img of images) {
    imageMap.set(img.productId, img.url);
  }

  const catalogProducts = allProducts.map((p) => ({
    ...p,
    imageUrl:
      imageMap.get(p.id) ||
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
    categoryName: p.categoryName || undefined,
    categorySlug: p.categorySlug || undefined,
  }));

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

      {/* Shop Content */}
      <div className="py-6 xs:py-8 sm:py-10 md:py-12 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 text-xs text-[var(--muted-text)] flex items-center gap-1.5">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-[var(--foreground)] font-medium">
            All Collections
          </span>
        </nav>

        {/* Catalog View */}
        <CatalogView
          title="All Collections"
          description="Explore the complete anthology of architectural desk organizers, calm ambient lighting, and master-crafted ceramics designed for intentional living."
          currentCategorySlug={null}
          categories={allCategories}
          products={catalogProducts}
        />
      </div>

      {/* Footer */}
      <StorefrontFooter />
    </main>
  );
}
