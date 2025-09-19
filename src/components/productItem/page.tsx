// "use client";
// import React, { useState, useEffect } from "react";
// import "./styles.scss";
// import { useRouter } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { FaStar } from "react-icons/fa6";
// import { Button, Popover, Rate, message, notification, Avatar } from "antd";
// import { reduxSettings } from "@/redux/slice/settingsSlice";
// import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
// import {
//   addToLocalCart,
//   decreaseLocalCartQuantity,
//   increaseLocalCartQuantity,
//   removeFromLocalCart,
// } from "@/redux/slice/localcartSlice";
// import { storeCheckout } from "@/redux/slice/checkoutSlice";
// import API from "@/config/API";
// import { POST, GET, PUT } from "@/util/apicall";
// import { useSession } from "next-auth/react";
// import { storeCart } from "@/redux/slice/cartSlice";
// import MergeLocalcartToLogin from "@/app/Middleware/MergeLocalcartToLogin";
// import veg from "../../../public/images/veg.png"
// import nonveg from "../../../public/images/non veg.png"

// function ProductItem(props: any) {
//   const [cartBtn, setCartBtn] = useState(false);
//   const navigate = useRouter();
//   const dispatch = useDispatch();
//   const Settings = useSelector(reduxSettings);
//   const LocalCart = useSelector(
//     (state: any) => state.LocalCart || { items: [] }
//   );
//   const { data: session }: any = useSession();
//   const [quantity, setQuantity] = useState(1);
//   const [totalPrice, setTotalPrice] = useState(props?.item?.retail_rate || 0);
//   const [Notifications, contextHolder] = notification.useNotification();
//   const cartItems = useSelector((state: any) => state.Cart.items);

//   const cartItemsLocal = session?.token ? cartItems : LocalCart.items;
//   const isInCart = cartItemsLocal?.some(
//     (itemCart: any) => itemCart.pid == props.item.pid
//   );
//   useEffect(() => {
//     cartItemsLocal.find((item: any) => {
//       if (item.pid == props.item.pid) {
//         setQuantity(item.quantity);
//       }
//     });
//   }, [cartItemsLocal, props.item.pid]);

//   const givenDate: any = new Date(props?.item?.createdAt);
//   const currentDate: any = new Date();
//   const differenceInMilliseconds = currentDate - givenDate;
//   const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)
//     ? Math.floor(differenceInMilliseconds / 1000)
//     : null;

//   useEffect(() => {
//     const basePrice = props?.item?.retail_rate || 0;
//     setTotalPrice(basePrice * quantity);
//   }, [quantity, props?.item?.retail_rate]);

//   const updateQuantity = async (type: "add" | "reduce") => {
//     const availableQuantity = props?.item?.unit || 10;
//     const cartItem = cartItemsLocal.find(
//       (item: any) => item.pid === props.item.pid
//     );

//     if (!cartItem) {
//       return;
//     }
//     try {
//       if (session?.token) {
//         const cartItems: any = await PUT(
//           API.CART + cartItem.id + `?action=${type}`,
//           {}
//         );

//         if (cartItems.status) {
//           const cartItemsAdd: any = await GET(API.CART_GET_ALL);
//           dispatch(storeCart(cartItemsAdd.data));
//         }
//       } else {
//         if (type === "add" && quantity < availableQuantity) {
//           dispatch(increaseLocalCartQuantity({ ...cartItem }));
//         } else if (type === "reduce" && quantity > 0) {
//           dispatch(decreaseLocalCartQuantity({ ...cartItem }));
//         }
//       }
//     } catch (error) {
//       notification.error({ message: "Can't change Quantity" });
//     }
//   };

//   const openDetails = () => {
//     navigate.push(`/${props?.item?.slug}/?pid=${props?.item?.pid}&review=2`);
//   };

//   const addToCart = async (quantity: number) => {
//     setCartBtn(true);
//     if (props?.item?.status != true) {
//       notification.error({ message: `Product is Temporarily not Available` });
//       return;
//     } else if (props?.item?.unit == 0) {
//       notification.error({ message: `Product is Out of Stock!!` });
//       return;
//     } else if (quantity > props?.item?.unit) {
//       notification.error({ message: `Selected Quantity is Not Available.` });
//       return;
//     } else if (quantity === 0) {
//       notification.error({ message: `Please select at least 1 quantity.` });
//       return;
//     }

