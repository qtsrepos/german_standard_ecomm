"use client";
import React from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";
import { useSelector } from "react-redux";
import { Alert, Button, Radio, Spin } from "antd";
import CheckoutItem from "./checkoutItem";
import { LoadingOutlined } from "@ant-design/icons";
import "../style.scss"
import PaymentBox from "./paymentBox";
const antIcon = (
  <LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />
);
const SummaryCard = (props: any) => {
  const Settings = useSelector((state: any) => state.Settings.Settings);

  console.log(props?.Cart?.Checkout);

  return (
    <div>
      {/* <div className="Cart-row">
        <div className="Cart-txt5">Checkout Summary</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt6">{props?.Cart?.Checkout?.length} Item</div>
      </div>
      <div className="Cart-line" />
      {props?.Cart?.Checkout?.map((item: any, index: number) => {
        return <CheckoutItem key={index} data={item} Settings={Settings} />;
      })}
      <br />
      <div className="Cart-row">
        <div className="Cart-txt3">Total Product Price</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">
          {Settings?.currency} {Number(props?.total).toFixed(2)}
        </div>
      </div>
      <div style={{ margin: 15 }} />
      <div className="Cart-row">
        <div className="Cart-txt3">Discount</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4 text-success">
          -{Settings?.currency} {Number(props?.discount).toFixed(2)}
        </div>
      </div>
      <div style={{ margin: 15 }} />
      <div className="Cart-row">
        <div className="Cart-txt3">Tax</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">{Settings?.currency} 0.00</div>
      </div>
      <div style={{ margin: 15 }} />
      <div className="Cart-row">
        <div className="Cart-txt3">Delivery Charges</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">
          {Settings?.currency} {Number(props?.delivery_charge).toFixed(2)}
        </div>
      </div>
      <div className="Cart-line2" />
      <div style={{ margin: 15 }} />
      <div className="Cart-row">
        <div className="Cart-txt3">Total :</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt7">
          {Settings?.currency} {Number(props?.grand_total).toFixed(2)}
        </div>
      </div>
      <div className="Cart-line2" />
      <div style={{ margin: 15 }} />
      {props?.error ? (
        <>
          <Alert
            type="error"
            message={
              <div className="Cart-error">
                <IoInformationCircleOutline size={30} /> &nbsp;{props?.error}
              </div>
            }
          />
          <div style={{ margin: 15 }} />
        </>
      ) : null}
      <div
        className="Cart-btn1"
        style={{ cursor: "pointer" }}
        onClick={() => props?.placeOrder()}
      >
        <div>PLACE ORDER</div>
        <div className="Cart-btn1Box">
          {props?.loading ? <Spin indicator={antIcon} /> : <GoArrowRight />}
        </div>
      </div> */}

      <div className="container mt-4">
        <div className="order-section ">
          <h5 className="text-center mb-4 fw-semibold">YOUR ORDER</h5>
          <div className="order-items  p-4">
            <div className="row fw-bold border-bottom py-2 mb-3">
              <div className="col-8">PRODUCT</div>
              <div className="col-4 text-end">SUBTOTAL</div>
            </div>

            {props?.Cart?.Checkout?.map((item: any, index: number) => (
              <div className="row py-3 border-bottom items" key={index}>
                <div className="col-8 ">{item.name} × {item.quantity}</div>
                <div className="col-4 text-end">{Number(item.totalPrice).toFixed(2)} {Settings?.currency}</div>
              </div>
            ))}

            <div className="row border-bottom py-3 fw-bold">
              <div className="col-8">Subtotal</div>
              <div className="col-4 text-end total"> {Number(props?.total).toFixed(2)} {Settings?.currency}</div>
            </div>

            <div className="row  border-bottom py-3 fw-bold">
              <div className="col-8">Shipping</div>
              <div className="col-4 text-end">{Number(props?.delivery_charge).toFixed(2)} {Settings?.currency}</div>
            </div>

            <div className="row  border-bottom py-3 fw-bold">
              <div className="col-8">VAT</div>
              <div className="col-4 text-end total">0.00 {Settings?.currency}</div>
            </div>

            <div className="row py-3 fw-bold">
              <div className="col-8">Total</div>
              <div className="col-4 text-end total">{Settings?.currency} {Number(props?.grand_total).toFixed(2)} {Settings?.currency}</div>
            </div>
          </div>
          <PaymentBox onChange={props?.onChange}/>
          {/* <div className="mt-4">
            <Radio.Group defaultValue="cashOnDelivery">
              <Radio value="cashOnDelivery">Cash on delivery</Radio>
              <Radio value="ccAvenue">CCAvenue</Radio>
              <Radio value="creditTerms">Agreed Credit Terms</Radio>
            </Radio.Group>
          </div> */}

          <p className="text-muted small mt-3 border-top pt-4">
            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
          </p>

          <Button type="primary" className="place-order-btn" 
          onClick={() => props?.placeOrder()} >Proceed to pay</Button>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
