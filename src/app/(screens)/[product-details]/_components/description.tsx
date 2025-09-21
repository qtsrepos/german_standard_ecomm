// =================davood code========================

"use client";
import { useAppSelector } from "@/redux/hooks";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import { Button, notification, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { storeCheckout } from "../../../../redux/slice/checkoutSlice";
import { germanStandardApi } from "@/services/germanStandardApi";
import { useSession } from "next-auth/react";
import { decrement, increment } from "@/redux/slice/favouriteSlice";
import {
  LocalCartSlice,
  cartServiceHelpers,
  localCartItems,
  setLocalCart,
} from "@/redux/slice/localcartSlice";
import "../style.scss";
import { CiHeart, CiShuffle } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoMdHeartEmpty } from "react-icons/io";
import { getProductId, getProductIdSafe } from "./functions";
import { getCustomerIdFromSession } from "@/shared/helpers/jwtUtils";

type Props = {
  data: any;
  currentVariant: any;
  handleBuyNow: (val: any) => void;
  handleAddToCart?: (quantity: number) => void;
  handleAddToWishlist?: () => void;
  bestRate?: any;
  ratesLoading?: boolean;
  rateError?: string | null;
  rateRetryCount?: number;
  productStock?: { unit: number; status: boolean };
  stockLoading?: boolean;
};

