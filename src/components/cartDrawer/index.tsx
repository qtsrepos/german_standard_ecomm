// import React, { useState, useEffect } from "react";
// import { Drawer, notification } from "antd";
// import { Col, Container, Row } from "react-bootstrap";
// import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
// import { Popconfirm } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import API from "../../config/API";
// import { storeCart, clearCart } from "../../redux/slice/cartSlice";
// import {
//   clearLocalCart,
//   increaseLocalCartQuantity,
//   decreaseLocalCartQuantity,
//   removeFromLocalCart,
// } from "../../redux/slice/localcartSlice";
// import { useSession } from "next-auth/react";
// import CartItem from "../../app/(user)/cart/_components/cartItem";
// import SummaryCard from "../../app/(user)/cart/_components/summaryCard";
// import NoData from "../../components/noData";
// import RecomendedItems from "../../app/(user)/cart/_components/recommended";
// import { useRouter } from "next/navigation";
// import { clearCheckout, storeCheckout } from "../../redux/slice/checkoutSlice";
// import { DELETE, GET, PUT, POST } from "../../util/apicall";
// import { checkoutCartItems } from "@/app/(user)/cart/_components/checkoutFunction";
// import "./styles.scss";
// import SummaryCardDrawer from "@/app/(user)/cart/_components/summeryCardDrawer";
// import CartItemDrawer from "@/app/(user)/cart/_components/cartItemsDrawer";
// const CartDrawer = ({
//   showDrawer,
//   setOpenDrawer,
// }: {
//   showDrawer: boolean;
//   setOpenDrawer: (open: boolean) => void;
// }) => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [error, setError] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const dispatch = useDispatch();
//   const Cart = useSelector((state: any) => state.Cart);
//   const LocalCart = useSelector(
//     (state: any) => state.LocalCart || { items: [] }
//   );
//   const Settings = useSelector((state: any) => state.Settings.Settings);
//   const { status, data: session } = useSession();
//   const navigate = useRouter();

//   const cartItems = session ? Cart.items : LocalCart.items;

//   const onShowDrawer = () => {
//     setOpenDrawer(true);
//     loadData();
//     getRecommendations();
//     dispatch(clearCheckout());
//   };

//   const onClose = () => {
//     setOpenDrawer(false);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [showDrawer]);

//   const getRecommendations = async () => {
//     try {
//       if (session) {
//         const url = API.USER_HISTORY;
//         const response: any = await GET(url);
//         if (response.status) {
//           setProducts(response.data);
//         } else {
//           setProducts([]);
//         }
//       } else {
//         setProducts([]);
//       }
//     } catch (err) {
//       console.log("No recommendations", err);
//       setProducts([]);
//     }
//   };

//   const mergeLocalCartWithBackend = async (backendCart: any[]) => {
//     try {
//       const localCartItems = LocalCart.items || [];
//       if (localCartItems.length === 0) {
//         dispatch(storeCart(backendCart));
//         return;
//       }
//       const mergedCart = [...backendCart];
//       for (const localItem of localCartItems) {
//         const existingItemIndex = mergedCart.findIndex(
//           (item) => item.productId === localItem.productId
//         );
//         if (existingItemIndex !== -1) {
//           mergedCart[existingItemIndex].quantity += localItem.quantity;
//           mergedCart[existingItemIndex].totalPrice =
//             mergedCart[existingItemIndex].price *
//             mergedCart[existingItemIndex].quantity;
//         } else {
//           mergedCart.push(localItem);
//         }
//       }

//       for (const item of mergedCart) {
//         if (item.id) {
//           await PUT(API.CART + item.id, { quantity: item.quantity });
//         } else {
//           await POST(API.CART, {
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//           });
//         }
//       }

