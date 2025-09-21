"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { notification, Alert, Spin } from 'antd';
import {
  isCartLoading,
  cartError,
  cartMetadata,
  getOutOfStockItems,
  getLowStockItems
} from '@/redux/slice/localcartSlice';

interface CartStatusIndicatorProps {
  showLoadingOverlay?: boolean;
  showErrorAlerts?: boolean;
  showStockWarnings?: boolean;
  compact?: boolean;
}

/**
 * 🛍️ Cart Status Indicator Component
 *
 * Provides visual feedback for cart operations including:
 * - Loading states
 * - Error handling
 * - Stock warnings
 * - Cart metadata display
 */
export const CartStatusIndicator: React.FC<CartStatusIndicatorProps> = ({
  showLoadingOverlay = true,
  showErrorAlerts = true,
  showStockWarnings = true,
  compact = false
}) => {
  const loading = useSelector(isCartLoading);
  const error = useSelector(cartError);
  const metadata = useSelector(cartMetadata);
  const outOfStockItems = useSelector(getOutOfStockItems);
  const lowStockItems = useSelector(getLowStockItems);

  // Don't render anything if no status to show
  if (!loading && !error && !showStockWarnings && compact) {
    return null;
  }

  return (
    <div className="cart-status-indicator">
      {/* Loading Overlay */}
      {loading && showLoadingOverlay && (
        <div className="cart-loading-overlay">
          <Spin size="small" />
          <span className="ms-2">Updating cart...</span>
        </div>
      )}

      {/* Error Alerts */}
      {error && showErrorAlerts && (
        <Alert
          message="Cart Error"
          description={error}
          type="error"
          closable
          showIcon
          className="mb-2"
        />
      )}

      {/* Stock Warnings */}
      {showStockWarnings && (
        <>
          {outOfStockItems.length > 0 && (
            <Alert
              message="Out of Stock Items"
              description={
                <div>
                  <p>The following items in your cart are no longer available:</p>
                  <ul>
                    {outOfStockItems.slice(0, 3).map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                    {outOfStockItems.length > 3 && (
                      <li>... and {outOfStockItems.length - 3} more items</li>
                    )}
                  </ul>
                </div>
              }
              type="error"
              showIcon
              className="mb-2"
            />
          )}

          {lowStockItems.length > 0 && (
            <Alert
              message="Low Stock Warning"
              description={
                <div>
                  <p>Limited quantities available for:</p>
                  <ul>
                    {lowStockItems.slice(0, 3).map((item, index) => (
                      <li key={index}>
                        {item.name} (Only {item.availableQuantity} left)
                      </li>
                    ))}
                    {lowStockItems.length > 3 && (
                      <li>... and {lowStockItems.length - 3} more items</li>
                    )}
                  </ul>
                </div>
              }
              type="warning"
              showIcon
              className="mb-2"
            />
          )}
        </>
      )}

      {/* Cart Metadata (for debugging in development) */}
      {process.env.NODE_ENV === 'development' && !compact && metadata && (
        <div className="cart-debug-info">
          <small className="text-muted">
            Cart Debug: {metadata.itemCount} items,
            AED {metadata.totalValue.toFixed(2)},
            Updated: {new Date(metadata.lastUpdated).toLocaleTimeString()}
          </small>
        </div>
      )}

      <style jsx>{`
        .cart-loading-overlay {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background: #f0f0f0;
          border-radius: 4px;
          margin-bottom: 8px;
          font-size: 12px;
          color: #666;
        }

        .cart-debug-info {
          padding: 4px 8px;
          background: #f8f9fa;
          border-radius: 3px;
          border-left: 3px solid #007bff;
          margin-top: 8px;
        }

        .cart-status-indicator {
          position: relative;
        }

        @media (max-width: 768px) {
          .cart-loading-overlay {
            font-size: 11px;
            padding: 6px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CartStatusIndicator;