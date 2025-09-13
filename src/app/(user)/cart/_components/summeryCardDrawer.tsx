import React from "react";
import { useSelector } from "react-redux";
import { Alert } from "antd";
import { useRouter } from "next/navigation";
import { reduxSettings } from "../../../../redux/slice/settingsSlice";

interface SummaryCardDrawerProps {
  Cart: any;
  checkout: () => void;
  error?: string;
  onClose: () => void; 
}

const SummaryCardDrawer = (props: SummaryCardDrawerProps) => {
  const Settings = useSelector(reduxSettings);
  const router = useRouter();

  const getTotalPrice = (cart: any) => {
    let total = 0;
    if (Array.isArray(cart?.items)) {
      cart.items.forEach((item: any) => {
        total += Number(item?.totalPrice);
      });
    }
    return Number(total).toFixed(2);
  };

  return (
    <div className=" bg-white">
      {/* Subtotal */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-dark text-uppercase summery-total">Subtotal:</div>
        <div className="fw-bold fs-4" style={{ color: "#dc4c2f" }}>
          {getTotalPrice(props?.Cart)} {Settings?.currency}
        </div>
      </div>

      {/* Error */}
      {props?.error && (
        <Alert type="error" showIcon message={props.error} className="mb-3" />
      )}

      {/* Buttons */}
      <div className="d-flex flex-column gap-3">
        <div
          onClick={() => {
            router.push("/cart");
            props.onClose(); 
          }}
          className="text-white text-center fw-bold py-2"
          style={{
            backgroundColor: "#dc4c2f",
            borderRadius: "999px",
            cursor: "pointer",
          }}
        >
          VIEW CART
        </div>

        <div
          onClick={() => {
            props.checkout();
            props.onClose(); 
          }}
          className="text-white text-center fw-bold py-2"
          style={{
            backgroundColor: "#dc4c2f",
            borderRadius: "999px",
            cursor: "pointer",
          }}
        >
          CHECKOUT
        </div>
      </div>
    </div>
  );
};

export default SummaryCardDrawer;