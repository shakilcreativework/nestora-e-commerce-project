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
            placeholder="Search by SKU, product name, or variant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === "ALL"
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All SKUs ({items.length})
          </button>
          <button
            onClick={() => setFilterStatus("LOW_STOCK")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterStatus === "LOW_STOCK"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Low Stock ({items.filter((i) => i.stockStatus === "LOW_STOCK").length})
          </button>
          <button
            onClick={() => setFilterStatus("OUT_OF_STOCK")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterStatus === "OUT_OF_STOCK"
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
            }`}
          >
            <XCircle className="w-3 h-3" />
            Out of Stock ({items.filter((i) => i.stockStatus === "OUT_OF_STOCK").length})
          </button>
          <button
            onClick={() => setFilterStatus("HEALTHY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterStatus === "HEALTHY"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Healthy ({items.filter((i) => i.stockStatus === "HEALTHY").length})
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
      <div className="md:hidden space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-border bg-card text-muted-foreground">
            <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No inventory items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
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
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-foreground truncate">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-muted-foreground truncate">{item.variantName}</p>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-foreground border border-border inline-block mt-1">
                      {item.sku}
                    </span>
                  </div>
                </div>

                {/* Stock Status Badge */}
                <div className="shrink-0 text-right">
                  {item.stockStatus === "HEALTHY" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Healthy
                    </span>
                  )}
                  {item.stockStatus === "LOW_STOCK" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Low Stock
                    </span>
                  )}
                  {item.stockStatus === "OUT_OF_STOCK" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-muted/30 border border-border/60 text-center">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Category
                  </div>
                  <div className="text-xs font-medium text-foreground truncate mt-0.5">
                    {item.categoryName}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Unit Price
                  </div>
                  <div className="text-xs font-mono font-bold text-foreground mt-0.5">
                    ${(item.price / 100).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    In Stock
                  </div>
                  <div className="text-xs font-mono font-bold text-foreground mt-0.5">
                    {item.stockQuantity} <span className="text-[10px] text-muted-foreground">units</span>
                  </div>
                </div>
              </div>

              {/* Quick Adjust Button */}
              <button
                onClick={() => setSelectedItemForAdjust(item)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-foreground text-background flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Boxes className="w-3.5 h-3.5" />
                Adjust Stock Units
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
