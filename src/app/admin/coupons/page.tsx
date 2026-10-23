import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { CouponsView } from "@/components/admin/coupons-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Coupon & Discount Management | NESTORA Admin",
  description: "Create and manage promotional discounts, vouchers, and track customer redemption volume.",
};

export default async function AdminCouponsPage() {
  // 1. Strictly enforce Admin role
  await requireAdmin("/admin/coupons");

  // 2. Query all coupons from PostgreSQL
  const allCoupons = await db
    .select()
    .from(coupons)
    .orderBy(desc(coupons.createdAt));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <CouponsView coupons={allCoupons} />
    </div>
  );
}
