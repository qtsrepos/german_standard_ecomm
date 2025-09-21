"use client";
import { notification, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
// Removed legacy cartSlice imports
import {
  clearLocalCart,
  increaseLocalCartQuantity,
  decreaseLocalCartQuantity,
  removeFromLocalCart,
  LocalCartSlice,
  cartServiceHelpers,
  localCartItems,
  setLocalCart,
} from "../../../redux/slice/localcartSlice";
import { useSession } from "next-auth/react";
import "./styles.scss";
import CartItem from "./_components/cartItem";
import SummaryCard from "./_components/summaryCard";
import NoData from "../../../components/noData";
import RecomendedItems from "./_components/recommended";
import { useRouter } from "next/navigation";
import {
  clearCheckout,
  storeCheckout,
} from "../../../redux/slice/checkoutSlice";
import { checkoutCartItems } from "./_components/checkoutFunction";
import HeaderBreadcrumbs from "./_components/headerBreadcrumbs";

function CartPage() {
  const dispatch = useDispatch();
  // Use unified LocalCart for all users (both authenticated and non-authenticated)
  const cartItems = useSelector(localCartItems);
  const Settings = useSelector((state: any) => state.Settings.Settings);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
    dispatch(clearCheckout());
  }, [session]);

  const loadData = async () => {
    try {
      setLoading(true);

      // 🔄 STATE MANAGEMENT ONLY: Load cart from enhanced local storage for ALL users
      console.log("🛍️ Loading cart from local storage (state management only)...");

      // Enhanced cart service automatically handles migration and validation
      const cartItems = await cartServiceHelpers.getCart();

      // Update unified LocalCart state for ALL users
      dispatch(setLocalCart(cartItems));
      console.log(`✅ Loaded ${cartItems.length} items into unified LocalCart state`);

    } catch (err) {
      console.error("❌ Cart load error:", err);
      notificationApi.error({
        message: "Failed to load cart. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    try {
      // 🔄 STATE MANAGEMENT ONLY: Use enhanced cart service for ALL users
      const result = await cartServiceHelpers.clearCart({ showNotification: true });

      if (result.success) {
        // Update unified LocalCart state for ALL users
        dispatch(setLocalCart([]));
        console.log("✅ Cart cleared successfully");
      } else {
        notificationApi.error({ message: "Failed to clear cart" });
      }
    } catch (err) {
      console.error("❌ Error clearing cart:", err);
      notificationApi.error({ message: "Failed to clear cart" });
    }
  };

  const updateQuantity = async (action: "add" | "reduce", item: any) => {
    try {
      // Stock validation
      if (item?.unit <= item?.quantity && action === "add") {
        notificationApi.error({
          message:
            item?.unit === 0
              ? "Product is Out of Stock"
              : `Only ${item?.unit} unit Left`,
        });
        return;
      }

      // Prevent multiple updates
      if (isUpdating) return;
      setIsUpdating(true);

      if (session) {
        // OPTIMISTIC UPDATE: Update Redux store immediately for logged-in users
        const newQuantity = action === "add" ? item.quantity + 1 : item.quantity - 1;

        if (newQuantity <= 0) {
          setIsUpdating(false);
          return;
        }

        const updatedItems = cartItems.map((cartItem: any) => {
          if (cartItem.id === item.id) {
            return {
              ...cartItem,
              quantity: newQuantity,
              totalPrice: cartItem.price * newQuantity
            };
          }
          return cartItem;
        });

        // Update unified Redux store immediately for instant UI feedback
        dispatch(setLocalCart(updatedItems));

        // 🔄 STATE MANAGEMENT ONLY: Use enhanced cart service for logged-in users too
        try {
          if (action === "add") {
            const result = await cartServiceHelpers.updateQuantity(
              item.productId,
              item.variantId || null,
              item.quantity + 1,
              { showNotification: true }
            );
            if (!result.success) {
              // Revert optimistic update if operation failed - reload from storage
              const revertedCart = await cartServiceHelpers.getCart();
              dispatch(setLocalCart(revertedCart));
            }
          } else if (action === "reduce") {
            if (item.quantity > 1) {
              const result = await cartServiceHelpers.updateQuantity(
                item.productId,
                item.variantId || null,
                item.quantity - 1,
                { showNotification: true }
              );
              if (!result.success) {
                // Revert optimistic update if operation failed
                const revertedCart = await cartServiceHelpers.getCart();
                dispatch(setLocalCart(revertedCart));
              }
            } else {
              // Remove item if quantity becomes 0
              const result = await cartServiceHelpers.removeFromCart(
                item.productId,
                item.variantId || null,
                { showNotification: true }
              );
              if (!result.success) {
                // Revert optimistic update if operation failed
                const revertedCart = await cartServiceHelpers.getCart();
                dispatch(setLocalCart(revertedCart));
              }
            }
          }
        } catch (error) {
          // Revert optimistic update if operation failed
          const revertedCart = await cartServiceHelpers.getCart();
          dispatch(setLocalCart(revertedCart));
          notificationApi.error({ message: "Failed to update cart" });
        }

      } else {
        // 🔄 STATE MANAGEMENT ONLY: Use enhanced cart service for guest users too
        try {
          if (action === "add") {
            const result = await cartServiceHelpers.updateQuantity(
              item.productId,
              item.variantId || null,
              item.quantity + 1,
              { showNotification: true }
            );
            if (result.success) {
              // Sync with Redux state
              const updatedCart = await cartServiceHelpers.getCart();
              dispatch(LocalCartSlice.actions.setLocalCart(updatedCart));
            }
          } else if (action === "reduce") {
            if (item.quantity > 1) {
              const result = await cartServiceHelpers.updateQuantity(
                item.productId,
                item.variantId || null,
                item.quantity - 1,
                { showNotification: true }
              );
              if (result.success) {
                // Sync with Redux state
                const updatedCart = await cartServiceHelpers.getCart();
                dispatch(LocalCartSlice.actions.setLocalCart(updatedCart));
              }
            } else {
              // Remove item if quantity becomes 0
              const result = await cartServiceHelpers.removeFromCart(
                item.productId,
                item.variantId || null,
                { showNotification: true }
              );
              if (result.success) {
                // Sync with Redux state
                const updatedCart = await cartServiceHelpers.getCart();
                dispatch(LocalCartSlice.actions.setLocalCart(updatedCart));
              }
            }
          }
        } catch (error) {
          notificationApi.error({ message: "Failed to update cart" });
        }
      }
    } catch (err) {
      notificationApi.error({ message: "Failed to Update cart" });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (id: number, item: any) => {
    try {
      // 🔄 STATE MANAGEMENT ONLY: Use enhanced cart service for ALL users
      const result = await cartServiceHelpers.removeFromCart(
        item.productId,
        item.variantId || null,
        { showNotification: true }
      );

      if (result.success) {
        // Update appropriate Redux state based on user session
        const updatedCart = await cartServiceHelpers.getCart();

        // Update unified LocalCart state for ALL users
        dispatch(setLocalCart(updatedCart));

        console.log("✅ Item removed successfully from cart");
      } else {
        notificationApi.error({ message: "Failed to remove item from cart" });
      }
    } catch (err) {
      console.error("❌ Error removing item from cart:", err);
      notificationApi.error({ message: "Failed to remove item from cart" });
    }
  };

  const goCheckout = async () => {
    try {
      if (!session) {
        try {
          const itemsToCheckout = cartItems;
          localStorage.setItem(
            "checkout_items",
            JSON.stringify(itemsToCheckout)
          );
        } catch (error) {
          console.error("Error storing checkout data in localStorage:", error);
        }
        navigate.push("/login");
        return;
      }

      setError(null);
      const itemsToCheckout = cartItems;

      var data: any = await checkoutCartItems(itemsToCheckout);
      if (data?.eligibleItems?.length) {
        dispatch(storeCheckout(data?.eligibleItems));
        try {
          localStorage.setItem(
            "checkout_items",
            JSON.stringify(data?.eligibleItems)
          );
        } catch (error) {
          console.error("Error storing checkout data in localStorage:", error);
        }
        navigate.push("/checkout");
      } else {
        setError(
          "Out of stock: Your cart contains items that are currently unavailable."
        );
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Checkout error:", err);
    }
  };

  return (
    <Container className="py-4">
      {contextHolder}
      <HeaderBreadcrumbs />

      {cartItems?.length > 0 ? (
        <Row>
          <Col lg={8} md={7} sm={12}>
            <div className="cart-container">
              {/* Desktop Cart Header */}
              <div className="d-none d-md-block">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="cart-title">Shopping Cart</h4>
                  <Popconfirm
                    placement="bottomRight"
                    title="Are you sure to clear all items from cart?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={clear}
                  >
                    <div className="Cart-txt2" style={{ cursor: "pointer" }}>
                      Remove All Products <IoCloseCircleOutline />
                    </div>
                  </Popconfirm>
                </div>

                {/* Column Headers */}
                <Row className="cart-headers d-none d-md-flex">
                  <Col xs={4}>
                    <div className="column-header">PRODUCT</div>
                  </Col>
                  <Col>
                    <div className="column-header">PRICE</div>
                  </Col>
                  <Col>
                    <div className="column-header">QUANTITY</div>
                  </Col>
                  <Col>
                    <div className="column-header">SUBTOTAL</div>
                  </Col>
                </Row>

                {/* Cart Items */}
                <div className="cart-items-list">
                  {cartItems.map((item: any, index: number) => (
                    <CartItem
                      key={`${item.id || item.productId}-${item.variantId || 'default'}`}
                      data={item}
                      Settings={Settings}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      loading={isUpdating}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Cart */}
              <div className="d-block d-md-none">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="cart-title">Shopping Cart</h4>
                  <IoCartOutline size={24} />
                </div>

                {cartItems.map((item: any, index: number) => (
                  <CartItem
                    key={`${item.id || item.productId}-${item.variantId || 'default'}`}
                    data={item}
                    Settings={Settings}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                    loading={isUpdating}
                  />
                ))}

                <div className="text-center mt-3">
                  <Popconfirm
                    placement="top"
                    title="Are you sure to clear all items from cart?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={clear}
                  >
                    <button className="btn btn-outline-danger btn-sm">
                      <IoCloseCircleOutline className="me-1" />
                      Clear Cart
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </Col>

          <Col lg={4} md={5} sm={12}>
            <SummaryCard
              cartItems={cartItems}
              settings={Settings}
              goCheckout={goCheckout}
              error={error}
            />
          </Col>
        </Row>
      ) : (
        <NoData
          text={
            loading
              ? "Loading your cart..."
              : "Your cart is empty. Start shopping!"
          }
        />
      )}

      {products?.length > 0 && (
        <RecomendedItems products={products} settings={Settings} />
      )}
    </Container>
  );
}

export default CartPage;