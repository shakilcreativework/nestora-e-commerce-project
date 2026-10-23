"use client";

import React, { useState } from "react";
import { createProduct } from "@/lib/actions/admin";
import { Plus, X, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface CreateProductModalProps {
  categories: CategoryOption[];
}

export function CreateProductModal({ categories }: CreateProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [imageUrl, setImageUrl] = useState("");
  const [stockQuantity, setStockQuantity] = useState("25");
  const [isFeatured, setIsFeatured] = useState(false);

  // Auto-generate slug when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const priceNum = parseFloat(priceDollars);
    const stockNum = parseInt(stockQuantity, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage("Please enter a valid price in USD.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMessage("Please enter a valid stock quantity.");
      return;
    }

    if (!categoryId) {
      setErrorMessage("Please select a category.");
      return;
    }

    setIsSubmitting(true);

    const res = await createProduct({
      name,
      slug,
      description,
      priceDollars: priceNum,
      categoryId,
      imageUrl,
      stockQuantity: stockNum,
      isFeatured,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || "Failed to create product");
    } else {
      // Success, reset form & close
      setName("");
      setSlug("");
      setDescription("");
      setPriceDollars("");
      setImageUrl("");
      setIsFeatured(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Product</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                  Create Atelier Product
                </h3>
                <p className="text-xs text-muted-foreground">
                  Add handcrafted item with pricing, inventory, and category.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Minimalist Ceramic Incense Burner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="minimalist-ceramic-incense-burner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Price (USD $) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={priceDollars}
                    onChange={(e) => setPriceDollars(e.target.value)}
                    placeholder="48.00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Artisan Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Hand-poured ceramic with matte glaze, designed for mindful living spaces..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-medium text-foreground cursor-pointer">
                    Feature on Storefront Homepage
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium border border-border hover:bg-muted text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to PostgreSQL...</span>
                    </>
                  ) : (
                    <span>Publish Product</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
