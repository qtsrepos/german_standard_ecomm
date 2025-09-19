# Wishlist Page Integration Tasks

## 💖 **Current State Analysis**
- **Status**: Wishlist functionality exists as "Favorites" but not fully integrated
- **Available APIs**: German Standard `upsertWishlist` + Legacy wishlist APIs
- **Location**: `src/app/(user)/user/favorites/page.tsx`
- **Redux**: Wishlist slice exists with basic functionality
- **Components**: Product items can toggle wishlist status

## 🔧 **German Standard API Integration**

### **Available Wishlist APIs**
```typescript
// German Standard APIs (Primary)
GERMAN_STANDARD_UPSERT_WISHLIST: "http://103.120.178.195/Sang.GermanStandard.API/gsgtransaction/upsertwishlist"

// Legacy APIs (Fallback)
WISHLIST: "wishlist/" // post,delete
WISHLIST_GETALL: "wishlist/all" // get,post,put
```

## 📋 **Implementation Tasks**

### **Phase 1: Core Wishlist Functionality** ⭐ HIGH PRIORITY

#### **Task 1: German Standard Wishlist API Integration**
- **File**: `src/app/(user)/user/favorites/page.tsx`
- **Action**: Replace legacy wishlist APIs with German Standard `upsertWishlist`
- **Implementation**:
  ```typescript
  // Load user wishlist
  const loadWishlist = async () => {
    const wishlistData = await germanStandardApi.getWishlistItems();
    dispatch(storeWishlist(wishlistData));
  };

  // Add/Remove from wishlist
  const toggleWishlist = async (productId: number) => {
    await germanStandardApi.upsertWishlist({
      productId,
      transId: 0, // 0 for add, existing ID for remove
      action: "toggle"
    });
  };
  ```

#### **Task 2: Wishlist State Management**
- **File**: `src/redux/slice/wishlistSlice.ts`
- **Actions**:
  - Ensure Redux state matches German Standard wishlist format
  - Add optimistic updates for better UX
  - Implement wishlist item count for header display
  - Handle wishlist persistence across sessions

#### **Task 3: Product Item Wishlist Integration**
- **File**: `src/components/productItem/page.tsx`
- **Actions**:
  - Connect heart/wishlist icon to German Standard API
  - Add visual feedback for wishlist actions
  - Implement loading states during wishlist operations
  - Show wishlist status based on German Standard data

#### **Task 4: Wishlist Page Enhancement**
- **File**: `src/app/(user)/user/favorites/page.tsx`
- **Actions**:
  - Display comprehensive wishlist with German Standard data
  - Add sorting options (date added, price, name)
  - Implement filtering by category/price range
  - Add bulk actions (remove multiple, move to cart)

### **Phase 2: Enhanced Wishlist Features** 🔶 MEDIUM PRIORITY

#### **Task 5: Wishlist to Cart Integration**
- **Implementation**: Move wishlist items directly to cart
- **German Standard API**: Use both `upsertWishlist` (remove) and `upsertCart` (add)
- **Features**:
  - "Add to Cart" buttons on wishlist items
  - "Move All to Cart" functionality
  - Bulk wishlist-to-cart operations

#### **Task 6: Wishlist Sharing**
- **Implementation**: Generate shareable wishlist links
- **Features**:
  - Public wishlist URLs
  - Email wishlist sharing
  - Social media wishlist sharing
  - Privacy controls for wishlist visibility

#### **Task 7: Wishlist Notifications**
- **Implementation**: Notify users about wishlist item changes
- **Features**:
  - Price drop alerts
  - Stock availability notifications
  - Sale/discount alerts for wishlist items
  - Back-in-stock notifications

#### **Task 8: Wishlist Analytics**
- **Implementation**: Track user wishlist behavior
- **Features**:
  - Most wishlisted products
  - Wishlist conversion tracking
  - User engagement metrics
  - Personalized recommendations based on wishlist

### **Phase 3: Advanced Wishlist Features** 🔷 LOW PRIORITY

#### **Task 9: Multiple Wishlists**
- **Implementation**: Allow users to create themed wishlists
- **Features**:
  - "Christmas List", "Birthday Wishes", etc.
  - Wishlist categories and tags
  - Wishlist search and organization
  - Wishlist templates

#### **Task 10: Wishlist Collaboration**
- **Implementation**: Share wishlists with family/friends
- **Features**:
  - Collaborative family wishlists
  - Gift registry functionality
  - Wishlist commenting system
  - Purchase coordination for shared lists

## 🔗 **API Integration Details**

### **German Standard Wishlist API Schema**
```typescript
interface WishlistRequest {
  productId: number;
  transId: number; // 0 for new item, existing ID for updates/removal
  notes?: string;
  priority?: number; // 1-5 priority rating
  dateAdded?: string;
}

interface WishlistResponse {
  status: "Success" | "Failed";
  statusCode: number;
  message: string;
  result: number; // transId of wishlist item
}

interface WishlistItem {
  transId: number;
  productId: number;
  productName: string;
  productImage: string;
  currentPrice: number;
  originalPrice?: number;
  stockStatus: boolean;
  dateAdded: string;
  notes?: string;
  priority?: number;
}
```

### **Required API Methods**
```typescript
// To implement in germanStandardApi.ts
async upsertWishlist(wishlistRequest: WishlistRequest): Promise<WishlistResponse>
async getWishlistItems(): Promise<WishlistItem[]>
async removeWishlistItem(transId: number): Promise<boolean>
async clearWishlist(): Promise<boolean>
async moveWishlistToCart(transId: number, quantity: number): Promise<boolean>
```

## 📁 **Files to Modify**

### **Primary Files**
- `src/app/(user)/user/favorites/page.tsx` - Main wishlist/favorites page
- `src/redux/slice/wishlistSlice.ts` - Wishlist state management
- `src/components/productItem/page.tsx` - Product wishlist toggle
- `src/services/germanStandardApi.ts` - API integration methods

### **Secondary Files**
- `src/components/header/index.tsx` - Wishlist count display
- `src/components/NavigationBar/Navigation.tsx` - Wishlist navigation
- `src/app/(screens)/[product-details]/detailsCard.tsx` - Product detail wishlist

## 🎯 **Success Criteria**

1. **Functional Wishlist**: Users can add/remove items from wishlist
2. **German Standard Sync**: All wishlist operations use German Standard APIs
3. **Real-time Updates**: Wishlist reflects changes immediately
4. **Cross-device Sync**: Wishlist persists across sessions/devices
5. **Visual Feedback**: Clear indication of wishlist status on products
6. **Wishlist Management**: Users can organize and manage their wishlist effectively

## ⚠️ **Critical Dependencies**

1. **Authentication**: Wishlist requires valid German Standard session
2. **Product Data**: Wishlist items must reference valid German Standard product IDs
3. **Stock Sync**: Wishlist must reflect current product availability
4. **Price Updates**: Wishlist must show current product pricing
5. **User Profile**: Wishlist tied to authenticated user account

## 🔄 **Integration with Other Features**

### **Cart Integration**
- Move wishlist items to cart seamlessly
- Bulk operations for multiple items
- Quantity selection during wishlist-to-cart transfer

### **Product Pages**
- Consistent wishlist toggle across all product displays
- Wishlist status persistence across page navigation
- Real-time wishlist updates on product details

### **Navigation**
- Wishlist item count in header/navigation
- Quick access to wishlist from anywhere in app
- Wishlist shortcuts and quick actions