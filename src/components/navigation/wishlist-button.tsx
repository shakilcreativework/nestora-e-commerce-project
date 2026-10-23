"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { selectWishlistCount } from "@/lib/store/features/wishlist-slice";

export function WishlistButton() {
  const count = useAppSelector(selectWishlistCount);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Avoid hydration mismatch on initial client load
  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger bounce animation when count changes
  useEffect(() => {
    if (count > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  const displayCount = mounted ? count : 0;

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist (${displayCount} items)`}
      className="relative p-2 sm:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--foreground)] transition-colors group"
    >
      <Heart
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
          displayCount > 0
            ? "fill-[#264E3A] text-[#264E3A] dark:fill-[#67B58E] dark:text-[#67B58E]"
            : "text-[var(--muted-text)] group-hover:text-red-500"
        } ${animate ? "scale-125" : "scale-100"}`}
      />

      {displayCount > 0 && (
        <span
          className={`absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-mono font-bold flex items-center justify-center leading-none shadow-xs transition-transform ${
            animate ? "scale-125" : "scale-100"
          }`}
        >
          {displayCount > 99 ? "99+" : displayCount}
        </span>
      )}
    </Link>
  );
}
