import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, message } from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { reduxSettings } from "../../../../redux/slice/settingsSlice";
import { germanStandardApi } from "@/services/germanStandardApi";
import { getCustomerIdFromSession } from "@/shared/helpers/jwtUtils";

interface SummaryCardDrawerProps {
  Cart: any;
  checkout: () => void;
  error?: string;
  onClose: () => void; 
}

const SummaryCardDrawer = (props: SummaryCardDrawerProps) => {
  const Settings = useSelector(reduxSettings);
  const router = useRouter();
  const { data: session }: any = useSession();
  const [orderLoading, setOrderLoading] = useState(false);

  const getTotalPrice = (cart: any) => {
    let total = 0;
    if (Array.isArray(cart?.items)) {
      cart.items.forEach((item: any) => {
        total += Number(item?.totalPrice);
      });
    }
    return Number(total).toFixed(2);
  };

  const handleOrderNow = async () => {
    // Check if user is logged in
    if (!session?.token) {
      message.warning({
        content: "Please login to place an order",
        duration: 3,
      });
      router.push("/login");
      return;
    }

    // Check if cart has items
    if (!props?.Cart?.items || props.Cart.items.length === 0) {
      message.error({
        content: "Your cart is empty",
        duration: 3,
      });
      return;
    }

    try {
      setOrderLoading(true);

      // Get customer ID from session token
      const customerId = getCustomerIdFromSession(session);
      if (!customerId) {
        message.error({
          content: "Unable to get customer information. Please login again.",
          duration: 3,
        });
        router.push("/login");
        return;
      }

      // Build order request with all cart items
      const orderRequest = {
        transId: 0, // 0 for new order
        date: new Date().toISOString().split('T')[0], // yyyy-MM-dd format
        country: 1, // Default country ID
        be: 1, // Business Entity ID
        customer: customerId, // Customer ID from JWT token
        deliveryAddress: "Default delivery address", // TODO: Get from user profile
        eventName: undefined, // Optional event name
        remarks: `Order created from cart with ${props.Cart.items.length} items`,
        discountType: 0, // No discount
        payTerms: 0, // Default payment terms
        discountCouponRef: undefined, // No coupon
        discountRef: undefined, // No discount campaign
        sampleRequestBy: 0, // Not a sample request
        deliveryTerms: "Standard delivery",
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        body: props.Cart.items.map((item: any) => ({
          transId: 0, // Line item transaction ID
          product: Number(item.productId || item.pid || item.id), // Product ID
          qty: item.quantity || 1, // Quantity
          headerId: 0, // Always 0
          voucherType: 0, // Always 0
          rate: item.price || item.rate || 0, // Unit price
          unit: 1, // Unit ID
          vat: 0, // VAT percentage
          addcharges: 0, // Extra charges
          discount: 0, // Discount percentage
          discountAmt: 0, // Discount amount
          discountRemarks: null, // No discount remarks
          remarks: `${item.name || 'Product'} - Cart order` // Item-level remarks
        }))
      };

      console.log("🛒 Cart Order Now - Request body:", orderRequest);

      message.loading({
        content: "Creating your order...",
        key: "cart_order_creation",
        duration: 0 // Keep loading until we update it
      });

      // Call German Standard Order API
      const response = await germanStandardApi.upsertOrder(orderRequest);

      console.log("📋 Cart Order Now - Response body:", response);

      // Handle response (need to fix this based on actual API response format)
      if (response?.status === "Success" && response?.result) {
        message.success({
          content: `Order created successfully! Order ID: ${response.result}`,
          key: "cart_order_creation",
          duration: 5,
        });

        // Close cart drawer
        props.onClose();

        // Redirect to order success page
        router.push(`/checkoutsuccess/${response.result}`);
      } else if (response?.status === "Failure") {
        message.error({
          content: `Order creation failed: ${response.message || 'Unknown error'}`,
          key: "cart_order_creation",
          duration: 5,
        });
      } else {
        message.error({
          content: "Order creation failed. Please try again.",
          key: "cart_order_creation",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("❌ Cart Order Now - Error:", error);
      message.error({
        content: "Failed to create order. Please try again.",
        key: "cart_order_creation",
        duration: 5,
      });
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className=" bg-white">
      {/* Subtotal */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-dark text-uppercase summery-total">Subtotal:</div>
        <div className="fw-bold fs-4" style={{ color: "#dc4c2f" }}>
          {getTotalPrice(props?.Cart)} {Settings?.currency}
        </div>
      </div>

      {/* Error */}
      {props?.error && (
        <Alert type="error" showIcon message={props.error} className="mb-3" />
      )}

      {/* Buttons */}
      <div className="d-flex flex-column gap-3">
        <div
          onClick={() => {
            router.push("/cart");
            props.onClose(); 
          }}
          className="text-white text-center fw-bold py-2"
          style={{
            backgroundColor: "#dc4c2f",
            borderRadius: "999px",
            cursor: "pointer",
          }}
        >
          VIEW CART
        </div>

        <div
          onClick={() => {
            props.checkout();
            props.onClose();
          }}
          className="text-white text-center fw-bold py-2"
          style={{
            backgroundColor: "#dc4c2f",
            borderRadius: "999px",
            cursor: "pointer",
          }}
        >
          CHECKOUT
        </div>

        <div
          onClick={handleOrderNow}
          className="text-white text-center fw-bold py-2"
          style={{
            backgroundColor: orderLoading ? "#999" : "#28a745",
            borderRadius: "999px",
            cursor: orderLoading ? "not-allowed" : "pointer",
            position: "relative",
          }}
        >
          {orderLoading ? "CREATING ORDER..." : "ORDER NOW"}
        </div>
      </div>
    </div>
  );
};

export default SummaryCardDrawer;