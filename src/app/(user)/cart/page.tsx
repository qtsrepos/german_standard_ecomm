// "use client";
// import { notification, Popconfirm } from "antd";
// import React, { useEffect, useState } from "react";
// import { Col, Container, Row } from "react-bootstrap";
// import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
// import { DELETE, GET, PUT } from "../../../util/apicall";
// import { useDispatch, useSelector } from "react-redux";
// import API from "../../../config/API";
// import { storeCart } from "../../../redux/slice/cartSlice";
// import { useSession } from "next-auth/react";
// import "./styles.scss";
// import CartItem from "./_components/cartItem";
// import SummaryCard from "./_components/summaryCard";
// import NoData from "../../../components/noData";
// import RecomendedItems from "./_components/recommended";
// import { useRouter } from "next/navigation";
// import { storeCheckout } from "../../../redux/slice/checkoutSlice";
// import { checkoutCartItems } from "./_components/checkoutFunction";

// function CartPage() {
//   // const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const User = useSession();
//   const Cart = useSelector((state: any) => state.Cart);
//   const Settings = useSelector((state: any) => state.Settings.Settings);
//   const [notificationApi, contextHolder] = notification.useNotification();
//   const [products, setProducts] = useState<any[]>([]);
//   const [error, setError] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useRouter();
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     loadData();
//     getRecommendations();
//     // dispatch(clearCheckout());
//   }, []);

