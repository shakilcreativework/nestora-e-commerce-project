import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number; // in minor units (cents, e.g. 12500 for $125.00)
  compareAtPrice?: number | null;
  currency: string;
  imageUrl: string;
  categoryName?: string;
  quantity: number;
  maxStock?: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Open/Close Cart Drawer
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    // Add item to cart (if already in cart, increment quantity)
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>
    ) => {
      const incoming = action.payload;
      const addQty = incoming.quantity && incoming.quantity > 0 ? incoming.quantity : 1;
      const existingIndex = state.items.findIndex((item) => item.id === incoming.id);

      if (existingIndex > -1) {
        const item = state.items[existingIndex];
        const newQty = item.quantity + addQty;
        // Respect stock limit if provided
        item.quantity = item.maxStock ? Math.min(newQty, item.maxStock) : newQty;
      } else {
        state.items.push({
          ...incoming,
          quantity: incoming.maxStock ? Math.min(addQty, incoming.maxStock) : addQty,
        });
      }
      // Auto-open drawer when adding an item for immediate customer feedback
      state.isOpen = true;
    },

    // Update quantity directly (e.g. via stepper buttons)
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existing.quantity = existing.maxStock
            ? Math.min(quantity, existing.maxStock)
            : quantity;
        }
      }
    },

    // Remove single item from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Clear entire cart (e.g. after successful checkout)
    clearCart: (state) => {
      state.items = [];
    },

    // Hydrate state from localStorage
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isOpen;

// Total number of items in bag (sum of quantities)
export const selectCartTotalQuantity = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

// Subtotal calculation in minor units (cents)
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
