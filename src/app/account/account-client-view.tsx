"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
} from "lucide-react";

interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string | null;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface AccountClientViewProps {
  user: AccountUser;
  initialOrders: CustomerOrder[];
}

export function AccountClientView({ user, initialOrders }: AccountClientViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">("overview");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAdmin = user.role === "ADMIN";

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
      setIsLoggingOut(false);
    }
  };

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent Member";

  return (
    <div className="space-y-8">
      {/* Header Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/80 p-6 sm:p-8 md:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-inner border border-primary/20">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {user.name}
                </h1>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                    <User className="w-3 h-3" />
                    Customer
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground/70" />
                {user.email}
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground/80 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                Member since {formattedJoinDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-border bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all text-muted-foreground"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border gap-2 sm:gap-6 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "overview"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "orders"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="w-4 h-4" />
          Orders ({initialOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "profile"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapPin className="w-4 h-4" />
          Profile & Address
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/70 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-serif text-foreground">{initialOrders.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Lifetime Orders Placed</p>
            </div>

            <Link
              href="/wishlist"
              className="p-6 rounded-2xl bg-card border border-border/70 space-y-2 hover:border-primary/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold font-serif text-foreground">Wishlist</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">View your saved curated items</p>
            </Link>

            <Link
              href="/shop"
              className="p-6 rounded-2xl bg-card border border-border/70 space-y-2 hover:border-primary/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold font-serif text-foreground">Atelier Shop</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Explore new artisan arrivals</p>
            </Link>
          </div>

          {/* Recent Orders Overview */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-foreground">Recent Orders</h2>
              {initialOrders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View all orders
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {initialOrders.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-foreground">No orders placed yet</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  When you acquire handcrafted items from NESTORA, your order tracking and receipts will appear here.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
                >
                  Start Shopping
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {initialOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">#{order.orderNumber}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">
                        ${order.totalAmount.toFixed(2)} {order.currency}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-foreground">Order History</h2>
            <p className="text-xs text-muted-foreground">
              Review details and live status of your previous purchases.
            </p>
          </div>

          {initialOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3 border border-dashed border-border rounded-xl">
              <Package className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">No purchases found</p>
              <p className="text-xs text-muted-foreground">You haven&apos;t placed any orders with this account yet.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {initialOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-border bg-background/50 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">Order #{order.orderNumber}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary uppercase">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <p className="font-bold text-foreground text-sm">
                      ${order.totalAmount.toFixed(2)} {order.currency}
                    </p>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                    >
                      View Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile & Address Tab */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Personal Details
            </h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                <span className="text-[11px] font-medium text-muted-foreground block">Full Name</span>
                <span className="font-semibold text-foreground">{user.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                <span className="text-[11px] font-medium text-muted-foreground block">Email Address</span>
                <span className="font-semibold text-foreground">{user.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                <span className="text-[11px] font-medium text-muted-foreground block">Phone Number</span>
                <span className="font-semibold text-foreground">{user.phone || "Not provided"}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                <span className="text-[11px] font-medium text-muted-foreground block">Account Role</span>
                <span className="font-semibold text-foreground uppercase text-xs">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Saved Addresses
              </h2>
              <span className="text-[11px] text-muted-foreground">Default shipping</span>
            </div>
            <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-2">
              <MapPin className="w-8 h-8 text-muted-foreground/60 mx-auto" />
              <p className="text-xs font-semibold text-foreground">No saved addresses</p>
              <p className="text-[11px] text-muted-foreground">
                Your shipping address will be automatically remembered during checkout.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