//   const getRecommendations = async () => {
//     try {
//       const url = API.USER_HISTORY;
//       const response: any = await GET(url);
//       if (response.status) {
//         setProducts(response.data);
//       }
//     } catch (err) {
//       console.log("no recommandations", err);
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       if (User) {
//         const cartItems: any = await GET(API.CART_GET_ALL);
//         if (cartItems.status) {
//           dispatch(storeCart(cartItems.data));
//           return;
//         } else {
//           notificationApi.error({ message: cartItems.message ?? "" });
//         }
//       }
//     } catch (err) {
//       notificationApi.error({
//         message: `Something went wrong. please try again`,
//       });
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clear = async () => {
//     try {
//       const response: any = await DELETE(API.CART_CLEAR_ALL);
//       if (response?.status) {
//         notificationApi.success({ message: response?.message });
//         loadData();
//       } else {
//         notificationApi.error({ message: response?.message });
//       }
//     } catch (err) {
//       notificationApi.error({ message: `Something went wrong.` });
//     }
//   };

//   const updateQuantity = async (action: string, item: any) => {
//     try {
//       if (item?.unit <= item?.quantity && action == "add") {
//         notificationApi.error({
//           message:
//             item?.unit == 0
//               ? "Product is Out of Stock"
//               : `Only ${item?.unit} unit Left`,
//         });
//         return;
//       }
//       setLoading(true);
//       const cartItems: any = await PUT(
//         API.CART + item?.id + `?action=${action}`,
//         {}
//       );
//       if (cartItems.status) {
//         loadData();
//         notificationApi.success({
//           message: cartItems?.message,
//         });
//       } else {
//         notificationApi.error({ message: cartItems?.message ?? "" });
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Failed to Update cart" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeItem = async (id: number, item: any) => {
//     try {
//       const url = API.CART + id;
//       const cartItems: any = await DELETE(url);
//       if (cartItems.status) {
//         loadData();
//         notificationApi.success({
//           message: `You have removed Product from cart`,
//         });
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Failed to Update cart" });
//     }
//   };

//   const goCheckout = async () => {
//     try {
//       setError(null);
//       var data: any = await checkoutCartItems(Cart.items);
//       if (data?.eligibleItems?.length) {
//         dispatch(storeCheckout(data?.eligibleItems));
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
//     <div className="Screen-box">
//       {contextHolder}
//       <br />
//       <Container fluid style={{ minHeight: "80vh" }}>
//         {Cart.items.length ? (
//           <div className="Cart-box">
//             <Row>
//               <Col sm={7}>
//                 <div
//                   className="Cart-row"
//                   style={{
//                     padding: 10,
//                     paddingBottom: 0,
//                     paddingRight: 0,
//                     paddingLeft: 0,
//                   }}
//                 >
//                   <div className="Cart-txt1">
//                     <span className="Cart-txt1Icon">
//                       <IoCartOutline />
//                     </span>
//                     CART - ( {Cart.items.length} )
//                   </div>
//                   <div style={{ flex: 1 }} />
//                   <div>
//                     <Popconfirm
//                       placement="bottomRight"
//                       title={"Are you sure to clear all items in your cart?"}
//                       okText="Yes"
//                       cancelText="No"
//                       onConfirm={async () => clear()}
//                     >
//                       <div className="Cart-txt2" style={{ cursor: "pointer" }}>
//                         Remove All Products <IoCloseCircleOutline />
//                       </div>
//                     </Popconfirm>
//                   </div>
//                 </div>
//                 <div className="Cart-line" />
//                 <div>
//                   {Cart.items.map((item: any, index: number) => (
//                     <CartItem
//                       key={index}
//                       data={item}
//                       Settings={Settings}
//                       updateQuantity={updateQuantity}
//                       removeItem={removeItem}
//                       loading={loading}
//                     />
//                   ))}
//                 </div>
//                 <br />
//                 <div className="Cart-txt8">
//                   The price and availability of items at German Standard Group  are
//                   subject to change. The Cart is a temporary place to store a
//                   list of your items and reflects each item's most recent price.
//                   Shopping Cart Learn more. Do you have a gift card or
//                   promotional code? We'll ask you to enter your claim code when
//                   it's time to pay.
//                 </div>
//                 <br />
//               </Col>
//               <Col sm={5}>
//                 <div className="Cart-box2">
//                   <SummaryCard
//                     Cart={Cart}
//                     checkout={() => goCheckout()}
//                     error={error}
//                   />
//                 </div>
//                 <br />
//               </Col>
//             </Row>
//           </div>
//         ) : (
//           <NoData
//             icon={<IoCartOutline size={70} color="#e6e6e6" />}
//             header="Cart is empty"
//             text1={`Your Cart is empty. Please start shopping at ${API.NAME} and place orders`}
//             button={"START SHOPPING NOW"}
//             onclick={() => {
//               navigate.push("/");
//             }}
//           />
//         )}
//         {products?.length ? (
//           <RecomendedItems
//             title={"Products You've Recently Visited"}
//             data={products}
//             type="visited"
//           />
//         ) : null}
//         <br />
//       </Container>
//     </div>
//   );
// }

// export default CartPage;

// "use client";
// import { notification, Popconfirm } from "antd";
// import React, { useEffect, useState } from "react";
// import { Col, Container, Row } from "react-bootstrap";
// import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
// import { DELETE, GET, PUT } from "../../../util/apicall";
// import { useDispatch, useSelector } from "react-redux";
// import API from "../../../config/API";
// import { storeCart, clearCart } from "../../../redux/slice/cartSlice";
// import { useSession } from "next-auth/react";
// import "./styles.scss";
// import CartItem from "./_components/cartItem";
// import SummaryCard from "./_components/summaryCard";
// import NoData from "../../../components/noData";
// import RecomendedItems from "./_components/recommended";
// import { useRouter } from "next/navigation";
// import { clearCheckout, storeCheckout } from "../../../redux/slice/checkoutSlice";
// import { checkoutCartItems } from "./_components/checkoutFunction";
// import { clearLocalCart } from "../../../redux/slice/localcartSlice";

// function CartPage() {
//   const dispatch = useDispatch();
//   const { data: session } = useSession();
//   const Cart = useSelector((state: any) => state.Cart);
//   const LocalCart = useSelector((state: any) => state.LocalCart || { items: [] });
//   const Settings = useSelector((state: any) => state.Settings.Settings);
//   const [notificationApi, contextHolder] = notification.useNotification();
//   const [products, setProducts] = useState<any[]>([]);
//   const [error, setError] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useRouter();

//   // Determine which cart to use based on login status
//   const cartItems = session ? Cart.items : LocalCart.items;

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     loadData();
//     getRecommendations();
//     // davood check below
//     dispatch(clearCheckout());
//   }, [session]);

//   const getRecommendations = async () => {
//     try {
//       // Only fetch recommendations for logged-in users
//       if (session) {
//         const url = API.USER_HISTORY;
//         const response: any = await GET(url);
//         if (response.status) {
//           setProducts(response.data);
//         }
//       } else {
//         // For non-logged in users, might want to set some default recommendations
//         // or use recently viewed items from localStorage if implemented
//         setProducts([]);
//       }
//     } catch (err) {
//       console.log("no recommandations", err);
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       if (session) {
//         // Logged in user - fetch cart from API
//         const cartItems: any = await GET(API.CART_GET_ALL);
//         if (cartItems.status) {
//           dispatch(storeCart(cartItems.data));
//         } else {
//           notificationApi.error({ message: cartItems.message ?? "" });
//         }
//       } else {
//         // Not logged in - check localStorage for cart items
//         try {
//           const localStorageCart = localStorage.getItem('cart_items');
//           if (localStorageCart) {
//             // Local cart data is already managed by the Redux store through localcartSlice
//             // This is just a fallback in case the Redux state is out of sync
//             console.log("LocalCart items already loaded in Redux");
//           }
//         } catch (err) {
//           console.error("Error loading local cart:", err);
//         }
//       }
//     } catch (err) {
//       notificationApi.error({
//         message: `Something went wrong. please try again`,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clear = async () => {
//     try {
//       if (session) {
//         // Logged in user - clear cart via API
//         const response: any = await DELETE(API.CART_CLEAR_ALL);
//         if (response?.status) {
//           notificationApi.success({ message: response?.message });
//           loadData();
//         } else {
//           notificationApi.error({ message: response?.message });
//         }
//       } else {
//         // Not logged in - clear local cart
//         dispatch(clearLocalCart());

//         // Also clear localStorage
//         try {
//           localStorage.removeItem('cart_items');
//         } catch (err) {
//           console.error("Error clearing localStorage cart:", err);
//         }

//         notificationApi.success({ message: "Cart cleared successfully" });
//       }
//     } catch (err) {
//       notificationApi.error({ message: `Something went wrong.` });
//     }
//   };

//   const updateQuantity = async (action: string, item: any) => {
//     try {
//       if (item?.unit <= item?.quantity && action == "add") {
//         notificationApi.error({
//           message:
//             item?.unit == 0
//               ? "Product is Out of Stock"
//               : `Only ${item?.unit} unit Left`,
//         });
//         return;
//       }

//       setLoading(true);

//       if (session) {
//         // Logged in user - update via API
//         const cartItems: any = await PUT(
//           API.CART + item?.id + `?action=${action}`,
//           {}
//         );
//         if (cartItems.status) {
//           loadData();
//           notificationApi.success({
//             message: cartItems?.message,
//           });
//         } else {
//           notificationApi.error({ message: cartItems?.message ?? "" });
//         }
//       } else {
//         // Not logged in - update local cart
//         // This implementation depends on your localcartSlice actions
//         // You would need to implement actions to increment/decrement quantities

//         // Example (you'll need to implement these actions in your localcartSlice):
//         /*
//         if (action === "add") {
//           dispatch(incrementLocalCartItem(item.productId));
//         } else {
//           dispatch(decrementLocalCartItem(item.productId));
//         }
//         */

//         // Also update localStorage
//         try {
//           const localStorageCart = localStorage.getItem('cart_items');
//           if (localStorageCart) {
//             let items = JSON.parse(localStorageCart);
//             const itemIndex = items.findIndex((cartItem: any) =>
//               cartItem.productId === item.productId
//             );

//             if (itemIndex !== -1) {
//               if (action === "add") {
//                 items[itemIndex].quantity += 1;
//                 items[itemIndex].totalPrice = items[itemIndex].price * items[itemIndex].quantity;
//               } else if (action === "remove" && items[itemIndex].quantity > 1) {
//                 items[itemIndex].quantity -= 1;
//                 items[itemIndex].totalPrice = items[itemIndex].price * items[itemIndex].quantity;
//               }

//               localStorage.setItem('cart_items', JSON.stringify(items));

//               // Update Redux state to match localStorage
//               // This depends on your localcartSlice implementation
//               // dispatch(updateLocalCartFromStorage(items));

//               notificationApi.success({
//                 message: "Cart updated successfully",
//               });
//             }
//           }
//         } catch (err) {
//           console.error("Error updating localStorage cart:", err);
//         }
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Failed to Update cart" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeItem = async (id: number, item: any) => {
//     try {
//       if (session) {
//         // Logged in user - remove via API
//         const url = API.CART + id;
//         const cartItems: any = await DELETE(url);
//         if (cartItems.status) {
//           loadData();
//           notificationApi.success({
//             message: `You have removed Product from cart`,
//           });
//         }
//       } else {
//         // Not logged in - remove from local cart
//         // This depends on your localcartSlice implementation
//         // dispatch(removeLocalCartItem(item.productId));

//         // Also update localStorage
//         try {
//           const localStorageCart = localStorage.getItem('cart_items');
//           if (localStorageCart) {
//             let items = JSON.parse(localStorageCart);
//             const updatedItems = items.filter((cartItem: any) =>
//               cartItem.productId !== item.productId
//             );

//             localStorage.setItem('cart_items', JSON.stringify(updatedItems));

//             // Update Redux state to match localStorage
//             // This depends on your localcartSlice implementation
//             // dispatch(updateLocalCartFromStorage(updatedItems));

//             notificationApi.success({
//               message: `You have removed Product from cart`,
//             });
//           }
//         } catch (err) {
//           console.error("Error removing item from localStorage cart:", err);
//         }
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Failed to Update cart" });
//     }
//   };

//   const goCheckout = async () => {
//     try {
//       // For non-logged in users, redirect to login page
//       if (!session) {
//         // Store the cart items in localStorage before redirecting
//         try {
//           const itemsToCheckout = LocalCart.items;
//           localStorage.setItem('checkout_items', JSON.stringify(itemsToCheckout));
//         } catch (error) {
//           console.error('Error storing checkout data in localStorage:', error);
//         }

//         // Redirect to login page
//         navigate.push("/login");
//         return;
//       }

//       // Continue with normal checkout flow for logged-in users
//       setError(null);
//       const itemsToCheckout = Cart.items;

//       var data: any = await checkoutCartItems(itemsToCheckout);
//       if (data?.eligibleItems?.length) {
//         dispatch(storeCheckout(data?.eligibleItems));

//         // Also store in localStorage for consistency
//         try {
//           localStorage.setItem('checkout_items', JSON.stringify(data?.eligibleItems));
//         } catch (error) {
//           console.error('Error storing checkout data in localStorage:', error);
//         }

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
//     <div className="Screen-box">
//       {contextHolder}
//       <br />
//       <Container fluid style={{ minHeight: "80vh" }}>
//         {cartItems?.length ? (
//           <div className="Cart-box">
//             <Row>
//               <Col sm={7}>
//                 <div
//                   className="Cart-row"
//                   style={{
//                     padding: 10,
//                     paddingBottom: 0,
//                     paddingRight: 0,
//                     paddingLeft: 0,
//                   }}
//                 >
//                   <div className="Cart-txt1">
//                     <span className="Cart-txt1Icon">
//                       <IoCartOutline />
//                     </span>
//                     CART - ( {cartItems.length} )
//                   </div>
//                   <div style={{ flex: 1 }} />
//                   <div>
//                     <Popconfirm
//                       placement="bottomRight"
//                       title={"Are you sure to clear all items in your cart?"}
//                       okText="Yes"
//                       cancelText="No"
//                       onConfirm={async () => clear()}
//                     >
//                       <div className="Cart-txt2" style={{ cursor: "pointer" }}>
//                         Remove All Products <IoCloseCircleOutline />
//                       </div>
//                     </Popconfirm>
//                   </div>
//                 </div>
//                 <div className="Cart-line" />
//                 <div>
//                   {cartItems.map((item: any, index: number) => (
//                     <CartItem
//                       key={index}
//                       data={item}
//                       Settings={Settings}
//                       updateQuantity={updateQuantity}
//                       removeItem={removeItem}
//                       loading={loading}
//                     />
//                   ))}
//                 </div>
//                 <br />
//                 <div className="Cart-txt8">
//                   The price and availability of items at German Standard Group  are
//                   subject to change. The Cart is a temporary place to store a
//                   list of your items and reflects each item's most recent price.
//                   Shopping Cart Learn more. Do you have a gift card or
//                   promotional code? We'll ask you to enter your claim code when
//                   it's time to pay.
//                 </div>
//                 <br />
//               </Col>
//               <Col sm={5}>
//                 <div className="Cart-box2">
//                   <SummaryCard
//                     Cart={{ ...Cart, items: cartItems }}
//                     checkout={() => goCheckout()}
//                     error={error}
//                   />
//                 </div>
//                 <br />
//               </Col>
//             </Row>
//           </div>
//         ) : (
//           <NoData
//             icon={<IoCartOutline size={70} color="#e6e6e6" />}
//             header="Cart is empty"
//             text1={`Your Cart is empty. Please start shopping at ${API.NAME} and place orders`}
//             button={"START SHOPPING NOW"}
//             onclick={() => {
//               navigate.push("/");
//             }}
//           />
//         )}
//         {products?.length ? (
//           <RecomendedItems
//             title={"Products You've Recently Visited"}
//             data={products}
//             type="visited"
//           />
//         ) : null}
//         <br />
//       </Container>
//     </div>
//   );
// }

// export default CartPage;

// "use client";
// import { notification, Popconfirm } from "antd";
// import React, { useEffect, useState } from "react";
// import { Col, Container, Row } from "react-bootstrap";
// import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
// import { DELETE, GET, PUT, POST } from "../../../util/apicall";
// import { useDispatch, useSelector } from "react-redux";
// import API from "../../../config/API";
// import { storeCart, clearCart } from "../../../redux/slice/cartSlice";
// import { useSession } from "next-auth/react";
// import "./styles.scss";
// import CartItem from "./_components/cartItem";
// import SummaryCard from "./_components/summaryCard";
// import NoData from "../../../components/noData";
// import RecomendedItems from "./_components/recommended";
// import { useRouter } from "next/navigation";
// import { clearCheckout, storeCheckout } from "../../../redux/slice/checkoutSlice";
// import { checkoutCartItems } from "./_components/checkoutFunction";
// import { clearLocalCart } from "../../../redux/slice/localcartSlice";

// function CartPage() {
//   const dispatch = useDispatch();
//   const { data: session } = useSession();
//   const Cart = useSelector((state: any) => state.Cart);
//   const LocalCart = useSelector((state: any) => state.LocalCart || { items: [] });
//   const Settings = useSelector((state: any) => state.Settings.Settings);
//   const [notificationApi, contextHolder] = notification.useNotification();
//   const [products, setProducts] = useState<any[]>([]);
//   const [error, setError] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useRouter();

//   const cartItems = session ? Cart.items : LocalCart.items;

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     loadData();
//     getRecommendations();
//     dispatch(clearCheckout());
//   }, [session]);

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
//         // If no local cart items, just use backend data
//         dispatch(storeCart(backendCart));
//         return;
//       }

//       // Merge local cart with backend cart
//       const mergedCart = [...backendCart];

//       for (const localItem of localCartItems) {
//         const existingItemIndex = mergedCart.findIndex(
//           (item) => item.productId === localItem.productId
//         );

//         if (existingItemIndex !== -1) {

//           mergedCart[existingItemIndex].quantity += localItem.quantity;
//           mergedCart[existingItemIndex].totalPrice =
//             mergedCart[existingItemIndex].price * mergedCart[existingItemIndex].quantity;
//         } else {

//           mergedCart.push(localItem);
//         }
//       }

//       for (const item of mergedCart) {
//         if (item.id) {

//           await PUT(API.CART + item.id, {
//             quantity: item.quantity,
//           });
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
//       notificationApi.success({ message: "Your products have been successfully added by the guest user to your account" });
//     } catch (err) {
//       console.error("Error merging cart:", err);
//       notificationApi.error({ message: "Failed to merge local cart with account" });
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
//           notificationApi.warning({
//             message: "No cart data from server, merging local cart",
//           });
//         }
//       } else {

//         try {
//           const localStorageCart = localStorage.getItem("cart_items");
//           if (localStorageCart) {
//             const parsedCart = JSON.parse(localStorageCart);
//             if (parsedCart.length > 0 && LocalCart.items.length === 0) {
//               dispatch(storeCart(parsedCart));
//             }
//           }
//         } catch (err) {
//           console.error("Error loading local cart:", err);
//         }
//       }
//     } catch (err) {
//       notificationApi.error({
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
//           notificationApi.success({ message: response?.message });
//           dispatch(clearCart());
//         } else {
//           notificationApi.error({ message: response?.message });
//         }
//       } else {
//         dispatch(clearLocalCart());
//         try {
//           localStorage.removeItem("cart_items");
//         } catch (err) {
//           console.error("Error clearing localStorage cart:", err);
//         }
//         // notificationApi.success({ message: "Cart cleared successfully" });
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Something went wrong." });
//     }
//   };

//   const updateQuantity = async (action: string, item: any) => {
//     try {
//       if (item?.unit <= item?.quantity && action === "add") {
//         notificationApi.error({
//           message:
//             item?.unit === 0
//               ? "Product is Out of Stock"
//               : `Only ${item?.unit} unit Left`,
//         });
//         return;
//       }

//       setLoading(true);

//       if (session) {
//         const cartItems: any = await PUT(API.CART + item?.id + `?action=${action}`, {});
//         if (cartItems.status) {
//           loadData();
//           notificationApi.success({ message: cartItems?.message });
//         } else {
//           notificationApi.error({ message: cartItems?.message ?? "" });
//         }
//       } else {
//         try {
//           const localStorageCart = localStorage.getItem("cart_items");
//           if (localStorageCart) {
//             let items = JSON.parse(localStorageCart);
//             const itemIndex = items.findIndex(
//               (cartItem: any) => cartItem.productId === item.productId
//             );

//             if (itemIndex !== -1) {
//               if (action === "add") {
//                 items[itemIndex].quantity += 1;
//                 items[itemIndex].totalPrice = items[itemIndex].price * items[itemIndex].quantity;
//               } else if (action === "remove" && items[itemIndex].quantity > 1) {
//                 items[itemIndex].quantity -= 1;
//                 items[itemIndex].totalPrice = items[itemIndex].price * items[itemIndex].quantity;
//               }
//               localStorage.setItem("cart_items", JSON.stringify(items));
//               dispatch(storeCart(items));
//               notificationApi.success({ message: "Cart updated successfully" });
//             }
//           }
//         } catch (err) {
//           console.error("Error updating localStorage cart:", err);
//         }
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Failed to Update cart" });
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
//           notificationApi.success({ message: "You have removed Product from cart" });
//         }
//       } else {
//         try {
//           const localStorageCart = localStorage.getItem("cart_items");
//           if (localStorageCart) {
//             let items = JSON.parse(localStorageCart);
//             const updatedItems = items.filter(
//               (cartItem: any) => cartItem.productId !== item.productId
//             );
//             localStorage.setItem("cart_items", JSON.stringify(updatedItems));
//             dispatch(storeCart(updatedItems));
//             notificationApi.success({ message: "You have removed Product from cart" });
//           }
//         } catch (err) {
//           console.error("Error removing item from localStorage cart:", err);
//         }
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Failed to Update cart" });
//     }
//   };

//   const goCheckout = async () => {
//     try {
//       if (!session) {
//         try {
//           const itemsToCheckout = LocalCart.items;
//           localStorage.setItem("checkout_items", JSON.stringify(itemsToCheckout));
//         } catch (error) {
//           console.error("Error storing checkout data in localStorage:", error);
//         }
//         navigate.push("/login");
//         return;
//       }

//       setError(null);
//       const itemsToCheckout = Cart.items;

//       var data: any = await checkoutCartItems(itemsToCheckout);
//       if (data?.eligibleItems?.length) {
//         dispatch(storeCheckout(data?.eligibleItems));
//         try {
//           localStorage.setItem("checkout_items", JSON.stringify(data?.eligibleItems));
//         } catch (error) {
//           console.error("Error storing checkout data in localStorage:", error);
//         }
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
//     <div className="Screen-box">
//       {contextHolder}
//       <br />
//       <Container fluid style={{ minHeight: "80vh" }}>
//         {cartItems?.length ? (
//           <div className="Cart-box">
//             <Row>
//               <Col sm={7}>
//                 <div
//                   className="Cart-row"
//                   style={{
//                     padding: 10,
//                     paddingBottom: 0,
//                     paddingRight: 0,
//                     paddingLeft: 0,
//                   }}
//                 >
//                   <div className="Cart-txt1">
//                     <span className="Cart-txt1Icon">
//                       <IoCartOutline />
//                     </span>
//                     CART - ( {cartItems.length} )
//                   </div>
//                   <div style={{ flex: 1 }} />
//                   <div>
//                     <Popconfirm
//                       placement="bottomRight"
//                       title={"Are you sure to clear all items in your cart?"}
//                       okText="Yes"
//                       cancelText="No"
//                       onConfirm={async () => clear()}
//                     >
//                       <div className="Cart-txt2" style={{ cursor: "pointer" }}>
//                         Remove All Products <IoCloseCircleOutline />
//                       </div>
//                     </Popconfirm>
//                   </div>
//                 </div>
//                 <div className="Cart-line" />
//                 <div>
//                   {cartItems.map((item: any, index: number) => (
//                     <CartItem
//                       key={index}
//                       data={item}
//                       Settings={Settings}
//                       updateQuantity={updateQuantity}
//                       removeItem={removeItem}
//                       loading={loading}
//                     />
//                   ))}
//                 </div>
//                 <br />
//                 <div className="Cart-txt8">
//                   The price and availability of items at German Standard Group  are
//                   subject to change. The Cart is a temporary place to store a
//                   list of your items and reflects each item's most recent price.
//                   Shopping Cart Learn more. Do you have a gift card or
//                   promotional code? We'll ask you to enter your claim code when
//                   it's time to pay.
//                 </div>
//                 <br />
//               </Col>
//               <Col sm={5}>
//                 <div className="Cart-box2">
//                   <SummaryCard
//                     Cart={{ ...Cart, items: cartItems }}
//                     checkout={() => goCheckout()}
//                     error={error}
//                   />
//                 </div>
//                 <br />
//               </Col>
//             </Row>
//           </div>
//         ) : (
//           <NoData
//             icon={<IoCartOutline size={70} color="#e6e6e6" />}
//             header="Cart is empty"
//             text1={`Your Cart is empty. Please start shopping at ${API.NAME} and place orders`}
//             button={"START SHOPPING NOW"}
//             onclick={() => {
//               navigate.push("/");
//             }}
//           />
//         )}
//         {products?.length ? (
//           <RecomendedItems
//             title={"Products You've Recently Visited"}
//             data={products}
//             type="visited"
//           />
//         ) : null}
//         <br />
//       </Container>
//     </div>
//   );
// }

// export default CartPage;

// "use client";
// import { notification, Popconfirm } from "antd";
// import React, { useEffect, useState } from "react";
// import { Col, Container, Row } from "react-bootstrap";
// import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
// import { DELETE, GET, PUT, POST } from "../../../util/apicall";
// import { useDispatch, useSelector } from "react-redux";
// import API from "../../../config/API";
// import { storeCart, clearCart } from "../../../redux/slice/cartSlice";
// import {
//   clearLocalCart,
//   increaseLocalCartQuantity,
//   decreaseLocalCartQuantity,
//   removeFromLocalCart,
// } from "../../../redux/slice/localcartSlice";
// import { useSession } from "next-auth/react";
// import "./styles.scss";
// import CartItem from "./_components/cartItem";
// import SummaryCard from "./_components/summaryCard";
// import NoData from "../../../components/noData";
// import RecomendedItems from "./_components/recommended";
// import { useRouter } from "next/navigation";
// import {
//   clearCheckout,
//   storeCheckout,
// } from "../../../redux/slice/checkoutSlice";
// import { checkoutCartItems } from "./_components/checkoutFunction";
// import HeaderBreadcrumbs from "./_components/headerBreadcrumbs";
// function CartPage() {
//   const dispatch = useDispatch();
//   const Cart = useSelector((state: any) => state.Cart);
//   const LocalCart = useSelector(
//     (state: any) => state.LocalCart || { items: [] }
//   );
//   const Settings = useSelector((state: any) => state.Settings.Settings);
//   const [notificationApi, contextHolder] = notification.useNotification();
//   const [products, setProducts] = useState<any[]>([]);
//   const [error, setError] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useRouter();
//   const { status, data: session } = useSession();

//   const cartItems = session ? Cart.items : LocalCart.items;

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     loadData();
//     getRecommendations();
//     dispatch(clearCheckout());
//   }, [session]);

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
//       notificationApi.success({
//         message:
//           "Your products have been successfully added by the guest user to your account",
//       });
//     } catch (err) {
//       console.error("Error merging cart:", err);
//       notificationApi.error({
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
//           notificationApi.warning({
//             message: "No cart data from server, merging local cart",
//           });
//         }
//       } else {
//         // No need to update LocalCart here; it’s already loaded from localStorage via LocalCartSlice
//       }
//     } catch (err) {
//       notificationApi.error({
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
//           notificationApi.success({ message: response?.message });
//           dispatch(clearCart());
//         } else {
//           notificationApi.error({ message: response?.message });
//         }
//       } else {
//         dispatch(clearLocalCart());
//         notificationApi.success({ message: "Cart cleared successfully" });
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Something went wrong." });
//     }
//   };

//   const updateQuantity = async (action: string, item: any) => {
//     try {
//       if (item?.unit <= item?.quantity && action === "add") {
//         notificationApi.error({
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
//           // notificationApi.success({ message: cartItems?.message });
//         } else {
//           notificationApi.error({ message: cartItems?.message ?? "" });
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
//         } else if (action === "reduce" && item.quantity == 1) {
//           dispatch(removeFromLocalCart(payload));
//         }
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Failed to Update cart" });
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
//           notificationApi.success({
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
//         // Notification is handled in LocalCartSlice
//       }
//     } catch (err) {
//       notificationApi.error({ message: "Failed to Update cart" });
//     }
//   };

//   const goCheckout = async () => {
//     try {
//       if (!session) {
//         try {
//           const itemsToCheckout = LocalCart.items;
//           localStorage.setItem(
//             "checkout_items",
//             JSON.stringify(itemsToCheckout)
//           );
//         } catch (error) {
//           console.error("Error storing checkout data in localStorage:", error);
//         }
//         navigate.push("/login");
//         return;
//       }

//       setError(null);
//       const itemsToCheckout = Cart.items;

//       var data: any = await checkoutCartItems(itemsToCheckout);
//       if (data?.eligibleItems?.length) {
//         dispatch(storeCheckout(data?.eligibleItems));
//         try {
//           localStorage.setItem(
//             "checkout_items",
//             JSON.stringify(data?.eligibleItems)
//           );
//         } catch (error) {
//           console.error("Error storing checkout data in localStorage:", error);
//         }
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
//     <>
//     <HeaderBreadcrumbs />
//     <div className="Screen-box">
//       {contextHolder}
//       <br />
//       <Container style={{ minHeight: "80vh" }}>
//         {cartItems?.length ? (
//           <div className="Cart-box">
//             <Row className="cart-row">
//               <Col xl={8} lg={12} >
//                 <div className="cart-items-container">
//                   <Row className="cart-header-row mb-3 d-none d-md-flex">
//                     <Col xs={2}></Col>
//                     <Col>
//                       <div className="column-header">PRODUCT</div>
//                     </Col>
//                     <Col>
//                       <div className="column-header">PRICE</div>
//                     </Col>
//                     <Col>
//                       <div className="column-header">QUANTITY</div>
//                     </Col>
//                     <Col>
//                       <div className="column-header">SUBTOTAL</div>
//                     </Col>
//                   </Row>

//                   {/* Cart Items */}
//                   <div className="cart-items-list">
//                     {cartItems.map((item: any, index: number) => (
//                       <CartItem
//                         key={index}
//                         data={item}
//                         Settings={Settings}
//                         updateQuantity={updateQuantity}
//                         removeItem={removeItem}
//                         loading={loading}
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 <br />
//                 <br />
//                 <div>
//                   <div className="container">
//                     <div className="d-flex flex-wrap align-items-center gap-3 coupon-container">
//                       <input
//                         type="text"
//                         className="coupon-input"
//                         placeholder="Coupon code"
//                       />
//                       <button className="btn btn-apply">APPLY COUPON</button>
//                       <div className="ms-auto">
//                         <button className="btn btn-update">UPDATE CART</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Col>
//               <Col xl={4} lg={12} className="cart-summary-col" >
//                 <div className="Cart-box2">
//                   <SummaryCard
//                     Cart={{ ...Cart, items: cartItems }}
//                     checkout={() => goCheckout()}
//                     error={error}
//                   />
//                 </div>
//                 <br />
//               </Col>
//             </Row>
//           </div>
//         ) : (
//           <NoData
//             icon={<IoCartOutline size={70} color="#e6e6e6" />}
//             header="Cart is empty"
//             text1={`Your Cart is empty. Please start shopping at ${API.NAME} and place orders`}
//             button={"START SHOPPING NOW"}
//             onclick={() => {
//               navigate.push("/");
//             }}
//           />
//         )}
//         {products?.length ? (
//           <RecomendedItems
//             title={"Products You've Recently Visited"}
//             data={products}
//             type="visited"
//           />
//         ) : null}
//         <br />
//       </Container>
//     </div>
//     </>
//   );
// }

// export default CartPage;

"use client";
import { notification, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IoCartOutline, IoCloseCircleOutline } from "react-icons/io5";
import { DELETE, GET, PUT, POST } from "../../../util/apicall";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../config/API";
import { storeCart, clearCart } from "../../../redux/slice/cartSlice";
import {
  clearLocalCart,
  increaseLocalCartQuantity,
  decreaseLocalCartQuantity,
  removeFromLocalCart,
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
import { germanStandardApi } from "@/services/germanStandardApi";

function CartPage() {
  const dispatch = useDispatch();
  const Cart = useSelector((state: any) => state.Cart);
  const LocalCart = useSelector(
    (state: any) => state.LocalCart || { items: [] }
  );
  const Settings = useSelector((state: any) => state.Settings.Settings);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // New state for quantity updates
  const navigate = useRouter();
  const { status, data: session } = useSession();

  const cartItems = session ? Cart.items : LocalCart.items;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
    // getRecommendations();
    dispatch(clearCheckout());
  }, [session]);

  // const getRecommendations = async () => {
  //   try {
  //     if (session) {
  //       const url = API.USER_HISTORY;
  //       const response: any = await GET(url);
  //       if (response.status) {
  //         setProducts(response.data);
  //       } else {
  //         setProducts([]);
  //       }
  //     } else {
  //       setProducts([]);
  //     }
  //   } catch (err) {
  //     console.log("No recommendations", err);
  //     setProducts([]);
  //   }
  // };

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

      // Use German Standard API for cart operations
      for (const item of mergedCart) {
        try {
          const cartRequest = {
            transId: item.id || 0, // 0 for new cart item
            date: new Date().toISOString().split('T')[0], // yyyy-MM-dd format
            customer: 1, // You may need to get this from session
            warehouse: 1, // Default warehouse
            product: item.productId,
            qty: item.quantity,
            rate: item.price || 0,
            unit: 1, // Default unit
            totalRate: (item.price || 0) * item.quantity,
            be: 1 // Business Entity
          };
          
          await germanStandardApi.upsertCart(cartRequest);
        } catch (error) {
          console.error("Error updating cart item:", error);
        }
      }

      dispatch(storeCart(mergedCart));
      dispatch(clearLocalCart());
      localStorage.removeItem("cart_items");
      notificationApi.success({
        message:
          "Your products have been successfully added by the guest user to your account",
      });
    } catch (err) {
      console.error("Error merging cart:", err);
      notificationApi.error({
        message: "Failed to merge local cart with account",
      });
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      if (session) {
        // Try German Standard API first
        try {
          const cartSummary = await germanStandardApi.getCartSummary(1, true, 1, 100);
          if (cartSummary.transactions && cartSummary.transactions.length > 0) {
            // Transform German Standard cart data to match existing format
            const transformedCart:any = cartSummary.transactions.map((item: any) => ({
              id: item.TransId,
              productId: item.productId || item.product,
              quantity: item.qty || item.quantity,
              price: item.rate || item.price,
              totalPrice: (item.rate || item.price) * (item.qty || item.quantity),
              name: item.productName || `Product ${item.productId || item.product}`,
              image: item.image || "/images/no-image.jpg",
              unit: item.stock || 999 // Default stock
            }));
            dispatch(storeCart(transformedCart));
            setLoading(false);
            return;
          }
        } catch (gsError) {
          console.log("German Standard API failed, falling back to legacy API:", gsError);
        }

        // Use German Standard API for cart data
        try {
          const cartSummary = await germanStandardApi.getCartSummary(1, true, 1, 100);
          if (cartSummary.transactions && cartSummary.transactions.length > 0) {
            // Transform German Standard cart data to match existing format
            const transformedCart = cartSummary.transactions.map((item: any) => ({
              id: item.TransId,
              productId: item.productId || 1, // You may need to get this from transaction details
              quantity: item.qty || 1,
              price: item.rate || 0,
              totalPrice: item.totalRate || 0,
              // Add other required fields as needed
            }));
            await mergeLocalCartWithBackend(transformedCart);
          } else {
            await mergeLocalCartWithBackend([]);
          }
        } catch (error) {
          console.error("Error fetching cart from German Standard API:", error);
          await mergeLocalCartWithBackend([]);
        }
      } else {
        // For guest users, just show local cart
        setLoading(false);
      }
    } catch (err) {
      console.error("Cart load error:", err);
      notificationApi.error({
        message: "Something went wrong. Showing cached cart data.",
      });
      if (session) {
        await mergeLocalCartWithBackend(Cart.items || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // const loadData = async () => {
  //   try {
  //     setLoading(true);
  //     if (session) {
  //       const cartItemsResponse: any = await GET(API.CART_GET_ALL);
  //       if (cartItemsResponse.status) {
  //         const backendCart = cartItemsResponse.data || [];
  //         await mergeLocalCartWithBackend(backendCart);
  //       } else {
  //         await mergeLocalCartWithBackend([]);
  //         notificationApi.warning({
  //           message: "No cart data from server, merging local cart",
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     notificationApi.error({
  //       message: "Something went wrong. Showing cached cart data.",
  //     });
  //     if (session) {
  //       await mergeLocalCartWithBackend(Cart.items || []);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const clear = async () => {
  //   try {
  //     if (session) {
  //       const response: any = await DELETE(API.CART_CLEAR_ALL);
  //       if (response?.status) {
  //         notificationApi.success({ message: response?.message });
  //         dispatch(clearCart());
  //       } else {
  //         notificationApi.error({ message: response?.message });
  //       }
  //     } else {
  //       dispatch(clearLocalCart());
  //       notificationApi.success({ message: "Cart cleared successfully" });
  //     }
  //   } catch (err) {
  //     notificationApi.error({ message: "Something went wrong." });
  //   }
  // };

  // FIXED: Optimistic update function
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
        // OPTIMISTIC UPDATE: Update Redux store immediately
        const newQuantity = action === "add" ? item.quantity + 1 : item.quantity - 1;
        
        // Don't allow quantity to go below 1
        if (newQuantity < 1) {
          setIsUpdating(false);
          return;
        }

        const updatedItems = Cart.items.map((cartItem: any) => {
          if (cartItem.id === item.id) {
            return {
              ...cartItem,
              quantity: newQuantity,
              totalPrice: cartItem.price * newQuantity
            };
          }
          return cartItem;
        });

        // Update Redux store immediately for instant UI feedback
        dispatch(storeCart(updatedItems));

        // Background API call
        try {
          const cartRequest = {
            transId: item.id || 0,
            date: new Date().toISOString().split('T')[0],
            customer: 1, // You may need to get this from session
            warehouse: 1,
            product: item.productId,
            qty: newQuantity,
            rate: item.price || 0,
            unit: 1,
            totalRate: (item.price || 0) * newQuantity,
            be: 1
          };
          
          await germanStandardApi.upsertCart(cartRequest);
          // German Standard API doesn't return status in the same way, so we assume success
          // Note: We don't call loadData() here anymore for better performance
        } catch (apiError) {
          // Revert optimistic update if API call failed
          dispatch(storeCart(Cart.items));
          notificationApi.error({ message: "Failed to update cart" });
        }

        // try {
        //   const cartResponse: any = await PUT(
        //     API.CART + item?.id + `?action=${action}`,
        //     {}
        //   );
          
        //   if (!cartResponse.status) {
        //     // Revert optimistic update if API failed
        //     dispatch(storeCart(Cart.items));
        //     notificationApi.error({ message: cartResponse?.message ?? "Failed to update quantity" });
        //   }
        //   // Note: We don't call loadData() here anymore for better performance
        // } catch (apiError) {
        //   // Revert optimistic update if API call failed
        //   dispatch(storeCart(Cart.items));
        //   notificationApi.error({ message: "Failed to update cart" });
        // }

      } else {
        // For guest users - direct Redux actions
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
            dispatch(removeFromLocalCart(payload));
          }
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
      if (session) {
        // Optimistic removal
        const updatedItems = Cart.items.filter((cartItem: any) => cartItem.id !== id);
        dispatch(storeCart(updatedItems));

        // const url = API.CART + id;
        // const cartResponse: any = await DELETE(url);
        
        // if (cartResponse.status) {
        //   notificationApi.success({
        //     message: "You have removed Product from cart",
        //   });
        // } else {
        //   // Revert optimistic update if API failed
        //   await loadData();
        //   notificationApi.error({ message: "Failed to remove item" });
        // }
      } else {
        dispatch(
          removeFromLocalCart({
            productId: item.productId,
            variantId: item.variantId || null,
          })
        );
      }
    } catch (err) {
      notificationApi.error({ message: "Failed to Update cart" });
      // Revert optimistic update if there was an error
      if (session) {
        await loadData();
      }
    }
  };

  const goCheckout = async () => {
    try {
      if (!session) {
        try {
          const itemsToCheckout = LocalCart.items;
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
      const itemsToCheckout = Cart.items;

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
      console.log("err", err);
    }
  };

  // Add item to cart using German Standard API
  const addToCartGS = async (productId: number, quantity: number, price: number) => {
    try {
      const cartRequest = {
        transId: 0, // New cart item
        date: new Date().toISOString().split('T')[0], // Today's date
        customer: (session?.user as any)?.id || 1, // User ID
        warehouse: 1, // Default warehouse
        product: productId,
        qty: quantity,
        rate: price,
        unit: 1, // Default unit
        totalRate: price * quantity,
        be: 1 // Business Entity
      };

      const response = await germanStandardApi.upsertCart(cartRequest);
      console.log("Item added to cart via German Standard API:", response.result);
      return response.result;
    } catch (error) {
      console.error("Failed to add to cart via German Standard API:", error);
      throw error;
    }
  };

  return (
    <>
    <HeaderBreadcrumbs />
    <div className="Screen-box">
      {contextHolder}
      <br />
      <Container style={{ minHeight: "80vh" }}>
        {cartItems?.length ? (
          <div className="Cart-box">
            <Row className="cart-row">
              <Col xl={8} lg={12} >
                <div className="cart-items-container">
                  <Row className="cart-header-row mb-3 d-none d-md-flex">
                    <Col xs={2}></Col>
                    <Col>
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
                        key={`${item.id || item.productId}-${item.variantId || 'default'}`} // Better key
                        data={item}
                        Settings={Settings}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                        loading={isUpdating} // Use isUpdating instead of loading
                      />
                    ))}
                  </div>
                </div>
                <br />
                <br />
                <div>
                  <div className="container">
                    <div className="d-flex flex-wrap align-items-center gap-3 coupon-container">
                      <input
                        type="text"
                        className="coupon-input"
                        placeholder="Coupon code"
                      />
                      <button className="btn btn-apply">APPLY COUPON</button>
                      <div className="ms-auto">
                        <button className="btn btn-update">UPDATE CART</button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={4} lg={12} className="cart-summary-col" >
                <div className="Cart-box2">
                  <SummaryCard
                    Cart={{ ...Cart, items: cartItems }}
                    checkout={() => goCheckout()}
                    error={error}
                  />
                </div>
                <br />
              </Col>
            </Row>
          </div>
        ) : (
          <NoData
            icon={<IoCartOutline size={70} color="#e6e6e6" />}
            header="Cart is empty"
            text1={`Your Cart is empty. Please start shopping at ${API.NAME} and place orders`}
            button={"START SHOPPING NOW"}
            onclick={() => {
              navigate.push("/");
            }}
          />
        )}
        {products?.length ? (
          <RecomendedItems
            title={"Products You've Recently Visited"}
            data={products}
            type="visited"
          />
        ) : null}
        <br />
      </Container>
    </div>
    </>
  );
}

export default CartPage;
