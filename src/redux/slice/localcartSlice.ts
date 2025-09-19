import type { PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { createAppSlice } from "../createSlices";

// Define types for cart item and state
export interface CartItemType {
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId: string | number | null;
  totalPrice: number;
  [key: string]: any;
}

export interface InitialLocalCartType {
  items: CartItemType[];
}

const initialState: InitialLocalCartType = {
  items: [],
};

// Helper functions for quantity management
function increaseQuantity(array: CartItemType[], productId: string | number, variantId: string | number | null) {
  return array.map((item) =>
    (item.productId === productId && item.variantId === variantId)
      ? { 
          ...item, 
          quantity: item.quantity < (item.availableQuantity || 10) ? item.quantity + 1 : (item.availableQuantity || 10),
          totalPrice: item.price * (item.quantity < (item.availableQuantity || 10) ? item.quantity + 1 : (item.availableQuantity || 10))
        }
      : item
  );
}

function decreaseQuantity(array: CartItemType[], productId: string | number, variantId: string | number | null) {
  return array.map((item) =>
    (item.productId === productId && item.variantId === variantId)
      ? { 
          ...item, 
          quantity: item.quantity > 1 ? item.quantity - 1 : 1,
          totalPrice: item.price * (item.quantity > 1 ? item.quantity - 1 : 1)
        }
      : item
  );
}

// Load initial state from localStorage if available
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedCart = localStorage.getItem('cart_items');
      if (storedCart) {
        return {
          items: JSON.parse(storedCart)
        };
      }
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
    }
  }
  return initialState;
};

export const LocalCartSlice = createAppSlice({
  name: "LocalCart",
  initialState: getInitialState(),
  reducers: (create: any) => ({
    // Add item to cart
    addToLocalCart: create.reducer(
      (state: any, action: PayloadAction<CartItemType>) => {
        const existingItemIndex = state.items.findIndex(
          (item: any) => item.productId === action.payload.productId && 
                    item.variantId === action.payload.variantId
        );

        if (existingItemIndex === -1) {
          // Add new item
          state.items = [action.payload, ...state.items];
          notification.success({
            message: "Product added to cart successfully."
          });
        } else {
          // Update quantity of existing item
          state.items[existingItemIndex].quantity += action.payload.quantity;
          state.items[existingItemIndex].totalPrice = 
            state.items[existingItemIndex].price * state.items[existingItemIndex].quantity;
          
          notification.success({
            message: "Cart updated successfully."
          });
        }

        // Sync with localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_items', JSON.stringify(state.items));
        }
      }
    ),

    // Remove item from cart
    removeFromLocalCart: create.reducer(
      (state: any, action: PayloadAction<{ productId: string | number, variantId: string | number | null }>) => {
        const initialLength = state.items.length;
        
        state.items = state.items.filter(
          (item: any) => !(item.productId === action.payload.productId && 
                     item.variantId === action.payload.variantId)
        );
        
        if (state.items.length < initialLength) {
          notification.success({
            message: "Product removed from cart successfully."
          });
          
          // Sync with localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart_items', JSON.stringify(state.items));
          }
        }
      }
    ),

    // Increase quantity
    increaseLocalCartQuantity: create.reducer(
      (state: any, action: PayloadAction<{ productId: string | number, variantId: string | number | null }>) => {
        state.items = increaseQuantity(state.items, action.payload.productId, action.payload.variantId);
        
        // Sync with localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_items', JSON.stringify(state.items));
        }
      }
    ),

    // Decrease quantity
    decreaseLocalCartQuantity: create.reducer(
      (state: any, action: PayloadAction<{ productId: string | number, variantId: string | number | null }>) => {
        state.items = decreaseQuantity(state.items, action.payload.productId, action.payload.variantId);
        
        // Sync with localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_items', JSON.stringify(state.items));
        }
      }
    ),

    // Update quantity directly
    updateLocalCartQuantity: create.reducer(
      (state: any, action: PayloadAction<{ 
        productId: string | number, 
        variantId: string | number | null,
        quantity: number 
      }>) => {
        const { productId, variantId, quantity } = action.payload;
        
        state.items = state.items.map((item: CartItemType) => 
          (item.productId === productId && item.variantId === variantId)
            ? { ...item, quantity, totalPrice: item.price * quantity }
            : item
        );
        
        // Sync with localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_items', JSON.stringify(state.items));
        }
      }
    ),

    // Clear cart
    clearLocalCart: create.reducer((state: any) => {
      state.items = [];
      
      // Sync with localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_items');
      }
      
      // notification.success({
      //   message: "Cart cleared successfully."
      // });
    }),

    // Set the entire cart (useful when loading from localStorage)
    setLocalCart: create.reducer(
      (state: any, action: PayloadAction<CartItemType[]>) => {
        state.items = action.payload;
        
        // Sync with localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_items', JSON.stringify(action.payload));
        }
      }
    ),
  }),

  // Selectors
  selectors: {
    localCartItems: (state: InitialLocalCartType) => state.items,
    localCartCount: (state: InitialLocalCartType) => state.items.length,
    localCartTotal: (state: InitialLocalCartType) => {
      return state.items.reduce(
        (total: number, item: CartItemType) => total + (item.totalPrice || (item.price * item.quantity)),
        0
      );
    },
    getLocalCartItem: (state: InitialLocalCartType, productId: string | number, variantId: string | number | null) => {
      return state.items.find(item => 
        item.productId === productId && item.variantId === variantId
      );
    }
  },
});

// Get the action creators from the slice
const sliceActions = LocalCartSlice.actions as any;

// Explicitly type the action creators as functions
export const addToLocalCart = ((payload: CartItemType) => sliceActions.addToLocalCart(payload)) as (payload: CartItemType) => {
  type: string;
  payload: CartItemType;
};

export const removeFromLocalCart = ((payload: { productId: string | number, variantId: string | number | null }) => 
  sliceActions.removeFromLocalCart(payload)) as (payload: { productId: string | number, variantId: string | number | null }) => {
  type: string;
  payload: { productId: string | number, variantId: string | number | null };
};

export const increaseLocalCartQuantity = ((payload: { productId: string | number, variantId: string | number | null }) => 
  sliceActions.increaseLocalCartQuantity(payload)) as (payload: { productId: string | number, variantId: string | number | null }) => {
  type: string;
  payload: { productId: string | number, variantId: string | number | null };
};

export const decreaseLocalCartQuantity = ((payload: { productId: string | number, variantId: string | number | null }) => 
  sliceActions.decreaseLocalCartQuantity(payload)) as (payload: { productId: string | number, variantId: string | number | null }) => {
  type: string;
  payload: { productId: string | number, variantId: string | number | null };
};

export const updateLocalCartQuantity = ((payload: { productId: string | number, variantId: string | number | null, quantity: number }) => 
  sliceActions.updateLocalCartQuantity(payload)) as (payload: { productId: string | number, variantId: string | number | null, quantity: number }) => {
  type: string;
  payload: { productId: string | number, variantId: string | number | null, quantity: number };
};

export const clearLocalCart = (() => sliceActions.clearLocalCart()) as () => {
  type: string;
};

export const setLocalCart = ((payload: CartItemType[]) => sliceActions.setLocalCart(payload)) as (payload: CartItemType[]) => {
  type: string;
  payload: CartItemType[];
};

// Export selectors
export const { 
  localCartItems, 
  localCartCount, 
  localCartTotal,
  getLocalCartItem
} = LocalCartSlice.selectors;

export default LocalCartSlice.reducer;