"use client";

import React, { useState } from "react";
import { createCoupon } from "@/lib/actions/admin";
import { Plus, X, Loader2, Tag, Percent, DollarSign, Calendar } from "lucide-react";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCouponCreated: (newCoupon: any) => void;
}

export function CreateCouponModal({
  isOpen,
  onClose,
  onCouponCreated,
}: CreateCouponModalProps) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number | "">("");
  const [minOrderDollars, setMinOrderDollars] = useState<number | "">(0);
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim() || Number(discountValue) <= 0) {
      setError("Please provide a valid coupon code and discount value.");
      return;
    }

    setLoading(true);

    try {
      const res = await createCoupon({
        code: code.trim().toUpperCase(),
        description: description.trim() || undefined,
        discountType,
        discountValue: Number(discountValue),
        minOrderDollars: Number(minOrderDollars) || 0,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt || null,
        isActive,
      });

      if (!res.success) {
        setError(res.error || "Failed to create coupon");
        setLoading(false);
        return;
      }

      onCouponCreated(res.coupon);
      onClose();
      // Reset form
      setCode("");
      setDescription("");
      setDiscountType("PERCENTAGE");
      setDiscountValue("");
      setMinOrderDollars(0);
      setUsageLimit("");
      setExpiresAt("");
      setIsActive(true);
    } catch {
      setError("An unexpected error occurred while saving the coupon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-foreground">Create Promo Voucher</h2>
              <p className="text-xs text-muted-foreground">Issue discounts for checkout redemption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Coupon Code */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Coupon Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))}
              placeholder="e.g. AUTUMN25"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-mono tracking-wider text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Promotion Narrative / Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. $25 off handcrafted tabletop collections over $150"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Discount Type
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
                <button
                  type="button"
                  onClick={() => setDiscountType("PERCENTAGE")}
                  className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                    discountType === "PERCENTAGE"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Percent</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType("FIXED")}
                  className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                    discountType === "FIXED"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Fixed ($)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Discount Value <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-muted-foreground select-none font-bold">
                  {discountType === "PERCENTAGE" ? "%" : "$"}
                </span>
                <input
                  type="number"
                  step={discountType === "PERCENTAGE" ? "1" : "0.01"}
                  min="0.01"
                  required
                  value={discountValue}
                  onChange={(e) =>
                    setDiscountValue(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder={discountType === "PERCENTAGE" ? "15" : "25.00"}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Minimum Spend & Redemption Limit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Min. Spend ($)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-muted-foreground select-none font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={minOrderDollars}
                  onChange={(e) =>
                    setMinOrderDollars(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="0 (No min)"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Max Usage Limit
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={usageLimit}
                onChange={(e) =>
                  setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Unlimited"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Expiration Date (Optional)
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 absolute left-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Active Switch */}
          <div className="pt-1 flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <div>
              <p className="text-xs font-semibold text-foreground">Activate Immediately</p>
              <p className="text-[11px] text-muted-foreground">
                Customers can apply this voucher at checkout right away
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Publish Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
