"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  closeCart,
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalQuantity,
  selectIsCartOpen,
} from "@/lib/store/features/cart-slice";

// Free shipping threshold: $150.00 (15000 cents)
const FREE_SHIPPING_THRESHOLD_CENTS = 15000;

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartOpen);
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const subtotalCents = useAppSelector(selectCartSubtotal);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        dispatch(closeCart());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  // Currency formatting
  const formattedSubtotal = (subtotalCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents
  );
  const formattedRemaining = (remainingForFreeShipping / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(closeCart())}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        aria-label="Shopping Cart"
        className="relative z-10 w-full max-w-md h-full bg-[#FBFBF9] dark:bg-[#121312] border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between overflow-hidden transition-transform duration-300 animate-in slide-in-from-right"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#264E3A] dark:text-[#67B58E]" />
            <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              Shopping Bag
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {totalQuantity}
            </span>
          </div>

          <button
            type="button"
            onClick={() => dispatch(closeCart())}
            aria-label="Close cart"
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-4 sm:px-5 py-3 bg-stone-100 dark:bg-[#181918] border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
              <Truck className="w-3.5 h-3.5 text-[#264E3A] dark:text-[#67B58E]" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-stone-900 dark:text-white">{formattedRemaining}</strong> for Free Delivery
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✦ You have unlocked Free Delivery!
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-stone-500">{freeShippingProgress}%</span>
          </div>
          {/* Progress Track */}
          <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                freeShippingProgress >= 100
                  ? "bg-emerald-500"
                  : "bg-[#264E3A] dark:bg-[#67B58E]"
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400 mb-4 border border-stone-200 dark:border-stone-800">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
                Your bag is empty
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xs mb-6">
                Explore our curated collection of architectural desk pieces, ambient lighting, and handcrafted ceramics.
              </p>
              <button
                type="button"
                onClick={() => dispatch(closeCart())}
                className="py-2.5 px-6 rounded-full text-xs font-semibold bg-[#264E3A] text-white hover:bg-[#1e3e2e] transition-colors shadow-xs"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemFormattedPrice = (item.price / 100).toLocaleString("en-US", {
                style: "currency",
                currency: item.currency || "USD",
              });

              return (
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-4 p-3 rounded-xl bg-white dark:bg-[#181918] border border-stone-200/80 dark:border-stone-800/80 shadow-2xs"
                >
                  {/* Thumbnail Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={() => dispatch(closeCart())}
                    className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 shrink-0"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="88px"
                      className="object-cover object-center"
                    />
                  </Link>

                  {/* Info Column */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => dispatch(closeCart())}
                          className="font-serif text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 hover:text-[#264E3A] dark:hover:text-[#67B58E] transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          aria-label={`Remove ${item.name} from bag`}
                          className="p-1 rounded-md text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.categoryName && (
                        <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400 truncate mt-0.5">
                          {item.categoryName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-900">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          aria-label="Decrease quantity"
                          className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          aria-label="Increase quantity"
                          className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 font-mono">
                        {itemFormattedPrice}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Subtotal & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-stone-100/70 dark:bg-[#161716] border-t border-stone-200 dark:border-stone-800 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
              <span className="font-mono text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                {formattedSubtotal}
              </span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Taxes and tracked shipping calculated during secure checkout.
            </p>

            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-[#264E3A] hover:bg-[#1d3d2e] dark:bg-[#478466] dark:hover:bg-[#386b52] text-white flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Trust Pill */}
            <div className="flex items-center justify-center gap-2 pt-1 text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>30-Day Calm Return • 256-Bit Encrypted Checkout</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
