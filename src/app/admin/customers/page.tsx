import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { getAdminCustomers } from "@/lib/actions/admin-customers";
import { CustomersTable } from "@/components/admin/customers-table";
import { Users, ShieldCheck, ShoppingBag, Ban, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Directory & Relations | NESTORA Admin",
  description: "View customer profiles, order volume, lifetime patron spend, and account role security.",
};

export default async function AdminCustomersPage() {
  await requireAdmin("/admin/customers");
  const customers = await getAdminCustomers();

  // Metrics
  const totalUsers = customers.length;
  const adminUsers = customers.filter((c) => c.role === "ADMIN").length;
  const verifiedBuyers = customers.filter((c) => c.orderCount > 0).length;
  const blockedAccounts = customers.filter((c) => c.isBlocked).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
          <Users className="w-3 h-3" />
          Audience & Patrons
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Customer Directory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Audit patron profiles, track order frequency and lifetime value, and manage administrative privileges.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Accounts */}
        <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Patrons</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{totalUsers}</p>
          <p className="text-[11px] text-muted-foreground">Registered user accounts</p>
        </div>

        {/* Verified Buyers */}
        <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Verified Buyers</span>
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{verifiedBuyers}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Placed ≥ 1 orders</p>
        </div>

        {/* Admin Accounts */}
        <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Staff / Admins</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{adminUsers}</p>
          <p className="text-[11px] text-muted-foreground">Full backoffice privileges</p>
        </div>

        {/* Blocked Accounts */}
        <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Restricted</span>
            <Ban className="w-4 h-4 text-destructive" />
          </div>
          <p className="font-mono text-2xl font-bold text-foreground">{blockedAccounts}</p>
          <p className="text-[11px] text-muted-foreground">Blocked from checkout</p>
        </div>
      </div>

      {/* Main Table View */}
      <CustomersTable initialCustomers={customers} />
    </div>
  );
}
