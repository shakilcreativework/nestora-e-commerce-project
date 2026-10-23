"use client";

import React, { useState } from "react";
import { CouponsTable, AdminCouponRow } from "@/components/admin/coupons-table";
import { CreateCouponModal } from "@/components/admin/create-coupon-modal";
import { Plus, Tag, CheckCircle2, Users, Sparkles, Percent } from "lucide-react";

interface CouponsViewProps {
  coupons: AdminCouponRow[];
}

export function CouponsView({ coupons: initialCoupons }: CouponsViewProps) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCount = coupons.filter(
    (c) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) >= new Date())
  ).length;

  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  const handleCouponCreated = (newCoupon: any) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
              Promotions & Growth
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Coupon & Discount Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create promotional voucher codes, percentage discounts, and monitor customer redemptions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-xs hover:bg-primary/90 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Voucher</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Vouchers
            </span>
            <Tag className="w-4 h-4 text-muted-foreground/60" />
          </div>
          <p className="text-2xl font-bold text-foreground">{coupons.length}</p>
          <p className="text-[11px] text-muted-foreground">Configured promo campaigns</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Active in Checkout
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{activeCount}</p>
          <p className="text-[11px] text-muted-foreground">Redeemable right now</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              Total Redemptions
            </span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalRedemptions}</p>
          <p className="text-[11px] text-muted-foreground">Completed checkout orders</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Featured Code
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold font-mono text-foreground truncate">
            {coupons.length > 0 ? coupons[0].code : "None"}
          </p>
          <p className="text-[11px] text-muted-foreground">Latest issued campaign</p>
        </div>
      </div>

      {/* Main Coupons Table */}
      <CouponsTable coupons={coupons} />

      {/* Create Modal */}
      <CreateCouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCouponCreated={handleCouponCreated}
      />
    </div>
  );
}
