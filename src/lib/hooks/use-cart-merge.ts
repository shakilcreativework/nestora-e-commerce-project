"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCartItems, setCartItems, CartItem } from "@/lib/store/features/cart-slice";
import { verifyAndMergeGuestCart, CartAdjustmentNotice } from "@/lib/actions/cart";

export interface CartMergeResult {
  success: boolean;
  mergedCount: number;
  adjustments: CartAdjustmentNotice[];
  error?: string;
}

/**
 * Senior Developer Standard Hook: useCartMerge
 * 
 * Orchestrates deterministic client-to-server cart merging upon customer authentication.
 * Safely reconciles client guest items with PostgreSQL authoritative stock and admin approval.
 */
export function useCartMerge() {
  const dispatch = useAppDispatch();
  const currentCartItems = useAppSelector(selectCartItems);

  const executeCartMerge = async (): Promise<CartMergeResult> => {
    try {
      if (!currentCartItems || currentCartItems.length === 0) {
        return { success: true, mergedCount: 0, adjustments: [] };
      }

      // Prepare minimal payload for server verification
      const payload = currentCartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      // Call authoritative server action
      const response = await verifyAndMergeGuestCart(payload);

      if (response.success && Array.isArray(response.items)) {
        // Update Redux state with verified items
        dispatch(setCartItems(response.items));

        return {
          success: true,
          mergedCount: response.items.length,
          adjustments: response.adjustments || [],
        };
      } else {
        return {
          success: false,
          mergedCount: currentCartItems.length,
          adjustments: [],
          error: response.error || "Failed to sync cart with server inventory.",
        };
      }
    } catch (err) {
      console.error("Cart merge error:", err);
      // Soft-fail: do not block authentication if merge encounters a transient issue
      return {
        success: false,
        mergedCount: currentCartItems.length,
        adjustments: [],
        error: "Cart sync failed, proceeding with current session.",
      };
    }
  };

  return {
    executeCartMerge,
    currentCartItems,
  };
}
