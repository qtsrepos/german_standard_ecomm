import type { PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { createAppSlice } from "../createSlices";
import { EnhancedCartItem, localCartService } from "@/services/localCartService";

// Define types for cart item and state - keeping backward compatibility
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

// Enhanced cart state with loading states and metadata
export interface EnhancedLocalCartState {
  items: EnhancedCartItem[];

  // Loading states for better UX
  isLoading: boolean;
  itemLoadingStates: Record<string, boolean>; // Track loading state per item

  // Error handling
  lastError: string | null;

  // Cart metadata for analytics and optimization
  metadata: {
    lastSyncAt: string;
    totalValue: number;
    itemCount: number;
    uniqueProducts: number;
    lastUpdated: string;
  };

  // Feature flags
  features: {
    autoValidation: boolean;
    compressionEnabled: boolean;
    notificationsEnabled: boolean;
  };
}

// Legacy interface for backward compatibility
export interface InitialLocalCartType {
  items: CartItemType[];
}

// Enhanced initial state
const enhancedInitialState: EnhancedLocalCartState = {
  items: [],
  isLoading: false,
  itemLoadingStates: {},
  lastError: null,
  metadata: {
    lastSyncAt: new Date().toISOString(),
    totalValue: 0,
    itemCount: 0,
    uniqueProducts: 0,
    lastUpdated: new Date().toISOString(),
  },
  features: {
    autoValidation: true,
    compressionEnabled: true,
    notificationsEnabled: true,
  },
};

// Legacy initial state for backward compatibility
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

// Enhanced initial state - no legacy storage loading
const getEnhancedInitialState = (): EnhancedLocalCartState => {
  // Return clean initial state - cart loading will be handled by the cart service
  // with automatic migration in the useCartInitialization hook
  return enhancedInitialState;
};

export const LocalCartSlice = createAppSlice({
  name: "LocalCart",
  initialState: getEnhancedInitialState(),
  reducers: (create: any) => ({
    // Enhanced cart actions using the cart service

    /**
     * Set loading state for the entire cart
     */
    setCartLoading: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
        if (!action.payload) {
          state.lastError = null;
        }
      }
    ),

    /**
     * Set loading state for a specific item
     */
    setItemLoading: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<{ key: string; loading: boolean }>) => {
        const { key, loading } = action.payload;
        if (loading) {
          state.itemLoadingStates[key] = true;
        } else {
          delete state.itemLoadingStates[key];
        }
      }
    ),

    /**
     * Set error state
     */
    setCartError: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<string | null>) => {
        state.lastError = action.payload;
        state.isLoading = false;
      }
    ),

    /**
     * Load cart items from storage (called on app init)
     */
    loadCartFromStorage: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<EnhancedCartItem[]>) => {
        state.items = action.payload;
        state.metadata = {
          ...state.metadata,
          itemCount: action.payload.length,
          totalValue: action.payload.reduce((sum, item) => sum + item.totalPrice, 0),
          uniqueProducts: new Set(action.payload.map(item => item.productId)).size,
          lastUpdated: new Date().toISOString(),
        };
        state.isLoading = false;
      }
    ),

    /**
     * Update feature flags
     */
    updateFeatures: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<Partial<EnhancedLocalCartState['features']>>) => {
        state.features = { ...state.features, ...action.payload };
      }
    ),
    // Enhanced add to cart action
    addToLocalCart: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<EnhancedCartItem>) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.productId === action.payload.productId &&
                    item.variantId === action.payload.variantId
        );

        if (existingItemIndex === -1) {
          // Add new item
          state.items = [action.payload, ...state.items];
        } else {
          // Update existing item
          const existingItem = state.items[existingItemIndex];
          state.items[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + action.payload.quantity,
            totalPrice: existingItem.price * (existingItem.quantity + action.payload.quantity),
            lastUpdated: new Date().toISOString()
          };
        }

        // Update metadata
        state.metadata = {
          ...state.metadata,
          itemCount: state.items.length,
          totalValue: state.items.reduce((sum, item) => sum + item.totalPrice, 0),
          uniqueProducts: new Set(state.items.map(item => item.productId)).size,
          lastUpdated: new Date().toISOString(),
        };
      }
    ),

    // Enhanced remove from cart action
    removeFromLocalCart: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<{ productId: string | number, variantId: string | number | null }>) => {
        const initialLength = state.items.length;

        state.items = state.items.filter(
          (item) => !(item.productId === action.payload.productId &&
                     item.variantId === action.payload.variantId)
        );

        // Update metadata if item was removed
        if (state.items.length < initialLength) {
          state.metadata = {
            ...state.metadata,
            itemCount: state.items.length,
            totalValue: state.items.reduce((sum, item) => sum + item.totalPrice, 0),
            uniqueProducts: new Set(state.items.map(item => item.productId)).size,
            lastUpdated: new Date().toISOString(),
          };
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

    // Enhanced update quantity action
    updateLocalCartQuantity: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<{
        productId: string | number,
        variantId: string | number | null,
        quantity: number
      }>) => {
        const { productId, variantId, quantity } = action.payload;

        state.items = state.items.map((item) =>
          (item.productId === productId && item.variantId === variantId)
            ? {
                ...item,
                quantity,
                totalPrice: item.price * quantity,
                lastUpdated: new Date().toISOString()
              }
            : item
        );

        // Update metadata
        state.metadata = {
          ...state.metadata,
          totalValue: state.items.reduce((sum, item) => sum + item.totalPrice, 0),
          lastUpdated: new Date().toISOString(),
        };
      }
    ),

    // Enhanced clear cart action
    clearLocalCart: create.reducer((state: EnhancedLocalCartState) => {
      state.items = [];
      state.metadata = {
        ...state.metadata,
        itemCount: 0,
        totalValue: 0,
        uniqueProducts: 0,
        lastUpdated: new Date().toISOString(),
      };
      state.itemLoadingStates = {};
      state.lastError = null;
    }),

    // Enhanced set entire cart action
    setLocalCart: create.reducer(
      (state: EnhancedLocalCartState, action: PayloadAction<EnhancedCartItem[]>) => {
        state.items = action.payload;
        state.metadata = {
          ...state.metadata,
          itemCount: action.payload.length,
          totalValue: action.payload.reduce((sum, item) => sum + item.totalPrice, 0),
          uniqueProducts: new Set(action.payload.map(item => item.productId)).size,
          lastUpdated: new Date().toISOString(),
        };
      }
    ),
  }),

  // Enhanced selectors
  selectors: {
    // Basic cart data
    localCartItems: (state: EnhancedLocalCartState) => state.items,
    localCartCount: (state: EnhancedLocalCartState) => state.metadata.itemCount,
    localCartTotal: (state: EnhancedLocalCartState) => state.metadata.totalValue,

    // Loading states
    isCartLoading: (state: EnhancedLocalCartState) => state.isLoading,
    itemLoadingStates: (state: EnhancedLocalCartState) => state.itemLoadingStates,

    // Error handling
    cartError: (state: EnhancedLocalCartState) => state.lastError,

    // Cart metadata
    cartMetadata: (state: EnhancedLocalCartState) => state.metadata,

    // Feature flags
    cartFeatures: (state: EnhancedLocalCartState) => state.features,

    // Computed values
    uniqueProductCount: (state: EnhancedLocalCartState) => state.metadata.uniqueProducts,
    avgItemPrice: (state: EnhancedLocalCartState) => {
      const { totalValue, itemCount } = state.metadata;
      return itemCount > 0 ? totalValue / itemCount : 0;
    },

    // Item finder with enhanced return type
    getLocalCartItem: (state: EnhancedLocalCartState, productId: string | number, variantId: string | number | null) => {
      return state.items.find(item =>
        item.productId === productId && item.variantId === variantId
      );
    },

    // Check if item is loading
    isItemLoading: (state: EnhancedLocalCartState, productId: string | number, variantId: string | number | null = null) => {
      const key = `${productId}_${variantId}`;
      return state.itemLoadingStates[key] || false;
    },

    // Get items by category or store
    getItemsByStore: (state: EnhancedLocalCartState, storeId?: string | number) => {
      if (!storeId) return state.items;
      return state.items.filter(item => item.storeId === storeId);
    },

    // Get low stock items
    getLowStockItems: (state: EnhancedLocalCartState) => {
      return state.items.filter(item => item.stockStatus === 'low_stock');
    },

    // Get out of stock items
    getOutOfStockItems: (state: EnhancedLocalCartState) => {
      return state.items.filter(item => item.stockStatus === 'out_of_stock');
    },

    // Legacy compatibility selector
    localCartItemsLegacy: (state: EnhancedLocalCartState): CartItemType[] => {
      return state.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variantId: item.variantId,
        totalPrice: item.totalPrice
      }));
    }
  },
});

