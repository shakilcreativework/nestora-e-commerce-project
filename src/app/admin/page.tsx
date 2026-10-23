import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { products, categories, orders, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import {
  Package,
  Layers,
  ShoppingBag,
  Users as UsersIcon,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Database,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // 1. Fetch live metrics from PostgreSQL
  const [productCountRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  const totalProducts = productCountRes?.count ?? 0;

  const [activeProductsRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.status, "ACTIVE"));
  const activeProducts = activeProductsRes?.count ?? 0;

  const [categoryCountRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categories);
  const totalCategories = categoryCountRes?.count ?? 0;

  const [orderCountRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders);
  const totalOrders = orderCountRes?.count ?? 0;

  const [userCountRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);
  const totalUsers = userCountRes?.count ?? 0;

  // 2. Fetch recent products
  const recentProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      currency: products.currency,
      status: products.status,
      isApproved: products.isApproved,
      createdAt: products.createdAt,
    })
    .from(products)
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time storefront performance, product approvals, and order telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            PostgreSQL Live
          </span>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <Link
          href="/admin/products"
          className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-xs hover:border-primary/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
              Catalog Items
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
              {totalProducts}
            </p>
            <p className="text-xs text-muted-foreground">
              {activeProducts} Active & Approved for public storefront
            </p>
          </div>
        </Link>

        {/* Categories */}
        <Link
          href="/admin/categories"
          className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
              {totalCategories}
            </p>
            <p className="text-xs text-muted-foreground">Active curated collections</p>
          </div>
        </Link>

        {/* Total Orders */}
        <Link
          href="/admin/orders"
          className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
              {totalOrders}
            </p>
            <p className="text-xs text-muted-foreground">Placed customer transactions</p>
          </div>
        </Link>

        {/* Customers */}
        <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Registered Accounts
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
              {totalUsers}
            </p>
            <p className="text-xs text-muted-foreground">Verified users with sessions</p>
          </div>
        </div>
      </div>

      {/* System Integrity & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Catalog Snapshot */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Product Catalog Snapshot
              </h2>
              <p className="text-xs text-muted-foreground">
                Admin approval rule: Only approved items are visible on the public storefront.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Public View
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {recentProducts.map((p) => (
              <div
                key={p.id}
                className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">/product/{p.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">
                    ${Number(p.price).toFixed(2)} {p.currency}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      <CheckCircle2 className="w-3 h-3" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive">
                      <Clock className="w-3 h-3" />
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & System Architecture Health */}
        <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Security & RBAC Guard
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Lock className="w-3.5 h-3.5 text-primary" />
                Better Auth RBAC
              </div>
              <p className="text-[11px] text-muted-foreground">
                Server-side `requireAdmin` guard active. Public signup cannot escalate to ADMIN.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Database className="w-3.5 h-3.5 text-primary" />
                PostgreSQL & Drizzle ORM
              </div>
              <p className="text-[11px] text-muted-foreground">
                Pool connected to `nestora_db`. ACID transactions active for stock integrity.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Admin Approval Rule
              </div>
              <p className="text-[11px] text-muted-foreground">
                Storefront routes filter out all unapproved or draft products automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
