import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq, sql, asc } from "drizzle-orm";
import { CategoriesView } from "@/components/admin/categories-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Category Management | NESTORA Admin",
  description: "Organize collections, taxonomies, and manage storefront collection availability.",
};

export default async function AdminCategoriesPage() {
  // 1. Strictly enforce Admin role
  await requireAdmin("/admin/categories");

  // 2. Query categories with live aggregated product counts
  const categoryRows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      imageUrl: categories.imageUrl,
      isActive: categories.isActive,
      createdAt: categories.createdAt,
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .groupBy(categories.id)
    .orderBy(asc(categories.name));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <CategoriesView categories={categoryRows} />
    </div>
  );
}
