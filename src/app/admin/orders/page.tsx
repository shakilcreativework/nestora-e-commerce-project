import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { orders, orderItems, users } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { OrdersTable, AdminOrderRow } from "@/components/admin/orders-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Queue & Fulfillment | NESTORA Admin",
  description: "Manage customer order fulfillment, statuses, and delivery telemetry.",
};

export default async function AdminOrdersPage() {
  // 1. Strictly enforce Admin role
  await requireAdmin("/admin/orders");

  // 2. Fetch orders with user details and item count
  const allOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      userId: orders.userId,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      currency: orders.currency,
      totalAmount: orders.totalAmount,
      shippingAddressSnapshot: orders.shippingAddressSnapshot,
      customerNote: orders.customerNote,
      createdAt: orders.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  // 3. Fetch item counts per order
  const itemCounts = await db
    .select({
      orderId: orderItems.orderId,
      count: sql<number>`count(*)::int`,
    })
    .from(orderItems)
    .groupBy(orderItems.orderId);

  const itemCountMap = new Map<string, number>();
  for (const c of itemCounts) {
    itemCountMap.set(c.orderId, c.count);
  }

  // 4. Transform into typed AdminOrderRow
  const rows: AdminOrderRow[] = allOrders.map((o) => {
    const address = o.shippingAddressSnapshot as AdminOrderRow["shippingAddress"];
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      userName: o.userName || address.fullName || "Guest Customer",
      userEmail: o.userEmail || address.email || "No email",
      totalAmount: o.totalAmount,
      currency: o.currency,
      status: o.status,
      paymentStatus: o.paymentStatus,
      itemCount: itemCountMap.get(o.id) || 1,
      shippingAddress: address,
      customerNote: o.customerNote,
      createdAt: o.createdAt.toISOString(),
    };
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Customer Orders & Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Review placed transactions, examine shipping address snapshots, and update dispatch statuses.
        </p>
      </div>

      <OrdersTable orders={rows} />
    </div>
  );
}