//     const obj = {
//       productId: props?.item?.pid || props?.item?._id,
//       quantity: quantity,
//       variantId: null,
//     };

//     const url = API.CART;
//     try {
//       const newCart: any = await POST(url, obj);
//       if (newCart.status) {
//         Notifications.success({ message: newCart?.message });
//       } else {
//         Notifications.error({ message: newCart?.message });
//       }
//     } catch (err: any) {
//       Notifications.error({ message: "Something went wrong!" });
//     }
//     try {
//       const url = API.CART_GET_ALL;
//       const cartItems: any = await GET(url);
//       if (cartItems.status) {
//         dispatch(storeCart(cartItems.data));
//       }
//     } catch (err) {}
//   };

//   const handleAddToLocalCart = () => {
//     if (props?.item?.status != true) {
//       notification.error({ message: `Product is Temporarily not Available` });
//       return;
//     } else if (props?.item?.unit == 0) {
//       notification.error({ message: `Product is Out of Stock!!` });
//       return;
//     } else if (quantity > props?.item?.unit) {
//       notification.error({ message: `Selected Quantity is Not Available.` });
//       return;
//     } else if (quantity === 0) {
//       notification.error({ message: `Please select at least 1 quantity.` });
//       return;
//     }

//     const cartItem = {
//       productId: props?.item?.pid || props?.item?._id,
//       pid: props?.item?.pid,
//       name: props?.item?.name,
//       price: props?.item?.retail_rate,
//       quantity: quantity,
//       image: props?.item?.image,
//       variantId: null,
//       totalPrice: totalPrice,
//       availableQuantity: props?.item?.unit,
//       storeId: props?.item?.store_id,
//       storeName: props?.item?.storeDetails?.store_name,
//     };

//     try {
//       dispatch(addToLocalCart(cartItem));
//     } catch (error) {
//       console.error("Error adding to local cart:", error);
//       notification.error({ message: "Failed to add item to cart" });
//     }
//   };

//   const content = (
//     <div>
//       <p>{props?.item?.totalReviews} total ratings</p>
//       <hr />
//       <p
//         className="ProductItem-txt5"
//         style={{ cursor: "pointer" }}
//         onClick={() => openDetails()}
//       >{`See customer reviews >`}</p>
//     </div>
//   );

//   const title = (
//     <div className="d-flex align-items-center gap-2">
//       <Rate
//         disabled
//         allowHalf
//         value={Number(props?.item?.averageRating)}
//         className=""
//         style={{ fontSize: "12px" }}
//       />
//       <h6 className="my-0 fw-bold">{`${Number(
//         props?.item?.averageRating
//       )?.toFixed(1)} out of 5`}</h6>
//     </div>
//   );

//   return (
//     <div className="ProductItem position-relative">
//       {contextHolder}
//       <div className="ProductItem-Box1">
//         <img
//           src={props?.item?.image}
//           className="ProductItem-img"
//           alt="ProductItem-img"
//           onClick={() => openDetails()}
//         />
//       </div>

//       <div className="ProductItem-Box2 d-flex flex-column justify-content-between">
//         <div>
//           <div className="d-flex justify-content-between">
//             <div
//               className="ProductItem-txt1 text-center text-sm-start"
//               onClick={() => openDetails()}
//             >
//               {props?.item?.name}
//             </div>
//             {/* <div>
//                <Avatar size={26} src={props?.item?.is_vegetarian ? veg.src : nonveg.src} shape="square"/>
//             </div> */}
//           </div>
//           <Popover content={content} title={title}>
//             {props?.item?.averageRating ? (
//               <div className="d-flex gap-2">
//                 <div className="ProductItem-txt5">
//                   <FaStar color="#f5da42" />
//                   {isNaN(Number(props?.item?.averageRating)) == false
//                     ? Number(props?.item?.averageRating)?.toFixed(1)
//                     : 0}
//                 </div>
//                 <span className="ProductItem-txt5 text-dark">
//                   {props?.item?.totalReviews
//                     ? ` (${props?.item?.totalReviews})`
//                     : ""}
//                 </span>
//               </div>
//             ) : null}
//           </Popover>
//           <div className="d-flex justify-content-between">
//             <div className="ProductItem-txt3 text-center text-sm-start">
//               {new Intl.NumberFormat("en-US", {
//                 style: "currency",
//                 currency: Settings?.currency,
//               }).format(props?.item?.retail_rate)}
//             </div>

