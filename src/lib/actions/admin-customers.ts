"use server";

import { db } from "@/lib/db";
import { users, orders } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export interface AdminCustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  isBlocked: boolean;
  orderCount: number;
  totalSpent: number; // in cents
  createdAt: string;
}

export async function getAdminCustomers(): Promise<AdminCustomerItem[]> {
  await requireAdmin("/admin/customers");

  // Fetch all users
  const userRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      isBlocked: users.isBlocked,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  // Fetch order aggregations per user
  const orderStats = await db
    .select({
      userId: orders.userId,
      orderCount: sql<number>`count(${orders.id})::int`,
      totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)::int`,
    })
    .from(orders)
    .groupBy(orders.userId);

  const statsMap = new Map<string, { orderCount: number; totalSpent: number }>();
  for (const s of orderStats) {
    statsMap.set(s.userId, {
      orderCount: Number(s.orderCount || 0),
      totalSpent: Number(s.totalSpent || 0),
    });
  }

  return userRows.map((u) => {
    const stats = statsMap.get(u.id) || { orderCount: 0, totalSpent: 0 };
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isBlocked: u.isBlocked,
      orderCount: stats.orderCount,
      totalSpent: stats.totalSpent,
      createdAt: u.createdAt.toISOString(),
    };
  });
}

export async function toggleUserBlock(userId: string, currentBlocked: boolean) {
  const currentAdmin = await requireAdmin("/admin/customers");

  if (userId === currentAdmin.id) {
    return { success: false, error: "You cannot block your own administrative account." };
  }

  await db
    .update(users)
    .set({
      isBlocked: !currentBlocked,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/customers");
  revalidatePath("/admin");

  return { success: true, isBlocked: !currentBlocked };
}

export async function toggleUserRole(userId: string, newRole: "CUSTOMER" | "ADMIN") {
  const currentAdmin = await requireAdmin("/admin/customers");

  if (userId === currentAdmin.id && newRole === "CUSTOMER") {
    return { success: false, error: "You cannot revoke your own administrative privileges." };
  }

  await db
    .update(users)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/customers");
  revalidatePath("/admin");

  return { success: true, role: newRole };
}
