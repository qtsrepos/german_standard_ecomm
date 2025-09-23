"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import { useSelector, useDispatch } from "react-redux";
import { VscError } from "react-icons/vsc";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Avatar, Button, List, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { clearCheckout } from "@/redux/slice/checkoutSlice";
import { clearLocalCart } from "@/redux/slice/localcartSlice";
import { GET, POST } from "@/util/apicall";
import API from "@/config/API";
import { germanStandardApi } from "@/services/germanStandardApi";
// Removed legacy cartSlice import
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import { useSession } from "next-auth/react";
import P from "../../products/view/page";
import OrderItems from "./components/orderDetails";
const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;
function Checkout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const Checkout = useSelector((state: any) => state?.Checkout?.order);
  const Settings = useAppSelector(reduxSettings);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [paymentStatus, setPaymentStatus] = useState<any>();
  const [orderStatus, setOrderStatus] = useState<any>();
  const [Notifications, contextHolder] = notification.useNotification();
  //   const User = useSelector((state: any) => state.User.user);
  const { data: user, status: sessionStatus }: any = useSession();
  const User = user?.user;
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [responseData, setResponseData] = useState<any>({});
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Wait for session to load before processing order
    if (sessionStatus === 'loading') {
      console.log('⏳ Session still loading, waiting...');
      return;
    }
    PlaceOrder();
  }, [sessionStatus]);

  const getOrderItems = (response: any[]) => {
    const array: any[] = [];
    if (Array.isArray(response)) {
      response.forEach((items: any) => {
        if (Array.isArray(items?.orderItems)) {
          items?.orderItems.forEach((item2: any) => {
            array.push(item2);
          });
        }
      });
    }
    setOrderItems(array);
  };

  // Fetch transaction details from German Standard API
  const fetchTransactionDetails = async (transactionId: string) => {
    try {
      console.log("🔍 Fetching transaction details for ID:", transactionId);
      console.log("🔍 Session status:", sessionStatus);
      console.log("🔍 User data:", user);

      if (!transactionId || transactionId === "undefined") {
        throw new Error("Invalid transaction ID");
      }

      // Check if user is authenticated
      if (sessionStatus === 'unauthenticated') {
        console.log("❌ User is not authenticated, redirecting to login");
        Notifications["warning"]({
          message: "Authentication Required",
          description: "Please log in to view order details.",
          duration: 5,
        });
        // Optionally redirect to login page
        // router.push('/login');
        return null;
      }

      if (!user?.token && !user?.accessToken) {
        console.log("❌ Access token not available");
        console.log("🔍 Available user properties:", Object.keys(user || {}));
        Notifications["warning"]({
          message: "Authentication Issue",
          description: "Unable to authenticate. Please refresh the page or log in again.",
          duration: 5,
        });
        return null;
      }

      // Try different token locations based on session structure
      const accessToken = user?.token || user?.accessToken;

      const response = await fetch(`${API.GERMAN_STANDARD_TRANSACTION_DETAILS}?id=${transactionId}&docType=1&be=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📋 Transaction details response:", data);
      console.log("📋 Response status:", data.status);
      console.log("📋 Response result:", data.result);

      if (data.status === "Success" && data.result) {
        console.log("✅ API call successful, parsing result...");
        try {
          // Parse the nested JSON in result field
          const parsedResult = JSON.parse(data.result);
          console.log("✅ Parsed transaction data:", parsedResult);

          setTransactionData(data);
          setOrderDetails(parsedResult);

          // Convert body items to orderItems format
          if (parsedResult.Body && Array.isArray(parsedResult.Body)) {
            const convertedOrderItems = parsedResult.Body.map((item: any, index: number) => ({
              id: `${transactionId}-${index}`,
              productId: item.Product,
              name: item.Product_Name,
              quantity: item.Quantity,
              price: item.Rate,
              totalPrice: item.Quantity * item.Rate,
              unit: item.Unit,
              unit_name: item.Unit_Name,
              vat: item.Vat,
              discount: item.Discount,
              discountAmount: item.DiscountAmt,
              addcharges: item.Addcharges
            }));

            setOrderItems(convertedOrderItems);
            console.log("✅ Order items converted:", convertedOrderItems);
          }

          return parsedResult;
        } catch (parseError) {
          console.error("❌ Error parsing API response JSON:", parseError);
          console.error("❌ Raw result data:", data.result);
          throw new Error("Failed to parse transaction details response");
        }
      } else {
        console.log("❌ API response not successful:", data);
        throw new Error(data.message || "Failed to fetch transaction details");
      }
    } catch (error: any) {
      console.error("❌ Error fetching transaction details:", error);
      Notifications["error"]({
        message: "Failed to Load Order Details",
        description: error.message || "Unable to fetch order details. Please try again.",
        duration: 5,
      });
      throw error; // Re-throw to allow calling code to handle it
    }
  };

  // const checkCart = async () => {
  //   try {
  //     if (User) {
  //       const cartItems: any = await GET(API.CART_GET_ALL);
  //       console.log('this is the cart data', cartItems)
  //       if (cartItems.status) {
  //         dispatch(storeCart(cartItems.data));

  const PlaceOrder = async () => {
    try {
      console.log("🚀 Starting German Standard order creation process");

      // Check if we have an order ID from cart drawer (URL parameter)
      const orderId = Array.isArray(params?.id) ? params.id[0] : params?.id;
      console.log("📋 URL Order ID:", orderId);

      // If we have an order ID from URL, we're coming from cart drawer - skip duplicate order creation
      if (orderId && orderId !== "undefined") {
        console.log("✅ Order already created via cart drawer, showing success page for order:", orderId);

        // Clear checkout data to prevent future conflicts
        dispatch(clearCheckout());

        // Clear the cart since the order was successful
        dispatch(clearLocalCart());

        // Set success state directly
        setOrderStatus(true);
        setPaymentStatus(true);

        try {
          // Fetch real transaction details from API
          await fetchTransactionDetails(orderId);
          console.log("✅ Transaction details fetched successfully");
        } catch (error) {
          console.error("❌ Error fetching transaction details:", error);
          // Continue with basic order display even if API fails
        }

        Notifications["success"]({
          message: "Order Placed Successfully!",
          description: `Your order has been created with ID: ${orderId}. Cart has been cleared.`,
          duration: 5,
        });

        setIsLoading(false);
        return;
      }

      if (!Checkout?.cart?.length) {
        throw new Error("No items in cart");
      }

      // Get payment method info
      const paymentMethod = Checkout?.payment || "Cash On Delivery";
      const paymentRef = searchParams.get("ref");

      console.log("📋 Order details:", {
        cartItems: Checkout.cart.length,
        paymentMethod,
        paymentRef,
        hasAddress: !!Checkout?.address
      });

      // Convert cart to German Standard order format
      const orderRequest = germanStandardApi.convertCartToGermanStandardOrder(
        Checkout.cart,
        Checkout.address,
        User, // Use User instead of user to avoid type issues
        paymentMethod
      );

      console.log("🔄 Submitting order to German Standard API...");

      // Create order using German Standard API
      const response = await germanStandardApi.upsertOrder(orderRequest);

      console.log("📋 German Standard order response:", response);

      if (response?.success === true && response?.result) {
        console.log("✅ Order created successfully with ID:", response.result);

        // Clear checkout data
        dispatch(clearCheckout());

        // Clear the cart since the order was successful
        dispatch(clearLocalCart());

        setPaymentStatus(true);

        try {
          // Fetch real transaction details from API
          await fetchTransactionDetails(String(response.result) as string);
        } catch (error) {
          console.error("Error fetching transaction details:", error);
          // Continue with basic order display even if API fails
        }

        setOrderStatus(true);

        // Show success notification with special handling for Focus system warnings
        if (response.message && response.message.includes("failed Posting to Focus")) {
          Notifications["warning"]({
            message: "Order Created with Warning",
            description: "Your order was created successfully but there was an issue with the external system integration. Your order is safe and will be processed.",
            duration: 8,
          });
        } else {
          Notifications["success"]({
            message: "Order Placed Successfully!",
            description: `Your order has been created with ID: ${response.result}. Cart has been cleared.`,
            duration: 5,
          });
        }

      } else {
        throw new Error("Invalid response from order API");
      }

    } catch (error: any) {
      console.error("❌ Order creation failed:", error);

      setOrderStatus(false);
      setPaymentStatus(false);

      Notifications["error"]({
        message: "Order Creation Failed",
        description: error.message || "An unexpected error occurred while creating your order. Please try again.",
        duration: 8,
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log("dfghjk", Checkout);

  // const loadCartItems = async () => {
  //   try {
  //     if (User?.data?.id) {
  //       const cartItems: any = await GET(API.CART_GET_ALL);
  //       if (cartItems.status) {
  //         dispatch(storeCart(cartItems.data));
  //         return;
  //       } else {
  //       }
  //     }
  //   } catch (err) {
  //     return;
  //   }
  // };

  return (
    <div className="Screen-box px-md-5">
      {contextHolder}
      <br />
      <Container className="px-md-5">
        {isLoading ? (
          <div className="checkout-box">
            <div className="checkout-txt1">Your Order Processing</div>
            <div className="checkout-txt2">Please do not click back button</div>
            <br />
            <Spin indicator={antIcon} />
          </div>
        ) : paymentStatus ? (
          orderStatus ? (
            <div className="px-lg-5">
              <div>
                <p className="thank-you">Thank you. Your order has been received.</p>
                {(() => { console.log("🔄 Rendering order success page with orderDetails:", orderDetails); return null; })()}
              </div>
              <Row className="text-center mt-4  pt-4">
                <Col md={12} lg className="border-end border-lg-none">
                  <div className="text-muted ">Order number:</div>
                  <div className="fw-bold">{orderDetails?.Header?.[0]?.DocNo || params?.id || 'N/A'}</div>
                </Col>
                <Col md={12}  lg className="border-end border-lg-none">
                  <div className="text-muted">Date:</div>
                  <div className="fw-bold">
                    {orderDetails?.Header?.[0]?.Date
                      ? (() => {
                          try {
                            return new Date(orderDetails.Header[0].Date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            });
                          } catch (error) {
                            console.error('Date parsing error:', error);
                            return 'Invalid Date';
                          }
                        })()
                      : new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                    }
                  </div>
                </Col>
                <Col md={12} lg  className="border-end border-lg-none">
                  <div className="text-muted">Email:</div>
                  <div className="fw-bold">{user?.user?.email || 'N/A'}</div>
                </Col>
                <Col md={12} lg  className="border-end border-lg-none">
                  <div className="text-muted">Total:</div>
                  <div className="fw-bold">
                    {(() => {
                      if (orderDetails?.Body && Array.isArray(orderDetails.Body)) {
                        let apiTotal = 0;
                        orderDetails.Body.forEach((item: any) => {
                          const subtotal = (item.Quantity || 0) * (item.Rate || 0);
                          const vat = subtotal * ((item.Vat || 0) / 100);
                          const addCharges = item.Addcharges || 0;
                          const discount = item.DiscountAmt || 0;
                          apiTotal += subtotal + vat + addCharges - discount;
                        });
                        console.log('Main page API total:', apiTotal.toFixed(2));
                        return `${apiTotal.toFixed(2)} AED`;
                      } else {
                        const total = (orderItems || []).reduce((sum, item) => sum + (item.totalPrice || 0), 0);
                        return `${total.toFixed(2)} AED`;
                      }
                    })()}
                  </div>
                </Col>
                <Col md={12} lg>
                  <div className="text-muted">Payment method:</div>
                  <div className="fw-bold">Cash on delivery</div>
                </Col>
              </Row>

              <p className="text-muted mt-3">
                Pay with cash upon delivery.
              </p>

              <OrderItems orderItems={orderItems} address={Checkout.address} orderDetails={orderDetails} />
            </div>

            //         <div>
            //           <IoIosCheckmarkCircleOutline size={60} color="#15ad4c" />
            //         </div>
            //         <div className="checkout-txt2" style={{ color: "#15ad4c" }}>
            //           Thank You
            //         </div>
            //         <div className="checkout-txt1">
            //           Your Order is Placed Successfully
            //         </div>
            //         <div className="checkout-txt2">
            //           We will be send you an email confirmation to your
            //           registered email shortly
            //         </div>
            //         <br />
            //         <br />
            //         <Button
            //           type="link"
            //           onClick={() => router.replace("/user/orders")}
            //         >
            //           View my Orders.
            //         </Button>
            //       </div>
            //     </div>
            //     <br />
            //   </Col>
            //   <Col sm={4} xs={12}>
            //     <div className="checkout-box3">
            //       <div>
            //         <div>
            //           <div className="checkout-txt3">
            //             <div>Order Status : </div>
            //             <div style={{ color: "orange" }}>
            //               {responseData?.[0]?.orderPayment?.status}
            //             </div>
            //           </div>
            //         </div>
            //       </div>
            //       <div>
            //         <div className="checkout-txt3">DELIVERY ADDRESS</div>

            //         <div className="checkout-txt4">
            //           {responseData?.[0]?.address?.fullAddress ?? ""},
            //           {responseData?.[0]?.address?.pin_code ?? ""},
            //           {responseData?.[0]?.address?.state ?? ""},
            //           {responseData?.[0]?.address?.street ?? ""},<br />
            //           {responseData?.[0]?.address?.alt_phone ?? ""}
            //         </div>
            //       </div>
            //       <div>
            //         <div className="checkout-txt3">PAYMENT DETAILS</div>
            //         <div className="checkout-txt4">
            //           Payment Type:{" "}
            //           {responseData?.[0]?.orderPayment?.paymentType ?? ""}{" "} <br />
            //           Amount: {Settings?.currency}{" "}
            //           {responseData?.[0]?.orderPayment?.amount ?? ""}
            //         </div>
            //       </div>
            //       <div className="checkout-txt3">ORDER SUMMARY</div>
            //       <div style={{ margin: 10 }}>
            //         <List
            //           itemLayout="horizontal"
            //           dataSource={orderItems}
            //           renderItem={(item, index) => (
            //             <List.Item key={index}>
            //               <List.Item.Meta
            //                 avatar={
            //                   <Avatar
            //                     src={item?.image}
            //                     size={40}
            //                     shape="square"
            //                   />
            //                 }
            //                 title={item?.name ?? ""}
            //                 description={<div>Total: {item?.totalPrice}</div>}
            //               />
            //             </List.Item>
            //           )}
            //         />
            //         <br />
            //         <div className="checkout-row">
            //           <div>Total Product Price</div>
            //           <div>
            //             {Settings?.currency}{" "}
            //             {Number(responseData?.[0]?.newOrder?.total).toFixed(2)}
            //           </div>
            //         </div>
            //         <div className="checkout-row">
            //           <div>Discount</div>
            //           <div>
            //             {Settings?.currency}{" "}
            //             {Number(responseData?.[0]?.newOrder?.discount).toFixed(
            //               2
            //             )}
            //           </div>
            //         </div>
            //         <div className="checkout-row">
            //           <div>Tax</div>
            //           <div>
            //             {Settings?.currency}{" "}
            //             {Number(responseData?.[0]?.newOrder?.tax).toFixed(2)}
            //           </div>
            //         </div>
            //         <div className="checkout-row">
            //           <div>Delivery Charges</div>
            //           <div>
            //             {Settings?.currency}{" "}
            //             {Number(
            //               responseData?.[0]?.newOrder?.deliveryCharge
            //             ).toFixed(2)}
            //           </div>
            //         </div>
            //         <hr />
            //         <div className="checkout-row">
            //           <div>Total</div>
            //           <div>
            //             {Settings?.currency}{" "}
            //             {Number(
            //               responseData?.[0]?.newOrder?.grandTotal
            //             ).toFixed(2)}
            //           </div>
            //         </div>
            //       </div>
            //     </div>
            //   </Col>
            // </Row>
          ) : (
            <div className="checkout-box4">
              <div className="checkout-txt1">Order Failed.</div>
              <div className="checkout-txt2">
                We are unable to complete your order. Please try again
              </div>
              <div className="checkout-txt2" style={{ color: "red" }}>
                Any Amount debited from your account will be refunded within 24
                hours
              </div>
              <br />
              <VscError size={50} color="red" />
              <br />
              <Button onClick={() => router.replace("/cart")}>GO BACK</Button>
            </div>
          )
        ) : (
          <div className="checkout-box4">
            <div className="checkout-txt1">Payment Faild.</div>
            <div className="checkout-txt2">
              We are unable to complete your order due to payment failure.
              Please try again
            </div>
            <div className="checkout-txt2" style={{ color: "red" }}>
              Any Amount debited from your account will be refunded within 24
              hours
            </div>
            <br />
            <VscError size={50} color="red" />
            <br />
            <Button onClick={() => router.replace("/cart")}>GO BACK</Button>
          </div>
        )}
      </Container>

      <br />
      <br />
    </div>
  );
}
export default Checkout;
