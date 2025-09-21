import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LocalCartSlice, cartServiceHelpers } from '@/redux/slice/localcartSlice';

/**
 * 🛍️ Cart Initialization Hook
 *
 * Ensures cart data is loaded from localStorage when the app starts
 * and keeps it synchronized across components.
 */
export const useCartInitialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeCart = async () => {
      try {
        // Set loading state
        dispatch(LocalCartSlice.actions.setCartLoading(true));

        // Load cart from storage using the cart service (includes automatic migration)
        const cart = await cartServiceHelpers.getCart();

        // Load cart data into Redux state
        dispatch(LocalCartSlice.actions.loadCartFromStorage(cart));

        // Show migration success notification if migrated data found
        const migratedItems = cart.filter(item => item.source === 'migrated_from_legacy');
        if (migratedItems.length > 0) {
          console.log(`🎉 Successfully migrated ${migratedItems.length} items from legacy cart storage`);
        }

        console.log('✅ Cart initialized successfully:', {
          itemCount: cart.length,
          totalValue: cart.reduce((sum, item) => sum + item.totalPrice, 0),
          hasMigratedItems: migratedItems.length > 0
        });

      } catch (error: any) {
        console.error('❌ Failed to initialize cart:', error);
        dispatch(LocalCartSlice.actions.setCartError('Failed to load cart'));
      } finally {
        dispatch(LocalCartSlice.actions.setCartLoading(false));
      }
    };

    // Initialize cart on app load
    initializeCart();

    // Set up periodic cart validation (every 5 minutes)
    const validationInterval = setInterval(async () => {
      try {
        const cart = await cartServiceHelpers.getCart();
        const summary = await cartServiceHelpers.getCartSummary();

        console.log('🔄 Cart validation:', {
          itemCount: summary.itemCount,
          totalValue: summary.totalValue,
          lastUpdated: summary.lastUpdated
        });

        // Update Redux state if needed
        dispatch(LocalCartSlice.actions.setLocalCart(cart));
      } catch (error) {
        console.warn('⚠️ Cart validation failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup interval on unmount
    return () => {
      clearInterval(validationInterval);
    };
  }, [dispatch]);
};

export default useCartInitialization;