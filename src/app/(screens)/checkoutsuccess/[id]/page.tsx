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
import { GET, POST } from "@/util/apicall";
import API from "@/config/API";
import { storeCart } from "@/redux/slice/cartSlice";
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
  const Checkout = useSelector((state: any) => state?.Checkout?.order);
  const Settings = useAppSelector(reduxSettings);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [paymentStatus, setPaymentStatus] = useState<any>();
  const [orderStatus, setOrderStatus] = useState<any>();
  const [Notifications, contextHolder] = notification.useNotification();
  //   const User = useSelector((state: any) => state.User.user);
  const { data: user }: any = useSession();
  const User = user?.user;
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [responseData, setResponseData] = useState<any>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    PlaceOrder();
  }, []);

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

  const checkCart = async () => {
    try {
      if (User) {
        const cartItems: any = await GET(API.CART_GET_ALL);
        console.log('this is the cart data', cartItems)
        if (cartItems.status) {
          dispatch(storeCart(cartItems.data));
          return;
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const PlaceOrder = async () => {
    try {
      let obj: any = {
        payment: {
          ref: searchParams.get("ref") ?? null,
          type: Checkout?.payment,
        },
        cart: Checkout?.cart,
        address: Checkout?.address,
        charges: Checkout?.charges,
      };
      if (Checkout?.cart?.length) {
        const response: any = await POST(API.ORDER, obj);
        if (response?.status) {
          getOrderItems(response?.data);
          setOrderStatus(true);
          // if (response?.data?.[0]?.newOrder?.status != "failed") {
          //   setOrderStatus(true);
          // } else {
          //   setOrderStatus(false);
          // }
          setResponseData(response?.data);

          dispatch(clearCheckout());
          loadCartItems();
          setPaymentStatus(true);
        } else {
          Notifications["error"]({
            message: response?.message ?? "",
            description: "",
          });
          setPaymentStatus(true);
          setOrderStatus(false);
        }
        setIsLoading(false);
      } else {
        router.push("/user/orders");
      }
    } catch (err) {
      setPaymentStatus(true);
      setOrderStatus(false);
      setIsLoading(false);

      Notifications["error"]({
        message: "oops Something went wrong..",
        description: "",
      });
    } finally {
      checkCart()
      // window.history.replaceState({}, "", "/profile/orders");
    }
  };
  console.log("dfghjk", Checkout);

  const loadCartItems = async () => {
    try {
      if (User?.data?.id) {
        const cartItems: any = await GET(API.CART_GET_ALL);
        if (cartItems.status) {
          dispatch(storeCart(cartItems.data));
          return;
        } else {
        }
      }
    } catch (err) {
      return;
    }
  };

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
              </div>
              <Row className="text-center mt-4  pt-4">
                <Col md={12} lg className="border-end border-lg-none">
                  <div className="text-muted ">Order number:</div>
                  <div className="fw-bold">98285</div>
                </Col>
                <Col md={12}  lg className="border-end border-lg-none">
                  <div className="text-muted">Date:</div>
                  <div className="fw-bold">May 9, 2025</div>
                </Col>
                <Col md={12} lg  className="border-end border-lg-none">
                  <div className="text-muted">Email:</div>
                  <div className="fw-bold">francis@gsgroup.co</div>
                </Col>
                <Col md={12} lg  className="border-end border-lg-none">
                  <div className="text-muted">Total:</div>
                  <div className="fw-bold">3,236.15 AED</div>
                </Col>
                <Col md={12} lg>
                  <div className="text-muted">Payment method:</div>
                  <div className="fw-bold">Cash on delivery</div>
                </Col>
              </Row>

              <p className="text-muted mt-3">
                Pay with cash upon delivery.
              </p>

              <OrderItems orderItems={orderItems} address ={Checkout.address}/>
            </div>

            // <Row>
            //   <Col sm={8} xs={12}>
            //     <div className="checkout-box2">
            //       <div>
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
