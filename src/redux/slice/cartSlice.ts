import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/redux/createSlices";

interface CartItem {
  transId: number;
  product: number;
  qty: number;
  rate: number;
  unit: number;
  totalRate: number;
  productName?: string;
  productImage?: string;
  unitName?: string;
  details?: any;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  totalAmount: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  totalAmount: 0,
  itemCount: 0,
};

export const CartSlice = createAppSlice({
  name: "Cart",
  initialState,
  reducers: {
    setLoading: (state: CartState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: CartState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    storeCart: (state: CartState, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.length;
      state.totalAmount = action.payload.reduce((sum, item) => sum + item.totalRate, 0);
    },
    addToCart: (state: CartState, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => 
        item.product === action.payload.product && item.unit === action.payload.unit
      );
      
      if (existingItem) {
        existingItem.qty += action.payload.qty;
        existingItem.totalRate = existingItem.qty * existingItem.rate;
      } else {
        state.items.push(action.payload);
      }
      
      state.itemCount = state.items.length;
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalRate, 0);
    },
    updateCartItem: (state: CartState, action: PayloadAction<{ transId: number; qty: number }>) => {
      const item = state.items.find(item => item.transId === action.payload.transId);
      if (item) {
        item.qty = action.payload.qty;
        item.totalRate = item.qty * item.rate;
        state.totalAmount = state.items.reduce((sum, item) => sum + item.totalRate, 0);
      }
    },
    removeFromCart: (state: CartState, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.transId !== action.payload);
      state.itemCount = state.items.length;
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalRate, 0);
    },
    clearCart: (state: CartState) => {
      state.items = [];
      state.itemCount = 0;
      state.totalAmount = 0;
      state.error = null;
    },
    updateCartItemDetails: (state: CartState, action: PayloadAction<{ transId: number; details: any }>) => {
      const item = state.items.find(item => item.transId === action.payload.transId);
      if (item) {
        item.details = action.payload.details;
        item.productName = action.payload.details.productName;
        item.productImage = action.payload.details.productImage;
        item.unitName = action.payload.details.unitName;
      }
    },
  },
  selectors: {
    reduxCartItems: (cart: CartState) => cart?.items,
    reduxCartCount: (cart: CartState) => cart.itemCount,
    reduxCartTotal: (cart: CartState) => cart.totalAmount,
    reduxCartLoading: (cart: CartState) => cart.loading,
    reduxCartError: (cart: CartState) => cart.error,
  },
});

export const { 
  setLoading, 
  setError, 
  storeCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  updateCartItemDetails
} = CartSlice.actions;

export const { 
  reduxCartItems, 
  reduxCartCount, 
  reduxCartTotal, 
  reduxCartLoading, 
  reduxCartError 
} = CartSlice.selectors;
