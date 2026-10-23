"use client";

import React, { useState } from "react";
import Link from "next/link";
import { moderateReview, deleteReview } from "@/lib/actions/admin";
import {
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Loader2,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export interface AdminReviewRow {
  id: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
  createdAt: Date | string;
  productName: string;
  productSlug: string;
  authorName: string;
  authorEmail: string;
}

interface ReviewsTableProps {
  reviews: AdminReviewRow[];
}

export function ReviewsTable({ reviews: initialReviews }: ReviewsTableProps) {
  const [reviewList, setReviewList] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredReviews = reviewList.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.authorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleModerate = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setLoadingId(id);
    setErrorMsg(null);
    try {
      const res = await moderateReview(id, newStatus);
      if (res.success && res.status) {
        setReviewList((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: res.status as any } : r))
        );
      } else {
        setErrorMsg(res.error || "Failed to update review status");
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
      const res = await deleteReview(id);
      if (res.success) {
        setReviewList((prev) => prev.filter((r) => r.id !== id));
        setDeletingId(null);
      } else {
        setErrorMsg(res.error || "Failed to delete review");
      }
    } catch {
      setErrorMsg("Failed to delete review.");
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
            placeholder="Search by review text, product name, or reviewer..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Reviews</option>
            <option value="PENDING">Pending Moderation</option>
            <option value="APPROVED">Approved & Live</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (hidden on mobile, zero-wrap standard min-w-[850px]) */}
      <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-muted/50 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Product</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Rating</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Review Content</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Reviewer</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Submitted</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                    No reviews found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors group">
                    {/* Product Name */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/product/${r.productSlug}`}
                          target="_blank"
                          className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <span className="truncate max-w-[160px]">{r.productName}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-60" />
                        </Link>
                      </div>
                    </td>

                    {/* Star Rating */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < r.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                        <span className="font-bold ml-1 text-foreground">{r.rating}.0</span>
                      </div>
                    </td>

                    {/* Review Snippet */}
                    <td className="py-3.5 px-4">
                      <div className="max-w-[280px]">
                        <p className="font-semibold text-foreground truncate">{r.title}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {r.comment}
                        </p>
                      </div>
                    </td>

                    {/* Author & Verified Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-foreground">{r.authorName}</p>
                        {r.isVerifiedPurchase ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Buyer
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Registered Member</span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          r.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : r.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {r.status === "APPROVED" && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        {r.status === "PENDING" && <Clock className="w-3 h-3 text-amber-500" />}
                        {r.status === "REJECTED" && <XCircle className="w-3 h-3 text-rose-500" />}
                        <span>{r.status}</span>
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status !== "APPROVED" && (
                          <button
                            onClick={() => handleModerate(r.id, "APPROVED")}
                            disabled={loadingId === r.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all flex items-center gap-1"
                            title="Approve Review"
                          >
                            {loadingId === r.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Approve
                          </button>
                        )}

                        {r.status !== "REJECTED" && (
                          <button
                            onClick={() => handleModerate(r.id, "REJECTED")}
                            disabled={loadingId === r.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-all flex items-center gap-1"
                            title="Reject Review"
                          >
                            {loadingId === r.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() => setDeletingId(r.id)}
                          title="Delete Review"
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

      {/* MOBILE STACKED CARDS VIEW (md:hidden - clean zero-wrap standard) */}
      <div className="md:hidden space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-border bg-card text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
            No reviews found.
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/product/${r.productSlug}`}
                    target="_blank"
                    className="font-semibold text-foreground text-sm flex items-center gap-1 hover:underline"
                  >
                    <span>{r.productName}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </Link>
                  <p className="text-xs text-muted-foreground">By {r.authorName}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                    r.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : r.status === "PENDING"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < r.rating
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                {r.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-foreground text-xs">{r.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.comment}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {r.status !== "APPROVED" && (
                    <button
                      onClick={() => handleModerate(r.id, "APPROVED")}
                      disabled={loadingId === r.id}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== "REJECTED" && (
                    <button
                      onClick={() => handleModerate(r.id, "REJECTED")}
                      disabled={loadingId === r.id}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => setDeletingId(r.id)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
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
              <h3 className="text-base font-bold text-foreground">Delete Review</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Are you sure you want to permanently delete this customer review?
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
