"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, Filter } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  price: number; // in minor units (cents)
  compareAtPrice?: number | null;
  currency: string;
  imageUrl: string;
  categoryName?: string;
  categorySlug?: string;
  isFeatured?: boolean;
}

export interface CatalogViewProps {
  title: string;
  description?: string | null;
  currentCategorySlug?: string | null;
  categories: CatalogCategory[];
  products: CatalogProduct[];
}

export function CatalogView({
  title,
  description,
  currentCategorySlug = null,
  categories,
  products,
}: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  // Filter and sort products client-side for instantaneous, zero-latency responsiveness
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      // "featured": prioritize featured products first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });

    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Category Header Hero */}
      <div className="border-b border-black/5 dark:border-white/10 pb-6 sm:pb-8">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#264E3A] dark:text-[#67B58E] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B2834E]" />
            <span>NESTORA Atelier Collection</span>
          </div>

          <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            {title}
          </h1>

          {description && (
            <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 scrollbar-none">
          <Link
            href="/shop"
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              currentCategorySlug === null
                ? "bg-[#264E3A] text-white shadow-xs"
                : "bg-black/[0.04] dark:bg-white/[0.05] text-[var(--foreground)] hover:bg-black/10 dark:hover:bg-white/10"
            }`}
          >
            All Pieces ({products.length})
          </Link>

          {categories.map((cat) => {
            const isActive = currentCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#264E3A] text-white shadow-xs"
                    : "bg-black/[0.04] dark:bg-white/[0.05] text-[var(--foreground)] hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10">
        {/* Left: Search within collection */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or material..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#161716] border border-black/10 dark:border-white/15 text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[#264E3A]/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Sort & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-[var(--muted-text)] font-mono">
            {filteredAndSortedProducts.length}{" "}
            {filteredAndSortedProducts.length === 1 ? "piece" : "pieces"}
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--muted-text)] hidden xs:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort products"
              className="py-2 px-3 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#161716] border border-black/10 dark:border-white/15 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#264E3A]/20 transition-all font-medium cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-16 sm:py-24 text-center flex flex-col items-center justify-center p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-dashed border-black/10 dark:border-white/15">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400 mb-3">
            <Filter className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--foreground)]">
            No artisan objects found
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] max-w-sm mt-1 mb-4">
            No items matched your search query &quot;{searchQuery}&quot;. Try adjusting your keywords or clearing the filter.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="py-2 px-5 rounded-full text-xs font-semibold bg-[#264E3A] text-white hover:bg-[#1e3e2e] transition-colors shadow-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Storefront Grid Progression Standards (rule-enforced):
           - Mobile & Tablet (<1024px): STRICTLY 2 columns
           - Laptop (1024px): STRICTLY 3 columns
           - Wide Desktop (1280px+): STRICTLY 4 columns
        */
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              currency={product.currency}
              categoryName={product.categoryName}
              imageUrl={product.imageUrl}
              isFeatured={product.isFeatured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
