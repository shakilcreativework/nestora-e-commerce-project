import React from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { AccountClientView } from "./account-client-view";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

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

  const typedUser = user as typeof user & { role?: string; phone?: string | null };

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
          initialOrders={customerOrders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            totalAmount: Number(o.totalAmount),
            currency: o.currency,
            status: o.status,
            createdAt: o.createdAt.toISOString(),
          }))}
        />
      </main>

      <StorefrontFooter />
    </div>
  );
}
