"use client";
import { notification, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
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
import { useRouter } from "next/navigation";
import {
  clearCheckout,
  storeCheckout,
} from "../../../redux/slice/checkoutSlice";
import { checkoutCartItems } from "./_components/checkoutFunction";
import HeaderBreadcrumbs from "./_components/headerBreadcrumbs";
import CartInitializer from "../../../components/cart/CartInitializer";

function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(localCartItems);
  const Settings = useSelector((state: any) => state.Settings.Settings);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    window.scrollTo(0, 0);
    // CartInitializer handles cart loading automatically
    dispatch(clearCheckout());
    setLoading(false);
  }, [session]);

  const clear = async () => {
    try {
      const result = await cartServiceHelpers.clearCart({ showNotification: true });
      if (result.success) {
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
      if (item?.unit <= item?.quantity && action === "add") {
        notificationApi.error({
          message:
            item?.unit === 0
              ? "Product is Out of Stock"
              : `Only ${item?.unit} unit Left`,
        });
        return;
      }

      if (isUpdating) return;
      setIsUpdating(true);

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

      dispatch(setLocalCart(updatedItems));

      try {
        if (action === "add") {
          const result = await cartServiceHelpers.updateQuantity(
            item.productId,
            item.variantId || null,
            item.quantity + 1,
            { showNotification: true }
          );
          if (!result.success) {
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
              const revertedCart = await cartServiceHelpers.getCart();
              dispatch(setLocalCart(revertedCart));
            }
          } else {
            const result = await cartServiceHelpers.removeFromCart(
              item.productId,
              item.variantId || null,
              { showNotification: true }
            );
            if (!result.success) {
              const revertedCart = await cartServiceHelpers.getCart();
              dispatch(setLocalCart(revertedCart));
            }
          }
        }
      } catch (error) {
        const revertedCart = await cartServiceHelpers.getCart();
        dispatch(setLocalCart(revertedCart));
        notificationApi.error({ message: "Failed to update cart" });
      }
    } catch (err) {
      notificationApi.error({ message: "Failed to Update cart" });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (id: number, item: any) => {
    try {
      const result = await cartServiceHelpers.removeFromCart(
        item.productId,
        item.variantId || null,
        { showNotification: true }
      );

      if (result.success) {
        const updatedCart = await cartServiceHelpers.getCart();
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
      <CartInitializer />
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
    </Container>
  );
}

export default CartPage;
