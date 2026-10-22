"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";

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
  name,
  slug,
  price,
  compareAtPrice,
  currency = "USD",
  categoryName,
  imageUrl,
  isFeatured,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#161716] border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      {/* Top Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
        <Link href={`/product/${slug}`} className="block h-full w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isFeatured && (
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#264E3A] text-white shadow-xs">
              Curated
            </span>
          )}
          {discountPercent && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#B2834E] text-white shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-md text-stone-700 dark:text-stone-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-black/80 transition-all shadow-xs z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover (Desktop & Mobile accessible) */}
        <div className="absolute bottom-3 inset-x-3 z-10">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 backdrop-blur-md transition-all shadow-sm ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-white/95 dark:bg-[#181918]/95 text-stone-900 dark:text-stone-100 hover:bg-[#264E3A] hover:text-white dark:hover:bg-[#478466] dark:hover:text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col gap-2">
        {categoryName && (
          <span className="text-[10px] uppercase tracking-widest font-mono text-stone-500 dark:text-stone-400">
            {categoryName}
          </span>
        )}

        <Link href={`/product/${slug}`} className="block">
          <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#264E3A] dark:group-hover:text-[#67B58E] transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Pricing & Stock status */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
              {formattedPrice}
            </span>
            {formattedCompareAt && (
              <span className="text-xs text-stone-400 dark:text-stone-500 line-through">
                {formattedCompareAt}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>In stock</span>
          </div>
        </div>
      </div>
    </div>
  );
}
