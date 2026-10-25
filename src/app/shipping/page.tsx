import React from "react";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { Truck, Clock, ShieldCheck, AlertCircle, Globe } from "lucide-react";

export const metadata = {
  title: "Shipping & Dispatch Policy | NESTORA Atelier",
  description: "Honest shipping timelines, express couriers, and delivery limitations for NESTORA handcrafted home goods.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <StorefrontHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Breadcrumb / Title */}
        <div className="space-y-4 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Truck className="w-3.5 h-3.5" />
            Dispatch & Logistics
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Shipping & Dispatch
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Each NESTORA artifact is packed with eco-conscious molded pulp cushioning to ensure pristine arrival.
          </p>
        </div>

        {/* Portfolio Demo Disclosure Banner */}
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 mb-10">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Portfolio Demonstration Disclosure</p>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              NESTORA is an advanced e-commerce portfolio demonstration. All shipping timelines, tracking numbers, and delivery methods are simulated in real-time. No physical shipments will be dispatched, and orders placed in the sandbox environment remain simulated.
            </p>
          </div>
        </div>

        {/* Content Slices */}
        <div className="space-y-8 divide-y divide-border">
          {/* Rate Matrix */}
          <div className="pt-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Delivery Tiers & Timelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">Standard Courier</h3>
                  <span className="font-bold text-sm text-foreground">$15.00</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  3–5 business days transit. Complimentary (Free Shipping) on all qualified orders over $150.00.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">Express Air Freight</h3>
                  <span className="font-bold text-sm text-foreground">$25.00</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  1–2 business days priority dispatch with direct white-glove signature delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Regional Limitations */}
          <div className="pt-8 space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Geographic Coverage
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              In production, NESTORA currently dispatches to the contiguous United States, Canada, the United Kingdom, Germany, and Australia. Remote territories and APO/FPO addresses may experience an additional 2–3 transit days due to regional customs inspection protocols.
            </p>
          </div>

          {/* Packaging Guarantee */}
          <div className="pt-8 space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Transit Protection & Tracking
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every package is paired with an immutable tracking ID upon dispatch. Customers receive live status updates via the account order timeline (`Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
            </p>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
