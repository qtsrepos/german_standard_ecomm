import React from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";
import { useSelector } from "react-redux";
import { Alert } from "antd";
import { reduxSettings } from "../../../../redux/slice/settingsSlice";
const SummaryCard = (props: any) => {
  const Settings = useSelector(reduxSettings);

  const getSubtotal = (cartItems: any) => {
    let subtotal = 0;
    if (Array.isArray(cartItems)) {
      cartItems?.forEach((item: any) => {
        subtotal += Number(item?.price * item?.quantity);
      });
    }
    return Number(subtotal).toFixed(2);
  };

  const getVAT = (cartItems: any) => {
    const subtotal = getSubtotal(cartItems);
    const vatAmount = Number(subtotal) * 0.05; // 5% VAT
    return Number(vatAmount).toFixed(2);
  };

  const getTotalPrice = (cartItems: any) => {
    const subtotal = getSubtotal(cartItems);
    const vat = getVAT(cartItems);
    const total = Number(subtotal) + Number(vat); // Subtotal + VAT
    return Number(total).toFixed(2);
  };

  return (
    <div className="Cart-SummaryCard">
      <div className="Cart-row">
        <div className="Cart-txt5">CART TOTALS</div>
        <div style={{ flex: 1 }} />
      </div>

      <br />
      <div className="Cart-row">
        <div className="Cart-txt3">Subtotal</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">
          {getSubtotal(props?.cartItems)} {Settings?.currency}
        </div>
      </div>
      <div className="Cart-line-new" />

      <div className="Cart-row">
        <div className="Cart-txt3">Shipping</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">Free Shipping</div>
      </div>
      <div className="Cart-line-new" />

      <div className="Cart-row">
        <div className="Cart-txt3">VAT (5%)</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">{getVAT(props?.cartItems)} {Settings?.currency}</div>
      </div>
      <div className="Cart-line-new" />
      <br />
      <br />
      <div className="Cart-row">
        <div className="Cart-txt3">Total </div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt7">
          {getTotalPrice(props?.cartItems)} {Settings?.currency}
        </div>
      </div>

      <br />
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
          <br />
        </>
      ) : null}
      <div
        className="Cart-btn1"
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => props?.goCheckout()}
      >
        <div>PROCEED TO CHECKOUT</div>
      </div>
    </div>
  );
};

export default SummaryCard;
