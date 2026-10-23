import React from "react";
import Link from "next/link";
import { Search, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserNav } from "@/components/navigation/user-nav";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { CartButton } from "@/components/navigation/cart-button";
import { WishlistButton } from "@/components/navigation/wishlist-button";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--background)]/90 border-b border-black/5 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        {/* Left: Mobile Drawer Trigger & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <MobileMenu cartCount={0} />

          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-[#264E3A] dark:bg-[#478466] flex items-center justify-center text-white font-serif font-bold text-base sm:text-xl shadow-xs shrink-0 group-hover:opacity-90 transition-opacity">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
                NESTORA
              </span>
              <span className="text-[10px] sm:text-xs tracking-widest uppercase text-[var(--muted-text)] font-mono -mt-1 hidden sm:block">
                Home & Lifestyle
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop only) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)]" />
            <input
              type="text"
              placeholder="Search organizers, lighting, ceramics..."
              readOnly
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4 shrink-0">
          {/* Theme Toggle (Desktop only) */}
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          {/* Wishlist Button with live Redux count badge */}
          <div className="hidden md:flex">
            <WishlistButton />
          </div>

          {/* Cart Button with live Redux count & slide-over drawer trigger */}
          <CartButton />

          {/* User Account Navigation (Desktop only) */}
          <div className="hidden md:flex">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
