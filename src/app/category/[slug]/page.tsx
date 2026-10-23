import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { categories, products, productImages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { CatalogView } from "@/components/products/catalog-view";
import { Sparkles, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO Metadata for Category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  const [category] = await db
    .select({
      name: categories.name,
      description: categories.description,
    })
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);

  if (!category) {
    return {
      title: "Category Not Found | NESTORA",
      description: "The requested collection is not available in our atelier.",
    };
  }

  return {
    title: `${category.name} — NESTORA Collections`,
    description: category.description || `Explore our curated ${category.name} collection.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // 1. Fetch target category from PostgreSQL
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);

  if (!category) {
    notFound();
  }

  // 2. Fetch all active categories for navigation pills
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .where(eq(categories.isActive, true));

  // 3. Fetch products belonging to this category (Enforcing Admin Approval Rule)
  const categoryProducts = await db
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
    .where(
      and(
        eq(products.categoryId, category.id),
        eq(products.status, "ACTIVE"),
        eq(products.isApproved, true)
      )
    );

  // 4. Fetch primary images for these products
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

  const catalogProducts = categoryProducts.map((p) => ({
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

      {/* Category Catalog Content */}
      <div className="py-6 xs:py-8 sm:py-10 md:py-12 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 text-xs text-[var(--muted-text)] flex items-center gap-1.5">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link href="/shop" className="hover:text-[var(--foreground)] transition-colors">
            Collections
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-[var(--foreground)] font-medium">
            {category.name}
          </span>
        </nav>

        {/* Catalog View */}
        <CatalogView
          title={category.name}
          description={category.description}
          currentCategorySlug={category.slug}
          categories={allCategories}
          products={catalogProducts}
        />
      </div>

      {/* Footer */}
      <StorefrontFooter />
    </main>
  );
}
