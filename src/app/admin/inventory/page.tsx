import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { getInventoryData, getInventoryAuditLogs } from "@/lib/actions/inventory";
import { InventoryView } from "@/components/admin/inventory-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inventory & Warehouse Stock Management | NESTORA Admin",
  description: "Monitor real-time SKU inventory levels, execute stock adjustments, and review audit history logs.",
};

export default async function AdminInventoryPage() {
  // 1. Strictly enforce Admin role guard
  await requireAdmin("/admin/inventory");

  // 2. Fetch inventory data & audit history logs
  const [{ items, telemetry }, auditLogs] = await Promise.all([
    getInventoryData(),
    getInventoryAuditLogs(50),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <InventoryView
        initialItems={items}
        auditLogs={auditLogs}
        telemetry={telemetry}
      />
    </div>
  );
}
