"use client";

import React, { useState } from "react";
import { X, Boxes, AlertCircle, ArrowRight, Plus, Minus, Check } from "lucide-react";
import { adjustVariantStock, type InventoryItem } from "@/lib/actions/inventory";

interface InventoryAdjustModalProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newQuantity: number) => void;
}

export function InventoryAdjustModal({
  item,
  isOpen,
  onClose,
  onSuccess,
}: InventoryAdjustModalProps) {
  const [actionType, setActionType] = useState<"ADD" | "DEDUCT" | "SET">("ADD");
  const [amount, setAmount] = useState<number>(5);
  const [reason, setReason] = useState<
    "RESTOCK" | "DAMAGED" | "AUDIT_RECONCILIATION" | "CUSTOMER_RETURN" | "CORRECTION"
  >("RESTOCK");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate live preview of new stock
  let calculatedNewStock = item.stockQuantity;
  let changeDiff = 0;
  if (actionType === "ADD") {
    calculatedNewStock = item.stockQuantity + (amount || 0);
    changeDiff = amount || 0;
  } else if (actionType === "DEDUCT") {
    calculatedNewStock = Math.max(0, item.stockQuantity - (amount || 0));
    changeDiff = -(item.stockQuantity - calculatedNewStock);
  } else if (actionType === "SET") {
    calculatedNewStock = Math.max(0, amount || 0);
    changeDiff = calculatedNewStock - item.stockQuantity;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await adjustVariantStock({
        variantId: item.id,
        actionType,
        amount: Math.max(0, Number(amount) || 0),
        reason,
        note: note.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error || "Failed to adjust inventory");
        setIsSubmitting(false);
        return;
      }

      onSuccess(res.newQuantity ?? calculatedNewStock);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Adjust Inventory Stock</h3>
              <p className="text-xs text-muted-foreground">Log physical stock adjustments & audit records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Identity Snippet */}
        <div className="px-6 py-3.5 bg-muted/40 border-b border-border flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">{item.productName}</h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              <span className="font-mono bg-background px-1.5 py-0.5 rounded border border-border text-[11px]">
                {item.sku}
              </span>
              <span>•</span>
              <span className="truncate">{item.variantName}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-muted-foreground">Current Stock</div>
            <div className="text-lg font-bold text-foreground font-mono">{item.stockQuantity}</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Adjustment Action
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActionType("ADD");
                  if (reason === "DAMAGED") setReason("RESTOCK");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  actionType === "ADD"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted/30 border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionType("DEDUCT");
                  if (reason === "RESTOCK") setReason("DAMAGED");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  actionType === "DEDUCT"
                    ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
                    : "bg-muted/30 border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                Deduct Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionType("SET");
                  setReason("AUDIT_RECONCILIATION");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  actionType === "SET"
                    ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "bg-muted/30 border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                Exact Count
              </button>
            </div>
          </div>

          {/* Quantity & Reason in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                {actionType === "SET" ? "New Exact Stock" : "Quantity Units"}
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAmount((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  required
                  className="w-full text-center h-10 px-3 rounded-xl bg-background border border-border text-foreground font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
                <button
                  type="button"
                  onClick={() => setAmount((prev) => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Adjustment Reason
              </label>
              <select
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value as
                      | "RESTOCK"
                      | "DAMAGED"
                      | "AUDIT_RECONCILIATION"
                      | "CUSTOMER_RETURN"
                      | "CORRECTION"
                  )
                }
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="RESTOCK">Restock / Supplier Intake</option>
                <option value="DAMAGED">Damaged / Written-Off</option>
                <option value="AUDIT_RECONCILIATION">Physical Audit Reconciliation</option>
                <option value="CUSTOMER_RETURN">Customer Return Restock</option>
                <option value="CORRECTION">Inventory Record Correction</option>
              </select>
            </div>
          </div>

          {/* Live Outcome Forecast Badge */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Inventory Transition:</span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-muted-foreground line-through">{item.stockQuantity}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-bold text-foreground text-sm">{calculatedNewStock} units</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  changeDiff >= 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                }`}
              >
                {changeDiff >= 0 ? `+${changeDiff}` : `${changeDiff}`}
              </span>
            </div>
          </div>

          {/* Audit Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Audit Note / Reference (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. PO-7809 Supplier shipment arrival / Q3 count"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={255}
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Boxes className="w-3.5 h-3.5" />
                  Confirm Stock Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
