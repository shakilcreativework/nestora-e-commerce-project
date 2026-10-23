"use client";

import React, { useState } from "react";
import { CategoriesTable, AdminCategoryRow } from "@/components/admin/categories-table";
import { CreateCategoryModal } from "@/components/admin/create-category-modal";
import { Plus, Layers, Sparkles, CheckCircle2, Package } from "lucide-react";

interface CategoriesViewProps {
  categories: AdminCategoryRow[];
}

export function CategoriesView({ categories: initialCategories }: CategoriesViewProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCount = categories.filter((c) => c.isActive).length;
  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

  const handleCategoryCreated = (newCat: any) => {
    setCategories((prev) => [
      {
        id: newCat.id,
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        imageUrl: newCat.imageUrl,
        isActive: newCat.isActive,
        createdAt: newCat.createdAt || new Date(),
        productCount: 0,
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
              Taxonomy & Collections
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Organize catalog hierarchy, manage storefront collections, and monitor catalog density.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-xs hover:bg-primary/90 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Categories
            </span>
            <Layers className="w-4 h-4 text-muted-foreground/60" />
          </div>
          <p className="text-2xl font-bold text-foreground">{categories.length}</p>
          <p className="text-[11px] text-muted-foreground">Catalog taxonomies</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Live in Storefront
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{activeCount}</p>
          <p className="text-[11px] text-muted-foreground">Active collection pages</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Hidden / Draft
            </span>
            <Sparkles className="w-4 h-4 text-muted-foreground/60" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {categories.length - activeCount}
          </p>
          <p className="text-[11px] text-muted-foreground">Temporarily unlisted</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              Total Products
            </span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
          <p className="text-[11px] text-muted-foreground">Distributed across collections</p>
        </div>
      </div>

      {/* Main Categories Table */}
      <CategoriesTable categories={categories} />

      {/* Create Modal */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
}
