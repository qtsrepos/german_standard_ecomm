# Cart Page Integration Tasks

## 🛒 **Current State Analysis**
- **Status**: Cart page is COMPLETELY COMMENTED OUT (`page.tsx` is non-functional)
- **Available APIs**: German Standard `upsertCart` + Legacy cart APIs
- **Components**: Cart item, summary card, and recommended items exist but not integrated
- **Critical Issue**: No working cart functionality currently

## 🔧 **German Standard API Integration**

### **Available Cart APIs**
```typescript
// German Standard APIs (Primary)
GERMAN_STANDARD_UPSERT_CART: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/upsertcart"

// Legacy APIs (Fallback)
CART_GET_ALL: "cart/all"
CART: "cart/" // post,put,delete
CART_CLEAR_ALL: "cart/clear-all/"
```

## 📋 **Implementation Tasks**

### **Phase 1: Core Cart Functionality** ⭐ HIGH PRIORITY

#### **Task 1: Uncomment and Restore Cart Page**
- **File**: `src/app/(user)/cart/page.tsx`
- **Action**: Uncomment the entire cart page implementation
- **Dependencies**: Fix imports and ensure all components are available
- **Testing**: Verify page loads without errors

#### **Task 2: German Standard Cart API Integration**
- **File**: `src/app/(user)/cart/page.tsx`
- **Action**: Replace legacy cart APIs with German Standard `upsertCart`
- **Implementation**:
  ```typescript
  // Replace existing cart load
  const loadCartItems = async () => {
    const cartData = await germanStandardApi.getCartItems();
    dispatch(storeCart(cartData));
  };

  // Replace cart update
  const updateCartItem = async (productId, quantity) => {
    await germanStandardApi.upsertCart({
      productId,
      quantity,
      transId: 0 // New cart item
    });
  };
  ```

#### **Task 3: Cart Item Management**
- **Files**:
  - `src/app/(user)/cart/_components/cartItem.tsx`
  - `src/app/(user)/cart/_components/summaryCard.tsx`
- **Actions**:
  - Connect quantity updates to German Standard API
  - Implement real-time price calculations
  - Add loading states during cart operations
  - Handle cart item removal via German Standard API

#### **Task 4: Cart State Synchronization**
- **File**: `src/redux/slice/cartSlice.ts`
- **Actions**:
  - Ensure Redux state matches German Standard cart format
  - Implement optimistic updates for better UX
  - Add cart item count updates for header display
  - Handle cart persistence across sessions

### **Phase 2: Enhanced Cart Features** 🔶 MEDIUM PRIORITY

#### **Task 5: Real-time Cart Updates**
- **Implementation**: WebSocket or polling for cart sync across devices
- **Benefit**: Multi-device cart synchronization
- **Files**: Cart page + cart slice

#### **Task 6: Cart Validation & Inventory Check**
- **Implementation**: Validate cart items against current inventory
- **Features**:
  - Stock availability warnings
  - Price change notifications
  - Product discontinuation alerts

#### **Task 7: Cart Recommendations**
- **File**: `src/app/(user)/cart/_components/recommended.tsx`
- **Actions**:
  - Integrate with German Standard product recommendations
  - Show related/complementary products
  - Implement "frequently bought together"

#### **Task 8: Saved for Later / Wishlist Integration**
- **Implementation**: Move cart items to wishlist functionality
- **German Standard API**: Use `upsertWishlist` for saved items
- **UI**: Add "Save for Later" buttons to cart items

### **Phase 3: Cart Performance & UX** 🔷 LOW PRIORITY

#### **Task 9: Cart Performance Optimization**
- **Implementation**:
  - Debounced quantity updates
  - Batch cart operations
  - Efficient re-rendering strategies

#### **Task 10: Mobile Cart Experience**
- **Files**:
  - `src/app/(user)/cart/_components/cartItemsDrawer.tsx`
  - `src/app/(user)/cart/_components/summeryCardDrawer.tsx`
- **Actions**:
  - Optimize drawer components for mobile
  - Implement swipe-to-delete functionality
  - Add mobile-specific cart shortcuts

## 🔗 **API Integration Details**

### **German Standard Cart API Schema**
```typescript
interface CartRequest {
  productId: number;
  quantity: number;
  transId: number; // 0 for new item, existing ID for updates
  variantId?: number;
  notes?: string;
}

interface CartResponse {
  status: "Success" | "Failed";
  statusCode: number;
  message: string;
  result: number; // transId of cart item
}
```

### **Required API Methods**
```typescript
// To implement in germanStandardApi.ts
async upsertCart(cartRequest: CartRequest): Promise<CartResponse>
async getCartItems(): Promise<CartItem[]>
async removeCartItem(transId: number): Promise<boolean>
async clearCart(): Promise<boolean>
```

## 📁 **Files to Modify**

### **Primary Files**
- `src/app/(user)/cart/page.tsx` - Main cart page (UNCOMMENT & INTEGRATE)
- `src/app/(user)/cart/_components/cartItem.tsx` - Individual cart item
- `src/app/(user)/cart/_components/summaryCard.tsx` - Cart summary
- `src/redux/slice/cartSlice.ts` - Cart state management

### **Secondary Files**
- `src/app/(user)/cart/_components/recommended.tsx` - Recommendations
- `src/app/(user)/cart/_components/cartItemsDrawer.tsx` - Mobile cart drawer
- `src/services/germanStandardApi.ts` - API integration methods

## 🎯 **Success Criteria**

1. **Functional Cart**: Users can add, update, remove items
2. **German Standard Sync**: All cart operations use German Standard APIs
3. **Real-time Updates**: Cart reflects changes immediately
4. **Cross-device Sync**: Cart persists across sessions/devices
5. **Performance**: Cart operations are fast and responsive
6. **Mobile Optimized**: Cart works seamlessly on mobile devices

## ⚠️ **Critical Dependencies**

1. **Authentication**: Cart requires valid German Standard session
2. **Product Data**: Cart items must reference valid German Standard product IDs
3. **Inventory Sync**: Cart quantities must respect current stock levels
4. **Price Updates**: Cart must reflect current product pricing