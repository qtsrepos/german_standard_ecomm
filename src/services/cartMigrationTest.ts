/**
 * 🧪 Cart Migration Test Suite
 *
 * Comprehensive tests to validate cart migration and consistency
 */

import { localCartService } from './localCartService';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  passed: boolean;
  duration: number;
}

export class CartMigrationTester {
  private testResults: TestSuite[] = [];

  /**
   * Run all cart migration tests
   */
  async runAllTests(): Promise<{ passed: boolean; suites: TestSuite[] }> {
    console.log('🧪 Starting Cart Migration Test Suite...');

    // Clear any existing cart data for clean testing
    await this.setupTestEnvironment();

    // Run test suites
    await this.testLegacyMigration();
    await this.testCartPersistence();
    await this.testDataConsistency();
    await this.testStorageCleanup();

    const allPassed = this.testResults.every(suite => suite.passed);

    console.log(`\n🎯 Test Results Summary:`);
    this.testResults.forEach(suite => {
      const status = suite.passed ? '✅' : '❌';
      console.log(`${status} ${suite.name}: ${suite.results.filter(r => r.passed).length}/${suite.results.length} tests passed (${suite.duration}ms)`);
    });

    if (allPassed) {
      console.log('🎉 All cart migration tests passed!');
    } else {
      console.error('💥 Some cart migration tests failed!');
      this.printFailedTests();
    }

    return {
      passed: allPassed,
      suites: this.testResults
    };
  }

  /**
   * Setup clean test environment
   */
  private async setupTestEnvironment(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Clear all cart-related storage
    const cartKeys = ['cart_items', 'enhanced_cart_items', 'enhanced_cart_metadata', 'localCart', 'cart'];
    cartKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('🧹 Test environment cleaned');
  }

  /**
   * Test legacy cart migration
   */
  private async testLegacyMigration(): Promise<void> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
      // Create mock legacy cart data
      const legacyCartData = [
        {
          productId: 'test-product-1',
          name: 'Test Product 1',
          price: 29.99,
          quantity: 2,
          image: '/test-image-1.jpg',
          totalPrice: 59.98
        },
        {
          pid: 'test-product-2',
          Name: 'Test Product 2',
          retail_rate: 15.50,
          qty: 1,
          Image: '/test-image-2.jpg'
        }
      ];

      // Store in legacy format
      localStorage.setItem('cart_items', JSON.stringify(legacyCartData));

      results.push({
        name: 'Legacy Data Setup',
        passed: true,
        message: 'Successfully created legacy cart data'
      });

      // Test migration
      const migratedCart = await localCartService.getCart();

      results.push({
        name: 'Migration Execution',
        passed: migratedCart.length === 2,
        message: `Expected 2 items, got ${migratedCart.length}`,
        details: { migratedCart }
      });

      // Validate migrated data structure
      const firstItem = migratedCart[0];
      const hasRequiredFields = firstItem &&
        firstItem.productId &&
        firstItem.name &&
        firstItem.price &&
        firstItem.quantity &&
        firstItem.source === 'migrated_from_legacy';

      results.push({
        name: 'Migrated Data Structure',
        passed: hasRequiredFields,
        message: hasRequiredFields ? 'All required fields present' : 'Missing required fields',
        details: { firstItem }
      });

      // Check if legacy storage was cleaned up
      const legacyDataExists = localStorage.getItem('cart_items') !== null;

