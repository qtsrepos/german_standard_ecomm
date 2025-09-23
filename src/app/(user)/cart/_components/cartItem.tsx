import React from "react";
import { Button, Popconfirm } from "antd";
import { VscClose } from "react-icons/vsc";
import { useRouter } from "next/navigation";

const CartItem = (props: any) => {
  const router = useRouter();

  function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const getActiveVariant = (data: any): string => {
    let variantInfo = "";
    if (Array.isArray(data?.combination)) {
      data?.combination.forEach((item: any) => {
        variantInfo += ` ${capitalizeFirstLetter(item.value)}`;
      });
    }
    return variantInfo;
  };

  return (
    <div className="cart-item p-3 border-bottom">
      <div className="d-flex">
        {/* Product Image */}
        <div
          className="me-3"
          style={{ cursor: "pointer", flexShrink: 0 }}
          onClick={() =>
            router.push(`/${props?.data?.slug}/?pid=${props?.data?.pid}&review=2`)
          }
        >
          <img
            src={props?.data?.image}
            alt={props?.data?.name}
            className="product-image"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
              border: "1px solid #e0e0e0",
              borderRadius: "8px"
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1 me-3">
              <h6
                className="product-name mb-1"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push(`/${props?.data?.slug}/?pid=${props?.data?.pid}&review=2`)
                }
              >
                {props?.data?.name}
              </h6>

              {props?.data?.variantId && (
                <div className="text-muted small mb-2">
                  Variant: {getActiveVariant(props?.data)}
                </div>
              )}

              <div className="d-flex align-items-center">
                <span className="fw-bold text-danger me-2">
                  AED {props?.data?.price?.toFixed(2)}
                </span>
                {props?.data?.discount > 0 && (
                  <span className="text-muted text-decoration-line-through small">
                    AED {(props?.data?.price * (1 + props?.data?.discount / 100))?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Remove Button */}
            <Popconfirm
              placement="bottomRight"
              title="Are you sure to remove item from cart?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => props?.removeItem(props?.data?.id, props?.data)}
            >
              <VscClose size={20} className="remove-btn text-muted" style={{ cursor: "pointer" }} />
            </Popconfirm>
          </div>

          {/* Quantity Controls */}
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex align-items-center">
              <Button
                className="quantity-btn p-0"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid #ddd"
                }}
                onClick={() => {
                  if (!props?.loading) {
                    props?.updateQuantity("reduce", props?.data);
                  }
                }}
                disabled={props?.loading}
              >
                -
              </Button>
              <span
                className="mx-3"
                style={{
                  minWidth: "40px",
                  textAlign: "center",
                  fontWeight: "bold"
                }}
              >
                {props?.data?.quantity}
              </span>
              <Button
                className="quantity-btn p-0"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid #ddd"
                }}
                onClick={() => {
                  if (!props?.loading) {
                    props?.updateQuantity("add", props?.data);
                  }
                }}
                disabled={props?.loading}
              >
                +
              </Button>
            </div>

            <div className="fw-bold text-danger">
              AED {(props?.data?.price * props?.data?.quantity)?.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
