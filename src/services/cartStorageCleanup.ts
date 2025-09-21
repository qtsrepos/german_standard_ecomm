/**
 * 🧹 Cart Storage Cleanup Utility
 *
 * Comprehensive cleanup tool to remove all legacy cart data from localStorage,
 * Redux persist, and any other storage mechanisms that might be causing
 * old data accumulation.
 */

/**
 * Force clear ALL cart-related storage
 */
export const forceCleanAllCartStorage = (): void => {
  try {
    if (typeof window === 'undefined') {
      console.log('⚠️ SSR mode - skipping storage cleanup');
      return;
    }

    console.log('🧹 Starting comprehensive cart storage cleanup...');

    // 1. Clear ALL possible legacy localStorage keys
    const legacyKeys = [
      'cart_items',           // Legacy API cart
      'localCart',           // Old local cart
      'cart',                // Backup cart
      'enhanced_cart_items',  // Enhanced cart data
      'enhanced_cart_metadata', // Enhanced cart metadata
      'checkout_items',       // Checkout storage
      'guest_cart',          // Possible guest cart
      'user_cart',           // Possible user cart
      'shopping_cart',       // Alternative cart name
      'ecommerce_cart',      // Alternative cart name
      'cart_cleanup_completed' // Reset cleanup flag too
    ];

    // Also clear any key that contains 'cart' (aggressive cleanup)
    const allKeys = Object.keys(localStorage);
    const cartRelatedKeys = allKeys.filter(key =>
      key.toLowerCase().includes('cart') ||
      key.toLowerCase().includes('checkout') ||
      key.toLowerCase().includes('shop')
    );

    let removedKeys = 0;

    // Remove specific legacy keys
    legacyKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        removedKeys++;
        console.log(`🗑️ Removed localStorage key: ${key}`);
      }
    });

    // Remove any cart-related keys found
    cartRelatedKeys.forEach(key => {
      if (!legacyKeys.includes(key)) { // Don't double-remove
        localStorage.removeItem(key);
        removedKeys++;
        console.log(`🗑️ Removed cart-related key: ${key}`);
      }
    });

    // 2. Clear Redux persist storage for cart-related slices
    const reduxPersistKeys = [
      'persist:nextme-nextjs',  // Main persist key
      'persist:Cart',           // Cart slice persist
      'persist:LocalCart',      // LocalCart slice persist
      'persist:Checkout',       // Checkout slice persist
    ];

    reduxPersistKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        if (key === 'persist:nextme-nextjs') {
          // For main persist key, try to clean cart data only
          try {
            const persistData = JSON.parse(localStorage.getItem(key) || '{}');
            let modified = false;

            if (persistData.Cart) {
              delete persistData.Cart;
              modified = true;
              console.log('🧹 Cleaned Cart data from main Redux persist');
            }
            if (persistData.LocalCart) {
              delete persistData.LocalCart;
              modified = true;
              console.log('🧹 Cleaned LocalCart data from main Redux persist');
            }
            if (persistData.Checkout) {
              delete persistData.Checkout;
              modified = true;
              console.log('🧹 Cleaned Checkout data from main Redux persist');
            }

            if (modified) {
              localStorage.setItem(key, JSON.stringify(persistData));
            }
          } catch (error) {
            console.warn(`⚠️ Failed to parse ${key}, removing entirely`);
            localStorage.removeItem(key);
            removedKeys++;
          }
        } else {
          // For specific persist keys, remove entirely
          localStorage.removeItem(key);
          removedKeys++;
          console.log(`🗑️ Removed Redux persist key: ${key}`);
        }
      }
    });

    // 3. Clear any sessionStorage cart data
    const sessionKeys = [
      'cart_items',
      'temp_cart',
      'product_data',
      'cart_session'
    ];

    sessionKeys.forEach(key => {
      if (sessionStorage.getItem(key) !== null) {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Removed sessionStorage key: ${key}`);
      }
    });

    // 4. Clear any cart-related cookies
    const cartCookies = [
      'cart_id',
      'guest_cart_id',
      'shopping_cart',
      'cart_session'
    ];

    cartCookies.forEach(cookieName => {
      // Clear cookie by setting expiry to past date
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    console.log(`✅ Cart storage cleanup complete! Removed ${removedKeys} localStorage keys`);
    console.log('🔄 Please refresh the page for clean cart state');

  } catch (error) {
    console.error('❌ Error during cart storage cleanup:', error);
  }
};

/**
 * Check and log current cart storage state
 */
export const debugCartStorage = (): void => {
  try {
    if (typeof window === 'undefined') {
      console.log('⚠️ SSR mode - cannot debug storage');
      return;
    }

    console.log('🔍 Current cart storage state:');

    // Check localStorage
    console.group('📦 localStorage:');
    Object.keys(localStorage).forEach(key => {
      if (key.toLowerCase().includes('cart') || key.toLowerCase().includes('checkout')) {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value ? JSON.parse(value) : null);
      }
    });
    console.groupEnd();

    // Check sessionStorage
    console.group('🗂️ sessionStorage:');
    Object.keys(sessionStorage).forEach(key => {
      if (key.toLowerCase().includes('cart')) {
        const value = sessionStorage.getItem(key);
        console.log(`${key}:`, value ? JSON.parse(value) : null);
      }
    });
    console.groupEnd();

    // Check Redux persist
    console.group('🔄 Redux persist:');
    const persistKey = 'persist:nextme-nextjs';
    const persistData = localStorage.getItem(persistKey);
    if (persistData) {
      try {
        const parsed = JSON.parse(persistData);
        console.log('Cart in persist:', parsed.Cart);
        console.log('LocalCart in persist:', parsed.LocalCart);
        console.log('Checkout in persist:', parsed.Checkout);
      } catch (e) {
        console.log('Failed to parse persist data');
      }
    }
    console.groupEnd();

  } catch (error) {
    console.error('❌ Error debugging cart storage:', error);
  }
};

/**
 * Add debug functions to global window for easy testing
 */
if (typeof window !== 'undefined') {
  (window as any).debugCartStorage = debugCartStorage;
  (window as any).forceCleanAllCartStorage = forceCleanAllCartStorage;
  console.log('🛠️ Cart debug functions available:');
  console.log('  - window.debugCartStorage() - Check current storage state');
  console.log('  - window.forceCleanAllCartStorage() - Force clean all cart data');
}