import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/redux/createSlices";

interface WishlistItem {
  transId: number;
  product: number;
  quantity: number;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  details?: any;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  itemCount: number;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  itemCount: 0,
};

export const WishlistSlice = createAppSlice({
  name: "Wishlist",
  initialState,
  reducers: {
    setLoading: (state: WishlistState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: WishlistState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    storeWishlist: (state: WishlistState, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.length;
    },
    addToWishlist: (state: WishlistState, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find(item => item.product === action.payload.product);
      
      if (!existingItem) {
        state.items.push(action.payload);
        state.itemCount = state.items.length;
      }
    },
    removeFromWishlist: (state: WishlistState, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.transId !== action.payload);
      state.itemCount = state.items.length;
    },
    clearWishlist: (state: WishlistState) => {
      state.items = [];
      state.itemCount = 0;
      state.error = null;
    },
    updateWishlistItemDetails: (state: WishlistState, action: PayloadAction<{ transId: number; details: any }>) => {
      const item = state.items.find(item => item.transId === action.payload.transId);
      if (item) {
        item.details = action.payload.details;
        item.productName = action.payload.details.productName;
        item.productImage = action.payload.details.productImage;
        item.productPrice = action.payload.details.productPrice;
      }
    },
  },
  selectors: {
    reduxWishlistItems: (wishlist: WishlistState) => wishlist?.items,
    reduxWishlistCount: (wishlist: WishlistState) => wishlist.itemCount,
    reduxWishlistLoading: (wishlist: WishlistState) => wishlist.loading,
    reduxWishlistError: (wishlist: WishlistState) => wishlist.error,
  },
});

export const { 
  setLoading, 
  setError, 
  storeWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  updateWishlistItemDetails
} = WishlistSlice.actions;

export const { 
  reduxWishlistItems, 
  reduxWishlistCount, 
  reduxWishlistLoading, 
  reduxWishlistError 
} = WishlistSlice.selectors;

