import React from "react";
import Link from "next/link";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { Compass, ShoppingBag, Layers, Home, ArrowRight, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col justify-between selection:bg-[#264E3A] selection:text-white dark:selection:bg-[#478466]">
      {/* Top Notification Bar */}
      <div className="w-full bg-[#264E3A] dark:bg-[#182C22] text-stone-100 text-[11px] xs:text-xs py-1.5 px-3 xs:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-[#B2834E] shrink-0" />
        <span className="truncate">
          Complimentary tracked worldwide shipping on all orders over $100.
        </span>
      </div>

      {/* Main Navigation Header */}
      <StorefrontHeader />

      {/* 404 Center Showcase */}
      <div className="flex-1 flex items-center justify-center py-12 xs:py-16 sm:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-xl w-full text-center space-y-6">
          {/* Subtle Ambient Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#B2834E]/10 text-[#B2834E] border border-[#B2834E]/20">
            <Compass className="w-3.5 h-3.5" />
            <span>404 • Uncharted Space</span>
          </div>

          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
            This space does not exist in our atelier.
          </h1>

          <p className="text-xs xs:text-sm sm:text-base text-[var(--muted-text)] max-w-md mx-auto leading-relaxed">
            The collection, piece, or path you were seeking may have been renamed, archived, or has not yet been introduced.
          </p>

          {/* Curated Navigation Suggestions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
            <Link
              href="/catalog"
              className="group p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 hover:border-[#264E3A] dark:hover:border-[#478466] shadow-xs hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#264E3A]/10 dark:bg-[#478466]/20 text-[#264E3A] dark:text-[#67B58E]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">Complete Catalog</h2>
                  <p className="text-[11px] text-[var(--muted-text)]">Explore all handcrafted objects</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-[#264E3A] dark:group-hover:text-[#67B58E] transition-all" />
            </Link>

            <Link
              href="/category"
              className="group p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 hover:border-[#264E3A] dark:hover:border-[#478466] shadow-xs hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B2834E]/10 text-[#B2834E]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">Curated Spaces</h2>
                  <p className="text-[11px] text-[var(--muted-text)]">Browse by functional zones</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-[#B2834E] transition-all" />
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Or return to Home Storefront</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <StorefrontFooter />
    </main>
  );
}
