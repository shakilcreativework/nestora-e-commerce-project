"use client";

import React, { useState } from "react";
import { toggleCouponActive, deleteCoupon } from "@/lib/actions/admin";
import {
  Tag,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Loader2,
  Percent,
  DollarSign,
  Calendar,
  Sparkles,
  Users,
} from "lucide-react";

export interface AdminCouponRow {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: Date | string | null;
  createdAt: Date | string;
}

interface CouponsTableProps {
  coupons: AdminCouponRow[];
}

export function CouponsTable({ coupons: initialCoupons }: CouponsTableProps) {
  const [couponList, setCouponList] = useState(initialCoupons);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED">("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isExpired = (expiresAt: Date | string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const filteredCoupons = couponList.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const expired = isExpired(coupon.expiresAt);

    let matchesStatus = true;
    if (filterStatus === "ACTIVE") matchesStatus = coupon.isActive && !expired;
    if (filterStatus === "INACTIVE") matchesStatus = !coupon.isActive && !expired;
    if (filterStatus === "EXPIRED") matchesStatus = expired;

    return matchesSearch && matchesStatus;
  });

  const handleToggleActive = async (id: string, currentVal: boolean) => {
    setLoadingId(id);
    setErrorMsg(null);
    try {
      const res = await toggleCouponActive(id, currentVal);
      if (res.success && typeof res.isActive === "boolean") {
        const nextVal = res.isActive;
        setCouponList((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: nextVal } : c))
        );
      } else {
        setErrorMsg(res.error || "Failed to update coupon status");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    setErrorMsg(null);
    try {
      const res = await deleteCoupon(id);
      if (res.success) {
        setCouponList((prev) => prev.filter((c) => c.id !== id));
        setDeletingId(null);
      } else {
        setErrorMsg(res.error || "Failed to delete coupon");
      }
    } catch {
      setErrorMsg("Failed to delete coupon.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search promo code, description, or discount..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Vouchers</option>
            <option value="ACTIVE">Active in Checkout</option>
            <option value="INACTIVE">Paused / Inactive</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (hidden on mobile, zero-wrap standard min-w-[850px]) */}
      <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-muted/50 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Voucher Code</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Benefit Value</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Min. Order</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Redemptions</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Expiration</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Tag className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    No promotional vouchers found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const expired = isExpired(coupon.expiresAt);
                  return (
                    <tr
                      key={coupon.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Code and Description */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            {coupon.code}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {coupon.description || "General checkout discount"}
                          </span>
                        </div>
                      </td>

                      {/* Benefit Value */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {coupon.discountType === "PERCENTAGE" ? (
                            <>
                              <Percent className="w-3 h-3" />
                              {coupon.discountValue}% OFF
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-3 h-3" />
                              ${(coupon.discountValue / 100).toFixed(2)} OFF
                            </>
                          )}
                        </span>
                      </td>

                      {/* Min Order Spend */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-muted-foreground">
                        {coupon.minOrderAmount === 0 ? (
                          <span className="text-muted-foreground/80">No minimum</span>
                        ) : (
                          <span className="font-semibold text-foreground">
                            ${(coupon.minOrderAmount / 100).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Usage Count / Limit */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                          {coupon.usageCount} / {coupon.usageLimit ?? "∞"}
                        </span>
                      </td>

                      {/* Status & Active Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        {expired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            Expired
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                            disabled={loadingId === coupon.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              coupon.isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            }`}
                          >
                            {loadingId === coupon.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : coupon.isActive ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                            <span>{coupon.isActive ? "Active" : "Paused"}</span>
                          </button>
                        )}
                      </td>

                      {/* Expiration Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                        {coupon.expiresAt ? (
                          <span className={expired ? "text-rose-500 font-semibold" : ""}>
                            {new Date(coupon.expiresAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">Never expires</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setDeletingId(coupon.id)}
                          title="Delete Coupon"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE STACKED CARDS VIEW (md:hidden - clean zero-wrap standard) */}
      <div className="md:hidden space-y-3">
        {filteredCoupons.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-border bg-card text-muted-foreground">
            <Tag className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
            No promotional vouchers found.
          </div>
        ) : (
          filteredCoupons.map((coupon) => {
            const expired = isExpired(coupon.expiresAt);
            return (
              <div
                key={coupon.id}
                className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      {coupon.code}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {coupon.description || "General checkout discount"}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}% OFF`
                      : `$${(coupon.discountValue / 100).toFixed(2)} OFF`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/60">
                  <div>
                    <span className="text-muted-foreground block">Min. Order Spend:</span>
                    <span className="font-semibold text-foreground font-mono">
                      {coupon.minOrderAmount === 0
                        ? "No minimum"
                        : `$${(coupon.minOrderAmount / 100).toFixed(2)}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Redemptions:</span>
                    <span className="font-semibold text-foreground font-mono">
                      {coupon.usageCount} / {coupon.usageLimit ?? "∞"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <div>
                    {expired ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                        <Clock className="w-3.5 h-3.5" /> Expired
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                        disabled={loadingId === coupon.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          coupon.isActive
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {loadingId === coupon.id ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        ) : coupon.isActive ? (
                          "Active"
                        ) : (
                          "Paused"
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "Never expires"}
                    </span>
                    <button
                      onClick={() => setDeletingId(coupon.id)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setDeletingId(null)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Delete Coupon</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Are you sure you want to permanently delete this voucher? Customers will no longer be able to redeem it.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                disabled={loadingId === deletingId}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={loadingId === deletingId}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-xs hover:bg-rose-700 disabled:opacity-50"
              >
                {loadingId === deletingId && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
