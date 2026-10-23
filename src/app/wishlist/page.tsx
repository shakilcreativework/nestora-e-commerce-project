import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { WishlistView } from "@/components/wishlist/wishlist-view";
import { Sparkles, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "My Wishlist — NESTORA Atelier",
  description:
    "Review your saved architectural desk organizers, ambient lighting pieces, and master-crafted ceramics.",
};

export default function WishlistPage() {
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

      {/* Wishlist Main Container */}
      <div className="py-6 xs:py-8 sm:py-10 md:py-12 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 sm:mb-6 text-xs text-[var(--muted-text)] flex items-center gap-1.5"
        >
          <Link
            href="/"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-[var(--foreground)] font-medium">Wishlist</span>
        </nav>

        {/* Wishlist View */}
        <WishlistView />
      </div>

      {/* Footer */}
      <StorefrontFooter />
    </main>
  );
}
