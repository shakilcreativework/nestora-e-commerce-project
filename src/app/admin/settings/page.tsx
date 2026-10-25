import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { SettingsView } from "@/components/admin/settings-view";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Atelier Settings & Configuration | NESTORA Admin",
  description: "Configure atelier storefront parameters, shipping thresholds, and security controls.",
};

export default async function AdminSettingsPage() {
  await requireAdmin("/admin/settings");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
          <Settings className="w-3 h-3" />
          Atelier Controls
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage storefront branding, shipping threshold rules, payment simulation parameters, and security policies.
        </p>
      </div>

      <SettingsView />
    </div>
  );
}
