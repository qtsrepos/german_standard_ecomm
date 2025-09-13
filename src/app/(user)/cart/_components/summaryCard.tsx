import React from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";
import { useSelector } from "react-redux";
import { Alert } from "antd";
import { reduxSettings } from "../../../../redux/slice/settingsSlice";
const SummaryCard = (props: any) => {
  const Settings = useSelector(reduxSettings);

  const getTotalPrice = (cartt: any) => {
    let total = 0;
    if (Array.isArray(cartt?.items) == true) {
      cartt?.items?.forEach((item: any) => {
        total += Number(item?.totalPrice);
      });
    }
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
          {getTotalPrice(props?.Cart)} {Settings?.currency}
        </div>
      </div>
      <div className="Cart-line-new" />

      <div className="Cart-row">
        <div className="Cart-txt3">Shipping</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4"></div>
      </div>
      <div className="Cart-line-new" />

      <div className="Cart-row">
        <div className="Cart-txt3">VAT</div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt4">0.00 {Settings?.currency}</div>
      </div>
      <div className="Cart-line-new" />
      <br />
      <br />
      <div className="Cart-row">
        <div className="Cart-txt3">Total </div>
        <div style={{ flex: 1 }} />
        <div className="Cart-txt7">
          {getTotalPrice(props?.Cart)} {Settings?.currency}
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
        onClick={() => props?.checkout()}
      >
        <div>PROCEED TO CHECKOUT</div>
      </div>
    </div>
  );
};

export default SummaryCard;
