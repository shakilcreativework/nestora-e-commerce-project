import React from "react";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, FileText } from "lucide-react";

export const metadata = {
  title: "30-Day Returns Policy | NESTORA Atelier",
  description: "Transparent 30-day returns, exchanges, and RMA procedures for handcrafted home items.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <StorefrontHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-4 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <RotateCcw className="w-3.5 h-3.5" />
            Customer Guarantee
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            30-Day Returns Policy
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            We want you to live in harmony with every piece you choose. If an object does not resonate with your space, return it within 30 days of delivery.
          </p>
        </div>

        {/* Demo Disclosure */}
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 mb-10">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Portfolio Demonstration Disclosure</p>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              This policy represents our production-ready commercial policy template. In this sandbox environment, simulated order cancellations and refunds can be triggered by administrators directly via the admin dashboard without physical package dispatch.
            </p>
          </div>
        </div>

        {/* Content Slices */}
        <div className="space-y-8 divide-y divide-border">
          <div className="pt-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Eligible Conditions for Return
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>The item must be in its original, undamaged condition with original atelier packaging and cert of authenticity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Return request initiated within 30 calendar days from the verified delivery timestamp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Custom engraved or bespoke one-of-a-kind commissions are subject to prior atelier consultation.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Return Merchandise Authorization (RMA) Steps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">1</div>
                <h3 className="font-semibold text-xs sm:text-sm text-foreground">Initiate RMA</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Navigate to your customer account order history and request a return slip.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</div>
                <h3 className="font-semibold text-xs sm:text-sm text-foreground">Secure Packaging</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Repack using our shock-absorbent pulp molded cradle with prepaid shipping label.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">3</div>
                <h3 className="font-semibold text-xs sm:text-sm text-foreground">Prompt Refund</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Upon intake inspection, your refund is processed directly to original payment method.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
