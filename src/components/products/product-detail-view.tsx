"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
  ChevronRight,
  Info,
  Star,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/features/cart-slice";
import { toggleWishlist, selectIsInWishlist } from "@/lib/store/features/wishlist-slice";

export interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    shortDescription: string;
    description: string;
    price: number; // in minor units (cents)
    compareAtPrice?: number | null;
    currency: string;
    brand?: string | null;
    categoryName?: string | null;
    categorySlug?: string | null;
    stockQuantity?: number;
    rating?: number;
    reviewCount?: number;
  };
  images: Array<{
    id: string;
    url: string;
    altText: string;
    sortOrder: number;
  }>;
}

export function ProductDetailView({ product, images }: ProductDetailProps) {
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsInWishlist(product.id));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "craftsmanship" | "shipping">("details");

  const stockLimit = product.stockQuantity && product.stockQuantity > 0 ? product.stockQuantity : 25;
  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;

  // Active image fallback
  const displayImages = images.length > 0 ? images : [{
    id: "default",
    url: "/placeholder.jpg",
    altText: product.name,
    sortOrder: 0,
  }];

  const currentImage = displayImages[selectedImageIndex] || displayImages[0];

  // Currency formatting
  const formattedPrice = (product.price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: product.currency || "USD",
  });

  const formattedCompareAt = product.compareAtPrice
    ? (product.compareAtPrice / 100).toLocaleString("en-US", {
        style: "currency",
        currency: product.currency || "USD",
      })
    : null;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        currency: product.currency,
        imageUrl: currentImage.url,
        categoryName: product.categoryName || undefined,
        quantity,
        maxStock: stockLimit,
      })
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(stockLimit, prev + 1));
  };

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 text-xs text-[var(--muted-text)] flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        {product.categoryName && (
          <>
            <Link
              href={`/category/${product.categorySlug || ""}`}
              className="hover:text-[var(--foreground)] transition-colors"
            >
              {product.categoryName}
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </>
        )}
        <span className="text-[var(--foreground)] font-medium truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout: 12-column grid on desktop, single column stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
        {/* Left: Gallery Column (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4 lg:sticky lg:top-28">
          {/* Main Showcase Image */}
          <div className="relative aspect-4/5 sm:aspect-5/4 lg:aspect-4/5 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-black/5 dark:border-white/10 shadow-xs">
            <Image
              src={currentImage.url}
              alt={currentImage.altText || product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center transition-all duration-300"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
              {discountPercent && (
                <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-stone-900/90 text-white dark:bg-stone-100 dark:text-stone-900 backdrop-blur-xs shadow-xs">
                  Save {discountPercent}%
                </span>
              )}
              {product.brand && (
                <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded-md bg-white/80 dark:bg-black/60 text-stone-800 dark:text-stone-200 backdrop-blur-xs">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Wishlist Button on Image */}
            <button
              type="button"
              onClick={() =>
                dispatch(
                  toggleWishlist({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    currency: product.currency,
                    imageUrl: currentImage.url,
                    categoryName: product.categoryName || undefined,
                  })
                )
              }
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 text-[var(--foreground)] backdrop-blur-xs shadow-xs hover:scale-105 active:scale-95 transition-all"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-[var(--muted-text)] hover:text-red-500"
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Selector Strip */}
          {displayImages.length > 1 && (
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
              {displayImages.map((img, idx) => {
                const isActive = idx === selectedImageIndex;
                return (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Select product image ${idx + 1}`}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      isActive
                        ? "border-[#264E3A] dark:border-[#67B58E] ring-2 ring-[#264E3A]/20 dark:ring-[#67B58E]/30"
                        : "border-black/5 dark:border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${product.name} view ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Product Information & Purchase Actions (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col space-y-5 sm:space-y-6">
          {/* Header & Meta */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#264E3A] dark:text-[#67B58E] font-semibold">
                {product.categoryName || "Curated Essential"}
              </span>
              <span className="text-[11px] font-mono text-[var(--muted-text)]">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              {product.name}
            </h1>

            {/* Star Rating Summary */}
            <div className="flex items-center gap-2 text-xs pt-0.5">
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < Math.round(product.rating || 5)
                        ? "fill-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-[var(--foreground)]">{product.rating || "5.0"}</span>
              <span className="text-[var(--muted-text)]">
                ({product.reviewCount ?? 0} {product.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Short Narrative */}
            <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Pricing & Stock Status */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                {formattedPrice}
              </span>
              {formattedCompareAt && (
                <span className="font-mono text-sm sm:text-base text-[var(--muted-text)] line-through">
                  {formattedCompareAt}
                </span>
              )}
              {discountPercent && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Stock Level Indicator */}
            <div className="flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <span className="flex items-center gap-1.5 text-red-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Currently Out of Stock
                </span>
              ) : stockLimit <= 5 ? (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Limited Atelier Batch — Only {stockLimit} left
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  In Stock • Ready to dispatch in 24 hours
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector & Add to Bag Button */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Quantity
            </label>

            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-black/10 dark:border-white/15 rounded-xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.05] h-12">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Decrease quantity"
                  className="px-3.5 h-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-[var(--foreground)] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold text-[var(--foreground)]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= stockLimit || isOutOfStock}
                  aria-label="Increase quantity"
                  className="px-3.5 h-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-[var(--foreground)] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-12 px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.99] ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : isOutOfStock
                    ? "bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed"
                    : "bg-[#264E3A] hover:bg-[#1e3e2e] dark:bg-[#478466] dark:hover:bg-[#386b52] text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Your Bag!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {formattedPrice}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Reassurance & Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
              <Truck className="w-4 h-4 text-[#264E3A] dark:text-[#67B58E] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <p className="font-semibold text-[var(--foreground)]">Complimentary Dispatch</p>
                <p className="text-[var(--muted-text)]">Orders over $100 ship free worldwide.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
              <RotateCcw className="w-4 h-4 text-[#264E3A] dark:text-[#67B58E] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <p className="font-semibold text-[var(--foreground)]">30-Day Calm Returns</p>
                <p className="text-[var(--muted-text)]">Simple, hassle-free returns on all atelier items.</p>
              </div>
            </div>
          </div>

          {/* Interactive Information Tabs */}
          <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-4 border-b border-black/5 dark:border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "border-[#264E3A] dark:border-[#67B58E] text-[var(--foreground)] font-bold"
                    : "border-transparent text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                Story & Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("craftsmanship")}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === "craftsmanship"
                    ? "border-[#264E3A] dark:border-[#67B58E] text-[var(--foreground)] font-bold"
                    : "border-transparent text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                Craftsmanship & Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === "shipping"
                    ? "border-[#264E3A] dark:border-[#67B58E] text-[var(--foreground)] font-bold"
                    : "border-transparent text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            {/* Tab Contents */}
            <div className="text-xs text-[var(--muted-text)] leading-relaxed">
              {activeTab === "details" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600 dark:text-stone-300">
                    <li>Individually hand-inspected at the NESTORA atelier.</li>
                    <li>Designed for minimal ergonomic footprint and calm aesthetics.</li>
                    <li>Finished with water-resistant non-toxic organic matte sealant.</li>
                  </ul>
                </div>
              )}

              {activeTab === "craftsmanship" && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <p>
                    Every piece is crafted in small batches using FSC-certified sustainably sourced
                    European timber, matte-glazed ceramic, or architectural-grade anodized aluminum.
                  </p>
                  <p>
                    <strong>Care Instructions:</strong> Wipe gently with a soft, slightly damp cloth.
                    Avoid harsh chemical cleaners or abrasive scouring pads to maintain the natural patina.
                  </p>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <p>
                    All items are carefully packaged in 100% recyclable, plastic-free biodegradable
                    packaging.
                  </p>
                  <p>
                    <strong>Domestic Delivery:</strong> 2–4 business days via carbon-neutral tracked courier.
                  </p>
                  <p>
                    <strong>Worldwide Dispatch:</strong> 5–9 business days with door-to-door tracking.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 dark:bg-[#121312]/95 backdrop-blur-md border-t border-black/10 dark:border-white/10 lg:hidden flex items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase text-[var(--muted-text)] truncate max-w-[120px]">
            {product.name}
          </span>
          <span className="font-mono text-sm font-bold text-[var(--foreground)]">
            {formattedPrice}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 max-w-[200px] h-11 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
            isAdded
              ? "bg-emerald-600 text-white"
              : isOutOfStock
              ? "bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed"
              : "bg-[#264E3A] active:bg-[#1e3e2e] dark:bg-[#478466] text-white"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : isOutOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
