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
let subtotal = 0;
let totalVAT = 0;
let totalAddCharges = 0;
let totalDiscount = 0;

;(props?.orderItems || []).forEach((item:any)=>{
  const itemSubtotal = (item.quantity || 0) * (item.price || 0);
  const itemVAT = itemSubtotal * ((item.vat || 0) / 100);
  const itemAddCharges = item.addcharges || 0;
  const itemDiscount = item.discountAmount || 0;

  subtotal += itemSubtotal;
  totalVAT += itemVAT;
  totalAddCharges += itemAddCharges;
  totalDiscount += itemDiscount;
});

const grandTotal = subtotal + totalVAT + totalAddCharges - totalDiscount;
  console.log('Order calculations:', {
    subtotal: subtotal.toFixed(2),
    totalVAT: totalVAT.toFixed(2),
    totalAddCharges: totalAddCharges.toFixed(2),
    totalDiscount: totalDiscount.toFixed(2),
    grandTotal: grandTotal.toFixed(2)
  });
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
        {props?.orderItems?.map((item: any) => {
          const itemSubtotal = (item.quantity || 0) * (item.price || 0);
          const itemVAT = itemSubtotal * ((item.vat || 0) / 100);
          const itemAddCharges = item.addcharges || 0;
          const itemDiscount = item.discountAmount || 0;
          const itemTotal = itemSubtotal + itemVAT + itemAddCharges - itemDiscount;

          return (
            <div className="row border-bottom p-3 " key={item.id}>
               <div className="col-8 m-0 font-1">
                 <div>{item?.name} × {item?.quantity}</div>
                 <div className="text-muted small">
                   Rate: {(item.price || 0).toFixed(2)} AED
                   {item.vat > 0 && ` | VAT: ${item.vat}%`}
                   {item.addcharges > 0 && ` | Charges: ${item.addcharges.toFixed(2)} AED`}
                   {item.discountAmount > 0 && ` | Discount: ${item.discountAmount.toFixed(2)} AED`}
                 </div>
               </div>
               <div className="col-4 text-end m-0 font-1">{itemTotal.toFixed(2)} AED</div>
            </div>
          );
        })}
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 ">
          <p className="m-0 font-2 ">Subtotal</p>
          <p className="m-0 font-2 text-danger">{subtotal.toFixed(2)} AED</p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3" >
          <p className="m-0 font-2">Shipping</p>
          <p className="m-0 font-2">{totalAddCharges.toFixed(2)} AED</p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 ">
          <p className="m-0 font-2 ">VAT</p>
          <p className="m-0 font-2 text-danger">{totalVAT.toFixed(2)} AED</p>
        </div>
        {totalDiscount > 0 && (
          <div className="d-flex justify-content-between gap-3 border-bottom p-3 ">
            <p className="m-0 font-2 ">Discount</p>
            <p className="m-0 font-2 text-success">-{totalDiscount.toFixed(2)} AED</p>
          </div>
        )}
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 " >
          <p className="m-0 font-2">Payment method</p>
          <p className="m-0 font-2">Cash on delivery </p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3" >
          <h5 className="m-0">TOTAL</h5>
          <h5 className="m-0 text-danger">{grandTotal.toFixed(2)} AED</h5>
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
                <div className="fw-bold">{props?.orderDetails?.Header?.[0]?.Customer_Name || 'Customer'}</div>

                <div>Country: {props?.orderDetails?.Header?.[0]?.Country_Name || 'N/A'}</div>
                <div>Transaction ID: {props?.orderDetails?.Header?.[0]?.TransId || 'N/A'}</div>
                <div>Delivery Address: {props?.orderDetails?.Header?.[0]?.DeliveryAddress || 'N/A'}</div>
                <div>Delivery Terms: {props?.orderDetails?.Header?.[0]?.DeliveryTerms || 'N/A'}</div>
                <div>Delivery Date: {props?.orderDetails?.Header?.[0]?.DeliveryDate || 'N/A'}</div>
                <div>
                  <strong>Remarks:</strong> {props?.orderDetails?.Header?.[0]?.Remarks || 'Order created successfully'}
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
