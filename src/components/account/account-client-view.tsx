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
  Truck,
  X,
  CreditCard,
  ShieldCheck,
  Pencil,
  Trash2,
  Plus,
  Star,
} from "lucide-react";
import {
  type CustomerSavedAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
} from "@/lib/actions/customer";
import { AddressModal } from "./address-modal";
import { ProfileEditModal } from "./profile-edit-modal";

export interface OrderItemSnapshot {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number; // in cents
  lineTotal: number; // in cents
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number; // in cents
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    email?: string | null;
    address: string;
    apartment?: string | null;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone: string;
    shippingMethod: string;
  } | null;
  items: OrderItemSnapshot[];
}

interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string | null;
}

interface AccountClientViewProps {
  user: AccountUser;
  initialOrders: CustomerOrder[];
  initialAddresses?: CustomerSavedAddress[];
}

export function AccountClientView({
  user,
  initialOrders,
  initialAddresses = [],
}: AccountClientViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">("overview");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<CustomerOrder | null>(null);

  // Profile & Address states (NESTORA-044)
  const [currentUser, setCurrentUser] = useState<AccountUser>(user);
  const [addressesList, setAddressesList] = useState<CustomerSavedAddress[]>(initialAddresses);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerSavedAddress | null>(null);
  const [isActionLoadingId, setIsActionLoadingId] = useState<string | null>(null);

  const isAdmin = currentUser.role === "ADMIN";

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

  const handleSetDefaultAddress = async (id: string) => {
    setIsActionLoadingId(id);
    // Optimistic update
    setAddressesList((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );

    try {
      await setDefaultCustomerAddress(id);
    } catch (err) {
      console.error("Failed to set default address:", err);
    } finally {
      setIsActionLoadingId(null);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this saved address?")) return;
    setIsActionLoadingId(id);
    // Optimistic remove
    setAddressesList((prev) => prev.filter((addr) => addr.id !== id));

    try {
      await deleteCustomerAddress(id);
    } catch (err) {
      console.error("Failed to delete address:", err);
    } finally {
      setIsActionLoadingId(null);
    }
  };

  const handleAddressSaved = (savedAddr: CustomerSavedAddress) => {
    setAddressesList((prev) => {
      const exists = prev.some((a) => a.id === savedAddr.id);
      let updated: CustomerSavedAddress[];
      if (exists) {
        updated = prev.map((a) => (a.id === savedAddr.id ? savedAddr : a));
      } else {
        updated = [savedAddr, ...prev];
      }

      if (savedAddr.isDefault) {
        return updated.map((a) =>
          a.id === savedAddr.id ? a : { ...a, isDefault: false }
        );
      }
      return updated;
    });
  };

  const handleProfileSaved = (newName: string, newPhone: string | null) => {
    setCurrentUser((prev) => ({
      ...prev,
      name: newName,
      phone: newPhone,
    }));
  };

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent Member";

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/80 p-6 sm:p-8 md:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-inner border border-primary/20">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {currentUser.name}
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

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
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

          {/* Recent Orders Card */}
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
                        ${(order.totalAmount / 100).toFixed(2)} {order.currency}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(order)}
                        className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === "orders" && (
        <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-foreground">Order History & Tracking</h2>
            <p className="text-xs text-muted-foreground">
              Review details, itemized receipts, and live fulfillment timeline of your purchases.
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
                  className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <p className="font-mono font-bold text-foreground text-sm">#{order.orderNumber}</p>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                      {order.items.length > 0 && ` • ${order.items.length} ${order.items.length === 1 ? "Item" : "Items"}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <p className="font-bold text-foreground text-sm sm:text-base">
                      ${(order.totalAmount / 100).toFixed(2)} {order.currency}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(order)}
                      className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-all shadow-2xs"
                    >
                      View Receipt & Tracking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile & Address (NESTORA-044) */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Personal Details Card */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-foreground">
                    Personal Profile
                  </h2>
                  <p className="text-[11px] text-muted-foreground">Manage your customer credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-muted text-foreground transition-all shadow-2xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                  Full Name
                </span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">
                  {currentUser.name}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                    Email Address
                  </span>
                  <span className="font-semibold text-foreground text-sm mt-0.5 block">
                    {currentUser.email}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  Verified
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                  Contact Phone
                </span>
                <span className="font-semibold text-foreground text-sm mt-0.5 block">
                  {currentUser.phone || "No phone number added"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
                    Membership Tier
                  </span>
                  <span className="font-semibold text-foreground text-sm mt-0.5 block">
                    {isAdmin ? "Administrator" : "Atelier Collector"}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  Since {formattedJoinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Saved Addresses Card */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-foreground">
                    Saved Addresses
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    {addressesList.length} {addressesList.length === 1 ? "address" : "addresses"} on file
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setIsAddressModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90 active:scale-[0.99] transition-all shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address List */}
            {addressesList.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-muted/50 text-muted-foreground flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">No saved addresses yet</p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-0.5">
                    Save your delivery locations to experience expedited, 1-click checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null);
                    setIsAddressModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Shipping Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addressesList.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      addr.isDefault
                        ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/10 shadow-xs"
                        : "border-border/80 bg-muted/20 hover:border-border"
                    }`}
                  >
                    {/* Header: Name + Default Pill / Action */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{addr.fullName}</h4>
                        <span className="font-mono text-[11px] text-muted-foreground block mt-0.5">
                          {addr.phone}
                        </span>
                      </div>
                      <div>
                        {addr.isDefault ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3" />
                            Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            disabled={isActionLoadingId === addr.id}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-border/80 transition-all whitespace-nowrap"
                          >
                            <Star className="w-3 h-3 text-muted-foreground" />
                            Make Default
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Address Body */}
                    <div className="text-xs text-muted-foreground space-y-0.5 leading-relaxed">
                      <p className="text-foreground font-medium">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                      </p>
                      <p>
                        {addr.city}, {addr.stateProvince} {addr.postalCode}
                      </p>
                      <p>{addr.country}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(addr);
                          setIsAddressModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        disabled={isActionLoadingId === addr.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Receipt & Tracking Modal (NESTORA-057) */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Official Atelier Receipt
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Order #{selectedReceipt.orderNumber}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Placed on {new Date(selectedReceipt.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Timeline */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary" />
                  Order Fulfillment Status
                </span>
                <span className="uppercase text-primary font-bold text-[11px]">
                  {selectedReceipt.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                {["Confirmed", "Processing", "Shipped", "Delivered"].map((step, idx) => {
                  const stepNumber = idx + 1;
                  const currentStep = getStatusStepIndex(selectedReceipt.status);
                  const isDone = stepNumber <= currentStep;
                  return (
                    <div key={step} className="space-y-1">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isDone ? "bg-primary" : "bg-muted-foreground/20"
                        }`}
                      />
                      <span className={isDone ? "font-bold text-foreground" : "text-muted-foreground"}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Snapshot Ledger */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Itemized Summary
              </h4>
              <div className="divide-y divide-border/60 border border-border rounded-xl p-3">
                {selectedReceipt.items.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">Standard Handcrafted Order</p>
                ) : (
                  selectedReceipt.items.map((i) => (
                    <div key={i.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-foreground">{i.productName}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          SKU: {i.sku} • Qty: {i.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          ${(i.lineTotal / 100).toFixed(2)} {selectedReceipt.currency}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          ${(i.unitPrice / 100).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Financials & Shipping Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {selectedReceipt.shippingAddress && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground block">
                    Delivery Destination
                  </span>
                  <p className="font-semibold text-foreground">
                    {selectedReceipt.shippingAddress.fullName}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedReceipt.shippingAddress.address}{" "}
                    {selectedReceipt.shippingAddress.apartment &&
                      `, ${selectedReceipt.shippingAddress.apartment}`}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedReceipt.shippingAddress.city},{" "}
                    {selectedReceipt.shippingAddress.stateProvince}{" "}
                    {selectedReceipt.shippingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">{selectedReceipt.shippingAddress.country}</p>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  Payment Snapshot
                </span>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span className="font-medium text-foreground">
                    ${(selectedReceipt.subtotal / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tracked Shipping:</span>
                  <span className="font-medium text-foreground">
                    {selectedReceipt.shippingAmount === 0
                      ? "FREE"
                      : `$${(selectedReceipt.shippingAmount / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold text-sm text-foreground">
                  <span>Total Paid:</span>
                  <span className="font-serif text-primary">
                    ${(selectedReceipt.totalAmount / 100).toFixed(2)} {selectedReceipt.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal (NESTORA-044) */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaved={handleProfileSaved}
        initialName={currentUser.name}
        initialPhone={currentUser.phone}
        email={currentUser.email}
      />

      {/* Address Create / Edit Modal (NESTORA-044) */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSaved={handleAddressSaved}
        initialData={editingAddress}
      />
    </div>
  );
}
