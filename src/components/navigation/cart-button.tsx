"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { openCart, selectCartTotalQuantity } from "@/lib/store/features/cart-slice";

export function CartButton({ className = "" }: { className?: string }) {
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const [mounted, setMounted] = useState(false);
  const [isBumping, setIsBumping] = useState(false);

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Micro-bounce animation whenever items are added
  useEffect(() => {
    if (totalQuantity === 0) return;
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 300);
    return () => clearTimeout(timer);
  }, [totalQuantity]);

  return (
    <button
      type="button"
      onClick={() => dispatch(openCart())}
      aria-label={`Shopping bag with ${mounted ? totalQuantity : 0} items`}
      className={`relative p-2 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-all ${
        isBumping ? "scale-110" : "scale-100"
      } ${className}`}
    >
      <ShoppingBag className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
      {mounted && totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-[#264E3A] dark:bg-[#478466] text-white text-[9px] xs:text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50">
          {totalQuantity}
        </span>
      )}
    </button>
  );
}
