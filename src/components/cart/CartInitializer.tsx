"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { cartServiceHelpers } from '@/redux/slice/localcartSlice';
import { debugCartStorage, forceCleanAllCartStorage } from '@/services/cartStorageCleanup';

/**
 * 🛍️ Cart Initializer Component
 *
 * Handles cart initialization with automatic legacy migration and cleanup.
 * Should be included once in the app root.
 */
const CartInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeCart = async () => {
      try {
        console.log('🚀 Initializing cart system...');

        // 🔍 Debug current storage state before initialization
        debugCartStorage();

        // 🧹 FORCE CLEANUP EVERY TIME (until issue is resolved)
        console.log('🧹 FORCE CLEANUP: Removing all legacy cart data...');
        forceCleanAllCartStorage();
        console.log('✅ Force cleanup completed');

        // After cleanup, wait a moment for storage to clear
        await new Promise(resolve => setTimeout(resolve, 200));

        // Load cart from storage with automatic migration
        const cart = await cartServiceHelpers.getCart();

        // Check for migrated data
        const migratedItems = cart.filter((item: any) => item.source === 'migrated_from_legacy');
        if (migratedItems.length > 0) {
          console.log(`🎉 Successfully migrated ${migratedItems.length} items from legacy cart storage`);
        }

        console.log('✅ Cart system initialized successfully:', {
          itemCount: cart.length,
          totalValue: cart.reduce((sum: number, item: any) => sum + item.totalPrice, 0),
          hasMigratedItems: migratedItems.length > 0
        });

        // 🔍 Debug storage state after initialization
        console.log('🔍 Storage state after initialization:');
        debugCartStorage();

        // 🛠️ Manual cleanup instructions
        console.log('');
        console.log('🛠️ If you still see old cart data, run this in console:');
        console.log('   window.forceCleanAllCartStorage()');
        console.log('   Then refresh the page');
        console.log('');

      } catch (error: any) {
        console.error('❌ Failed to initialize cart:', error);
      }
    };

    // Initialize cart on component mount
    initializeCart();

  }, [dispatch]);

  // This component doesn't render anything
  return null;
};

export default CartInitializer;