"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toggleProductApproval, toggleProductStatus } from "@/lib/actions/admin";
import {
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react";

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  price: number; // in cents
  currency: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  isApproved: boolean;
  categoryName: string;
  imageUrl: string;
  sku: string;
  stockQuantity: number;
}

interface ProductsTableProps {
  products: AdminProductRow[];
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const [productList, setProductList] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Categories list for filtering
  const categories = Array.from(new Set(initialProducts.map((p) => p.categoryName)));

  const filteredProducts = productList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === "ALL" || p.categoryName === filterCategory;
    const matchesStat =
      filterStatus === "ALL" ||
      (filterStatus === "APPROVED" && p.isApproved) ||
      (filterStatus === "PENDING" && !p.isApproved) ||
      (filterStatus === "DRAFT" && p.status === "DRAFT");
    return matchesSearch && matchesCat && matchesStat;
  });

  const handleToggleApproval = async (id: string, currentVal: boolean) => {
    setLoadingId(id);
    const res = await toggleProductApproval(id, currentVal);
    setLoadingId(null);
    if (res.success) {
      setProductList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isApproved: res.isApproved } : item))
      );
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: "ACTIVE" | "DRAFT" | "ARCHIVED") => {
    const newStatus = currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE";
    setLoadingId(id);
    const res = await toggleProductStatus(id, newStatus);
    setLoadingId(null);
    if (res.success) {
      setProductList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product title, SKU, or slug..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved Only</option>
            <option value="PENDING">Pending Approval</option>
            <option value="DRAFT">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[850px]">
            <thead className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Product</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Price</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Inventory</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Catalog Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Admin Approval</th>
                <th className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    No products matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLoading = loadingId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-foreground truncate">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground font-mono truncate">
                              {p.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                          {p.categoryName}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                        ${(p.price / 100).toFixed(2)}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold text-xs ${
                            p.stockQuantity <= 5 ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                          }`}
                        >
                          {p.stockQuantity} in stock
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleToggleStatus(p.id, p.status)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            p.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-stone-500/10 text-stone-600 dark:text-stone-400 hover:bg-stone-500/20"
                          }`}
                        >
                          {p.status}
                        </button>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleToggleApproval(p.id, p.isApproved)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            p.isApproved
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                          }`}
                        >
                          {p.isApproved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Pending
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 sm:px-6 text-right whitespace-nowrap">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs"
                          title="View on Public Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
