import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Rate,
  Tag,
  notification,
} from "antd";
import Meta from "antd/es/card/Meta";
import moment from "moment";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { log } from "console";
import "../styles.scss";
import { useRouter } from "next/navigation";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import { POST } from "@/util/apicall";
import API from "@/config/API";

function OrderItems(props: any) {
  const Settings = useSelector(reduxSettings);
  const [form] = Form.useForm();
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const [showRating, setShowRating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [Notifications, contextHolder] = notification.useNotification();
  const formSubmitHandler = async (values: any) => {
    const url = API.STORE_REVIEW_CREATE;
    const obj = {
      ...values,
      orderId: props?.data?.id,
    };
    setIsLoading(true);
    try {
      const response: any = await POST(url, obj);
      if (response.status) {
        Notifications["success"]({
          message: `Review has been Successfully added`,
          description: "",
        });
        setShowRating(false);
        props?.getOrderDetails();
      } else {
        Notifications["error"]({
          message: response?.message ?? "",
          description: "",
        });
      }
    } catch (err) {
      Notifications["error"]({
        message: `Something went wrong..`,
        description: "",
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log(props?.data);
let total = 0
  props?.orderItems?.forEach((item:any)=>{
    total+=item.totalPrice
  })
  return (
    <div className="px-2">
        <Container>
      {contextHolder}
      <h4 className="my-4 py-2 font-weight-bold">ORDER DETAILS</h4>
      <div className="mx-2">
        <div className="d-flex justify-content-between gap-2 border-bottom p-3">
          <h6 className="font-weight-bold m-0">PRODUCT</h6>
          <h6 className="font-weight-bold m-0">TOTAL</h6>
        </div>
        {props?.orderItems?.map((item: any) => (
          <div className="row border-bottom p-3 " key={item.id}>
             <div className="col-8 m-0 font-1">{item?.name} × {item?.quantity}</div>
             <div className="col-4 text-end m-0 font-1">{item.totalPrice.toFixed(2)} AED</div>
          </div>
        ))}
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 ">
          <p className="m-0 font-2 ">Subtotal</p>
          <p className="m-0 font-2 text-danger">{total.toFixed(2)} AED</p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3" >
          <p className="m-0 font-2">Shipping</p>
          <p className="m-0 font-2">0 AED</p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 ">
          <p className="m-0 font-2 ">VAT</p>
          <p className="m-0 font-2 text-danger">0 AED</p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 " >
          <p className="m-0 font-2">Payment method</p>
          <p className="m-0 font-2">Cash on delivery </p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3" >
          <h5 className="m-0">TOTAL</h5>
          <h5 className="m-0 text-danger">{total.toFixed(2)} AED</h5>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3" >
          <h5 className="m-0">ACTIONS</h5>
          <div className="d-flex gap-2">
            <button className="list-btn" onClick={()=>router.push(`/user/orders`)}>TRACK ORDER</button>
            <button className="list-btn">INVOICE</button>
          </div>
        </div>
      </div>

<div className="mt-5 mb-5">
  <p style={{fontSize:"13px"}}>Note:<br/>
  <span className="text-muted">Click The Below To Track Your Order</span></p>
  <Button className="btn-trackOrder" onClick={()=>router.push(`/user/orders`)}>TRACK ORDER</Button>
</div>

      <div className="d-flex flex-column gap-3">
        <Card bordered={false} style={{boxShadow:"none"}}>
          <Meta
            title="BILLING & SHIPPING ADDRESS"
            style={{padding:"0px"}}
            description={
              <div className="text-dark">
                <div className="fw-bold">{props?.address?.name}</div>

                <div>City: {props?.address?.city}</div>
                <div>PinCode: {props?.address?.pin_code}</div>
                <div>State: {props?.address?.state}</div>
                <div>Type: {props?.address?.type}</div>
                <div>
                  Address: {props?.address?.fullAddress},
                  {props?.address?.geo_location}
                </div>
                <div className="fw-bold">
                  Phone Number: {props?.address?.code ?? ""}{" "}
                  {props?.address?.alt_phone ?? ""}
                </div>
              </div>
            }
          />
        </Card>
      </div>
      </Container>
    </div >
  );
}

export default OrderItems;
