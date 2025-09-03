"use client";
import React, { useEffect, useState } from "react";
import "../../(user)/cart/styles.scss";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";

import AddressBox from "./_components/addressBox";
import PaymentBox from "./_components/paymentBox";
import SummaryCard from "./_components/summaryCard";

import NotDeliverableModal from "./_components/notDeliverable";
import { useRouter } from "next/navigation";
import { GET, POST } from "@/util/apicall";
import API from "@/config/API";
import useToggle from "@/shared/hook/useToggle";
import { storeFinal } from "@/redux/slice/checkoutSlice";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/redux/hooks";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import { storeCart } from "@/redux/slice/cartSlice";
import HeaderBreadcrumbs from "@/app/(user)/cart/_components/headerBreadcrumbs";
function Checkout() {
  const dispatch = useDispatch();
  const navigation = useRouter();
  const { user }: any = useSession();
  const Checkout = useSelector((state: any) => state?.Checkout);
  const Settings = useAppSelector(reduxSettings);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [payment_method, setPayment_method] = useState<any>("Cash On Delivery");
  const [isLoading, setIsLoading] = useState<any>(false);
  const [deliveryToken, setDeliveryToken] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const User = useSession();
  const [total, setTotal] = useState<any>(0);
  const [delivery_charge, setDelivery_charge] = useState<any>(0);
  const [discount, setDiscount] = useState(0);
  const [grand_total, setGrand_total] = useState<any>(0);
  const [openModal, toggleModal] = useToggle(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    CalculateDeliveryCharge();
  }, [Checkout?.address?.id]);

  const CalculateDeliveryCharge = async () => {
    try {
      var totals = 0;
      if (Array.isArray(Checkout?.Checkout) == true) {
        Checkout?.Checkout?.forEach((item: any) => {
          totals += Number(item?.totalPrice);
        });
      }
      setTotal(Number(totals).toFixed(2));
      setGrand_total(totals);
      let obj = {
        cart: Checkout?.Checkout,
        address: Checkout?.address,
        total: totals,
      };
      if (Checkout?.address?.id) {
        // const response: any = await POST(API.CALCULATE_DELIVERY_CHARGE, obj);
        // if (response?.status) {
        //   setDeliveryToken(response?.token);
        //   let delivery = Number(response?.details?.totalCharge);
        //   let gTotal =
        //     Number(totals) +
        //     Number(delivery) -
        //     Number(response?.data?.discount);
        //   setDelivery_charge(delivery);
        //   setGrand_total(gTotal);
        //   setDiscount(response?.data?.discount);
          
        // } else {
        //   toggleModal(true);
        //   setErrorMessage(response?.message ?? "");
        //   setDeliveryToken("");
        //   setDelivery_charge(0);
        //   setGrand_total(totals);
        //   setDiscount(0);
        // }

        setDelivery_charge(50);
          setGrand_total(5);
          setDiscount(0);
      }
    } catch (err) {
      setDelivery_charge(0);
      setDiscount(0);
      setDeliveryToken("");
      console.log("err", err);
    }
  };

  

  const PlaceOrder = async () => {
    // if (deliveryToken) {
      // if delivery details available..only
      try {
        const obj = {
          payment: payment_method,
          cart: Checkout?.Checkout,
          address: Checkout?.address,
          charges: {
            token: deliveryToken,
          },
        };
        dispatch(storeFinal(obj));
        if (payment_method === "Pay Online") {
          GetPaymentToken();
        } else {
          navigation.replace("/checkoutsuccess/1");
        }
      } catch (err) {
        console.log(err);
      }
    // } else {
    //   if (Checkout?.address?.id) {
    //     toggleModal(true);
    //     // notificationApi.error({
    //     //   message: `Delivery to the Selected address is not available. Please choose another one.`,
    //     // });
    //     return;
    //   }
    //   notificationApi.error({
    //     message: `Please Choose a Delivery Address to place an Order`,
    //   });
    // }
  };

  const GetPaymentToken = async () => {
    try {
      setIsLoading(true);
      const response: any = await GET(API.PAYMENT_GATEWAY_GETTOKEN);
      if (response.access_token) {
        let obj = {
          currencyCode: Settings?.currency,
          value: Number(Number(grand_total) * 100).toFixed(2),
          emailAddress: user?.user?.email,
          firstName: user?.user?.first_name,
          lastName: user?.user?.last_name,
          token: response.access_token,
        };
        var order: any = await POST(API.PAYMENT_GATEWAY_ORDER, obj);
        if (order?._links?.payment?.href) {
          window.location.replace(order?._links?.payment?.href);
        } else {
          notificationApi.error({
            message: `Payment Faild. Please Try Again`,
            description: `Something went wrong. please try again`,
          });
        }
      } else {
        notificationApi.error({
          message: `Payment Faild. Please Try Again`,
          description: `Something went wrong. please try again`,
        });
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      notificationApi.error({
        message: `Payment Faild. Please Try Again`,
        description: `Something went wrong. please try again`,
      });
    }
  };

  return (
    <>
    <HeaderBreadcrumbs />
    <div className="Screen-box">
      {contextHolder}
      <br />
      <Container style={{ minHeight: "80vh" }}>
        <p className="fw-bold coopen py-2 px-2 mt-4 mb-3">Have a coupon? Click here to enter your code</p>
        <Row>
          <Col sm={6}>
            <AddressBox />
            {/* <PaymentBox
              method={payment_method}
              onChange={(value: any) => setPayment_method(value)}
            />
            <br /> */}
          </Col>
          <Col sm={6}>
            <div className="Cart-box2">
              <SummaryCard
                Cart={Checkout}
                total={total}
                delivery_charge={delivery_charge}
                grand_total={grand_total}
                placeOrder={() => PlaceOrder()}
                loading={isLoading}
                discount={discount}
                onChange={(value: any) => setPayment_method(value)}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <br />
      <NotDeliverableModal
        open={openModal}
        close={() => toggleModal(false)}
        message={errorMessage}
      />
    </div>
    </>
  );
}
export default Checkout;
