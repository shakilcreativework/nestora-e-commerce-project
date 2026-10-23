"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/features/cart-slice";
import { toggleWishlist, selectIsInWishlist } from "@/lib/store/features/wishlist-slice";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number; // in minor units (cents)
  compareAtPrice?: number | null;
  currency?: string;
  categoryName?: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  currency = "USD",
  categoryName,
  imageUrl,
  isFeatured,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsInWishlist(id));
  const [isAdded, setIsAdded] = useState(false);

  // Format currency
  const formattedPrice = (price / 100).toLocaleString("en-US", {
    style: "currency",
    currency,
  });

  const formattedCompareAt = compareAtPrice
    ? (compareAtPrice / 100).toLocaleString("en-US", {
        style: "currency",
        currency,
      })
    : null;

  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(
      addToCart({
        id,
        name,
        slug,
        price,
        compareAtPrice,
        currency,
        imageUrl,
        categoryName,
        maxStock: 20,
      })
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(
      toggleWishlist({
        id,
        name,
        slug,
        price,
        compareAtPrice,
        currency,
        imageUrl,
        categoryName,
      })
    );
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white dark:bg-[#161716] border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      {/* Top Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
        <Link href={`/product/${slug}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Badges Container */}
        <div className="absolute top-2 left-2 xs:top-2.5 xs:left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {isFeatured && (
            <span className="inline-block px-1.5 xs:px-2 sm:px-2.5 py-0.5 sm:py-1 text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-md bg-[#264E3A] text-white shadow-xs">
              Curated
            </span>
          )}
          {discountPercent && (
            <span className="inline-block px-1.5 xs:px-2 py-0.5 text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-md bg-[#B2834E] text-white shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 xs:top-2.5 xs:right-2.5 sm:top-3 sm:right-3 p-1.5 xs:p-2 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-md text-stone-700 dark:text-stone-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-black/80 transition-all shadow-xs z-10"
        >
          <Heart
            className={`w-3.5 h-3.5 xs:w-4 xs:h-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover / Touch */}
        <div className="absolute bottom-2 inset-x-2 xs:bottom-2.5 xs:inset-x-2.5 sm:bottom-3 sm:inset-x-3 z-10">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-1.5 xs:py-2 sm:py-2.5 px-2 xs:px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[10px] xs:text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-md transition-all shadow-sm ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-white/95 dark:bg-[#181918]/95 text-stone-900 dark:text-stone-100 hover:bg-[#264E3A] hover:text-white dark:hover:bg-[#478466] dark:hover:text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate">Added to bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate">Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-2.5 xs:p-3 sm:p-4 flex flex-col gap-1 sm:gap-2">
        {categoryName && (
          <span className="text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-widest font-mono text-stone-500 dark:text-stone-400 truncate">
            {categoryName}
          </span>
        )}

        <Link href={`/product/${slug}`} className="block">
          <h3 className="font-serif text-xs xs:text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#264E3A] dark:group-hover:text-[#67B58E] transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Pricing & Stock status */}
        <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5 sm:pt-1">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-xs xs:text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
              {formattedPrice}
            </span>
            {formattedCompareAt && (
              <span className="text-[10px] xs:text-[11px] sm:text-xs text-stone-400 dark:text-stone-500 line-through">
                {formattedCompareAt}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[9px] xs:text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>In stock</span>
          </div>
        </div>
      </div>
    </div>
  );
}