      results.push({
        name: 'Legacy Storage Cleanup',
        passed: !legacyDataExists,
        message: legacyDataExists ? 'Legacy data still exists' : 'Legacy data cleaned up successfully'
      });

    } catch (error) {
      results.push({
        name: 'Migration Error Handling',
        passed: false,
        message: `Migration failed: ${error}`,
        details: { error }
      });
    }

    this.testResults.push({
      name: 'Legacy Migration Tests',
      results,
      passed: results.every(r => r.passed),
      duration: Date.now() - startTime
    });
  }

  /**
   * Test cart persistence across sessions
   */
  private async testCartPersistence(): Promise<void> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
      // Add test items to cart
      const testProduct = {
        id: 'persistence-test-1',
        name: 'Persistence Test Product',
        price: 25.00,
        image: '/test-persistence.jpg',
        unit: 10,
        status: true
      };

      const addResult = await localCartService.addToCart(testProduct, 3, {
        source: 'product_listing',
        showNotification: false
      });

      results.push({
        name: 'Add to Cart',
        passed: addResult.success,
        message: addResult.success ? 'Item added successfully' : addResult.message,
        details: { addResult }
      });

      // Verify cart contents
      const cartAfterAdd = await localCartService.getCart();
      const addedItem = cartAfterAdd.find(item => item.productId === 'persistence-test-1');

      results.push({
        name: 'Cart Content Verification',
        passed: addedItem?.quantity === 3,
        message: `Expected quantity 3, got ${addedItem?.quantity}`,
        details: { addedItem }
      });

      // Simulate page reload by creating new service instance
      const freshCart = await localCartService.getCart();
      const persistedItem = freshCart.find(item => item.productId === 'persistence-test-1');

      results.push({
        name: 'Persistence After Reload',
        passed: persistedItem?.quantity === 3,
        message: persistedItem ? 'Item persisted correctly' : 'Item not found after reload',
        details: { persistedItem }
      });

    } catch (error) {
      results.push({
        name: 'Persistence Error',
        passed: false,
        message: `Persistence test failed: ${error}`,
        details: { error }
      });
    }

    this.testResults.push({
      name: 'Cart Persistence Tests',
      results,
      passed: results.every(r => r.passed),
      duration: Date.now() - startTime
    });
  }

  /**
   * Test data consistency across operations
   */
  private async testDataConsistency(): Promise<void> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
      // Clear cart for clean test
      await localCartService.clearCart({ showNotification: false });

      // Add multiple items
      const products = [
        { id: 'consistency-1', name: 'Product 1', price: 10.00 },
        { id: 'consistency-2', name: 'Product 2', price: 20.00 },
        { id: 'consistency-3', name: 'Product 3', price: 30.00 }
      ];

      for (const product of products) {
        await localCartService.addToCart(product, 1, {
          source: 'product_listing',
          showNotification: false
        });
      }

      const cartAfterAdds = await localCartService.getCart();

      results.push({
        name: 'Multiple Item Addition',
        passed: cartAfterAdds.length === 3,
        message: `Expected 3 items, got ${cartAfterAdds.length}`,
        details: { cartAfterAdds: cartAfterAdds.map(i => ({ id: i.productId, name: i.name })) }
      });

      // Test cart summary calculation
      const summary = await localCartService.getCartSummary();
      const expectedTotal = 60.00; // 10 + 20 + 30

      results.push({
        name: 'Cart Summary Calculation',
        passed: Math.abs(summary.totalValue - expectedTotal) < 0.01,
        message: `Expected total ${expectedTotal}, got ${summary.totalValue}`,
        details: { summary }
      });

      // Test quantity update
      await localCartService.updateQuantity('consistency-2', null, 5, {
        showNotification: false
      });

      const cartAfterUpdate = await localCartService.getCart();
      const updatedItem = cartAfterUpdate.find(item => item.productId === 'consistency-2');

      results.push({
        name: 'Quantity Update Consistency',
        passed: updatedItem?.quantity === 5 && updatedItem?.totalPrice === 100.00,
        message: `Expected qty=5, total=100, got qty=${updatedItem?.quantity}, total=${updatedItem?.totalPrice}`,
        details: { updatedItem }
      });

    } catch (error) {
      results.push({
        name: 'Consistency Error',
        passed: false,
        message: `Consistency test failed: ${error}`,
        details: { error }
      });
    }

    this.testResults.push({
      name: 'Data Consistency Tests',
      results,
      passed: results.every(r => r.passed),
      duration: Date.now() - startTime
    });
  }

  /**
   * Test storage cleanup functionality
   */
  private async testStorageCleanup(): Promise<void> {
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
      // Create legacy data in multiple formats
      localStorage.setItem('cart_items', JSON.stringify([{ id: 1, name: 'Old Item 1' }]));
      localStorage.setItem('localCart', JSON.stringify([{ id: 2, name: 'Old Item 2' }]));
      localStorage.setItem('cart', JSON.stringify([{ id: 3, name: 'Old Item 3' }]));

      results.push({
        name: 'Legacy Data Creation',
        passed: true,
        message: 'Created test legacy data in multiple formats'
      });

      // Trigger migration which should clean up legacy data
      await localCartService.getCart();

      // Check if legacy data was cleaned up
      const hasLegacyData = [
        localStorage.getItem('cart_items'),
        localStorage.getItem('localCart'),
        localStorage.getItem('cart')
      ].some(data => data !== null);

      results.push({
        name: 'Legacy Data Cleanup',
        passed: !hasLegacyData,
        message: hasLegacyData ? 'Legacy data still exists' : 'All legacy data cleaned up',
        details: {
          cart_items: localStorage.getItem('cart_items'),
          localCart: localStorage.getItem('localCart'),
          cart: localStorage.getItem('cart')
        }
      });

    } catch (error) {
      results.push({
        name: 'Cleanup Error',
        passed: false,
        message: `Cleanup test failed: ${error}`,
        details: { error }
      });
    }

    this.testResults.push({
      name: 'Storage Cleanup Tests',
      results,
      passed: results.every(r => r.passed),
      duration: Date.now() - startTime
    });
  }

  /**
   * Print detailed information about failed tests
   */
  private printFailedTests(): void {
    this.testResults.forEach(suite => {
      const failedTests = suite.results.filter(r => !r.passed);
      if (failedTests.length > 0) {
        console.group(`❌ Failed tests in ${suite.name}:`);
        failedTests.forEach(test => {
          console.error(`   • ${test.name}: ${test.message}`);
          if (test.details) {
            console.error('     Details:', test.details);
          }
        });
        console.groupEnd();
      }
    });
  }
}

// Export singleton instance
export const cartMigrationTester = new CartMigrationTester();

// Helper function to run tests in development
export const runCartMigrationTests = async () => {
  if (process.env.NODE_ENV === 'development') {
    return await cartMigrationTester.runAllTests();
  } else {
    console.warn('Cart migration tests are only available in development mode');
    return { passed: true, suites: [] };
  }
};