//             {quantity > 1 && (
//               <small className="text-success py-2  d-none d-sm-block">
//                 Total:{" "}
//                 {new Intl.NumberFormat("en-US", {
//                   style: "currency",
//                   currency: Settings?.currency,
//                 }).format(totalPrice)}
//               </small>
//             )}
//           </div>
//         </div>

//         <div className="d-flex flex-column align-items-center mt-2">

//           {/* {!isInCart ? (
//             <Button
//               disabled={cartBtn == true}
//               size="small"
//               className="w-100 p-1 h-100 w-100 cartBtn"
//               onClick={() => {
//                 if (session?.token) {
//                   addToCart(quantity);
//                 } else {
//                   handleAddToLocalCart();
//                 }
//               }}
//             >
//               Add to Cart
//             </Button>
//           ) : (
//             <div className="incDecBtn">
//               <Button
//                 size="small"
//                 type="primary"
//                 ghost
//                 icon={<AiOutlineMinus />}
//                 shape="circle"
//                 disabled={quantity == 1}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   updateQuantity("reduce");
//                 }}
//               />
//               <div className="fw-bold">{quantity}</div>
//               <Button
//                 size="small"
//                 type="primary"
//                 ghost
//                 icon={<AiOutlinePlus />}
//                 shape="circle"
//                 disabled={(props?.item?.unit || 10) <= quantity}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   updateQuantity("add");
//                 }}
//               />
//             </div>
//           )} */}
//         </div>

//         {/* Product Status Tags */}
//         {props?.item?.unit <= 0 ? (
//           <div className="product_status_tag position-absolute">
//             <div className="badge2 grey">Soldout</div>
//           </div>
//         ) : props?.item?.status == false ? (
//           <div className="product_status_tag position-absolute">
//             <div className="badge2 red">not available</div>
//           </div>
//         ) : props?.item?.unit <= 5 ? (
//           <div className="product_status_tag position-absolute">
//             <div className="badge2 orange">{` only ${props?.item?.unit} left`}</div>
//           </div>
//         ) : typeof differenceInMilliseconds == "number" ? (
//           differenceInMilliseconds < 43000 ? (
//             <div className="product_status_tag position-absolute">
//               <div className="badge2 blue">New</div>
//             </div>
//           ) : null
//         ) : null}
//       </div>
//     </div>
//   );
// }

// export default ProductItem;

"use client";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  notification,
  Tooltip,
} from "antd";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import {
  addToLocalCart,
  decreaseLocalCartQuantity,
  increaseLocalCartQuantity,
} from "@/redux/slice/localcartSlice";
import API from "@/config/API";
import { POST } from "@/util/apicall";
import { useSession } from "next-auth/react";
import { CiHeart, CiSearch, CiShoppingCart, CiShuffle } from "react-icons/ci";
import { getProductRates, getBestProductRate, ProductRate } from "@/util/productRatesApi";
import { germanStandardApi } from "@/services/germanStandardApi";

