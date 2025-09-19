// =================davood code========================

"use client";
import { useAppSelector } from "@/redux/hooks";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import { Button, notification, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
// import { FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { storeCheckout } from "../../../../redux/slice/checkoutSlice";
import { germanStandardApi } from "@/services/germanStandardApi";
import { useSession } from "next-auth/react";
import { decrement, increment } from "@/redux/slice/favouriteSlice";
import { addToLocalCart } from "@/redux/slice/localcartSlice";
import "../style.scss";
import { storeCart } from "@/redux/slice/cartSlice";
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
  const LocalCart = useSelector(
    (state: any) => state.LocalCart || { items: [] }
  );
  // const [favourited, setFavourited] = useState(props?.data ?? false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const cart = useSelector((state: any) => state.Cart.items);

  const cartItems = session?.token ? cart : LocalCart.items;

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
        deliveryAddress: "Default delivery address", // TODO: Get from user profile or make it required
        eventName: null, // Optional event name
        remarks: `Order created via Buy Now for ${props?.data?.name || props?.data?.Name}`,
        discountType: 0, // No discount
        payTerms: 0, // Default payment terms
        discountCouponRef: null, // No coupon
        discountRef: null, // No discount campaign
        sampleRequestBy: 0, // Not a sample request
        deliveryTerms: "Standard delivery",
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        body: [
          {
            transId: 0, // Line item transaction ID
            product: Number(productId), // Product ID
            qty: quantity, // Quantity
            headerId: 0, // Always 0
            voucherType: 0, // Always 0
            rate: rate, // Unit price
            unit: 1, // Unit ID
            vat: 0, // VAT percentage
            addcharges: 0, // Extra charges
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
    } catch (error) {
      console.error("❌ Buy Now - Order creation error:", error);
      message.error({
        content: "Failed to create order. Please try again.",
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
      // Use German Standard API to add to cart
      const productId = getProductIdSafe(props?.data);

      // Get customer ID from session token
      const customerId = getCustomerIdFromSession(session);
      if (!customerId) {
        notification.error({ message: "Please log in to add items to cart" });
        router.push("/login");
        return;
      }

      // Calculate the proper rate including variant pricing
      const rate = props?.bestRate?.rate ?? props?.currentVariant?.price ?? props?.currentVariant?.rate ?? props?.data?.retail_rate ?? 0;

      const cartRequest = {
        transId: 0, // 0 for new cart item
        date: new Date().toISOString().split('T')[0], // yyyy-MM-dd format
        customer: customerId, // Dynamic customer ID from JWT token
        warehouse: 2, // Configurable warehouse (default: 2)
        product: productId,
        qty: quantity,
        rate: rate,
        unit: 1, // Default unit
        totalRate: rate * quantity,
        be: 1 // Configurable Business Entity (default: 1)
      };

      console.log("🛒 Add to Cart - Request body:", cartRequest);

      const response = await germanStandardApi.upsertCart(cartRequest);

      console.log("📋 Add to Cart - Response body:", response);

      message.success({
        content: "Item added to cart successfully!",
        key: "cart_addition",
        duration: 3,
      });

      // Refresh cart data
      try {
        const cartSummary = await germanStandardApi.getCartSummary(1, true, 1, 100);
        if (cartSummary.transactions && cartSummary.transactions.length > 0) {
          // Transform German Standard cart data to match existing format
          const transformedCart:any = cartSummary.transactions.map((item: any) => ({
            id: item.TransId,
            productId: item.productId || 1,
            quantity: item.qty || 1,
            price: item.rate || 0,
            totalPrice: item.totalRate || 0,
            // Add other required fields as needed
          }));
          dispatch(storeCart(transformedCart));
        }
      } catch (err) {
        console.error("Error refreshing cart:", err);
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

  const handleAddToLocalCart = () => {
    if (props?.data?.status != true) {
      notification.error({ message: `Product is Temporarily not Available` });
      return;
    } else if (props?.data?.unit == 0) {
      notification.error({ message: `Product is Out of Stock!!` });
      return;
    } else if (quantity > props?.data?.unit) {
      notification.error({ message: `Selected Quantity is Not Available.` });
      return;
    } else if (quantity === 0) {
      notification.error({ message: `Please select at least 1 quantity.` });
      return;
    }

    const productId = getProductIdSafe(props?.data);
    const rate = props?.bestRate?.rate ?? props?.currentVariant?.price ?? props?.currentVariant?.rate ?? props?.data?.retail_rate ?? 0;

    const cartItem = {
      productId: productId,
      pid: productId, // For backward compatibility
      name: props?.data?.name || props?.data?.Name,
      price: rate,
      quantity: quantity,
      image: props?.currentVariant?.image || props?.data?.image || props?.data?.Image,
      variantId: props?.currentVariant?.id || null,
      variantName: props?.currentVariant?.combination?.map((c: any) => c.value).join(' ') || null,
      totalPrice: totalPrice,
      availableQuantity: availableQuantity,
      storeId: props?.data?.store_id,
      storeName: props?.data?.storeDetails?.store_name,
    };

    try {
      dispatch(addToLocalCart(cartItem));
    } catch (error) {
      console.error("Error adding to local cart:", error);
      notification.error({ message: "Failed to add item to cart" });
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
        {/* Only show pricing section if we have valid price data */}
        {(props?.bestRate?.rate > 0 || totalPrice > 0) && (
          <div className="d-flex fw-bold">
            <div className="ts-5 detail-head mt-4">
              {props?.ratesLoading ? (
                <span className="text-muted">Loading prices...</span>
              ) : props?.bestRate ? (
                <div>
                  <div className="fw-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: settings.currency ?? "INR",
                    }).format(props.bestRate.rate)}
                    <span className="text-muted small ms-1">/ {props.bestRate.unitName}</span>
                  </div>
                  <div className="small text-muted">
                    Total: {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: settings.currency ?? "INR",
                    }).format(totalPrice)}
                  </div>
                </div>
              ) : totalPrice > 0 ? (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: settings.currency ?? "INR",
                }).format(totalPrice)
              ) : null}
            </div>
          </div>
        )}
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

          {/* Quantity availability indicator */}
          <div className="ms-2 d-flex align-items-center">
            <small className="text-muted">
              {props?.stockLoading ? (
                "Loading stock..."
              ) : availableQuantity > 0 ? (
                `(${availableQuantity} available)`
              ) : (
                "No stock available"
              )}
            </small>
          </div>
        </div>

        <br />
          {props?.stockLoading ? (
            <h5 className="text-muted">Checking stock...</h5>
          ) : availableQuantity === 0 ? (
            <h5 className="text-danger">Currently Out of Stock</h5>
          ) : availableQuantity < quantity ? (
            <h5 className="text-danger">{`Only ${availableQuantity} units left`}</h5>
          ) : availableQuantity <= 5 ? (
            <h5 className="text-warning">{`Only ${availableQuantity} units left`}</h5>
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
              onClick={() => {
                if (isProductInCart) {
                  router.push("/cart");
                } else {
                  if (session?.token) {
                    // Use the new handler from parent component
                    if (props?.handleAddToCart) {
                      props.handleAddToCart(quantity);
                    } else {
                      addToCart(props?.data, quantity);
                    }
                  } else {
                    // For non-logged in users - use Redux + localStorage via the LocalCartSlice
                    handleAddToLocalCart();
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
