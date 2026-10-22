"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { openCart, selectCartTotalQuantity } from "@/lib/store/features/cart-slice";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  Home,
  Sparkles,
  Lamp,
  Box,
  Coffee,
  Shield,
  LogOut,
  ChevronRight,
  User,
  ExternalLink,
} from "lucide-react";

interface MobileMenuProps {
  cartCount?: number;
}

export function MobileMenu({ cartCount: propCartCount }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const reduxCartCount = useAppSelector(selectCartTotalQuantity);
  const cartCount = propCartCount !== undefined ? propCartCount : reduxCartCount;

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const user = session?.user as
    | ({ name?: string; email?: string; role?: string } & Record<string, unknown>)
    | undefined;
  const isAdmin = user?.role === "ADMIN";

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      {/* Mobile Hamburger Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile navigation"
        className="md:hidden flex items-center justify-center w-9 h-9 -ml-1 rounded-xl text-stone-900 dark:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/80 active:scale-95 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Dark Dimming Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Drawer (100% Height, 100% Opaque Solid Surface) */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-[1000] w-[86%] max-w-sm h-[100dvh] bg-[#FFFFFF] dark:bg-[#121312] text-stone-900 dark:text-stone-100 border-r border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header: Brand + Close Button */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-[#181918] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#264E3A] dark:bg-[#478466] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-bold tracking-tight text-stone-900 dark:text-stone-50">
                NESTORA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-mono -mt-0.5">
                Home & Lifestyle
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Top Profile Card (if logged in) */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-[#1a1c1a] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-[#264E3A] dark:bg-[#478466] text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {userInitials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-50 truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Shield className="w-2.5 h-2.5" />
                  Admin
                </span>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-[#1a1c1a] border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-stone-400" />
                <span className="text-xs text-stone-600 dark:text-stone-400">
                  Welcome to NESTORA
                </span>
              </div>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-[#264E3A] dark:text-[#67B58E] hover:underline"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Quick Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search products, lighting, ceramics..."
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/70 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#264E3A]/40 dark:focus:ring-[#478466]/40"
            />
          </div>

          {/* Main Navigation Options */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-2 mb-2">
              Collections & Catalog
            </p>

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span>Home</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>

            <Link
              href="/catalog"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#B2834E]" />
                <span>All Products</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>

            <Link
              href="/category/workspace"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span>Desk & Workspace</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>

            <Link
              href="/category/lighting"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Lamp className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span>Ambient Lighting</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>

            <Link
              href="/category/ceramics"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Coffee className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span>Handcrafted Ceramics</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
          </div>

          {/* Quick Activity Section */}
          <div className="space-y-1 pt-4 border-t border-stone-200 dark:border-stone-800">
            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-2 mb-2">
              My Activity
            </p>

            <Link
              href="/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span>Saved Wishlist</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                dispatch(openCart());
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span>Shopping Cart</span>
              </div>
              {cartCount > 0 ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#264E3A] dark:bg-[#478466] text-white">
                  {cartCount}
                </span>
              ) : (
                <span className="text-xs text-stone-400">Empty</span>
              )}
            </button>
          </div>

          {/* Theme Selector */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-2">
              Theme & Appearance
            </p>
            <div className="px-2 pt-1">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Pinned Bottom Area (User Info, Admin & Logout) */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#181918] shrink-0 space-y-2">
          {user ? (
            <div className="space-y-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                </Link>
              )}

              <button
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                  window.location.reload();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500/20 active:scale-[0.99] transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#264E3A] dark:bg-[#478466] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
