"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import type { InventoryItem } from "@/lib/actions/inventory";
import { InventoryAdjustModal } from "./inventory-adjust-modal";

interface InventoryTableProps {
  initialItems: InventoryItem[];
}

export function InventoryTable({ initialItems }: InventoryTableProps) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "HEALTHY" | "LOW_STOCK" | "OUT_OF_STOCK">("ALL");
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<InventoryItem | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === "ALL") return true;
    return item.stockStatus === filterStatus;
  });

  const handleAdjustSuccess = (newQuantity: number) => {
    if (!selectedItemForAdjust) return;

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === selectedItemForAdjust.id) {
          let updatedStatus: "HEALTHY" | "LOW_STOCK" | "OUT_OF_STOCK" = "HEALTHY";
          if (newQuantity === 0) updatedStatus = "OUT_OF_STOCK";
          else if (newQuantity <= 10) updatedStatus = "LOW_STOCK";

          return {
            ...it,
            stockQuantity: newQuantity,
            stockStatus: updatedStatus,
            updatedAt: new Date(),
          };
        }
        return it;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search SKU, product, or variant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
          />
        </div>

        {/* Filter Pills with smooth horizontal touch scroll on mobile */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              filterStatus === "ALL"
                ? "bg-foreground text-background shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All SKUs ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("LOW_STOCK")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
              filterStatus === "LOW_STOCK"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span>Low Stock ({items.filter((i) => i.stockStatus === "LOW_STOCK").length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("OUT_OF_STOCK")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
              filterStatus === "OUT_OF_STOCK"
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
            }`}
          >
            <XCircle className="w-3 h-3 shrink-0" />
            <span>Out of Stock ({items.filter((i) => i.stockStatus === "OUT_OF_STOCK").length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("HEALTHY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
              filterStatus === "HEALTHY"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>Healthy ({items.filter((i) => i.stockStatus === "HEALTHY").length})</span>
          </button>
        </div>
      </div>

      {/* Zero Text-Wrapping Standard Table Container (Desktop / Tablet >= 768px) */}
      <div className="hidden md:block rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6 whitespace-nowrap">Product & Variant</th>
                <th className="py-3.5 px-4 whitespace-nowrap">SKU Code</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Unit Price</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Stock Level</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Health Status</th>
                <th className="py-3.5 px-6 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No inventory items found matching your filter</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Product & Variant */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-border bg-muted/40 shrink-0">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-[10px]">
                                IMG
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/product/${item.productSlug}`}
                              target="_blank"
                              className="font-semibold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                            >
                              <span>{item.productName}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                            </Link>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {item.variantName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-muted/60 text-foreground border border-border font-medium">
                          {item.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap text-muted-foreground font-medium">
                        {item.categoryName}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono font-medium text-foreground">
                        ${(item.price / 100).toFixed(2)}
                      </td>

                      {/* Stock Level */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <span className="font-mono font-bold text-sm text-foreground">
                          {item.stockQuantity}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-1">units</span>
                      </td>

                      {/* Health Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        {item.stockStatus === "HEALTHY" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Healthy Stock
                          </span>
                        )}
                        {item.stockStatus === "LOW_STOCK" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Low Stock Alert
                          </span>
                        )}
                        {item.stockStatus === "OUT_OF_STOCK" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedItemForAdjust(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-muted/60 hover:bg-foreground hover:text-background text-foreground border border-border transition-all shadow-xs"
                        >
                          <Boxes className="w-3.5 h-3.5" />
                          <span>Adjust Stock</span>
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

      {/* Mobile Stacked Card View (<768px: Zero Text-Wrapping & Clean Responsiveness) */}
      <div className="md:hidden space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-border bg-card text-muted-foreground">
            <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No inventory items found matching your filter</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3.5"
            >
              {/* Top Row: Thumbnail + Product/Variant Info + Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border bg-muted/40 shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-[10px]">
                        IMG
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground leading-snug line-clamp-1">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {item.variantName}
                    </p>
                    <div className="mt-1">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-foreground border border-border font-medium inline-block">
                        {item.sku}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 pt-0.5">
                  {item.stockStatus === "HEALTHY" && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      Healthy
                    </span>
                  )}
                  {item.stockStatus === "LOW_STOCK" && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                      Low Stock
                    </span>
                  )}
                  {item.stockStatus === "OUT_OF_STOCK" && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Metrics Row: Clean Key-Value Pairs (Never Truncates Categories!) */}
              <div className="space-y-1.5 py-2.5 px-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Category:</span>
                  <span className="font-semibold text-foreground text-right">{item.categoryName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Unit Price:</span>
                  <span className="font-mono font-bold text-foreground">
                    ${(item.price / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-muted-foreground text-[11px]">Current Stock:</span>
                  <span className="font-mono font-bold text-foreground">
                    {item.stockQuantity}{" "}
                    <span className="text-[10px] text-muted-foreground font-normal">units</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setSelectedItemForAdjust(item)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-foreground text-background flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all shadow-xs"
              >
                <Boxes className="w-3.5 h-3.5 shrink-0" />
                <span>Adjust Stock Units</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Adjust Modal */}
      {selectedItemForAdjust && (
        <InventoryAdjustModal
          item={selectedItemForAdjust}
          isOpen={!!selectedItemForAdjust}
          onClose={() => setSelectedItemForAdjust(null)}
          onSuccess={handleAdjustSuccess}
        />
      )}
    </div>
  );
}
