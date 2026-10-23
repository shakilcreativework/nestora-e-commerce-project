"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  toggleCategoryActive,
  deleteCategory,
  updateCategory,
  CreateCategoryInput,
} from "@/lib/actions/admin";
import {
  Search,
  Layers,
  ExternalLink,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  Package,
  Calendar,
  X,
  Sparkles,
} from "lucide-react";

export interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date | string;
  productCount: number;
}

interface CategoriesTableProps {
  categories: AdminCategoryRow[];
}

export function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit Modal State
  const [editingCategory, setEditingCategory] = useState<AdminCategoryRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCategories = categoryList.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "ACTIVE" && cat.isActive) ||
      (filterStatus === "INACTIVE" && !cat.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleToggleActive = async (id: string, currentVal: boolean) => {
    setLoadingId(id);
    setErrorMsg(null);
    try {
      const res = await toggleCategoryActive(id, currentVal);
      if (res.success && typeof res.isActive === "boolean") {
        const nextVal = res.isActive;
        setCategoryList((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: nextVal } : c))
        );
      } else {
        setErrorMsg(res.error || "Failed to update category status");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const openEditModal = (cat: AdminCategoryRow) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || "");
    setEditImageUrl(cat.imageUrl || "");
    setEditIsActive(cat.isActive);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setEditLoading(true);
    setErrorMsg(null);

    try {
      const res = await updateCategory(editingCategory.id, {
        name: editName,
        slug: editSlug,
        description: editDescription,
        imageUrl: editImageUrl,
        isActive: editIsActive,
      });

      if (res.success) {
        setCategoryList((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  name: editName,
                  slug: editSlug,
                  description: editDescription,
                  imageUrl: editImageUrl,
                  isActive: editIsActive,
                }
              : c
          )
        );
        setEditingCategory(null);
      } else {
        setErrorMsg(res.error || "Failed to update category");
      }
    } catch {
      setErrorMsg("Failed to update category.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    setErrorMsg(null);
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategoryList((prev) => prev.filter((c) => c.id !== id));
        setDeletingId(null);
      } else {
        setErrorMsg(res.error || "Failed to delete category");
      }
    } catch {
      setErrorMsg("Failed to delete category.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Message Notification */}
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
            placeholder="Search category name, slug, or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Categories</option>
            <option value="ACTIVE">Active in Storefront</option>
            <option value="INACTIVE">Hidden / Inactive</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (hidden on mobile, zero-wrap standard min-w-[850px]) */}
      <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-muted/50 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Storefront Slug</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Products</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Created</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    No categories found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Category Details */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border/60 shrink-0">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Layers className="w-5 h-5 opacity-40" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-[240px]">
                          <p className="font-semibold text-foreground truncate text-sm">
                            {category.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {category.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border/60">
                          /category/{category.slug}
                        </span>
                        <Link
                          href={`/category/${category.slug}`}
                          target="_blank"
                          title="Open live category page"
                          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>

                    {/* Product Count Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        <Package className="w-3.5 h-3.5" />
                        {category.productCount} {category.productCount === 1 ? "item" : "items"}
                      </span>
                    </td>

                    {/* Active Status & Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleToggleActive(category.id, category.isActive)}
                        disabled={loadingId === category.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          category.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                        }`}
                      >
                        {loadingId === category.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : category.isActive ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span>{category.isActive ? "Active" : "Hidden"}</span>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                      {new Date(category.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(category)}
                          title="Edit Category"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(category.id)}
                          title="Delete Category"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE STACKED CARDS VIEW (md:hidden - clean, no text breaking) */}
      <div className="md:hidden space-y-3">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-border bg-card text-muted-foreground">
            <Layers className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
            No categories found.
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Layers className="w-5 h-5 opacity-40" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {category.name}
                    </h3>
                    <button
                      onClick={() => handleToggleActive(category.id, category.isActive)}
                      disabled={loadingId === category.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                        category.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {loadingId === category.id ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : category.isActive ? (
                        "Active"
                      ) : (
                        "Hidden"
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {category.description || "No description provided"}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60 truncate">
                      /{category.slug}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      <Package className="w-3 h-3" />
                      {category.productCount} {category.productCount === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Card Bottom Bar */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono">
                  Created{" "}
                  {new Date(category.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/category/${category.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(category.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setEditingCategory(null)}
          />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-foreground">Edit Category</h2>
                  <p className="text-xs text-muted-foreground">Modify collection parameters</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                <div>
                  <p className="text-xs font-semibold text-foreground">Active in Storefront</p>
                  <p className="text-[11px] text-muted-foreground">Visible on navigation & catalog</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/80">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  disabled={editLoading}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 disabled:opacity-50"
                >
                  {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
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
              <h3 className="text-base font-bold text-foreground">Delete Category</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Are you sure you want to delete this category? If there are products assigned to it, the database will safeguard and prevent deletion.
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
