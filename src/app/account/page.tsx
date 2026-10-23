import React from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { AccountClientView, CustomerOrder } from "@/components/account/account-client-view";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Account | NESTORA",
  description: "Manage your profile, view orders, and manage addresses on NESTORA.",
};

export default async function AccountPage() {
  // 1. Enforce Server-Side Authentication
  const user = await requireUser("/account");

  // 2. Fetch customer's orders from PostgreSQL
  const customerOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(10);

  const orderIds = customerOrders.map((o) => o.id);
  const items =
    orderIds.length > 0
      ? await db
          .select()
          .from(orderItems)
          .where(inArray(orderItems.orderId, orderIds))
      : [];

  const itemMap = new Map<string, typeof items>();
  for (const item of items) {
    const list = itemMap.get(item.orderId) || [];
    list.push(item);
    itemMap.set(item.orderId, list);
  }

  const typedUser = user as typeof user & { role?: string; phone?: string | null };

  const initialOrders: CustomerOrder[] = customerOrders.map((o) => {
    const orderItemsList = itemMap.get(o.id) || [];
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      subtotal: Number(o.subtotal),
      shippingAmount: Number(o.shippingAmount),
      totalAmount: Number(o.totalAmount),
      currency: o.currency,
      status: o.status,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt.toISOString(),
      shippingAddress: o.shippingAddressSnapshot as CustomerOrder["shippingAddress"],
      items: orderItemsList.map((i) => ({
        id: i.id,
        productName: i.productNameSnapshot,
        sku: i.skuSnapshot,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      })),
    };
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <StorefrontHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AccountClientView
          user={{
            id: typedUser.id,
            name: typedUser.name,
            email: typedUser.email,
            role: typedUser.role || "CUSTOMER",
            phone: typedUser.phone || null,
            createdAt: typedUser.createdAt ? new Date(typedUser.createdAt).toISOString() : null,
          }}
          initialOrders={initialOrders}
        />
      </main>

      <StorefrontFooter />
    </div>
  );
}
