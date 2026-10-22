"use client";

import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import { hydrateCart, CartItem } from "@/lib/store/features/cart-slice";

const CART_STORAGE_KEY = "nestora_cart_v1";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  // Hydrate cart from localStorage on mount & listen to state changes to persist
  useEffect(() => {
    if (!storeRef.current) return;

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          storeRef.current.dispatch(hydrateCart(parsed));
        }
      }
    } catch {
      // Ignore localStorage parse error if user cleared storage or invalid json
    }

    // Subscribe to store updates to persist cart to localStorage
    const unsubscribe = storeRef.current.subscribe(() => {
      try {
        const state = storeRef.current?.getState();
        if (state) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart.items));
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
