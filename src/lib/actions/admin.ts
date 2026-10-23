"use server";

import { db } from "@/lib/db";
import { products, productImages, productVariants, categories, orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Toggle Product Approval (Core Business Rule: only approved products show on storefront)
export async function toggleProductApproval(productId: string, currentApproval: boolean) {
  await requireAdmin("/admin/products");

  await db
    .update(products)
    .set({
      isApproved: !currentApproval,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true, isApproved: !currentApproval };
}

// 2. Toggle Product Active Status (ACTIVE vs DRAFT)
export async function toggleProductStatus(
  productId: string,
  newStatus: "ACTIVE" | "DRAFT" | "ARCHIVED"
) {
  await requireAdmin("/admin/products");

  await db
    .update(products)
    .set({
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/shop");

  return { success: true, status: newStatus };
}

// 3. Create New Product Schema
const createProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priceDollars: z.number().positive("Price must be greater than 0"),
  categoryId: z.string().uuid("Please select a valid category"),
  imageUrl: z.string().url("Please provide a valid image URL"),
  stockQuantity: z.number().int().min(0, "Stock cannot be negative"),
  isFeatured: z.boolean().default(false),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// 4. Create Product Transactionally
export async function createProduct(rawInput: CreateProductInput) {
  await requireAdmin("/admin/products");

  const validation = createProductSchema.safeParse(rawInput);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || "Invalid input" };
  }

  const data = validation.data;
  const priceInCents = Math.round(data.priceDollars * 100);

  try {
    await db.transaction(async (tx) => {
      const productSku = `SKU-${data.slug.toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;

      // A. Insert Product
      const [newProduct] = await tx
        .insert(products)
        .values({
          name: data.name,
          slug: data.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          sku: productSku,
          shortDescription: data.description.slice(0, 150),
          description: data.description,
          price: priceInCents,
          categoryId: data.categoryId,
          status: "ACTIVE",
          isApproved: true, // Admin is creating, so it's auto-approved
          isFeatured: data.isFeatured,
          currency: "USD",
        })
        .returning({ id: products.id, name: products.name });

      // B. Insert Primary Product Image
      await tx.insert(productImages).values({
        productId: newProduct.id,
        url: data.imageUrl,
        altText: data.name,
        sortOrder: 0,
      });

      // C. Insert Default Product Variant with stock
      await tx.insert(productVariants).values({
        productId: newProduct.id,
        sku: `SKU-${data.slug.toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`,
        name: "Standard Artisan Edition",
        stockQuantity: data.stockQuantity,
        isActive: true,
      });
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/shop");

    return { success: true };
  } catch (err: unknown) {
    console.error("Error creating product:", err);
    const msg = err instanceof Error ? err.message : "Failed to create product";
    return { success: false, error: msg };
  }
}

// 5. Update Order Status (Order status transitions)
export async function updateOrderStatus(
  orderId: string,
  newStatus:
    | "PENDING_PAYMENT"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "PAYMENT_FAILED"
    | "EXPIRED"
) {
  await requireAdmin("/admin/orders");

  try {
    await db
      .update(orders)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/account");

    return { success: true, status: newStatus };
  } catch (err) {
    console.error("Error updating order status:", err);
    return { success: false, error: "Failed to update order status" };
  }
}

// 6. Category Management Actions
const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional().default(""),
  imageUrl: z.string().url("Please provide a valid image URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export async function createCategory(rawInput: CreateCategoryInput) {
  await requireAdmin("/admin/categories");

  const validation = createCategorySchema.safeParse(rawInput);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || "Invalid input" };
  }

  const data = validation.data;
  const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  try {
    const [existing] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, cleanSlug))
      .limit(1);

    if (existing) {
      return { success: false, error: "A category with this slug already exists." };
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        name: data.name.trim(),
        slug: cleanSlug,
        description: data.description?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        isActive: data.isActive,
      })
      .returning();

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true, category: newCategory };
  } catch (err: unknown) {
    console.error("Error creating category:", err);
    const msg = err instanceof Error ? err.message : "Failed to create category";
    return { success: false, error: msg };
  }
}

export async function updateCategory(
  categoryId: string,
  rawInput: Partial<CreateCategoryInput>
) {
  await requireAdmin("/admin/categories");

  try {
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (rawInput.name !== undefined) updateData.name = rawInput.name.trim();
    if (rawInput.slug !== undefined) {
      updateData.slug = rawInput.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    }
    if (rawInput.description !== undefined) {
      updateData.description = rawInput.description.trim() || null;
    }
    if (rawInput.imageUrl !== undefined) {
      updateData.imageUrl = rawInput.imageUrl.trim() || null;
    }
    if (rawInput.isActive !== undefined) {
      updateData.isActive = rawInput.isActive;
    }

    await db.update(categories).set(updateData).where(eq(categories.id, categoryId));

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    console.error("Error updating category:", err);
    return { success: false, error: "Failed to update category" };
  }
}

export async function toggleCategoryActive(categoryId: string, currentVal: boolean) {
  await requireAdmin("/admin/categories");

  try {
    await db
      .update(categories)
      .set({
        isActive: !currentVal,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, categoryId));

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true, isActive: !currentVal };
  } catch (err: unknown) {
    console.error("Error toggling category status:", err);
    return { success: false, error: "Failed to toggle category status" };
  }
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin("/admin/categories");

  try {
    const linkedProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.categoryId, categoryId));

    if (linkedProducts.length > 0) {
      return {
        success: false,
        error: `Cannot delete this category because ${linkedProducts.length} product(s) are assigned to it. Please reassign or delete them first.`,
      };
    }

    await db.delete(categories).where(eq(categories.id, categoryId));

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    console.error("Error deleting category:", err);
    return { success: false, error: "Failed to delete category" };
  }
}