// Export enhanced action creators
export const {
  setCartLoading,
  setItemLoading,
  setCartError,
  loadCartFromStorage,
  updateFeatures,
  addToLocalCart,
  removeFromLocalCart,
  increaseLocalCartQuantity,
  decreaseLocalCartQuantity,
  updateLocalCartQuantity,
  clearLocalCart,
  setLocalCart
} = LocalCartSlice.actions;

// Legacy action creators for backward compatibility
const sliceActions = LocalCartSlice.actions as any;

// Helper functions for components to use the cart service directly
export const cartServiceHelpers = {
  addToCart: localCartService.addToCart.bind(localCartService),
  updateQuantity: localCartService.updateQuantity.bind(localCartService),
  removeFromCart: localCartService.removeFromCart.bind(localCartService),
  clearCart: localCartService.clearCart.bind(localCartService),
  getCart: localCartService.getCart.bind(localCartService),
  isInCart: localCartService.isInCart.bind(localCartService),
  getCartItem: localCartService.getCartItem.bind(localCartService),
  getCartSummary: localCartService.getCartSummary.bind(localCartService)
};

// Export enhanced selectors
export const {
  localCartItems,
  localCartCount,
  localCartTotal,
  isCartLoading,
  itemLoadingStates,
  cartError,
  cartMetadata,
  cartFeatures,
  uniqueProductCount,
  avgItemPrice,
  getLocalCartItem,
  isItemLoading,
  getItemsByStore,
  getLowStockItems,
  getOutOfStockItems,
  localCartItemsLegacy
} = LocalCartSlice.selectors;

export default LocalCartSlice.reducer;