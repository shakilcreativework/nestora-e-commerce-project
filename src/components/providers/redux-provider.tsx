"use client";

import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import { hydrateCart, CartItem } from "@/lib/store/features/cart-slice";
import { hydrateWishlist, WishlistItem } from "@/lib/store/features/wishlist-slice";

const CART_STORAGE_KEY = "nestora_cart_v1";
const WISHLIST_STORAGE_KEY = "nestora_wishlist_v1";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  // Hydrate cart & wishlist from localStorage on mount & listen to state changes to persist
  useEffect(() => {
    if (!storeRef.current) return;

    try {
      // 1. Hydrate Cart
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          storeRef.current.dispatch(hydrateCart(parsedCart));
        }
      }

      // 2. Hydrate Wishlist
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        const parsedWishlist: WishlistItem[] = JSON.parse(storedWishlist);
        if (Array.isArray(parsedWishlist) && parsedWishlist.length > 0) {
          storeRef.current.dispatch(hydrateWishlist(parsedWishlist));
        }
      }
    } catch {
      // Ignore localStorage parse error if user cleared storage or invalid json
    }

    // Subscribe to store updates to persist cart & wishlist to localStorage
    const unsubscribe = storeRef.current.subscribe(() => {
      try {
        const state = storeRef.current?.getState();
        if (state) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart.items));
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.wishlist.items));
        }
      } catch {
        // Ignore storage write issues (e.g. private browsing quota)
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
