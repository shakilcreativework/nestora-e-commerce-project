import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { products, categories, productImages, productVariants } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { ProductReviews } from "@/components/products/product-reviews";
import { ProductCard } from "@/components/products/product-card";
import { getProductReviews } from "@/lib/actions/reviews";
import { getCurrentUser } from "@/lib/auth-guard";
import { Sparkles, ArrowRight } from "lucide-react";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO & OpenGraph Metadata (NESTORA-037)
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      shortDescription: products.shortDescription,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
    })
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.status, "ACTIVE"), eq(products.isApproved, true)))
    .limit(1);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested object is not available in our atelier collection.",
    };
  }

  // Fetch primary image for OpenGraph / Twitter previews
  const [primaryImage] = await db
    .select({ url: productImages.url })
    .from(productImages)
    .where(and(eq(productImages.productId, product.id), eq(productImages.sortOrder, 0)))
    .limit(1);

  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.shortDescription;
  const imageUrl =
    primaryImage?.url ||
    "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&h=630&q=85";
  const canonicalUrl = `${baseUrl}/product/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: canonicalUrl,
      title: `${title} | NESTORA`,
      description,
      siteName: "NESTORA",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | NESTORA`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. Fetch target product from PostgreSQL (Enforcing Admin Approval & Active Status)
  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      sku: products.sku,
      shortDescription: products.shortDescription,
      description: products.description,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      currency: products.currency,
      brand: products.brand,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.status, "ACTIVE"), eq(products.isApproved, true)))
    .limit(1);

  if (!product) {
    notFound();
  }

  // 2. Fetch all gallery images for this product, ordered by sortOrder
  const images = await db
    .select({
      id: productImages.id,
      url: productImages.url,
      altText: productImages.altText,
      sortOrder: productImages.sortOrder,
    })
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);

  // 3. Fetch variants to calculate live stock level
  const variants = await db
    .select({
      stockQuantity: productVariants.stockQuantity,
    })
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));

  const totalStock = variants.length > 0
    ? variants.reduce((acc, curr) => acc + (curr.stockQuantity || 0), 0)
    : 15; // default fallback if unassigned

  // 4. Fetch up to 4 related products in the same category
  const relatedRows = await db
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
    .where(
      and(
        eq(products.categoryId, product.categoryId),
        ne(products.id, product.id),
        eq(products.status, "ACTIVE"),
        eq(products.isApproved, true)
      )
    )
    .limit(4);

  // Fetch images for related products
  const relatedImages = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(eq(productImages.sortOrder, 0));

  const relatedImageMap = new Map<string, string>();
  for (const img of relatedImages) {
    relatedImageMap.set(img.productId, img.url);
  }

  // 4. Fetch live approved customer reviews & current session
  const reviewSummary = await getProductReviews(product.id);
  const currentUser = await getCurrentUser();

  // 5. Build Schema.org Product Structured Data (NESTORA-037)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images.map((i) => i.url),
    description: product.shortDescription,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "NESTORA",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: product.currency,
      price: (product.price / 100).toFixed(2),
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "NESTORA",
      },
    },
    ...(reviewSummary.totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviewSummary.averageRating,
            reviewCount: reviewSummary.totalReviews,
          },
        }
      : {}),
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col justify-between selection:bg-[#264E3A] selection:text-white dark:selection:bg-[#478466]">
      {/* Schema.org Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Top Banner */}
      <div className="w-full bg-[#264E3A] dark:bg-[#182C22] text-stone-100 text-[11px] xs:text-xs py-1.5 px-3 xs:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-[#B2834E] shrink-0" />
        <span className="truncate">
          Complimentary tracked worldwide shipping on all orders over $100.
        </span>
      </div>

      {/* Main Header */}
      <StorefrontHeader />

      {/* Product Detail Section */}
      <section className="py-6 xs:py-8 sm:py-10 md:py-12 lg:py-14 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full">
        <ProductDetailView
          product={{
            ...product,
            stockQuantity: totalStock,
            rating: reviewSummary.averageRating,
            reviewCount: reviewSummary.totalReviews,
          }}
          images={images}
        />
      </section>

      {/* Customer Reviews & Community Feedback Section (NESTORA-066) */}
      <section className="py-8 sm:py-12 border-t border-black/5 dark:border-white/10 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full">
        <ProductReviews
          productId={product.id}
          productName={product.name}
          reviewSummary={reviewSummary}
          isLoggedIn={!!currentUser}
        />
      </section>

      {/* Related Products / Curated Cross-Sell Section */}
      {relatedRows.length > 0 && (
        <section className="py-10 sm:py-14 md:py-16 border-t border-black/5 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full">
            <div className="flex items-end justify-between mb-6 sm:mb-8">
              <div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#264E3A] dark:text-[#67B58E] font-semibold">
                  Complete the Aesthetic
                </span>
                <h2 className="font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)] mt-1">
                  You May Also Like
                </h2>
              </div>
              {product.categorySlug && (
                <Link
                  href={`/category/${product.categorySlug}`}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#264E3A] dark:text-[#67B58E] hover:underline"
                >
                  <span>View All in {product.categoryName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Responsive Grid adhering strictly to rule */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {relatedRows.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  slug={item.slug}
                  price={item.price}
                  compareAtPrice={item.compareAtPrice}
                  currency={item.currency}
                  categoryName={item.categoryName || undefined}
                  imageUrl={
                    relatedImageMap.get(item.id) ||
                    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"
                  }
                  isFeatured={item.isFeatured}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Footer */}
      <StorefrontFooter />
    </main>
  );
}
