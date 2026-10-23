"use client";

import React, { useState } from "react";
import { History, ArrowRight, UserCheck, Search, Filter } from "lucide-react";
import type { InventoryAuditLogItem } from "@/lib/actions/inventory";

interface InventoryAuditTableProps {
  logs: InventoryAuditLogItem[];
}

export function InventoryAuditTable({ logs }: InventoryAuditTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState<string>("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.variantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.note && log.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (reasonFilter === "ALL") return true;
    return log.reason === reasonFilter;
  });

  const getReasonBadge = (reason: InventoryAuditLogItem["reason"]) => {
    switch (reason) {
      case "RESTOCK":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            Restock
          </span>
        );
      case "DAMAGED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
            Damaged / Write-off
          </span>
        );
      case "AUDIT_RECONCILIATION":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
            Audit Reconciliation
          </span>
        );
      case "CUSTOMER_RETURN":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 whitespace-nowrap">
            Customer Return
          </span>
        );
      case "CORRECTION":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
            Correction
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border whitespace-nowrap">
            {reason}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audit trail by SKU, product, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
          />
        </div>

        {/* Reason selector */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="w-full sm:w-auto py-2 sm:py-1.5 px-3 rounded-xl bg-card border border-border text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="ALL">All Reasons ({logs.length})</option>
            <option value="RESTOCK">Restock</option>
            <option value="DAMAGED">Damaged</option>
            <option value="AUDIT_RECONCILIATION">Audit Reconciliation</option>
            <option value="CUSTOMER_RETURN">Customer Return</option>
            <option value="CORRECTION">Correction</option>
          </select>
        </div>
      </div>

      {/* Zero Text-Wrapping Standard Table Container (Desktop / Tablet >= 768px) */}
      <div className="hidden md:block rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6 whitespace-nowrap">Date & Time</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Target Product & SKU</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Adjustment Reason</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Net Change</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Transition (Before → After)</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Auditor</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Reference Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No audit log records found matching your filter</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateStr = new Date(log.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const timeStr = new Date(log.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      {/* Date & Time */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-medium text-foreground">{dateStr}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{timeStr}</div>
                      </td>

                      {/* Product & SKU */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-foreground">{log.productName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-foreground border border-border">
                            {log.sku}
                          </span>
                          <span className="text-[11px] text-muted-foreground">• {log.variantName}</span>
                        </div>
                      </td>

                      {/* Reason Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getReasonBadge(log.reason)}
                      </td>

                      {/* Net Change */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <span
                          className={`font-mono font-bold text-xs px-2.5 py-1 rounded-md ${
                            log.changeAmount > 0
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : log.changeAmount < 0
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {log.changeAmount > 0 ? `+${log.changeAmount}` : `${log.changeAmount}`}
                        </span>
                      </td>

                      {/* Pre -> Post */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <span>{log.previousQuantity}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-bold text-foreground">{log.newQuantity}</span>
                        </div>
                      </td>

                      {/* Auditor */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span>{log.performedBy}</span>
                        </div>
                      </td>

                      {/* Reference Note */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {log.note ? (
                          <span className="text-xs text-muted-foreground max-w-xs truncate block" title={log.note}>
                            {log.note}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40 italic text-[11px]">No note recorded</span>
                        )}
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
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-border bg-card text-muted-foreground">
            <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No audit logs found</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const dateFormatted = new Date(log.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground leading-snug line-clamp-1">{log.productName}</h4>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{log.variantName}</p>
                    <div className="mt-1">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-foreground border border-border inline-block font-medium">
                        {log.sku}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5">{getReasonBadge(log.reason)}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl bg-muted/30 border border-border/60 text-center">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Stock Transition
                    </div>
                    <div className="flex items-center justify-center gap-1.5 font-mono text-xs mt-0.5">
                      <span className="text-muted-foreground">{log.previousQuantity}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="font-bold text-foreground">{log.newQuantity}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Net Change
                    </div>
                    <div
                      className={`font-mono font-bold text-xs mt-0.5 ${
                        log.changeAmount > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : log.changeAmount < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {log.changeAmount > 0 ? `+${log.changeAmount}` : `${log.changeAmount}`} units
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                  <span className="truncate max-w-[200px]">{log.note || "Standard operational adjustment"}</span>
                  <span className="shrink-0 font-mono text-[10px]">{dateFormatted}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
