"use client";
import React from "react";
import { Row, Col } from "react-bootstrap";
import { IoCardOutline } from "react-icons/io5";
import { IoCashOutline } from "react-icons/io5";
import { HiOutlineCash } from "react-icons/hi";
import { IoIosRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";

import Visa from "../../../../assets/images/visa.png";
import Mster from "../../../../assets/images/mastercard.png";
import Diners from "../../../../assets/images/dinners.png";
import Samsu from "../../../../assets/images/samsungpay.png";
import { BsBank } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import Image from "next/image";
import { Radio } from "antd";
function PaymentBox(props: any) {
  return (
    <div>
<div className="mt-4">
            <Radio.Group defaultValue="cashOnDelivery" className="d-flex flex-column gap-2">
              <Radio value="cashOnDelivery" onClick={() => props?.onChange("Cash On Delivery")}>Cash on delivery</Radio>
              <Radio value="ccAvenue" onClick={() => props?.onChange("Pay Online")}>CCAvenue</Radio>
              <Radio value="creditTerms" onClick={() => props?.onChange("Pay Online")}>Agreed Credit Terms</Radio>
            </Radio.Group>
          </div>

      {/* <div className="Cart-row" style={{ padding: 0 }}>
        <div className="Cart-txt1">
          <span className="Cart-txt1Icon">
            <IoCashOutline />
          </span>
          PAYMENT METHOD
        </div>
      </div>
      <div className="Cart-line" />
      <br />
      <div
        className={`Cart-paymentBox ${
          props?.method === "Pay Online" ? "active" : ""
        }`}
        onClick={() => props?.onChange("Pay Online")}
      >
        <div style={{ marginRight: 20 }}>
          {props?.method === "Pay Online" ? (
            <IoMdRadioButtonOn size={25} />
          ) : (
            <IoIosRadioButtonOff size={25} />
          )}
        </div>
        <div style={{ marginRight: 10 }}>
          <IoCardOutline size={40} color="grey" />
        </div>
        <div style={{ flex: 1 }}>
          <Row>
            <Col sm={6} xs={12}>
              <div className="Cart-txt3">Pay Online</div>
            </Col>
            <Col sm={6} xs={12}>
              <div className="Cart-row" style={{ justifyContent: "flex-end" }}>
                <div style={{ marginRight: 10 }}>
                  <Image src={Visa} height={30 }alt="" />
                </div>
                <div style={{ marginRight: 10 }}>
                  <Image src={Mster} height={ 30} alt=""/>
                </div>
                <div style={{ marginRight: 10 }}>
                  <Image src={Diners} height={30 } alt="" />
                </div>
                <div>
                  <Image src={Samsu} height={30} alt=""/>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div
        className={`Cart-paymentBox ${
          props?.method === "Cash On Delivery" ? "active" : ""
        }`}
        onClick={() => props?.onChange("Cash On Delivery")}
      >
        <div style={{ marginRight: 20 }}>
          {props?.method === "Cash On Delivery" ? (
            <IoMdRadioButtonOn size={25} />
          ) : (
            <IoIosRadioButtonOff size={25} />
          )}
        </div>
        <div style={{ marginRight: 10 }}>
          <HiOutlineCash size={40} color="grey" />
        </div>
        <div className="Cart-txt3" style={{ flex: 1 }}>
          Cash On Delivery ( COD )
        </div>
      </div> */}
      {/* <div
        className={`Cart-paymentBox ${
          props?.method === "Pay On Credit" ? "active" : ""
        }`}
        onClick={() => props?.onChange("Pay On Credit")}
      >
        <div style={{ marginRight: 20 }}>
          {props?.method === "Pay On Credit" ? (
            <IoMdRadioButtonOn size={25} />
          ) : (
            <IoIosRadioButtonOff size={25} />
          )}
        </div>
        <div style={{ marginRight: 10 }}>
          <MdPayments size={38} color="grey" />
        </div>
        <div className="Cart-txt3" style={{ flex: 1 }}>
          Pay On Credit
        </div>
      </div>
      {props?.method === "Pay On Credit" ? (
        <div className={`Cart-paymentBox`}>
          <div className="Cart-bankDetails-box">
            <span>
              This Order will be processed only after the Admin approves the
              Credit payment.
            </span>
            <span>The payment will be completed on month end.</span>
          </div>
        </div>
      ) : null} */}

    </div>
  );
}
export default PaymentBox;
