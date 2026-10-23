"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectWishlistItems,
  removeFromWishlist,
  clearWishlist,
  WishlistItem,
} from "@/lib/store/features/wishlist-slice";
import { addToCart } from "@/lib/store/features/cart-slice";

export function WishlistView() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const [mounted, setMounted] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  // Avoid hydration mismatch on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 text-center flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#264E3A] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Move single item from wishlist to cart
  const handleMoveToCart = (item: WishlistItem) => {
    setMovingId(item.id);
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        currency: item.currency,
        imageUrl: item.imageUrl,
        categoryName: item.categoryName,
        quantity: 1,
        maxStock: 25,
      })
    );
    // Remove from wishlist after moving to cart
    dispatch(removeFromWishlist(item.id));
    setTimeout(() => setMovingId(null), 1000);
  };

  // Move all items to cart
  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      dispatch(
        addToCart({
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          currency: item.currency,
          imageUrl: item.imageUrl,
          categoryName: item.categoryName,
          quantity: 1,
          maxStock: 25,
        })
      );
    });
    dispatch(clearWishlist());
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Page Title & Actions */}
      <div className="border-b border-black/5 dark:border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#264E3A] dark:text-[#67B58E] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B2834E]" />
            <span>Saved Essentials</span>
          </div>
          <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1">
            {items.length === 0
              ? "No items saved yet"
              : `${items.length} ${items.length === 1 ? "object" : "objects"} saved for later consideration`}
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => dispatch(clearWishlist())}
              className="py-2 px-3.5 rounded-xl text-xs font-semibold text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#264E3A] hover:bg-[#1e3e2e] dark:bg-[#478466] dark:hover:bg-[#386b52] text-white flex items-center gap-2 transition-all shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add All to Bag</span>
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items Grid or Empty State */}
      {items.length === 0 ? (
        <div className="py-20 sm:py-28 text-center flex flex-col items-center justify-center p-6 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-dashed border-black/10 dark:border-white/15">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400 mb-4 border border-stone-200 dark:border-stone-800">
            <Heart className="w-7 h-7 stroke-1" />
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[var(--foreground)]">
            Your wishlist is empty
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] max-w-sm mt-1.5 mb-6 leading-relaxed">
            Curate your personal collection of architectural organizers, calm ambient lighting, and master-crafted ceramics.
          </p>
          <Link
            href="/shop"
            className="py-3 px-6 rounded-full text-xs font-semibold bg-[#264E3A] hover:bg-[#1e3e2e] dark:bg-[#478466] text-white flex items-center gap-2 transition-all shadow-sm group"
          >
            <span>Explore Atelier Collection</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      ) : (
        /* Storefront Grid Progression Standards (rule-enforced):
           - Mobile & Tablet (<1024px): STRICTLY 2 columns
           - Laptop (1024px): STRICTLY 3 columns
           - Wide Desktop (1280px+): STRICTLY 4 columns
        */
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {items.map((item) => {
            const formattedPrice = (item.price / 100).toLocaleString("en-US", {
              style: "currency",
              currency: item.currency || "USD",
            });

            const formattedCompareAt = item.compareAtPrice
              ? (item.compareAtPrice / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: item.currency || "USD",
                })
              : null;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white dark:bg-[#161716] border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-4/5 w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <Link href={`/product/${item.slug}`} className="block h-full w-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    aria-label={`Remove ${item.name} from wishlist`}
                    className="absolute top-2 right-2 xs:top-2.5 xs:right-2.5 sm:top-3 sm:right-3 p-1.5 xs:p-2 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-md text-stone-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-black/80 transition-all shadow-xs z-10"
                  >
                    <Trash2 className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  </button>
                </div>

                {/* Details & Move to Bag */}
                <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    {item.categoryName && (
                      <span className="text-[9px] xs:text-[10px] font-mono uppercase tracking-wider text-[var(--muted-text)] block truncate">
                        {item.categoryName}
                      </span>
                    )}
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-serif text-xs xs:text-sm sm:text-base font-bold text-[var(--foreground)] hover:text-[#264E3A] dark:hover:text-[#67B58E] transition-colors line-clamp-1 mt-0.5"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-xs xs:text-sm sm:text-base font-bold text-[var(--foreground)]">
                        {formattedPrice}
                      </span>
                      {formattedCompareAt && (
                        <span className="font-mono text-[10px] xs:text-xs text-[var(--muted-text)] line-through">
                          {formattedCompareAt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Move to Bag Button */}
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-2 px-3 rounded-lg sm:rounded-xl text-xs font-semibold bg-[#264E3A] hover:bg-[#1e3e2e] dark:bg-[#478466] dark:hover:bg-[#386b52] text-white flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98]"
                  >
                    {movingId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
