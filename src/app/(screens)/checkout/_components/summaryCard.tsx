"use client";
import React from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";
import { useSelector } from "react-redux";
import { Alert, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "../style.scss"
import PaymentBox from "./paymentBox";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />
);

const SummaryCard = (props: any) => {
  const Settings = useSelector((state: any) => state.Settings.Settings);

  console.log(props?.Cart?.Checkout);

  const getSubtotal = () => {
    let subtotal = 0;
    if (Array.isArray(props?.Cart?.Checkout)) {
      props?.Cart?.Checkout?.forEach((item: any) => {
        subtotal += Number(item?.price * item?.quantity);
      });
    }
    return Number(subtotal).toFixed(2);
  };

  const getVAT = () => {
    const subtotal = getSubtotal();
    const vatAmount = Number(subtotal) * 0.05; // 5% VAT
    return Number(vatAmount).toFixed(2);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const vat = getVAT();
    const total = Number(subtotal) + Number(vat);
    return Number(total).toFixed(2);
  };

  return (
    <div>
      <div className="Cart-row">
        <div className="Cart-txt5">YOUR ORDER</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt6">{props?.Cart?.Checkout?.length || 0} Item{(props?.Cart?.Checkout?.length || 0) !== 1 ? 's' : ''}</div>
      </div>
      <div className="Cart-line" />

      {/* Order Items */}
      {props?.Cart?.Checkout?.map((item: any, index: number) => {
        return (
          <div key={index} style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                  {item?.name}
                </div>
                {item?.variantId && (
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    Variant: {item?.combination?.map((c: any) => c.value).join(' ')}
                  </div>
                )}
                <div style={{ fontSize: '12px', color: '#888' }}>
                  Quantity: {item?.quantity}
                </div>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {Settings?.currency} {Number(item?.price * item?.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        );
      })}

      <br />

      {/* Order Totals */}
      <div className="Cart-row">
        <div className="Cart-txt3">Subtotal</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">
          {Settings?.currency} {getSubtotal()}
        </div>
      </div>
      <div style={{ margin: 15 }} />

      <div className="Cart-row">
        <div className="Cart-txt3">Shipping</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4 text-success">
          {Settings?.currency} {Number(props?.delivery_charge || 0).toFixed(2)}
        </div>
      </div>
      <div style={{ margin: 15 }} />

      <div className="Cart-row">
        <div className="Cart-txt3">VAT (5%)</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">
          {Settings?.currency} {getVAT()}
        </div>
      </div>
      <div style={{ margin: 15 }} />

      <div className="Cart-row">
        <div className="Cart-txt3">Discount</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4 text-success">
          -{Settings?.currency} {Number(props?.discount || 0).toFixed(2)}
        </div>
      </div>
      <div style={{ margin: 15 }} />

      <div className="Cart-line" />

      <div className="Cart-row" style={{ padding: '15px 0' }}>
        <div className="Cart-txt3" style={{ fontWeight: 'bold', fontSize: '16px' }}>Total</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt7" style={{ fontWeight: 'bold', fontSize: '18px' }}>
          {Settings?.currency} {getTotal()}
        </div>
      </div>

      <br />

      {/* Payment Method Selection */}
      <PaymentBox
        method={props?.payment_method}
        onChange={props?.onChange}
      />

      <br />

      {/* Place Order Button */}
      <Button
        type="primary"
        size="large"
        block
        onClick={props?.placeOrder}
        loading={props?.loading}
        disabled={props?.loading}
        style={{
          height: '50px',
          backgroundColor: '#E9421A',
          borderColor: '#E9421A',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {props?.loading ? 'PROCESSING...' : 'PLACE ORDER'}
      </Button>
    </div>
  );
};

export default SummaryCard;
