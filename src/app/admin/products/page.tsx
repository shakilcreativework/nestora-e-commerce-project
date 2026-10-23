import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { products, categories, productImages, productVariants } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProductsTable, AdminProductRow } from "@/components/admin/products-table";
import { CreateProductModal } from "@/components/admin/create-product-modal";
import { Package, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Product Management | NESTORA Admin",
  description: "Manage catalog items, pricing, inventory, and storefront approval workflows.",
};

export default async function AdminProductsPage() {
  // 1. Strictly enforce Admin role
  await requireAdmin("/admin/products");

  // 2. Query all products with category info
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      currency: products.currency,
      status: products.status,
      isApproved: products.isApproved,
      categoryId: products.categoryId,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));

  // 3. Query all categories for modal
  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .where(eq(categories.isActive, true));

  // 4. Query primary images
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.sortOrder, 0));

  const imageMap = new Map<string, string>();
  for (const img of images) {
    imageMap.set(img.productId, img.url);
  }

  // 5. Query primary variants for stock
  const variants = await db.select().from(productVariants);
  const variantMap = new Map<string, typeof variants[0]>();
  for (const v of variants) {
    if (!variantMap.has(v.productId)) {
      variantMap.set(v.productId, v);
    }
  }

  // 6. Map into typed table rows
  const tableRows: AdminProductRow[] = allProducts.map((p) => {
    const variant = variantMap.get(p.id);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      currency: p.currency,
      status: p.status,
      isApproved: p.isApproved,
      categoryName: p.categoryName || "Uncategorized",
      imageUrl: imageMap.get(p.id) || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      sku: variant?.sku || `SKU-${p.id.slice(0, 8)}`,
      stockQuantity: variant?.stockQuantity ?? 50,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Product Catalog & Approvals
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Admin Approval Rule: Only items with &quot;Approved&quot; and &quot;ACTIVE&quot; status appear on the public storefront.
          </p>
        </div>

        <CreateProductModal
          categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>

      {/* Interactive Table */}
      <ProductsTable products={tableRows} />
    </div>
  );
}
