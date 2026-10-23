"use client";

import React, { useState } from "react";
import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  XCircle,
  History,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type {
  InventoryItem,
  InventoryAuditLogItem,
  InventoryTelemetry,
} from "@/lib/actions/inventory";
import { InventoryTable } from "./inventory-table";
import { InventoryAuditTable } from "./inventory-audit-table";

interface InventoryViewProps {
  initialItems: InventoryItem[];
  auditLogs: InventoryAuditLogItem[];
  telemetry: InventoryTelemetry;
}

export function InventoryView({
  initialItems,
  auditLogs,
  telemetry,
}: InventoryViewProps) {
  const [activeTab, setActiveTab] = useState<"CATALOG" | "AUDIT">("CATALOG");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Inventory & Warehouse
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Live Stock
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time SKU stock levels, physical adjustments, and immutable audit trail
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center p-1 bg-muted/60 rounded-xl border border-border shrink-0">
          <button
            onClick={() => setActiveTab("CATALOG")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "CATALOG"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            Stock Catalog
          </button>
          <button
            onClick={() => setActiveTab("AUDIT")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "AUDIT"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total SKUs */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tracked SKUs
            </span>
            <div className="p-2 rounded-xl bg-muted/60 text-foreground">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground">
              {telemetry.totalSkus}
            </span>
            <span className="text-xs text-muted-foreground">variants</span>
          </div>
        </div>

        {/* Card 2: Total Units In Stock */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Units
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {telemetry.totalUnitsInStock}
            </span>
            <span className="text-xs text-muted-foreground">on hand</span>
          </div>
        </div>

        {/* Card 3: Low Stock Alerts */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {telemetry.lowStockCount}
            </span>
            <span className="text-xs text-muted-foreground">≤ 10 units</span>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 dark:text-rose-400">
              {telemetry.outOfStockCount}
            </span>
            <span className="text-xs text-muted-foreground">critical</span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      {activeTab === "CATALOG" ? (
        <InventoryTable initialItems={initialItems} />
      ) : (
        <InventoryAuditTable logs={auditLogs} />
      )}
    </div>
  );
}