function ProductItem(props: any) {
  const [isHovered, setIsHovered] = useState(false); // Added state for hover
  const [productRates, setProductRates] = useState<ProductRate[]>([]);
  const [bestRate, setBestRate] = useState<ProductRate | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [productStock, setProductStock] = useState({ unit: 10, status: true });
  const navigate = useRouter();
  const dispatch = useDispatch();
  const Settings = useSelector(reduxSettings);
  const LocalCart = useSelector(
    (state: any) => state.LocalCart || { items: [] }
  );
  const { data: session }: any = useSession();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0); // Will be set based on product data
  const [Notifications, contextHolder] = notification.useNotification();
  const cartItems = useSelector((state: any) => state.Cart.items);

  // Map the props data structure - support both formats
  const product = {
    id: props?.item?.id || props?.item?._id || props?.item?.Id,
    pid: props?.item?.id || props?.item?._id || props?.item?.Id, // Use id as pid for compatibility
    name: props?.item?.name || props?.item?.Name,
    code: props?.item?.slug || props?.item?.Code,
    description: props?.item?.description || props?.item?.Description,
    extraDescription: props?.item?.extraDescription || props?.item?.ExtraDescription,
    image: props?.item?.image || props?.item?.Image,
    price: bestRate?.rate || props?.item?.price || 0,
    retail_rate: bestRate?.rate || props?.item?.price || 0,
    unit: productStock.unit, // Use state for stock quantity
    status: productStock.status, // Use state for stock status
    averageRating: 0, // Default rating
    totalReviews: 0, // Default reviews
    createdAt: new Date().toISOString(), // Default creation date
    category: props?.item?.category,
  };

  // Fetch product rates and stock data for German Standard API format
  useEffect(() => {
    const fetchProductData = async () => {
      const productId = props?.item?.id || props?.item?._id || props?.item?.Id;
      console.log("🆔 ProductItem - Processing Product ID:", productId, "| Session:", !!session?.token);

      if (productId) {
        // Fetch stock data for ALL users (authenticated and non-authenticated)
        console.log("🔍 Fetching stock for ProductItem - Product ID:", productId);

        // Try multiple warehouse configurations to find working one
        let stockResponse = null;
        const warehousesToTry = [2, 1, 0]; // Try different warehouse IDs

        try {
          for (const warehouse of warehousesToTry) {
            try {
              console.log(`📦 Trying warehouse ${warehouse} for product ${productId}`);
              stockResponse = await germanStandardApi.getStock({
                product: Number(productId),
                warehouse: warehouse,
                be: 1
              });

              if (stockResponse && Array.isArray(stockResponse) && stockResponse.length > 0) {
                console.log(`✅ Found stock data with warehouse ${warehouse}:`, stockResponse);
                break; // Success! Stop trying other warehouses
              } else {
                console.log(`⚠️ No stock data with warehouse ${warehouse}`);
              }
            } catch (warehouseError: any) {
              console.log(`❌ Warehouse ${warehouse} failed:`, warehouseError.message);
              continue; // Try next warehouse
            }
          }

          console.log("📦 ProductItem Final Stock API response:", stockResponse);

          if (stockResponse && Array.isArray(stockResponse) && stockResponse.length > 0) {
            const stockData = stockResponse[0];
            if (stockData && typeof stockData.BalQty !== 'undefined') {
              const stockQuantity = Math.floor(stockData.BalQty) || 0; // API returns BalQty, not Quantity
              setProductStock({
                unit: stockQuantity,
                status: stockQuantity > 0
              });
              console.log("✅ ProductItem Stock data set:", {
                unit: stockQuantity,
                status: stockQuantity > 0,
                warehouse: stockData.Warehouse
              });
            } else {
              console.warn("⚠️ ProductItem: Stock data format invalid:", stockData);
              setProductStock({ unit: 0, status: false });
            }
          } else {
            console.warn("⚠️ ProductItem: No stock data received from any warehouse - Product might not exist in inventory");
            setProductStock({ unit: 0, status: false });
          }
        } catch (stockError) {
          console.error("❌ ProductItem Stock fetch error:", stockError);
          // Show real error instead of fake default
          setProductStock({ unit: -1, status: false }); // -1 indicates API error
        }

        // Fetch rates ONLY if user is authenticated (business logic)
        if (session?.token) {
          setRatesLoading(true);
          try {
            console.log("💰 Fetching rates for ProductItem - Product ID:", productId, "(type:", typeof productId, ")");

            // Convert productId to number to ensure API compatibility
            const numericProductId = Number(productId);
            if (isNaN(numericProductId)) {
              throw new Error(`Invalid product ID: ${productId} cannot be converted to number`);
            }

            console.log("💰 Converted Product ID to number:", numericProductId);

            // Fetch all product rates with error handling
            const rates = await getProductRates(numericProductId);
            console.log("💰 ProductItem rates received:", rates);

            if (rates && Array.isArray(rates) && rates.length > 0) {
              setProductRates(rates);

              // Get the best rate (lowest price)
              const best = await getBestProductRate(numericProductId);
              setBestRate(best);
              console.log("✅ ProductItem best rate set:", best);
            } else {
              console.warn("⚠️ ProductItem: No rates received for product ID:", numericProductId, "- API may not have pricing data for this product");
              setProductRates([]);
              setBestRate(null);
            }
          } catch (rateError: any) {
            console.error("❌ ProductItem Rate fetch error:", {
              productId,
              errorMessage: rateError.message,
              errorType: rateError.name,
              fullError: rateError
            });
            // Set empty rates on error (don't show fake prices)
            setProductRates([]);
            setBestRate(null);
          } finally {
            setRatesLoading(false);
          }
        } else {
          console.log("👤 User not authenticated - skipping rate fetching (stock still fetched)");
          setRatesLoading(false);
          setProductRates([]);
          setBestRate(null);
        }
      } else {
        console.warn("❌ ProductItem: No product ID found in props");
        setProductStock({ unit: 0, status: false });
        setProductRates([]);
        setBestRate(null);
        setRatesLoading(false);
      }
    };

    fetchProductData();
  }, [props?.item?.id, props?.item?._id, props?.item?.Id, session?.token]);

  // Update total price when quantity or price changes
  useEffect(() => {
    const basePrice = product.retail_rate || 0;
    setTotalPrice(basePrice * quantity);
  }, [quantity, product.retail_rate]);

  const cartItemsLocal = session?.token ? cartItems : LocalCart.items;
  useEffect(() => {
    cartItemsLocal.find((item: any) => {
      if (item.pid == product.pid) {
        setQuantity(item.quantity);
      }
    });
  }, [cartItemsLocal, product.pid]);

  const givenDate: any = new Date(product.createdAt);
  const currentDate: any = new Date();
  const differenceInMilliseconds = currentDate - givenDate;

  const updateQuantity = async (type: "add" | "reduce") => {
    const availableQuantity = product.unit || 10;
    const cartItem = cartItemsLocal.find(
      (item: any) => item.pid === product.pid
    );

    if (!cartItem) {
      return;
    }
    try {
      if (session?.token) {
        // For now, we'll use local cart management for both formats
        // TODO: Implement proper API calls for cart quantity updates
        if (type === "add" && quantity < availableQuantity) {
          dispatch(increaseLocalCartQuantity({ ...cartItem }));
        } else if (type === "reduce" && quantity > 0) {
          dispatch(decreaseLocalCartQuantity({ ...cartItem }));
        }
      } else {
        if (type === "add" && quantity < availableQuantity) {
          dispatch(increaseLocalCartQuantity({ ...cartItem }));
        } else if (type === "reduce" && quantity > 0) {
          dispatch(decreaseLocalCartQuantity({ ...cartItem }));
        }
      }
    } catch (error) {
      notification.error({ message: "Can't change Quantity" });
    }
  };

  const openDetails = () => {
    // ENHANCED: Pass complete product data with prioritization

    // First priority: Use fullProductData if available (from search/products page)
    let productDataToPass = null;

    if (props?.item?.fullProductData) {
      console.log("📋 Using complete fullProductData from search page:", props.item.fullProductData);
      productDataToPass = {
        ...props.item.fullProductData,
        // Add current component state for real-time data
        currentStock: productStock,
        currentRates: productRates,
        currentBestRate: bestRate,
        ratesLoading: ratesLoading,
        // Add timestamp for data freshness
        passedAt: new Date().toISOString()
      };
    }
    // Fallback: Use basic productData if available
    else if (props?.item?.productData) {
      console.log("📋 Using basic productData fallback:", props.item.productData);
      productDataToPass = props.item.productData;
    }
    // Last resort: Construct from current product state
    else {
      console.log("📋 Constructing product data from component state");
      productDataToPass = {
        Id: product.id,
        id: product.id,
        Name: product.name,
        name: product.name,
        Description: product.description,
        description: product.description,
        ExtraDescription: product.extraDescription,
        extraDescription: product.extraDescription,
        Image: product.image,
        image: product.image,
        Code: product.code,
        source: 'component_state',
        passedAt: new Date().toISOString()
      };
    }

    try {
      const encodedProductData = encodeURIComponent(JSON.stringify(productDataToPass));

      // Check URL length to prevent issues with very large data
      const baseUrl = `/${product.code}/?pid=${product.pid}&review=2&productData=`;
      const fullUrl = baseUrl + encodedProductData;

      if (fullUrl.length > 8000) {
        console.warn("⚠️ URL too long, using basic data only");
        // Fallback to essential data only
        const essentialData = {
          Id: product.id,
          Name: product.name,
          Description: product.description,
          Image: product.image,
          Code: product.code,
          source: 'essential_fallback'
        };
        const encodedEssentialData = encodeURIComponent(JSON.stringify(essentialData));
        navigate.push(baseUrl + encodedEssentialData);
      } else {
        console.log("✅ Navigating with complete product data, URL length:", fullUrl.length);
        navigate.push(fullUrl);
      }
    } catch (error) {
      console.error("❌ Error encoding product data, using minimal navigation:", error);
      // Emergency fallback - just use basic URL params
      navigate.push(`/${product.code}/?pid=${product.pid}&review=2&name=${encodeURIComponent(product.name)}`);
    }
  };

  const addToCart = async (quantity: number) => {
    // ✅ IMPROVED: Enhanced status validation with better error messages
    const productStatus = product.status;
    const availableStock = productStock?.unit || product.unit || 0;

    console.log("🔍 ProductItem availability check:", {
      productName: product.name,
      status: productStatus,
      availableStock,
      requestedQuantity: quantity
    });

    // Check product status with more intelligent logic
    if (productStatus === false || (productStatus !== true && productStatus !== undefined && !productStatus)) {
      notification.error({
        message: `Product Not Available`,
        description: `${product.name || 'This product'} is currently not available for purchase.`
      });
      return;
    } else if (availableStock <= 0) {
      notification.error({ message: `Product is Out of Stock!!` });
      return;
    } else if (quantity > product.unit) {
      notification.error({ message: `Selected Quantity is Not Available.` });
      return;
    } else if (quantity === 0) {
      notification.error({ message: `Please select at least 1 quantity.` });
      return;
    }

    // Determine which API to use based on data format
    const isGermanStandardFormat = props?.item?.Id; // Check if it's German Standard API format
    
    let obj, url;
    
    if (isGermanStandardFormat) {
      // German Standard API format
      obj = {
        product: product.id,
        qty: quantity,
        headerId: 0,
        voucherType: 0,
      };
      url = API.GERMAN_STANDARD_UPSERT_CART;
    } else {
      // New format
      obj = {
        productId: product.id,
        quantity: quantity,
        variantId: null,
      };
      url = API.GERMAN_STANDARD_UPSERT_CART; // Using same endpoint for now
    }

    try {
      const newCart: any = await POST(url, obj);
      if (isGermanStandardFormat) {
        if (newCart.status === "Success") {
          Notifications.success({ message: "Product added to cart successfully" });
        } else {
          Notifications.error({ message: newCart?.message || "Failed to add to cart" });
        }
      } else {
        if (newCart.status) {
          Notifications.success({ message: newCart?.message || "Product added to cart successfully" });
        } else {
          Notifications.error({ message: newCart?.message || "Failed to add to cart" });
        }
      }
    } catch (err: any) {
      Notifications.error({ message: "Something went wrong!" });
    }
    // Note: Cart retrieval needs to be implemented with German Standard API
  };

  const handleAddToLocalCart = () => {
    // ✅ IMPROVED: Enhanced status validation with better error messages
    const productStatus = product.status;
    const availableStock = productStock?.unit || product.unit || 0;

    console.log("🔍 Local cart availability check:", {
      productName: product.name,
      status: productStatus,
      availableStock,
      requestedQuantity: quantity
    });

    // Check product status with more intelligent logic
    if (productStatus === false || (productStatus !== true && productStatus !== undefined && !productStatus)) {
      notification.error({
        message: `Product Not Available`,
        description: `${product.name || 'This product'} is currently not available for purchase.`
      });
      return;
    } else if (availableStock <= 0) {
      notification.error({ message: `Product is Out of Stock!!` });
      return;
    } else if (quantity > product.unit) {
      notification.error({ message: `Selected Quantity is Not Available.` });
      return;
    } else if (quantity === 0) {
      notification.error({ message: `Please select at least 1 quantity.` });
      return;
    }

    const cartItem = {
      productId: product.id,
      pid: product.pid,
      name: product.name,
      price: product.retail_rate,
      quantity: quantity,
      image: product.image,
      variantId: null,
      totalPrice: totalPrice,
      availableQuantity: product.unit,
      storeId: product.category, // Use category as storeId
      storeName: product.extraDescription, // Use extraDescription as storeName
    };

    try {
      dispatch(addToLocalCart(cartItem));
    } catch (error) {
      console.error("Error adding to local cart:", error);
      notification.error({ message: "Failed to add item to cart" });
    }
  };


  // Functions for the sidebar actions
  const handleAddToCart = () => {
    if (session?.token) {
      addToCart(quantity);
    } else {
      handleAddToLocalCart();
    }
  };

  const handleQuickView = () => {
    openDetails();
  };

  const handleShare = () => {
    // Add your share functionality here
    notification.info({ message: "Share functionality coming soon" });
  };

  const handleAddToWishlist = () => {
    // Add your wishlist functionality here
    notification.info({ message: "Wishlist functionality coming soon" });
  };

  return (
    <div
      className="ProductItem "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {contextHolder}
      <div className="ProductItem-Box1 position-relative">
        <img
          src={product.image}
          className="ProductItem-img"
          alt={product.name}
          onClick={() => openDetails()}
        />
      </div>

      {/* Hover Sidebar */}
      <div
        className="hover-sidebar"
        style={{
          position: "absolute",
          top: "40px",
          // bottom:0,
          transition: "right 0.3s ease",
          right: isHovered ? "15px" : "-40px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 10,
          backgroundColor: "white",
        }}
      >
        {" "}
        <Tooltip title="Add To Cart" placement="left">
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "transparent",
              color: "#E9421A",
              cursor: "pointer",
              border: "none",
              transition: "all 0.3s",
              height: "40px",
              fontSize: "23px",
              padding: "10px",
            }}
            onClick={handleAddToCart}
          // disabled={props?.item?.status != true || props?.item?.unit === 0}
          >
            <CiShoppingCart />
          </button>
        </Tooltip>
        <Tooltip title="Quick view" placement="left">
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "transparent",
              color: "#E9421A",
              cursor: "pointer",
              border: "none",
              transition: "all 0.3s",
              height: "40px",
              fontSize: "23px",
              padding: "10px",
            }}
            onClick={handleQuickView}
          >
            <CiSearch />
          </button>
        </Tooltip>
        <Tooltip title="Compare" placement="left">
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E9421A",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
              transition: "all 0.3s",
              height: "40px",
              fontSize: "23px",
              padding: "10px",
            }}
            onClick={handleShare}
          >
            <CiShuffle />
          </button>
        </Tooltip>
        <Tooltip title="Add to wishlist" placement="left">
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "transparent",
              color: "#E9421A",
              cursor: "pointer",
              border: "none",
              transition: "all 0.3s",
              height: "40px",
              fontSize: "23px",
              padding: "10px",
            }}
            onClick={handleAddToWishlist}
          >
            <CiHeart />
          </button>
        </Tooltip>
      </div>

      <div className="ProductItem-Box2 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between">
            <div
              className="ProductItem-txt1 text-center text-md-start"
              onClick={() => openDetails()}
            >
              {product.name}
            </div>
            {/* <div>
               <Avatar size={26} src={product.is_vegetarian ? veg.src : nonveg.src} shape="square"/>
            </div> */}
          </div>
          {/* <Popover content={content} title={title}>
            {props?.item?.averageRating ? (
              <div className="d-flex gap-2">
                <div className="ProductItem-txt5">
                  <FaStar color="#f5da42" />  
                  {isNaN(Number(props?.item?.averageRating)) == false
                    ? Number(props?.item?.averageRating)?.toFixed(1)
                    : 0}
                </div>
                <span className="ProductItem-txt5 text-dark">
                  {props?.item?.totalReviews
                    ? ` (${props?.item?.totalReviews})`
                    : ""}
                </span>
              </div>
            ) : null}
          </Popover> */}
          <div className="d-flex justify-content-between">
            <div className="ProductItem-txt3 text-center text-sm-start">
              {ratesLoading ? (
                <span className="text-muted">Loading prices...</span>
              ) : bestRate ? (
                <div>
                  <div className="d-flex align-items-center gap-1">
                    <div className="fw-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: Settings?.currency || "USD",
                      }).format(bestRate.rate)}
                    </div>
                    {productRates.length > 1 && (
                      <span className="badge bg-success" style={{ fontSize: '0.6rem' }}>
                        Best
                      </span>
                    )}
                  </div>
                  <div className="small text-muted">
                    per {bestRate.unitName}
                    {productRates.length > 1 && (
                      <span className="ms-1">• {productRates.length} options</span>
                    )}
                  </div>
                </div>
              ) : product.retail_rate > 0 ? (
                <div className="fw-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: Settings?.currency || "USD",
                  }).format(product.retail_rate)}
                </div>
              ) : session?.token ? (
                <div className="text-muted">
                  <small>💬 Price unavailable</small>
                </div>
              ) : (
                <div className="text-info">
                  <small>🔒 Login for pricing</small>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Detailed Rates Display */}
          {productRates.length > 1 && !ratesLoading && (
            <div className="mt-2">
              <div className="small text-muted mb-1">
                💰 Multiple pricing options:
              </div>
              <div className="d-flex flex-wrap gap-1">
                {productRates.slice(0, 2).map((rate, index) => (
                  <Tooltip
                    key={index}
                    title={`${rate.rate} ${Settings?.currency || "USD"} per ${rate.unitName}`}
                    placement="top"
                  >
                    <span
                      className={`badge ${rate === bestRate ? 'bg-success' : 'bg-primary'}`}
                      style={{ fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: Settings?.currency || "USD",
                      }).format(rate.rate)}/{rate.unitName}
                      {rate === bestRate && ' ⭐'}
                    </span>
                  </Tooltip>
                ))}
                {productRates.length > 2 && (
                  <Tooltip
                    title={`Click to see all ${productRates.length} pricing options`}
                    placement="top"
                  >
                    <span
                      className="badge bg-info"
                      style={{ fontSize: '0.65rem', cursor: 'pointer' }}
                      onClick={() => openDetails()}
                    >
                      +{productRates.length - 2} more options
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="d-flex flex-column align-items-center mt-2">
          {/* {!isInCart ? (
            <Button
              disabled={cartBtn == true}
              size="small"
              className="w-100 p-1 h-100 w-100 cartBtn"
              onClick={() => {
                if (session?.token) {
                  addToCart(quantity);
                } else {
                  handleAddToLocalCart();
                }
              }}
            >
              Add to Cart
            </Button>
          ) : (
            <div className="incDecBtn">
              <Button
                size="small"
                type="primary"
                ghost
                icon={<AiOutlineMinus />}
                shape="circle"
                disabled={quantity == 1}
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity("reduce");
                }}
              />
              <div className="fw-bold">{quantity}</div>
              <Button
                size="small"
                type="primary"
                ghost
                icon={<AiOutlinePlus />}
                shape="circle"
                disabled={(props?.item?.unit || 10) <= quantity}
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity("add");
                }}
              />
            </div>
          )} */}
        </div>

        {/* Enhanced Product Status Tags with Real Stock Information */}
        {!product.status ? (
          <div className="product_status_tag position-absolute">
            <div className="badge2 red">not available</div>
          </div>
        ) : product.unit === -1 ? (
          <div className="product_status_tag position-absolute">
            <div className="badge2 grey">Stock Unknown</div>
          </div>
        ) : product.unit === 0 ? (
          <div className="product_status_tag position-absolute">
            <div className="badge2 grey">Out of Stock</div>
          </div>
        ) : product.unit <= 5 && product.unit > 0 ? (
          <div className="product_status_tag position-absolute">
            <div className="badge2 orange">{`Only ${product.unit} left`}</div>
          </div>
        ) : product.unit <= 20 && product.unit > 5 ? (
          <div className="product_status_tag position-absolute">
            <div className="badge2 yellow">{`${product.unit} in stock`}</div>
          </div>
        ) : product.unit > 20 ? (
          <div className="product_status_tag position-absolute">
            <div className="badge2 green">In Stock</div>
          </div>
        ) : typeof differenceInMilliseconds == "number" ? (
          differenceInMilliseconds < 43000 ? (
            <div className="product_status_tag position-absolute">
              <div className="badge2 blue">New</div>
            </div>
          ) : null
        ) : null}

        {/* Enhanced Stock Information Display */}
        <div className="mt-1">
          <div className="d-flex justify-content-between align-items-center">
            <div className="small">
              {product.unit === -1 ? (
                <span className="text-warning">
                  ⚠️ Stock info unavailable
                </span>
              ) : product.unit === 0 ? (
                <span className="text-danger">
                  ❌ Out of stock
                </span>
              ) : product.unit > 0 ? (
                <span className="text-success">
                  📦 {product.unit > 100 ? '100+' : product.unit} available
                </span>
              ) : (
                <span className="text-muted">
                  📦 Stock checking...
                </span>
              )}
            </div>
            {product.unit > 0 && product.unit <= 10 && (
              <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                Low Stock
              </span>
            )}
            {product.unit === -1 && (
              <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>
                API Error
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add this hover style to your SCSS file */}
      {/* <style jsx>{`
        .hover-sidebar button:hover {
          background-color: #ff4d4f !important;
          color: white !important;
        }
      `}</style> */}
    </div>
  );
}

export default ProductItem;