function Description(props: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session }: any = useSession();

  const checkWishlistStatus = async () => {
    try {
      // Use German Standard API to check wishlist status
      const wishlistSummary = await germanStandardApi.getWishlistSummary(1, true, 1, 100);
      const productId = getProductId(props?.data);
      const isInWishlist = wishlistSummary.transactions?.some(
        (item: any) => {
          return item?.productId == productId;
        }
      );

      setFavourited(!!isInWishlist);
    } catch (err) {
      console.log("err", err);
      setFavourited(false);
    }
  };

  // const checkWishlistStatus = async () => {
  //   try {
  //     const res = await GET(API.WISHLIST_GETALL);
  //     const isInWishlist = res?.data?.some(
  //       (item: any) => {
  //         return item?.pid == props?.data?.pid;
  //       }
  //       // (!props.currentVariant?.id
  //       //   || item.variantId === props.currentVariant.id)
  //     );

  //     setFavourited(!!isInWishlist);
  //   } catch (err) {
  //     console.log("err", err);
  //     setFavourited(false);
  //   }
  // };

  // Prioritize variant-specific stock information
  const availableQuantity = props?.currentVariant?.units ?? props?.productStock?.unit ?? props?.data?.unit ?? 0;
  const settings = useAppSelector(reduxSettings);
  const [Notifications, contextHolder] = notification.useNotification();
  const [quantity, setQuantity] = useState<number>(1);

  // Debug logging for quantity and stock
  console.log("🔍 Quantity Debug:", {
    availableQuantity,
    currentVariantUnits: props?.currentVariant?.units,
    productStockUnit: props?.productStock?.unit,
    dataUnit: props?.data?.unit,
    stockLoading: props?.stockLoading,
    quantity: quantity,
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [favourited, setFavourited] = useState(false);

  // Enhanced cart integration
  const cartItems = useSelector(localCartItems);

  // Get standardized product ID for cart check
  const productId = getProductId(props?.data);
  const isProductInCart = cartItems?.some(
    (item: any) => item.pid === productId || item.productId === productId
  );

  useEffect(() => {
    // Calculate base price with proper variant handling
    let basePrice = 0;

    // Priority: Best rate from API > Variant price > Default product price
    if (props?.bestRate?.rate) {
      basePrice = props.bestRate.rate;
    } else if (props?.currentVariant?.price) {
      basePrice = props.currentVariant.price;
    } else if (props?.currentVariant?.rate) {
      basePrice = props.currentVariant.rate;
    } else {
      basePrice = props?.data?.retail_rate ?? props?.data?.price ?? 0;
    }

    setTotalPrice(basePrice * quantity);
  }, [quantity, props?.bestRate, props?.currentVariant, props?.data]);

  useEffect(() => {
    const productId = getProductId(props?.data);
    if (productId) {
      checkWishlistStatus();
    }
  }, [props?.data?.Id, props?.data?.id, props?.data?.pid]);

  const updateQuantity = (type: "increment" | "decrement") => {
    console.log("🔄 Updating quantity:", { type, currentQuantity: quantity, availableQuantity });

    if (type === "increment") {
      // Allow increment if we have stock available or if stock is still loading
      const maxQuantity = availableQuantity > 0 ? availableQuantity : 999; // Default max if stock unknown
      if (quantity < maxQuantity) {
        setQuantity((prev) => prev + 1);
        console.log("✅ Quantity incremented to:", quantity + 1);
      } else {
        console.log("❌ Cannot increment - reached max quantity");
      }
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
      console.log("✅ Quantity decremented to:", quantity - 1);
    } else {
      console.log("❌ Cannot decrement - minimum is 1");
    }
  };

  const shareLink = async () => {
    try {
      if (navigator?.share) {
        await navigator.share({
          title: document?.title,
          url: window?.location?.href,
        });
      } else {
        Notifications.error({ message: `Failed to share link` });
      }
    } catch (err) {
      Notifications.error({ message: `Failed to share link` });
    }
  };

  const buyNow = async () => {
    // ✅ IMPROVED: Enhanced status validation for buy now
    const productStatus = props?.data?.status;
    const availableStock = availableQuantity || props?.data?.unit || 0;

    console.log("🔍 Buy Now availability check:", {
      productName: props?.data?.name || props?.data?.Name,
      status: productStatus,
      availableStock,
      requestedQuantity: quantity
    });

    // Check product status with more intelligent logic
    if (productStatus === false || (productStatus !== true && productStatus !== undefined && !productStatus)) {
      notification.error({
        message: `Product Not Available`,
        description: `${props?.data?.name || 'This product'} is currently not available for purchase.`
      });
      return;
    } else if (availableStock === 0) {
      notification.error({ message: `Product is Out of Stock!!` });
      return;
    } else if (quantity > availableStock) {
      notification.error({ message: `Selected Quantity is Not Available. Available: ${availableStock}` });
      return;
    }

    // Check if user is logged in
    if (!session?.token) {
      message.warning({
        content: "Please login to place an order",
        duration: 3,
      });
      router.push("/login");
      return;
    }

    try {
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

      const productId = getProductId(props?.data);
      const rate = props?.bestRate?.rate || props?.currentVariant?.price || props?.data?.retail_rate || props?.data?.price || 0;
      const totalAmount = rate * quantity;

      // Build order request body according to German Standard API format
      const orderRequest = {
        transId: 0, // 0 for new order
        date: new Date().toISOString().split('T')[0], // yyyy-MM-dd format
        country: 1, // Default country ID
        be: 1, // Business Entity ID
        customer: customerId, // Customer ID from JWT token
        deliveryAddress: null, // Updated to match Swagger spec
        eventName: null, // Updated to match Swagger spec
        remarks: `Order created via Buy Now for ${props?.data?.name || props?.data?.Name}`,
        discountType: 0, // No discount
        payTerms: 0, // Default payment terms
        discountCouponRef: null, // Updated to match Swagger spec
        discountRef: null, // Updated to match Swagger spec
        sampleRequestBy: 0, // Not a sample request
        deliveryTerms: null, // Updated to match Swagger spec
        deliveryDate: null, // Updated to match Swagger spec - will be calculated by server
        body: [
          {
            transId: 0, // Line item transaction ID
            product: Number(productId), // Product ID
            qty: quantity, // Quantity
            headerId: 0, // Always 0
            voucherType: 1, // Updated to match Swagger spec (was 0)
            rate: rate, // Unit price
            unit: 1, // Unit ID
            vat: 5, // Updated to match Swagger spec (was 0)
            addcharges: 1, // Updated to match Swagger spec (was 0)
            discount: 0, // Discount percentage
            discountAmt: 0, // Discount amount
            discountRemarks: null, // No discount remarks
            remarks: `${props?.data?.name || props?.data?.Name} - Buy Now order` // Item-level remarks
          }
        ]
      };

      console.log("🔄 Buy Now - Order request body:", orderRequest);

      message.loading({
        content: "Creating your order...",
        key: "order_creation",
        duration: 0 // Keep loading until we update it
      });

      // Call German Standard Order API
      const response = await germanStandardApi.upsertOrder(orderRequest);

      console.log("📋 Buy Now - Order response body:", response);

      // Handle response
      if (response?.success === true && response?.result) {
        message.success({
          content: `Order created successfully! Order ID: ${response.result}`,
          key: "order_creation",
          duration: 5,
        });

        // Optionally redirect to order success page
        router.push(`/checkoutsuccess/${response.result}`);
      } else if (response?.status === "Failure") {
        message.error({
          content: `Order creation failed: ${response.message || 'Unknown error'}`,
          key: "order_creation",
          duration: 5,
        });
      } else {
        message.error({
          content: "Order creation failed. Please try again.",
          key: "order_creation",
          duration: 5,
        });
      }
    } catch (error: any) {
      // Rich diagnostics for Axios errors
      const errInfo = {
        message: error?.message,
        name: error?.name,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data,
        requestUrl: error?.config?.url,
        requestMethod: error?.config?.method,
      };
      console.error("❌ Buy Now - Order creation error:", errInfo);
      message.error({
        content: error?.response?.data?.message || error?.message || "Failed to create order. Please try again.",
        key: "order_creation",
        duration: 5,
      });
    }
  };

  const addToCart = async (item: any, quantity: number) => {
    // ✅ IMPROVED: Enhanced status validation with better error messages
    const productStatus = props?.data?.status;
    const availableStock = availableQuantity || props?.data?.unit || 0;

    console.log("🔍 Product availability check:", {
      productName: props?.data?.name || props?.data?.Name,
      status: productStatus,
      availableStock,
      requestedQuantity: quantity
    });

    // Check product status with more intelligent logic
    if (productStatus === false || (productStatus !== true && productStatus !== undefined && !productStatus)) {
      notification.error({
        message: `Product Not Available`,
        description: `${props?.data?.name || 'This product'} is currently not available for purchase.`
      });
      return;
    } else if (availableStock <= 0) {
      notification.error({ message: `Product is Out of Stock!!` });
      return;
    } else if (quantity > availableStock) {
      notification.error({ message: `Selected Quantity is Not Available. Available: ${availableStock}` });
      return;
    }

    setCartLoading(true);
    try {
      const productId = getProductIdSafe(props?.data);
      const rate = props?.bestRate?.rate ?? props?.currentVariant?.price ?? props?.currentVariant?.rate ?? props?.data?.retail_rate ?? 0;

      const productData = {
        id: productId,
        productId: productId,
        name: props?.data?.name || props?.data?.Name,
        price: rate,
        image: props?.currentVariant?.image || props?.data?.image || props?.data?.Image,
        unit: availableQuantity,
        status: props?.data?.status,
        variantId: props?.currentVariant?.id || null,
        category: props?.data?.category,
        code: props?.data?.code || props?.data?.Code,
        description: props?.data?.description || props?.data?.Description,
        availableQuantity: availableQuantity,
        // Additional variant info
        variantName: props?.currentVariant?.combination?.map((c: any) => c.value).join(' ') || null,
      };

      console.log("🛒 Add to Cart - Using unified cart service:", {
        productName: productData.name,
        quantity,
        rate,
        isAuthenticated: !!session?.token
      });

      const result = await cartServiceHelpers.addToCart(
        productData,
        quantity,
        {
          source: 'product_details_description',
          showNotification: true
        }
      );

      if (result.success) {
        // Refresh cart state
        const updatedCart = await cartServiceHelpers.getCart();
        dispatch(setLocalCart(updatedCart));

        message.success({
          content: "Item added to cart successfully!",
          key: "cart_addition",
          duration: 3,
        });
      }

    } catch (err: any) {
      console.error("❌ Add to Cart - Error:", err);
      message.error({
        content: "Failed to add item to cart. Please try again.",
        key: "cart_addition",
        duration: 3,
      });
    } finally {
      setCartLoading(false);
    }
  };

  // const addToCart = async (item: any, quantity: number) => {
  //   if (props?.data?.status != true) {
  //     notification.error({ message: `Product is Temporarily not Available` });
  //     return;
  //   } else if (props?.data?.unit == 0) {
  //     notification.error({ message: `Product is Out of Stock!!` });
  //     return;
  //   } else if (quantity > props?.data?.unit) {
  //     notification.error({ message: `Selected Quantity is Not Available.` });
  //     return;
  //   }
  //   const obj = {
  //     productId: props?.data?.pid,
  //     quantity: quantity,
  //     variantId: props?.currentVariant?.id ?? null,
  //   };
  //   const url = API.CART;
  //   try {
  //     const newCart: any = await POST(url, obj);
  //     if (newCart.status) {
  //       Notifications.success({ message: newCart?.message });
  //       // setTimeout(() => {
  //       //   router.push("/cart");
  //       // }, 1000);
  //     } else {
  //       Notifications.error({ message: newCart?.message });
  //     }
  //   } catch (err: any) {
  //     Notifications.error({ message: "Something went wrong!" });
  //   }
  //   try {
  //     const url = API.CART_GET_ALL;
  //     const cartItems: any = await GET(url);
  //     if (cartItems.status) {
  //       dispatch(storeCart(cartItems.data));
  //     }
  //   } catch (err) {}
  // };

  const handleAddToLocalCart = async () => {
    try {
      setCartLoading(true);

      const productId = getProductIdSafe(props?.data);
      const rate = props?.bestRate?.rate ?? props?.currentVariant?.price ?? props?.currentVariant?.rate ?? props?.data?.retail_rate ?? 0;

      const productData = {
        id: productId,
        productId: productId,
        name: props?.data?.name || props?.data?.Name,
        price: rate,
        image: props?.currentVariant?.image || props?.data?.image || props?.data?.Image,
        unit: availableQuantity,
        status: props?.data?.status,
        variantId: props?.currentVariant?.id || null,
        category: props?.data?.category,
        code: props?.data?.code || props?.data?.Code,
        description: props?.data?.description || props?.data?.Description,
        availableQuantity: availableQuantity,
        storeId: props?.data?.store_id,
        storeName: props?.data?.storeDetails?.store_name,
        // Additional variant info
        variantName: props?.currentVariant?.combination?.map((c: any) => c.value).join(' ') || null,
      };

      console.log("🔍 Adding to local cart from details page:", {
        productName: productData.name,
        quantity,
        rate,
        availableQuantity
      });

      const result = await cartServiceHelpers.addToCart(
        productData,
        quantity,
        {
          source: 'product_details_local',
          showNotification: true
        }
      );

      if (result.success) {
        // Refresh cart state
        const updatedCart = await cartServiceHelpers.getCart();
        dispatch(setLocalCart(updatedCart));
      }

    } catch (error: any) {
      console.error("Error adding to local cart:", error);
      notification.error({
        message: "Failed to add item to cart",
        description: error.message || "Please try again"
      });
    } finally {
      setCartLoading(false);
    }
  };


  const AddWishlist = async () => {
    setWishlistLoading(true);
    try {
      const productId = getProductIdSafe(props?.data);

      // Get customer ID from session token
      const customerId = getCustomerIdFromSession(session);
      if (!customerId) {
        notification.error({ message: "Please log in to add to wishlist" });
        router.push("/login");
        return;
      }

      const wishlistRequest = {
        transId: 0, // 0 for new wishlist item
        product: productId,
        quantity: 1,
        customer: customerId, // Dynamic customer ID from JWT token
        remarks: "",
        be: 1 // Business Entity
      };

      await germanStandardApi.upsertWishlist(wishlistRequest);

      // Update state immediately for better UX
      const newFavoritedState = !favourited;
      setFavourited(newFavoritedState);

      const message = newFavoritedState
        ? "Successfully added to Wishlist"
        : "Item removed from wishlist.";
      Notifications.success({ message });
      if (newFavoritedState) {
        dispatch(increment());
      } else {
        dispatch(decrement());
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      Notifications.error({
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // const AddWishlist = async () => {
  //   const obj = {
  //     productId: props?.data?.pid,
  //     variantId: props?.currentVariant?.id ?? null,
  //   };
  //   const url = API.WISHLIST;

  //   try {
  //     const response = await POST(url, obj);
  //     if (response?.status) {
  //       // Update state immediately for better UX
  //       const newFavoritedState = !favourited;
  //       setFavourited(newFavoritedState);

  //       const message = newFavoritedState
  //         ? "Successfully added to Wishlist"
  //         : "Item removed from wishlist.";
  //       Notifications.success({ message });
  //       if (newFavoritedState) {
  //         dispatch(increment());
  //       } else {
  //         dispatch(decrement());
  //       }
  //     } else {
  //       Notifications.error({ message: response?.message });
  //     }
  //   } catch (error) {
  //     console.error("Error toggling wishlist:", error);
  //     Notifications.error({
  //       message: "Something went wrong. Please try again later.",
  //     });
  //   }
  // };

  return (
    <>
      {contextHolder}
      <div>
      {/* <div>category: {props?.data?.categoryName?.name}</div>
      <div>subCategory: {props?.data?.subCategoryName?.name}</div> */}
      <div className=" justify-content-between align-items-center">
        {/* Enhanced pricing section - always visible with comprehensive status feedback */}
        <div className="d-flex fw-bold">
          <div className="ts-5 detail-head mt-4">
            {/* Prioritize showing price if available, regardless of rateError */}
            {props?.ratesLoading ? (
              <div className="border rounded p-3 bg-light">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="text-primary fw-bold">
                    {props?.rateRetryCount && props.rateRetryCount > 0 ?
                      `Retrying... (Attempt ${props.rateRetryCount + 1}/3)` :
                      'Loading live pricing...'
                    }
                  </span>
                </div>
                {props?.rateRetryCount && props.rateRetryCount > 0 && (
                  <div className="small text-warning">
                    <div className="progress mb-2" style={{ height: '4px' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                        style={{ width: `${((props.rateRetryCount + 1) / 3) * 100}%` }}
                      />
                    </div>
                    ⚠️ Connection issues detected - retrying automatically
                  </div>
                )}
                <div className="small text-muted">
                  📡 Fetching real-time rates from German Standard API...
                </div>
              </div>
            ) : props?.bestRate?.rate > 0 ? (
              <div>
                <div className="fw-bold text-success">
                  AED {props.bestRate.rate.toFixed(2)}
                </div>
              </div>
            ) : totalPrice > 0 ? (
              <div>
                <div className="fw-bold text-primary">
                  AED {(totalPrice / quantity).toFixed(2)}
                </div>
              </div>
            ) : props?.rateError ? (
              <></>
            ) : (
              <div>
                <div className="text-muted">
                  Price on request
                </div>
              </div>
            )}
          </div>
        </div>
        <br />
        <div className="d-flex gap-2">
          <div className="d-flex gap-3 align-items-center product-qnty">
            <Button
              shape="circle"
              icon={<AiOutlineMinus />}
              disabled={quantity === 1}
              onClick={() => updateQuantity("decrement")}
            />
            <div
              style={{
                fontSize: "24px",
                color: "#333",
                fontWeight: "600",
                minWidth: "40px",
                textAlign: "center",
                userSelect: "none"
              }}
            >
              {quantity}
            </div>
            <Button
              shape="circle"
              icon={<AiOutlinePlus />}
              disabled={
                (availableQuantity > 0 && quantity >= availableQuantity) ||
                (availableQuantity === 0 && !props?.stockLoading)
              }
              onClick={() => updateQuantity("increment")}
            />
          </div>

          {/* Enhanced quantity availability indicator */}
          <div className="ms-2 d-flex align-items-center">
            {props?.stockLoading ? (
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-info" role="status" style={{ width: '12px', height: '12px' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <small className="text-info fw-bold">Checking stock levels...</small>
              </div>
            ) : (
              <small className={`fw-bold ${
                availableQuantity > 10 ? 'text-success' :
                availableQuantity > 0 ? 'text-warning' :
                'text-danger'
              }`}>
                {availableQuantity > 0 ? (
                  <span>
                    <span className="badge bg-success bg-opacity-25 text-success me-1">✓</span>
                    {availableQuantity} available
                  </span>
                ) : (
                  <span>
                    <span className="badge bg-danger bg-opacity-25 text-danger me-1">✗</span>
                    Out of stock
                  </span>
                )}
              </small>
            )}
          </div>
        </div>

        <br />
          {props?.stockLoading ? (
            <div className="alert alert-info d-flex align-items-center py-2">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="fw-bold">Verifying stock availability...</span>
            </div>
          ) : availableQuantity === 0 ? (
            <div className="alert alert-danger d-flex align-items-center py-2">
              <span className="badge bg-danger me-2">⚠️</span>
              <div>
                <strong>Currently Out of Stock</strong>
                <div className="small">This item is temporarily unavailable</div>
              </div>
            </div>
          ) : availableQuantity < quantity ? (
            <div className="alert alert-warning d-flex align-items-center py-2">
              <span className="badge bg-warning me-2">⚠️</span>
              <div>
                <strong>Limited Stock Available</strong>
                <div className="small">Only {availableQuantity} units remaining - please adjust quantity</div>
              </div>
            </div>
          ) : availableQuantity <= 5 ? (
            <div className="alert alert-warning d-flex align-items-center py-2">
              <span className="badge bg-warning me-2">⏰</span>
              <div>
                <strong>Low Stock Alert</strong>
                <div className="small">Only {availableQuantity} units left - order soon!</div>
              </div>
            </div>
          ) : availableQuantity > 0 ? (
            <div className="alert alert-success d-flex align-items-center py-2">
              <span className="badge bg-success me-2">✓</span>
              <div>
                <strong>In Stock</strong>
                <div className="small">{availableQuantity} units available for immediate shipping</div>
              </div>
            </div>
          ) : null}
          <br />
          <div className="d-flex gap-2 align-items-center button-container">
            {availableQuantity > 0 && (
              <Button
                className="buynow-btn fw-bold"
                type="primary"
                onClick={() => {
                  props?.handleBuyNow && props.handleBuyNow(quantity);
                  buyNow();
                }}
              >
                Order Now
              </Button>
            )}
            <Button
              className="buynow-btn fw-bold"
              type="primary"
              icon={cartLoading ? undefined : <HiOutlineShoppingBag />}
              loading={cartLoading}
              onClick={async () => {
                if (isProductInCart) {
                  router.push("/cart");
                } else {
                  if (session?.token) {
                    // Use the new handler from parent component or fallback to local method
                    if (props?.handleAddToCart) {
                      props.handleAddToCart(quantity);
                    } else {
                      await addToCart(props?.data, quantity);
                    }
                  } else {
                    // For non-logged in users - use enhanced local cart service
                    await handleAddToLocalCart();
                  }
                }
              }}
              disabled={cartLoading}
            >
              {isProductInCart ? "Go to Cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
      <br />
      {/* Additional Actions */}
      <div className="d-flex gap-2 align-items-center">
        <Button
          type="text"
          className="productDetails-text-btn1 ps-md-0"
          loading={wishlistLoading}
          onClick={() => {
            if (session) {
              // Use the new handler from parent component
              if (props?.handleAddToWishlist) {
                props.handleAddToWishlist();
              } else {
                AddWishlist();
              }
            } else {
              router.push("/login");
            }
          }}
          icon={
            wishlistLoading ? undefined : favourited ? (
              <CiHeart
                color="#FF006A"
                className={isWobbling ? "wobble" : ""}
                size={20}
              />
            ) : (
              <IoMdHeartEmpty color="#DBDBDB" size={20} />
            )
          }
          disabled={wishlistLoading}
        >
          Add to wishlist
        </Button>
        <Button
          type="text"
          className="productDetails-text-btn1"
          icon={
            <CiShuffle
              // color="#FF006A"
              className={isWobbling ? "wobble" : ""}
              size={20}
            />
          }
        >
          Compare
        </Button>
        {/* <div>Any Problem with Product?</div> */}
        {/* <Button type="text" icon={<RiFlag2Fill />}>
            Report
          </Button> */}
      </div>
    </>
  );
}

export default Description;
