import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Senior Developer Standard:
 * Dynamic XML Sitemap Route (sitemap.xml).
 * 
 * Rules:
 * - Only ACTIVE and Admin-APPROVED products are indexed.
 * - Inactive categories are excluded to prevent 404/crawler budget waste.
 * - Real PostgreSQL updatedAt timestamps are used for search engine freshness signals.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  // 1. Static high-priority storefront routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    // 2. Fetch all active categories from PostgreSQL
    const activeCategories = await db
      .select({
        slug: categories.slug,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .where(eq(categories.isActive, true));

    const categoryRoutes: MetadataRoute.Sitemap = activeCategories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 3. Fetch all active and approved products (Enforcing Admin Approval Rule)
    const activeProducts = await db
      .select({
        slug: products.slug,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(and(eq(products.status, "ACTIVE"), eq(products.isApproved, true)));

    const productRoutes: MetadataRoute.Sitemap = activeProducts.map((prod) => ({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: prod.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    // Fallback to static routes if database is unreachable during generation
    return staticRoutes;
  }
}
