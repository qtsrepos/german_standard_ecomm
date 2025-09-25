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
// // import MergeLocalcartToLogin from "@/app/Middleware/MergeLocalcartToLogin";
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
  setLocalCart,
  cartServiceHelpers,
  localCartItems,
  isItemLoading,
  LocalCartSlice,
} from "@/redux/slice/localcartSlice";
import { useSession } from "next-auth/react";
import { CiSearch, CiShoppingCart } from "react-icons/ci";

interface ProductItemProps {
  item: any;
  enableRateFetching?: boolean; // New prop to control rate fetching
  context?: 'listing' | 'details' | 'search'; // Context information
}

function ProductItem(props: ProductItemProps) {
  const [isHovered, setIsHovered] = useState(false); // Added state for hover
  const [productStock, setProductStock] = useState({ unit: 0, status: false }); // Changed default to 0 and false
  const navigate = useRouter();
  const dispatch = useDispatch();
  const Settings = useSelector(reduxSettings);
  const cartItems = useSelector(localCartItems);
  const { data: session }: any = useSession();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [Notifications, contextHolder] = notification.useNotification();
  const [cartLoading, setCartLoading] = useState(false);

  // Map the props data structure - support both formats
  const product = {
    id: props?.item?.id || props?.item?._id || props?.item?.Id,
    pid: props?.item?.id || props?.item?._id || props?.item?.Id, // Use id as pid for compatibility
    name: props?.item?.name || props?.item?.Name,
    code: props?.item?.slug || props?.item?.Code,
    description: props?.item?.description || props?.item?.Description,
    extraDescription: props?.item?.extraDescription || props?.item?.ExtraDescription,
    image: props?.item?.image || props?.item?.Image,
    // Pricing: support transformed fields and raw API field `Rate`
    price: props?.item?.price || props?.item?.retail_rate || props?.item?.Rate || 0,
    retail_rate: props?.item?.price || props?.item?.retail_rate || props?.item?.Rate || 0,
    unit: productStock.unit, // Use state for stock quantity
    status: productStock.status, // Use state for stock status
    averageRating: 0, // Default rating
    totalReviews: 0, // Default reviews
    createdAt: new Date().toISOString(), // Default creation date
    category: props?.item?.category,
  };


  // Simple stock and status initialization
  useEffect(() => {
    // Stock: support transformed fields and raw API field `Stock`
    const stockUnit = props?.item?.unit || props?.item?.stock || props?.item?.Stock || 0; // Changed default to 0
    // Status: only consider explicitly false status as unavailable
    // If status is undefined/null, rely on stock quantity instead
    const explicitStatus = props?.item?.status;
    const stockStatus = explicitStatus === false ? false : stockUnit > 0;

    setProductStock({
      unit: stockUnit,
      status: stockStatus
    });
  }, [props?.item?.unit, props?.item?.stock, props?.item?.Stock, props?.item?.status]);

  // Update total price when quantity or price changes
  useEffect(() => {
    const basePrice = product.retail_rate || 0;
    setTotalPrice(basePrice * quantity);
  }, [quantity, product.retail_rate]);

  // Check if product is in cart and get its details
  const isInCart = cartItems?.some((item: any) =>
    item.productId === product.pid && item.variantId === null
  );

  useEffect(() => {
    const cartItem = cartItems?.find((item: any) =>
      item.productId === product.pid && item.variantId === null
    );
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItems, product.pid]);

  const givenDate: any = new Date(product.createdAt);
  const currentDate: any = new Date();
  const differenceInMilliseconds = currentDate - givenDate;

  const updateQuantity = async (type: "add" | "reduce") => {
    const availableQuantity = product.unit || 0; // Changed default to 0
    const cartItem = cartItems?.find(
      (item: any) => item.productId === product.pid && item.variantId === null
    );

    if (!cartItem) {
      return;
    }

    try {
      setCartLoading(true);
      const newQuantity = type === "add" ? cartItem.quantity + 1 : cartItem.quantity - 1;

      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0
        const result = await cartServiceHelpers.removeFromCart(
          product.pid,
          null,
          { showNotification: true }
        );
        if (result.success) {
          const updatedCart = await cartServiceHelpers.getCart();
          dispatch(setLocalCart(updatedCart));
        }
      } else if (newQuantity <= availableQuantity) {
        // Update quantity
        const result = await cartServiceHelpers.updateQuantity(
          product.pid,
          null,
          newQuantity,
          { showNotification: false }
        );
        if (result.success) {
          const updatedCart = await cartServiceHelpers.getCart();
          dispatch(setLocalCart(updatedCart));
        }
      } else {
        notification.warning({
          message: "Stock Limit Reached",
          description: `Only ${availableQuantity} units available`,
          duration: 3
        });
      }
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      notification.error({
        message: "Can't change quantity",
        description: error.message || "Please try again"
      });
    } finally {
      setCartLoading(false);
    }
  };

  const openDetails = () => {
    const productDataToPass = {
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
      unit: productStock.unit,
      status: productStock.status,
      price: product.retail_rate,
      retail_rate: product.retail_rate,
      _metadata: {
        source: 'product_listing_enhanced',
        currentStock: productStock,
        passedFrom: 'product_listing'
      },
      passedAt: new Date().toISOString()
    };

    try {
      // Debug log before redirecting to details page
      console.log("🧭 Navigating to Product Details with payload:", {
        productId: product.id,
        productCode: product.code,
        name: product.name,
        price: product.retail_rate,
        stock: productStock,
        rawItem: props?.item,
        payload: productDataToPass
      });
      const encodedProductData = encodeURIComponent(JSON.stringify(productDataToPass));
      const url = `/${product.code}/?pid=${product.pid}&review=2&productData=${encodedProductData}`;
      console.log("🔗 Details URL:", url);
      navigate.push(url);
    } catch (error) {
      console.error("Error encoding product data:", error);
      navigate.push(`/${product.code}/?pid=${product.pid}&review=2`);
    }
  };

  // Removed German Standard API cart - using enhanced cart service only

  // Removed German Standard API cart refresh - using enhanced cart service only

  const handleAddToLocalCart = async () => {
    try {
      setCartLoading(true);

      const productData = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.retail_rate,
        image: product.image,
        unit: product.unit,
        status: product.status,
        variantId: null,
        category: product.category,
        code: product.code,
        description: product.description,
        availableQuantity: product.unit,
        storeId: product.category,
        storeName: product.extraDescription
      };

      console.log("🔍 Adding to local cart:", {
        productName: product.name,
        quantity,
        productData
      });

      const result = await cartServiceHelpers.addToCart(
        productData,
        quantity,
        {
          source: 'product_listing',
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


  // Functions for the sidebar actions
  const handleAddToCart = async () => {
    await handleAddToLocalCart();
  };

  const handleQuickView = () => {
    openDetails();
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
              color: cartLoading ? "#ccc" : "#E9421A",
              cursor: cartLoading ? "not-allowed" : "pointer",
              border: "none",
              transition: "all 0.3s",
              height: "40px",
              fontSize: "23px",
              padding: "10px",
            }}
            onClick={handleAddToCart}
            disabled={cartLoading || product.status !== true || product.unit === 0}
          >
            {cartLoading ? (
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #f3f3f3",
                  borderTop: "2px solid #E9421A",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}
              />
            ) : (
              <CiShoppingCart />
            )}
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
              {product.retail_rate > 0 ? (
                <div>
                  <div className="d-flex align-items-center gap-1">
                    <div className="fw-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: Settings?.currency || "AED",
                      }).format(product.retail_rate)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted">
                  <small>Price not available</small>
                </div>
              )}
            </div>
          </div>
          
          {/* Removed enhanced rates display - using simple pricing only */}
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
        {product.status === false ? (
          <div className="product_status_tag position-absolute">
            <div className="badge2 red">not available</div>
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
              {product.status === false ? (
                <span className="text-danger">
                  ❌ Not available
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
