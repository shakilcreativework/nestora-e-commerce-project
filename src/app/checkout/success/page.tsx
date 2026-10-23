import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Confirmed | NESTORA",
  description: "Thank you for your order. Your handcrafted objects are being prepared.",
};

interface OrderSuccessProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessProps) {
  const { orderNumber } = await searchParams;

  if (!orderNumber) {
    notFound();
  }

  // Fetch order from PostgreSQL
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) {
    notFound();
  }

  // Fetch snapshot line items
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const address = order.shippingAddressSnapshot as {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string | null;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    shippingMethod: string;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <StorefrontHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="space-y-8">
          {/* Celebratory Banner */}
          <div className="rounded-3xl bg-card border border-border/80 p-8 sm:p-12 text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20 animate-in zoom-in-75">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Order Confirmed & Paid
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Thank You, {address.fullName.split(" ")[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your order <span className="font-semibold text-foreground">#{order.orderNumber}</span> has
                been placed and recorded in our atelier ledger.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
              >
                <span>View in Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-border bg-background hover:bg-muted transition-all text-foreground"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Details & Immutable Snapshot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Snapshot */}
            <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                Shipping Details
              </h2>
              <div className="text-xs sm:text-sm space-y-1 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground">{address.fullName}</p>
                <p>{address.address} {address.apartment && `, ${address.apartment}`}</p>
                <p>{address.city}, {address.stateProvince} {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="pt-2 text-foreground font-medium">Contact: {address.email} • {address.phone}</p>
                <p className="text-[11px] text-primary font-semibold pt-1">
                  Method: {address.shippingMethod === "EXPRESS" ? "Express Artisan Courier (1-2 Days)" : "Standard Tracked Shipping (3-5 Days)"}
                </p>
              </div>
            </div>

            {/* Financial Summary Snapshot */}
            <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Payment & Totals
              </h2>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">
                    ${(order.subtotal / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tracked Shipping</span>
                  <span className="text-foreground font-medium">
                    {order.shippingAmount === 0 ? "FREE" : `$${(order.shippingAmount / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold text-sm sm:text-base text-foreground">
                  <span>Total Paid</span>
                  <span className="font-serif text-lg text-primary">
                    ${(order.totalAmount / 100).toFixed(2)} {order.currency}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Payment status: Verified & Locked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Order Ledger Snapshot */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-foreground">
              Itemized Order Ledger ({items.length} {items.length === 1 ? "Item" : "Items"})
            </h2>

            <div className="divide-y divide-border/60">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{item.productNameSnapshot}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      SKU: {item.skuSnapshot} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      ${(item.lineTotal / 100).toFixed(2)} {order.currency}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      ${(item.unitPrice / 100).toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
