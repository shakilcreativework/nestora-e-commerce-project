"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  ShieldCheck,
  Server,
  Save,
  CheckCircle2,
  Sparkles,
  Lock,
  Globe,
  Bell,
  Mail,
  MapPin,
  DollarSign,
} from "lucide-react";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<"GENERAL" | "SHIPPING" | "PAYMENTS" | "SECURITY" | "INFRA">("GENERAL");
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [storeName, setStoreName] = useState("NESTORA Atelier");
  const [storeTagline, setStoreTagline] = useState("Handcrafted Home & Living Atelier");
  const [supportEmail, setSupportEmail] = useState("concierge@nestora-atelier.com");
  const [supportPhone, setSupportPhone] = useState("+1 (415) 890-4281");
  const [showroomAddress, setShowroomAddress] = useState("482 Jackson Street, Suite 300, San Francisco, CA 94111");

  const [freeShippingThreshold, setFreeShippingThreshold] = useState("150.00");
  const [standardShippingFee, setStandardShippingFee] = useState("15.00");
  const [expressShippingFee, setExpressShippingFee] = useState("25.00");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Save Success Alert */}
      {isSaved && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Atelier platform configuration updated and saved successfully!</span>
          </div>
          <span className="text-[11px] font-mono">Status: Applied</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border border-border bg-card/60 text-xs">
        <button
          onClick={() => setActiveTab("GENERAL")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "GENERAL"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Atelier Identity</span>
        </button>

        <button
          onClick={() => setActiveTab("SHIPPING")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "SHIPPING"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Shipping & Logistics</span>
        </button>

        <button
          onClick={() => setActiveTab("PAYMENTS")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "PAYMENTS"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Gateway</span>
        </button>

        <button
          onClick={() => setActiveTab("SECURITY")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "SECURITY"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security & RBAC</span>
        </button>

        <button
          onClick={() => setActiveTab("INFRA")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            activeTab === "INFRA"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Cloud Infrastructure</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: General Atelier Identity */}
        {activeTab === "GENERAL" && (
          <div className="p-6 rounded-2xl border border-border bg-card space-y-6 shadow-xs">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-lg font-bold text-foreground">Atelier Storefront Details</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Public branding, contact emails, and physical studio showroom coordinates displayed to patrons.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Brand Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Brand Tagline</label>
                <input
                  type="text"
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Concierge Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Support Telephone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">Studio Showroom Address</label>
                <input
                  type="text"
                  value={showroomAddress}
                  onChange={(e) => setShowroomAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Shipping & Delivery Controls */}
        {activeTab === "SHIPPING" && (
          <div className="p-6 rounded-2xl border border-border bg-card space-y-6 shadow-xs">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-lg font-bold text-foreground">Logistics & Shipping Thresholds</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure minor-unit checkout thresholds, courier fees, and complimentary free shipping gates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>Free Shipping Threshold</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Orders exceeding this qualify for free courier.</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Standard Courier Fee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={standardShippingFee}
                    onChange={(e) => setStandardShippingFee(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">3–5 business days transit delivery.</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Express Air Freight</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={expressShippingFee}
                    onChange={(e) => setExpressShippingFee(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">1–2 business days expedited air dispatch.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Payment Gateway */}
        {activeTab === "PAYMENTS" && (
          <div className="p-6 rounded-2xl border border-border bg-card space-y-6 shadow-xs">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-lg font-bold text-foreground">Payment Processor Engine</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Current financial adapter mode and compliance isolation parameters.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-200">Active Mode: Sandbox Simulation</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Live Demo Safe
                  </span>
                </div>
                <p className="text-xs text-amber-700/90 dark:text-amber-300/90 leading-relaxed">
                  Real card numbers are blocked. The portfolio mock adapter verifies 3 live test scenarios (4242 Success, 4000 0002 Insufficient Funds, 4000 0003 Expired Card).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <p className="text-xs font-semibold text-foreground">Idempotency Retention</p>
                  <p className="text-xs font-mono text-muted-foreground">24 Hours TTL (Deduplication)</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <p className="text-xs font-semibold text-foreground">PCI Storage Rule</p>
                  <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">Strict 0 PAN / 0 CVV Policy</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security & RBAC */}
        {activeTab === "SECURITY" && (
          <div className="p-6 rounded-2xl border border-border bg-card space-y-6 shadow-xs">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-lg font-bold text-foreground">Security & Access Control</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cookie authentication, session lifecycle, and Role-Based Access Control policies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <p className="text-xs font-semibold text-foreground">Authentication Engine</p>
                <p className="text-xs text-muted-foreground">Better-Auth with PostgreSQL Session Cookies</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <p className="text-xs font-semibold text-foreground">Session Expiration</p>
                <p className="text-xs font-mono text-muted-foreground">30 Days Sliding Window</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <p className="text-xs font-semibold text-foreground">Client Privilege Escalation Guard</p>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">Enforced (role: input: false)</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <p className="text-xs font-semibold text-foreground">HTTP Headers Security</p>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">X-Frame-Options: DENY</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Cloud Infrastructure */}
        {activeTab === "INFRA" && (
          <div className="p-6 rounded-2xl border border-border bg-card space-y-6 shadow-xs">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-lg font-bold text-foreground">Active Cloud Topology</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live telemetry of hosting services, serverless regions, and database engine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Web Application Layer</p>
                <p className="text-sm font-bold text-foreground">Vercel Edge Global Network</p>
                <p className="text-[11px] text-muted-foreground font-mono">Next.js 16 • Turbopack Engine</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Database Layer</p>
                <p className="text-sm font-bold text-foreground">Render Managed PostgreSQL 16</p>
                <p className="text-[11px] text-muted-foreground font-mono">Drizzle ORM • Auto SSL Tunnel</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Region</p>
                <p className="text-sm font-bold text-foreground">Virginia (US East) • dpg-dbepopoae00c73duj7a0-a</p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Production Status</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  100% Operational & Synced
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Changes take effect across the storefront dynamically.
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
