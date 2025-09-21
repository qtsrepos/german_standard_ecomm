import { notification } from "antd";

// Enhanced CartItem interface with comprehensive metadata
export interface EnhancedCartItem {
  // Core product data
  productId: string | number;
  pid: string | number; // For backward compatibility
  name: string;
  price: number;
  quantity: number;
  image: string;

  // Variant support
  variantId: string | number | null;
  variantName?: string;

  // Calculated values
  totalPrice: number;

  // Product metadata for smart cart features
  availableQuantity: number;
  maxQuantity?: number;
  minQuantity?: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'unknown';

  // Store information
  storeId?: string | number;
  storeName?: string;

  // Cart metadata
  addedAt: string; // ISO timestamp
  lastUpdated: string; // ISO timestamp
  source: 'product_listing' | 'product_details' | 'search' | 'recommendation' | 'migrated_from_legacy';

  // Additional product details for better UX
  code?: string;
  description?: string;
  category?: string;

  // Validation flags
  isValidated: boolean;
  validationErrors?: string[];

  // Temporary flags
  isSaving?: boolean;
  isRemoving?: boolean;
}

// Cart validation result
export interface CartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestedQuantity?: number;
}

// Cart operation result
export interface CartOperationResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

// Cart storage metadata
export interface CartMetadata {
  version: string;
  lastSyncAt: string;
  itemCount: number;
  totalValue: number;
  expiresAt: string;
  compressed: boolean;
}

// Local storage configuration
const CART_STORAGE_KEY = 'enhanced_cart_items';
const CART_METADATA_KEY = 'enhanced_cart_metadata';
const CART_VERSION = '2.0';
const CART_EXPIRY_DAYS = 30;
const MAX_CART_SIZE_KB = 1024; // 1MB localStorage limit buffer

/**
 * 🛍️ Enhanced Local Cart Service
 *
 * Centralized service for all local cart operations with smart features:
 * - Intelligent quantity management
 * - Advanced validation and error handling
 * - Optimized localStorage management
 * - Cart data compression and cleanup
 * - Consistent user feedback
 */
export class LocalCartService {
  private static instance: LocalCartService;

  public static getInstance(): LocalCartService {
    if (!LocalCartService.instance) {
      LocalCartService.instance = new LocalCartService();
    }
    return LocalCartService.instance;
  }

  /**
   * 🎯 Core Cart Operations
   */