//       dispatch(storeCart(mergedCart));
//       dispatch(clearLocalCart());
//       localStorage.removeItem("cart_items");
//       notification.success({
//         message:
//           "Your products have been successfully added by the guest user to your account",
//       });
//     } catch (err) {
//       console.error("Error merging cart:", err);
//       notification.error({
//         message: "Failed to merge local cart with account",
//       });
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       if (session) {
//         const cartItemsResponse: any = await GET(API.CART_GET_ALL);
//         if (cartItemsResponse.status) {
//           const backendCart = cartItemsResponse.data || [];
//           await mergeLocalCartWithBackend(backendCart);
//         } else {
//           await mergeLocalCartWithBackend([]);
//           notification.warning({
//             message: "No cart data from server, merging local cart",
//           });
//         }
//       }
//     } catch (err) {
//       notification.error({
//         message: "Something went wrong. Showing cached cart data.",
//       });
//       if (session) {
//         await mergeLocalCartWithBackend(Cart.items || []);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clear = async () => {
//     try {
//       if (session) {
//         const response: any = await DELETE(API.CART_CLEAR_ALL);
//         if (response?.status) {
//           notification.success({ message: response?.message });
//           dispatch(clearCart());
//         } else {
//           notification.error({ message: response?.message });
//         }
//       } else {
//         dispatch(clearLocalCart());
//         notification.success({ message: "Cart cleared successfully" });
//       }
//     } catch (err) {
//       notification.error({ message: "Something went wrong." });
//     }
//   };

//   const updateQuantity = async (action: string, item: any) => {
//     try {
//       if (item?.unit <= item?.quantity && action === "add") {
//         notification.error({
//           message:
//             item?.unit === 0
//               ? "Product is Out of Stock"
//               : `Only ${item?.unit} unit Left`,
//         });
//         return;
//       }

//       setLoading(true);

//       if (session) {
//         const cartItems: any = await PUT(
//           API.CART + item?.id + `?action=${action}`,
//           {}
//         );
//         if (cartItems.status) {
//           loadData();
//         } else {
//           notification.error({ message: cartItems?.message ?? "" });
//         }
//       } else {
//         const payload = {
//           productId: item.productId,
//           variantId: item.variantId || null,
//         };
//         if (action === "add") {
//           dispatch(increaseLocalCartQuantity(payload));
//         } else if (action === "reduce" && item.quantity > 1) {
//           dispatch(decreaseLocalCartQuantity(payload));
//         } else if (action === "reduce" && item.quantity === 1) {
//           dispatch(removeFromLocalCart(payload));
//         }
//       }
//     } catch (err) {
//       notification.error({ message: "Failed to Update cart" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeItem = async (id: number, item: any) => {
//     try {
//       if (session) {
//         const url = API.CART + id;
//         const cartItems: any = await DELETE(url);
//         if (cartItems.status) {
//           loadData();
//           notification.success({
//             message: "You have removed Product from cart",
//           });
//         }
//       } else {
//         dispatch(
//           removeFromLocalCart({
//             productId: item.productId,
//             variantId: item.variantId || null,
//           })
//         );
//       }
//     } catch (err) {
//       notification.error({ message: "Failed to Update cart" });
//     }
//   };

//   const goCheckout = async () => {
//     try {
//       if (!session) {
//         const itemsToCheckout = LocalCart.items;
//         localStorage.setItem("checkout_items", JSON.stringify(itemsToCheckout));
//         navigate.push("/login");
//         return;
//       }

//       setError(null);
//       const itemsToCheckout = Cart.items;

//       const data: any = await checkoutCartItems(itemsToCheckout);
//       if (data?.eligibleItems?.length) {
//         dispatch(storeCheckout(data?.eligibleItems));
//         localStorage.setItem(
//           "checkout_items",
//           JSON.stringify(data?.eligibleItems)
//         );
//         navigate.push("/checkout");
//       } else {
//         setError(
//           "Out of stock: Your cart contains items that are currently unavailable."
//         );
//       }
//     } catch (err) {
//       console.log("err", err);
//     }
//   };

//   return (
//     <Drawer
//       title={<span className="drawer-title">Shopping Cart</span>}
//       placement="right"
//       onClose={onClose}
//       open={showDrawer}
//       width={340}
//       extra={""}
//       bodyStyle={{
//         padding: 0,
//         display: "flex",
//         flexDirection: "column",
//         height: "100%",
//         overflow: "hidden", // Crucial for fixed positioning to work
//       }}
//     >
//       {cartItems?.length ? (
//         <>
//           {/* Scrollable cart items */}
//           <div
//             style={{
//               flex: 1,
//               overflowY: "auto",
              
//               marginBottom: "150px", // Space for fixed summary card
//             }}
//           >
//             <Container fluid>
//               <Row>
//                 <Col sm={12} style={{ padding: 0 }}>
//                   {cartItems.map((item: any, index: number) => (
//                     <CartItemDrawer
//                       key={index}
//                       data={item}
//                       Settings={Settings}
//                       updateQuantity={updateQuantity}
//                       removeItem={removeItem}
//                       loading={loading}
//                     />
//                   ))}
//                 </Col>
//               </Row>
//             </Container>
//           </div>

//           {/* Fixed summary card at bottom */}
//           <div
//             style={{
//               position: "fixed",
//               bottom: 0,
//               right: 0,
//               width: "340px", // Match drawer width
//               background: "#fff",
//               borderTop: "1px solid #f0f0f0",
//               padding: "16px",
//               zIndex: 1000,
//             }}
//           >
//             <SummaryCardDrawer
//               Cart={{ ...Cart, items: cartItems }}
//               checkout={() => goCheckout()}
//               error={error}
//               onClose={onClose}
//             />
//           </div>
//         </>
//       ) : (
//         <NoData
//           icon={<IoCartOutline size={100} color="#e6e6e6" />}
//           header=""
//           text1={`NO PRODUCTS IN THE CART`}
//           button="RETURN TO SHOP"
//           onclick={() => {
//             navigate.push("/products");
//             onClose();
//           }}
//         />
//       )}

//       {products?.length > 0 && (
//         <RecomendedItems
//           title="Products You've Recently Visited"
//           data={products}
//           type="visited"
//         />
//       )}
//     </Drawer>
//   );
// };

// export default CartDrawer;

import React, { useState, useEffect } from "react";
import { Drawer, notification } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
import { Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import API from "../../config/API";
import { storeCart, clearCart } from "../../redux/slice/cartSlice";
import {
  clearLocalCart,
  increaseLocalCartQuantity,
  decreaseLocalCartQuantity,
  removeFromLocalCart,
} from "../../redux/slice/localcartSlice";
import { useSession } from "next-auth/react";
import CartItem from "../../app/(user)/cart/_components/cartItem";
import SummaryCard from "../../app/(user)/cart/_components/summaryCard";
import NoData from "../../components/noData";
import RecomendedItems from "../../app/(user)/cart/_components/recommended";
import { useRouter } from "next/navigation";
import { clearCheckout, storeCheckout } from "../../redux/slice/checkoutSlice";
import { DELETE, GET, PUT, POST } from "../../util/apicall";
import { checkoutCartItems } from "@/app/(user)/cart/_components/checkoutFunction";
import "./styles.scss";
import SummaryCardDrawer from "@/app/(user)/cart/_components/summeryCardDrawer";
import CartItemDrawer from "@/app/(user)/cart/_components/cartItemsDrawer";

interface CartDrawerProps {
  showDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  showDrawer,
  setOpenDrawer,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // New state for quantity updates

  const dispatch = useDispatch();
  const Cart = useSelector((state: any) => state.Cart);
  const LocalCart = useSelector(
    (state: any) => state.LocalCart || { items: [] }
  );
  const Settings = useSelector((state: any) => state.Settings.Settings);
  const { status, data: session } = useSession();
  const navigate = useRouter();

  const cartItems = session ? Cart.items : LocalCart.items;

  const onShowDrawer = () => {
    setOpenDrawer(true);
    loadData();
    getRecommendations();
    dispatch(clearCheckout());
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showDrawer]);

  const getRecommendations = async () => {
    try {
      if (session) {
        const url = API.USER_HISTORY;
        const response: any = await GET(url);
        if (response.status) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.log("No recommendations", err);
      setProducts([]);
    }
  };

  const mergeLocalCartWithBackend = async (backendCart: any[]) => {
    try {
      const localCartItems = LocalCart.items || [];
      if (localCartItems.length === 0) {
        dispatch(storeCart(backendCart));
        return;
      }
      const mergedCart = [...backendCart];
      for (const localItem of localCartItems) {
        const existingItemIndex = mergedCart.findIndex(
          (item) => item.productId === localItem.productId
        );
        if (existingItemIndex !== -1) {
          mergedCart[existingItemIndex].quantity += localItem.quantity;
          mergedCart[existingItemIndex].totalPrice =
            mergedCart[existingItemIndex].price *
            mergedCart[existingItemIndex].quantity;
        } else {
          mergedCart.push(localItem);
        }
      }

      for (const item of mergedCart) {
        if (item.id) {
          await PUT(API.CART + item.id, { quantity: item.quantity });
        } else {
          await POST(API.CART, {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          });
        }
      }

      dispatch(storeCart(mergedCart));
      dispatch(clearLocalCart());
      localStorage.removeItem("cart_items");
      notification.success({
        message:
          "Your products have been successfully added by the guest user to your account",
      });
    } catch (err) {
      console.error("Error merging cart:", err);
      notification.error({
        message: "Failed to merge local cart with account",
      });
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      if (session) {
        const cartItemsResponse: any = await GET(API.CART_GET_ALL);
        if (cartItemsResponse.status) {
          const backendCart = cartItemsResponse.data || [];
          await mergeLocalCartWithBackend(backendCart);
        } else {
          await mergeLocalCartWithBackend([]);
          notification.warning({
            message: "No cart data from server, merging local cart",
          });
        }
      }
    } catch (err) {
      notification.error({
        message: "Something went wrong. Showing cached cart data.",
      });
      if (session) {
        await mergeLocalCartWithBackend(Cart.items || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    try {
      if (session) {
        const response: any = await DELETE(API.CART_CLEAR_ALL);
        if (response?.status) {
          notification.success({ message: response?.message });
          dispatch(clearCart());
        } else {
          notification.error({ message: response?.message });
        }
      } else {
        dispatch(clearLocalCart());
        notification.success({ message: "Cart cleared successfully" });
      }
    } catch (err) {
      notification.error({ message: "Something went wrong." });
    }
  };

  // Fixed updateQuantity function
  const updateQuantity = async (action: "add" | "reduce", item: any) => {
    try {
      // Stock validation
      if (item?.unit <= item?.quantity && action === "add") {
        notification.error({
          message:
            item?.unit === 0
              ? "Product is Out of Stock"
              : `Only ${item?.unit} unit Left`,
        });
        return;
      }

      // Prevent multiple simultaneous updates
      if (isUpdating) return;
      
      setIsUpdating(true);

      if (session) {
        // For logged-in users - optimistic update + API call
        const newQuantity = action === "add" ? item.quantity + 1 : item.quantity - 1;
        
        // Optimistic update to Redux store for immediate UI feedback
        const updatedItems = Cart.items.map((cartItem: any) => {
          if (cartItem.id === item.id) {
            const updatedItem = {
              ...cartItem,
              quantity: newQuantity,
              totalPrice: cartItem.price * newQuantity
            };
            return updatedItem;
          }
          return cartItem;
        });

        // Update Redux store immediately
        dispatch(storeCart(updatedItems));

        // Make API call
        const cartResponse: any = await PUT(
          API.CART + item?.id + `?action=${action}`,
          {}
        );
        
        if (cartResponse.status) {
          // Refresh data from server to ensure consistency
          await loadData();
        } else {
          // Revert optimistic update if API call failed
          dispatch(storeCart(Cart.items));
          notification.error({ message: cartResponse?.message ?? "Failed to update quantity" });
        }
      } else {
        // For guest users - Redux actions only
        const payload = {
          productId: item.productId,
          variantId: item.variantId || null,
        };
        
        if (action === "add") {
          dispatch(increaseLocalCartQuantity(payload));
        } else if (action === "reduce") {
          if (item.quantity > 1) {
            dispatch(decreaseLocalCartQuantity(payload));
          } else {
            // Remove item if quantity becomes 0
            dispatch(removeFromLocalCart(payload));
          }
        }
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      notification.error({ message: "Failed to update cart" });
      
      // Revert optimistic update if there was an error
      if (session) {
        await loadData();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (id: number|string, item: any) => {
    try {
      setIsUpdating(true);
      
      if (session) {
        // Optimistic removal for immediate UI feedback
        const updatedItems = Cart.items.filter((cartItem: any) => cartItem.id !== id);
        dispatch(storeCart(updatedItems));

        const url = API.CART + id;
        const cartItems: any = await DELETE(url);
        
        if (cartItems.status) {
          notification.success({
            message: "You have removed Product from cart",
          });
          // Refresh data to ensure consistency
          await loadData();
        } else {
          // Revert optimistic update if API call failed
          await loadData();
          notification.error({ message: "Failed to remove item" });
        }
      } else {
        dispatch(
          removeFromLocalCart({
            productId: item.productId,
            variantId: item.variantId || null,
          })
        );
        notification.success({
          message: "You have removed Product from cart",
        });
      }
    } catch (err) {
      console.error("Error removing item:", err);
      notification.error({ message: "Failed to remove item from cart" });
      
      // Revert optimistic update if there was an error
      if (session) {
        await loadData();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const goCheckout = async () => {
    try {
      if (!session) {
        const itemsToCheckout = LocalCart.items;
        localStorage.setItem("checkout_items", JSON.stringify(itemsToCheckout));
        navigate.push("/login");
        return;
      }

      setError(null);
      const itemsToCheckout = Cart.items;

      const data: any = await checkoutCartItems(itemsToCheckout);
      if (data?.eligibleItems?.length) {
        dispatch(storeCheckout(data?.eligibleItems));
        localStorage.setItem(
          "checkout_items",
          JSON.stringify(data?.eligibleItems)
        );
        navigate.push("/checkout");
      } else {
        setError(
          "Out of stock: Your cart contains items that are currently unavailable."
        );
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <Drawer
      title={<span className="drawer-title">Shopping Cart</span>}
      placement="right"
      onClose={onClose}
      open={showDrawer}
      width={340}
      extra={""}
      bodyStyle={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {cartItems?.length ? (
        <>
          {/* Scrollable cart items */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: "150px",
            }}
          >
            <Container fluid>
              <Row>
                <Col sm={12} style={{ padding: 0 }}>
                  {cartItems.map((item: any, index: number) => (
                    <CartItemDrawer
                      key={`${item.id || item.productId}-${item.variantId || 'default'}`} // Better key for re-rendering
                      data={item}
                      Settings={Settings}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      loading={isUpdating} // Use isUpdating instead of loading
                    />
                  ))}
                </Col>
              </Row>
            </Container>
          </div>

          {/* Fixed summary card at bottom */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              right: 0,
              width: "340px",
              background: "#fff",
              borderTop: "1px solid #f0f0f0",
              padding: "16px",
              zIndex: 1000,
            }}
          >
            <SummaryCardDrawer
              Cart={{ ...Cart, items: cartItems }}
              checkout={() => goCheckout()}
              error={error}
              onClose={onClose}
            />
          </div>
        </>
      ) : (
        <NoData
          icon={<IoCartOutline size={100} color="#e6e6e6" />}
          header=""
          text1={`NO PRODUCTS IN THE CART`}
          button="RETURN TO SHOP"
          onclick={() => {
            navigate.push("/products");
            onClose();
          }}
        />
      )}

      {products?.length > 0 && (
        <RecomendedItems
          title="Products You've Recently Visited"
          data={products}
          type="visited"
        />
      )}
    </Drawer>
  );
};

export default CartDrawer;