  /**
   * Add item to cart with smart validation and quantity management
   */
  async addToCart(
    product: any,
    requestedQuantity: number = 1,
    options: {
      source?: string;
      skipValidation?: boolean;
      showNotification?: boolean;
    } = {}
  ): Promise<CartOperationResult> {
    try {
      const { source = 'unknown', skipValidation = false, showNotification = true } = options;

      console.log('🛍️ LocalCartService: Adding to cart:', {
        productId: product.id || product.productId,
        quantity: requestedQuantity,
        source
      });

      // Validate input data
      if (!product || (!product.id && !product.productId)) {
        const error = 'Invalid product data: missing product ID';
        console.error('❌ LocalCartService:', error);
        return { success: false, message: error };
      }

      // Create enhanced cart item
      const cartItem = this.createEnhancedCartItem(product, requestedQuantity, source);

      // Validate quantity if not skipped
      if (!skipValidation) {
        const validation = this.validateQuantity(cartItem, requestedQuantity);
        if (!validation.isValid) {
          const errorMessage = validation.errors.join(', ');
          if (showNotification) {
            notification.error({
              message: 'Cannot Add to Cart',
              description: errorMessage,
              duration: 4
            });
          }
          return { success: false, message: errorMessage, errors: validation.errors };
        }

        // Use suggested quantity if available
        if (validation.suggestedQuantity && validation.suggestedQuantity !== requestedQuantity) {
          cartItem.quantity = validation.suggestedQuantity;
          cartItem.totalPrice = cartItem.price * validation.suggestedQuantity;

          if (showNotification) {
            notification.warning({
              message: 'Quantity Adjusted',
              description: `Quantity adjusted to ${validation.suggestedQuantity} based on available stock`,
              duration: 3
            });
          }
        }
      }

      // Get current cart
      const currentCart = await this.getCart();

      // Check if item already exists
      const existingItemIndex = currentCart.findIndex(item =>
        this.isSameCartItem(item, cartItem)
      );

      let updatedCart: EnhancedCartItem[];
      let operationType: string;

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = currentCart[existingItemIndex];
        const newQuantity = existingItem.quantity + cartItem.quantity;

        // Validate combined quantity
        if (!skipValidation) {
          const combinedValidation = this.validateQuantity(existingItem, newQuantity);
          if (!combinedValidation.isValid) {
            const errorMessage = `Cannot add ${cartItem.quantity} more. ${combinedValidation.errors.join(', ')}`;
            if (showNotification) {
              notification.error({
                message: 'Cannot Update Cart',
                description: errorMessage,
                duration: 4
              });
            }
            return { success: false, message: errorMessage, errors: combinedValidation.errors };
          }
        }

        // Update existing item
        currentCart[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: existingItem.price * newQuantity,
          lastUpdated: new Date().toISOString(),
          isValidated: !skipValidation
        };

        updatedCart = [...currentCart];
        operationType = 'updated';
      } else {
        // Add new item
        updatedCart = [cartItem, ...currentCart];
        operationType = 'added';
      }

      // Save to storage
      const saveResult = await this.saveCart(updatedCart);
      if (!saveResult.success) {
        return saveResult;
      }

      // Show success notification
      if (showNotification) {
        notification.success({
          message: `Product ${operationType}`,
          description: `${cartItem.name} has been ${operationType} to your cart`,
          duration: 3
        });
      }

      console.log(`✅ LocalCartService: Product ${operationType} successfully`);
      return {
        success: true,
        message: `Product ${operationType} successfully`,
        data: { cartItem, operation: operationType }
      };

    } catch (error: any) {
      console.error('❌ LocalCartService: Add to cart error:', error);
      const errorMessage = 'Failed to add product to cart';

      if (options.showNotification !== false) {
        notification.error({
          message: 'Cart Error',
          description: errorMessage,
          duration: 4
        });
      }

      return { success: false, message: errorMessage, errors: [error.message] };
    }
  }

  /**
   * Update item quantity with validation
   */
  async updateQuantity(
    productId: string | number,
    variantId: string | number | null,
    newQuantity: number,
    options: { skipValidation?: boolean; showNotification?: boolean } = {}
  ): Promise<CartOperationResult> {
    try {
      const { skipValidation = false, showNotification = true } = options;

      console.log('🔄 LocalCartService: Updating quantity:', {
        productId,
        variantId,
        newQuantity
      });

      if (newQuantity < 0) {
        return { success: false, message: 'Quantity cannot be negative' };
      }

      const currentCart = await this.getCart();
      const itemIndex = currentCart.findIndex(item =>
        item.productId === productId && item.variantId === variantId
      );

      if (itemIndex === -1) {
        return { success: false, message: 'Item not found in cart' };
      }

      const item = currentCart[itemIndex];

      // If quantity is 0, remove item
      if (newQuantity === 0) {
        return this.removeFromCart(productId, variantId, { showNotification });
      }

      // Validate new quantity
      if (!skipValidation) {
        const validation = this.validateQuantity(item, newQuantity);
        if (!validation.isValid) {
          const errorMessage = validation.errors.join(', ');
          if (showNotification) {
            notification.error({
              message: 'Invalid Quantity',
              description: errorMessage,
              duration: 4
            });
          }
          return { success: false, message: errorMessage, errors: validation.errors };
        }
      }

      // Update item
      const updatedItem: EnhancedCartItem = {
        ...item,
        quantity: newQuantity,
        totalPrice: item.price * newQuantity,
        lastUpdated: new Date().toISOString(),
        isValidated: !skipValidation
      };

      const updatedCart = [...currentCart];
      updatedCart[itemIndex] = updatedItem;

      // Save to storage
      const saveResult = await this.saveCart(updatedCart);
      if (!saveResult.success) {
        return saveResult;
      }

      if (showNotification) {
        notification.success({
          message: 'Cart Updated',
          description: `${item.name} quantity updated to ${newQuantity}`,
          duration: 2
        });
      }

      console.log('✅ LocalCartService: Quantity updated successfully');
      return {
        success: true,
        message: 'Quantity updated successfully',
        data: { updatedItem }
      };

    } catch (error: any) {
      console.error('❌ LocalCartService: Update quantity error:', error);
      const errorMessage = 'Failed to update quantity';

      if (options.showNotification !== false) {
        notification.error({
          message: 'Cart Error',
          description: errorMessage,
          duration: 4
        });
      }

      return { success: false, message: errorMessage, errors: [error.message] };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(
    productId: string | number,
    variantId: string | number | null,
    options: { showNotification?: boolean } = {}
  ): Promise<CartOperationResult> {
    try {
      const { showNotification = true } = options;

      console.log('🗑️ LocalCartService: Removing from cart:', { productId, variantId });

      const currentCart = await this.getCart();
      const itemToRemove = currentCart.find(item =>
        item.productId === productId && item.variantId === variantId
      );

      if (!itemToRemove) {
        return { success: false, message: 'Item not found in cart' };
      }

      const updatedCart = currentCart.filter(item =>
        !(item.productId === productId && item.variantId === variantId)
      );

      // Save to storage
      const saveResult = await this.saveCart(updatedCart);
      if (!saveResult.success) {
        return saveResult;
      }

      if (showNotification) {
        notification.success({
          message: 'Item Removed',
          description: `${itemToRemove.name} removed from cart`,
          duration: 2
        });
      }

      console.log('✅ LocalCartService: Item removed successfully');
      return {
        success: true,
        message: 'Item removed successfully',
        data: { removedItem: itemToRemove }
      };

    } catch (error: any) {
      console.error('❌ LocalCartService: Remove from cart error:', error);
      const errorMessage = 'Failed to remove item from cart';

      if (options.showNotification !== false) {
        notification.error({
          message: 'Cart Error',
          description: errorMessage,
          duration: 4
        });
      }

      return { success: false, message: errorMessage, errors: [error.message] };
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(options: { showNotification?: boolean } = {}): Promise<CartOperationResult> {
    try {
      const { showNotification = true } = options;

      console.log('🧹 LocalCartService: Clearing cart');

      const currentCart = await this.getCart();
      const itemCount = currentCart.length;

      // Clear cart data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(CART_METADATA_KEY);
      }

      if (showNotification && itemCount > 0) {
        notification.success({
          message: 'Cart Cleared',
          description: `${itemCount} items removed from cart`,
          duration: 2
        });
      }

      console.log('✅ LocalCartService: Cart cleared successfully');
      return {
        success: true,
        message: 'Cart cleared successfully',
        data: { removedCount: itemCount }
      };

    } catch (error: any) {
      console.error('❌ LocalCartService: Clear cart error:', error);
      const errorMessage = 'Failed to clear cart';

      if (options.showNotification !== false) {
        notification.error({
          message: 'Cart Error',
          description: errorMessage,
          duration: 4
        });
      }

      return { success: false, message: errorMessage, errors: [error.message] };
    }
  }

  /**
   * 🎯 Smart Cart Features
   */

  /**
   * Validate quantity against product constraints
   */
  validateQuantity(item: EnhancedCartItem, requestedQuantity: number): CartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let suggestedQuantity: number | undefined;

    // Basic validation
    if (requestedQuantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (requestedQuantity !== Math.floor(requestedQuantity)) {
      errors.push('Quantity must be a whole number');
      suggestedQuantity = Math.floor(requestedQuantity);
    }

    // Stock validation
    if (item.availableQuantity !== undefined && item.availableQuantity >= 0) {
      if (requestedQuantity > item.availableQuantity) {
        if (item.availableQuantity === 0) {
          errors.push('Product is out of stock');
        } else {
          errors.push(`Only ${item.availableQuantity} units available`);
          suggestedQuantity = item.availableQuantity;
        }
      } else if (item.availableQuantity <= 5 && requestedQuantity > 0) {
        warnings.push(`Low stock: only ${item.availableQuantity} units left`);
      }
    }

    // Min/Max quantity validation
    if (item.minQuantity && requestedQuantity < item.minQuantity) {
      errors.push(`Minimum quantity is ${item.minQuantity}`);
      suggestedQuantity = item.minQuantity;
    }

    if (item.maxQuantity && requestedQuantity > item.maxQuantity) {
      errors.push(`Maximum quantity is ${item.maxQuantity}`);
      suggestedQuantity = item.maxQuantity;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestedQuantity
    };
  }

  /**
   * Suggest optimal quantity based on stock and constraints
   */
  suggestOptimalQuantity(item: EnhancedCartItem): number {
    let optimal = 1;

    // Start with minimum quantity if specified
    if (item.minQuantity) {
      optimal = item.minQuantity;
    }

    // Don't exceed available stock
    if (item.availableQuantity !== undefined && item.availableQuantity >= 0) {
      optimal = Math.min(optimal, item.availableQuantity);
    }

    // Don't exceed maximum quantity
    if (item.maxQuantity) {
      optimal = Math.min(optimal, item.maxQuantity);
    }

    return Math.max(optimal, 0);
  }

  /**
   * 📦 Storage Management
   */

  /**
   * Get cart items from storage with automatic legacy migration
   */
  async getCart(): Promise<EnhancedCartItem[]> {
    try {
      if (typeof window === 'undefined') {
        return [];
      }

      // Check for new storage first
      const cartData = localStorage.getItem(CART_STORAGE_KEY);

      if (!cartData) {
        // No new storage found, check for legacy data to migrate
        console.log('🔄 LocalCartService: No enhanced cart found, checking for legacy data...');
        return await this.migrateFromLegacyStorage();
      }

      const parsedData = JSON.parse(cartData);

      // Handle compressed data
      if (this.isCompressedData(parsedData)) {
        return this.decompressCartData(parsedData);
      }

      // Validate and migrate old data if necessary
      return this.validateAndMigrateCartData(parsedData);

    } catch (error) {
      console.error('❌ LocalCartService: Error reading cart from storage:', error);

      // Try to recover from corrupted data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(CART_METADATA_KEY);
      }

      // Attempt legacy migration as fallback
      return await this.migrateFromLegacyStorage();
    }
  }

  /**
   * Save cart items to storage with compression if needed
   */
  async saveCart(cartItems: EnhancedCartItem[]): Promise<CartOperationResult> {
    try {
      if (typeof window === 'undefined') {
        return { success: true, message: 'Cart saved (SSR mode)' };
      }

      // Create metadata
      const metadata: CartMetadata = {
        version: CART_VERSION,
        lastSyncAt: new Date().toISOString(),
        itemCount: cartItems.length,
        totalValue: cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
        expiresAt: new Date(Date.now() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        compressed: false
      };

      // Try to save without compression first
      let dataToSave = cartItems;
      let saveAttempt = 0;
      const maxAttempts = 3;

      while (saveAttempt < maxAttempts) {
        try {
          const serializedData = JSON.stringify(dataToSave);
          const sizeKB = new Blob([serializedData]).size / 1024;

          // If data is too large, try compression
          if (sizeKB > MAX_CART_SIZE_KB && !metadata.compressed) {
            console.log(`🗜️ LocalCartService: Cart data too large (${sizeKB.toFixed(2)}KB), compressing...`);
            dataToSave = this.compressCartData(cartItems);
            metadata.compressed = true;
            saveAttempt++;
            continue;
          }

          // Save cart data
          localStorage.setItem(CART_STORAGE_KEY, serializedData);
          localStorage.setItem(CART_METADATA_KEY, JSON.stringify(metadata));

          console.log(`💾 LocalCartService: Cart saved successfully (${sizeKB.toFixed(2)}KB, compressed: ${metadata.compressed})`);
          return { success: true, message: 'Cart saved successfully' };

        } catch (storageError: any) {
          saveAttempt++;

          if (storageError.name === 'QuotaExceededError') {
            console.warn(`⚠️ LocalCartService: Storage quota exceeded, attempt ${saveAttempt}/${maxAttempts}`);

            if (saveAttempt < maxAttempts) {
              // Try to free up space
              await this.cleanupExpiredData();
              if (!metadata.compressed) {
                dataToSave = this.compressCartData(cartItems);
                metadata.compressed = true;
              }
            } else {
              throw new Error('Storage quota exceeded. Please clear some space and try again.');
            }
          } else {
            throw storageError;
          }
        }
      }

      throw new Error('Failed to save cart after multiple attempts');

    } catch (error: any) {
      console.error('❌ LocalCartService: Error saving cart:', error);
      return {
        success: false,
        message: error.message || 'Failed to save cart',
        errors: [error.message]
      };
    }
  }

  /**
   * 🔧 Helper Methods
   */

  /**
   * Create enhanced cart item from product data
   */
  private createEnhancedCartItem(
    product: any,
    quantity: number,
    source: string
  ): EnhancedCartItem {
    const now = new Date().toISOString();
    const productId = product.id || product.productId || product.pid;
    const price = product.price || product.retail_rate || 0;

    return {
      // Core data
      productId,
      pid: productId,
      name: product.name || product.Name || 'Unknown Product',
      price,
      quantity,
      image: product.image || product.Image || '/images/no-image.jpg',

      // Variant info
      variantId: product.variantId || null,
      variantName: product.variantName || null,

      // Calculated values
      totalPrice: price * quantity,

      // Stock info
      availableQuantity: product.unit || product.availableQuantity || 0,
      maxQuantity: product.maxQuantity,
      minQuantity: product.minQuantity || 1,
      stockStatus: this.determineStockStatus(product),

      // Store info
      storeId: product.storeId || product.store_id,
      storeName: product.storeName || product.store_name,

      // Metadata
      addedAt: now,
      lastUpdated: now,
      source: source as any,

      // Additional details
      code: product.code || product.Code,
      description: product.description || product.Description,
      category: product.category || product.categoryName,

      // Validation
      isValidated: true,
      validationErrors: []
    };
  }

  /**
   * Determine stock status from product data
   */
  private determineStockStatus(product: any): EnhancedCartItem['stockStatus'] {
    const stock = product.unit || product.availableQuantity;

    if (stock === undefined || stock === null) {
      return 'unknown';
    }

    if (stock === 0) {
      return 'out_of_stock';
    }

    if (stock <= 5) {
      return 'low_stock';
    }

    return 'in_stock';
  }

  /**
   * Check if two cart items are the same (same product and variant)
   */
  private isSameCartItem(item1: EnhancedCartItem, item2: EnhancedCartItem): boolean {
    return item1.productId === item2.productId && item1.variantId === item2.variantId;
  }

  /**
   * Validate and migrate cart data from older versions
   */
  private validateAndMigrateCartData(data: any[]): EnhancedCartItem[] {
    return data.map(item => {
      // Ensure all required fields exist
      const now = new Date().toISOString();

      return {
        // Core data with fallbacks
        productId: item.productId || item.pid || item.id,
        pid: item.productId || item.pid || item.id,
        name: item.name || 'Unknown Product',
        price: item.price || item.retail_rate || 0,
        quantity: item.quantity || 1,
        image: item.image || '/images/no-image.jpg',

        // Variant info
        variantId: item.variantId || null,
        variantName: item.variantName || null,

        // Calculated values
        totalPrice: item.totalPrice || (item.price || 0) * (item.quantity || 1),

        // Stock info with defaults
        availableQuantity: item.availableQuantity || 0,
        maxQuantity: item.maxQuantity,
        minQuantity: item.minQuantity || 1,
        stockStatus: item.stockStatus || 'unknown',

        // Store info
        storeId: item.storeId,
        storeName: item.storeName,

        // Metadata with defaults
        addedAt: item.addedAt || now,
        lastUpdated: item.lastUpdated || now,
        source: item.source || 'unknown',

        // Additional details
        code: item.code,
        description: item.description,
        category: item.category,

        // Validation
        isValidated: item.isValidated || false,
        validationErrors: item.validationErrors || []
      } as EnhancedCartItem;
    });
  }

  /**
   * Check if data is compressed
   */
  private isCompressedData(data: any): boolean {
    return data && typeof data === 'object' && data.__compressed === true;
  }

  /**
   * Compress cart data for storage efficiency
   */
  private compressCartData(cartItems: EnhancedCartItem[]): any {
    // Simple compression: remove non-essential fields and use shorter keys
    const compressed = cartItems.map(item => ({
      i: item.productId, // id
      n: item.name,      // name
      p: item.price,     // price
      q: item.quantity,  // quantity
      img: item.image,   // image
      v: item.variantId, // variantId
      t: item.totalPrice, // totalPrice
      a: item.availableQuantity, // availableQuantity
      s: item.source,    // source
      u: item.lastUpdated // updated
    }));

    return {
      __compressed: true,
      __version: CART_VERSION,
      data: compressed
    };
  }

  /**
   * Decompress cart data
   */
  private decompressCartData(compressedData: any): EnhancedCartItem[] {
    if (!compressedData.data || !Array.isArray(compressedData.data)) {
      return [];
    }

    return compressedData.data.map((item: any) => ({
      productId: item.i,
      pid: item.i,
      name: item.n || 'Unknown Product',
      price: item.p || 0,
      quantity: item.q || 1,
      image: item.img || '/images/no-image.jpg',
      variantId: item.v || null,
      variantName: null,
      totalPrice: item.t || (item.p || 0) * (item.q || 1),
      availableQuantity: item.a || 0,
      maxQuantity: undefined,
      minQuantity: 1,
      stockStatus: 'unknown' as const,
      storeId: undefined,
      storeName: undefined,
      addedAt: item.u || new Date().toISOString(),
      lastUpdated: item.u || new Date().toISOString(),
      source: item.s || 'unknown',
      code: undefined,
      description: undefined,
      category: undefined,
      isValidated: false,
      validationErrors: []
    })) as EnhancedCartItem[];
  }

  /**
   * Migrate data from legacy cart storage to new enhanced format
   */
  private async migrateFromLegacyStorage(): Promise<EnhancedCartItem[]> {
    try {
      if (typeof window === 'undefined') return [];

      console.log('🔄 LocalCartService: Starting legacy cart migration...');

      // Check all possible legacy storage keys
      const legacyKeys = ['cart_items', 'localCart', 'cart'];
      let legacyData: any[] = [];
      let foundLegacyKey: string | null = null;

      // Find the first available legacy cart data
      for (const key of legacyKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
              legacyData = parsed;
              foundLegacyKey = key;
              console.log(`📦 Found legacy cart data in "${key}":`, parsed.length, 'items');
              break;
            }
          } catch (parseError) {
            console.warn(`⚠️ Failed to parse legacy data from "${key}":`, parseError);
          }
        }
      }

      if (legacyData.length === 0) {
        console.log('✅ No legacy cart data found, returning empty cart');
        return [];
      }

      // Transform legacy data to new format
      const migratedItems: EnhancedCartItem[] = legacyData.map((legacyItem, index) => {
        console.log(`🔄 Migrating item ${index + 1}:`, legacyItem);

        const now = new Date().toISOString();

        // Extract data with fallbacks for different legacy formats
        const productId = legacyItem.productId || legacyItem.pid || legacyItem.id || `migrated_${index}`;
        const name = legacyItem.name || legacyItem.Name || 'Migrated Product';
        const price = legacyItem.price || legacyItem.retail_rate || legacyItem.rate || 0;
        const quantity = legacyItem.quantity || legacyItem.qty || 1;
        const image = legacyItem.image || legacyItem.Image || '/images/no-image.jpg';
        const totalPrice = legacyItem.totalPrice || (price * quantity);

        return {
          // Core data
          productId,
          pid: productId,
          name,
          price,
          quantity,
          image,

          // Variant info
          variantId: legacyItem.variantId || null,
          variantName: legacyItem.variantName || null,

          // Calculated values
          totalPrice,

          // Stock info with defaults
          availableQuantity: legacyItem.availableQuantity || legacyItem.unit || 10,
          maxQuantity: legacyItem.maxQuantity,
          minQuantity: legacyItem.minQuantity || 1,
          stockStatus: 'unknown' as const,

          // Store info
          storeId: legacyItem.storeId || legacyItem.store_id,
          storeName: legacyItem.storeName || legacyItem.store_name,

          // Migration metadata
          addedAt: legacyItem.addedAt || now,
          lastUpdated: now,
          source: 'migrated_from_legacy' as any,

          // Additional details with fallbacks
          code: legacyItem.code || legacyItem.Code,
          description: legacyItem.description || legacyItem.Description || '',
          category: legacyItem.category || legacyItem.categoryName,

          // Validation flags
          isValidated: false, // Needs revalidation after migration
          validationErrors: ['Migrated from legacy storage - needs validation']
        } as EnhancedCartItem;
      });

      console.log(`✅ Successfully migrated ${migratedItems.length} items from legacy storage`);

      // Save migrated data to new storage
      if (migratedItems.length > 0) {
        const saveResult = await this.saveCart(migratedItems);
        if (saveResult.success) {
          console.log('💾 Migrated cart data saved successfully');

          // Clean up legacy storage after successful migration
          this.cleanupAllLegacyStorage(foundLegacyKey ? [foundLegacyKey] : []);
        } else {
          console.error('❌ Failed to save migrated cart data:', saveResult.message);
        }
      }

      return migratedItems;

    } catch (error) {
      console.error('❌ LocalCartService: Migration failed:', error);
      return [];
    }
  }

  /**
   * Clean up legacy storage keys after successful migration
   */
  private cleanupLegacyStorage(primaryKey?: string | null): void {
    try {
      if (typeof window === 'undefined') return;

      const legacyKeys = ['cart_items', 'localCart', 'cart'];
      let cleanedCount = 0;

      for (const key of legacyKeys) {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          cleanedCount++;
          console.log(`🧹 Cleaned up legacy storage key: "${key}"`);
        }
      }

      if (cleanedCount > 0) {
        console.log(`✅ Legacy storage cleanup complete: ${cleanedCount} keys removed`);
      }

    } catch (error) {
      console.error('❌ LocalCartService: Legacy cleanup failed:', error);
    }
  }

  /**
   * Clean up ALL legacy storage keys including Redux persist data
   */
  private cleanupAllLegacyStorage(foundKeys: string[]): void {
    try {
      if (typeof window === 'undefined') return;

      console.log('🧹 Starting comprehensive legacy storage cleanup...');

      // 1. Clean all localStorage cart keys
      const allLegacyKeys = [
        'cart_items', 'localCart', 'cart', 'guest_cart', 'user_cart',
        'shopping_cart', 'ecommerce_cart', 'checkout_items'
      ];

      let cleanedCount = 0;
      allLegacyKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          cleanedCount++;
          console.log(`🧹 Cleaned up legacy storage key: "${key}"`);
        }
      });

      // 2. Clean Redux persist cart data
      const persistKey = 'persist:nextme-nextjs';
      const persistData = localStorage.getItem(persistKey);
      if (persistData) {
        try {
          const parsed = JSON.parse(persistData);
          let persistModified = false;

          if (parsed.Cart) {
            delete parsed.Cart;
            persistModified = true;
            console.log('🧹 Cleaned Cart data from Redux persist');
          }

          if (parsed.LocalCart) {
            delete parsed.LocalCart;
            persistModified = true;
            console.log('🧹 Cleaned LocalCart data from Redux persist');
          }

          if (parsed.Checkout) {
            delete parsed.Checkout;
            persistModified = true;
            console.log('🧹 Cleaned Checkout data from Redux persist');
          }

          if (persistModified) {
            localStorage.setItem(persistKey, JSON.stringify(parsed));
            cleanedCount++;
          }
        } catch (error) {
          console.warn('⚠️ Failed to clean Redux persist data:', error);
        }
      }

      console.log(`✅ Comprehensive legacy cleanup complete: ${cleanedCount} keys cleaned`);

    } catch (error) {
      console.error('❌ LocalCartService: Comprehensive cleanup failed:', error);
    }
  }

  /**
   * Clean up expired cart data and other storage items
   */
  private async cleanupExpiredData(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;

      // Check cart expiration
      const metadataStr = localStorage.getItem(CART_METADATA_KEY);
      if (metadataStr) {
        const metadata: CartMetadata = JSON.parse(metadataStr);
        const expiresAt = new Date(metadata.expiresAt);

        if (expiresAt < new Date()) {
          console.log('🧹 LocalCartService: Cleaning up expired cart data');
          localStorage.removeItem(CART_STORAGE_KEY);
          localStorage.removeItem(CART_METADATA_KEY);
        }
      }

      // Clean up other expired items (implement as needed)
      // This is where you could clean up other localStorage items

    } catch (error) {
      console.error('❌ LocalCartService: Error during cleanup:', error);
    }
  }

  /**
   * 📊 Cart Analytics and Utilities
   */

  /**
   * Get cart summary statistics
   */
  async getCartSummary(): Promise<{
    itemCount: number;
    totalValue: number;
    uniqueProducts: number;
    avgItemPrice: number;
    lastUpdated: string;
  }> {
    const cart = await this.getCart();

    const totalValue = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const uniqueProducts = new Set(cart.map(item => item.productId)).size;
    const avgItemPrice = cart.length > 0 ? totalValue / cart.length : 0;
    const lastUpdated = cart.length > 0
      ? cart.reduce((latest, item) =>
          new Date(item.lastUpdated) > new Date(latest) ? item.lastUpdated : latest,
          cart[0].lastUpdated
        )
      : new Date().toISOString();

    return {
      itemCount: cart.length,
      totalValue,
      uniqueProducts,
      avgItemPrice,
      lastUpdated
    };
  }

  /**
   * Check if product is in cart
   */
  async isInCart(productId: string | number, variantId: string | number | null = null): Promise<boolean> {
    const cart = await this.getCart();
    return cart.some(item =>
      item.productId === productId && item.variantId === variantId
    );
  }

  /**
   * Get specific cart item
   */
  async getCartItem(productId: string | number, variantId: string | number | null = null): Promise<EnhancedCartItem | null> {
    const cart = await this.getCart();
    return cart.find(item =>
      item.productId === productId && item.variantId === variantId
    ) || null;
  }
}

// Export singleton instance
export const localCartService = LocalCartService.getInstance();
export default localCartService;