// import React from "react";
// import { Button, Popconfirm } from "antd";
// import { VscClose } from "react-icons/vsc";
// import { useRouter } from "next/navigation";

// const CartItem = (props: any) => {
//   const router = useRouter();

//   function capitalizeFirstLetter(text: string) {
//     return text.charAt(0).toUpperCase() + text.slice(1);
//   }

//   const getActiveVariant = (data: any): string => {
//     let variantInfo = "";
//     if (Array.isArray(data?.combination)) {
//       data?.combination.forEach((item: any) => {
//         variantInfo += ` ${capitalizeFirstLetter(item.value)}`;
//       });
//     }
//     return variantInfo;
//   };

//   return (
//     <>
//     <tr>

//       <td>
//         <div className="d-flex align-items-center">
//           <Popconfirm
//             placement="bottomRight"
//             title="Are you sure to remove item from cart?"
//             okText="Yes"
//             cancelText="No"
//             onConfirm={() => props?.removeItem(props?.data?.id, props?.data)}
//             className="me-2"
//           >
//             <VscClose size={20} className="remove-btn" />
//           </Popconfirm>
//           <div
//             onClick={() =>
//               router.push(`/${props?.data?.slug}/?pid=${props?.data?.pid}&review=2`)
//             }
//             className="image-wrapper me-2"
//             style={{ cursor: "pointer" }}
//           >
//             <img
//               src={props?.data?.image}
//               alt={props?.data?.name}
//               className="product-image"
//               style={{ width: "60px", height: "60px", objectFit: "contain" }}
//             />
//           </div>
//           <span className="product-name">
//             {props?.data?.name} {getActiveVariant(props?.data)}
//           </span>
//         </div>
//       </td>

//       <td>
//         {props?.Settings?.currency} {Number(props?.data?.price).toFixed(2)}
//       </td>

//       <td>
//         <div className="d-flex align-items-center quantity-wrapper">
//           <Button
//             className="quantity-btn"
//             onClick={() => {
//               if (!props?.loading) {
//                 props?.updateQuantity("reduce", props?.data);
//               }
//             }}
//           >
//             -
//           </Button>
//           <Button className="quantity-count mx-2">
//             {props?.data?.quantity}
//           </Button>
//           <Button
//             className="quantity-btn"
//             onClick={() => {
//               if (!props?.loading) {
//                 props?.updateQuantity("add", props?.data);
//               }
//             }}
//           >
//             +
//           </Button>
//         </div>
//       </td>

//       <td>
//         {props?.Settings?.currency} {Number(props?.data?.totalPrice).toFixed(2)}
//       </td>
//     </tr>
//     </>
//   );
// };

// export default CartItem;

// import React from "react";
// import { Button, Popconfirm } from "antd";
// import { VscClose } from "react-icons/vsc";
// import { useRouter } from "next/navigation";
// import { Col, Container, Row } from "react-bootstrap";
// import { reduxSettings } from "../../../../redux/slice/settingsSlice";
// import { useSelector } from "react-redux";

// const CartItem = (props: any) => {
//   const Settings = useSelector(reduxSettings);

//   const router = useRouter();

//   function capitalizeFirstLetter(text: string) {
//     return text.charAt(0).toUpperCase() + text.slice(1);
//   }

//   const getActiveVariant = (data: any): string => {
//     let variantInfo = "";
//     if (Array.isArray(data?.combination)) {
//       data?.combination.forEach((item: any) => {
//         variantInfo += ` ${capitalizeFirstLetter(item.value)}`;
//       });
//     }
//     return variantInfo;
//   };

//   return (
//     <>
//       <Row className="cart-item-row">
//         <Col xs={2} className="d-flex align-items-center">
//           <Popconfirm
//             placement="bottomRight"
//             title="Are you sure to remove item from cart?"
//             okText="Yes"
//             cancelText="No"
//             onConfirm={() => props?.removeItem(props?.data?.id, props?.data)}
//             className="me-2"
//           >
//             <VscClose size={20} className="remove-btn" />
//           </Popconfirm>
//           <div
//             onClick={() =>
//               router.push(
//                 `/${props?.data?.slug}/?pid=${props?.data?.pid}&review=2`
//               )
//             }
//             className="image-wrapper me-2"
//             style={{ cursor: "pointer" }}
//           >
//             <img
//               src={props?.data?.image}
//               alt={props?.data?.name}
//               className="product-image"
//               style={{ width: "60px", height: "60px", objectFit: "contain" }}
//             />
//           </div>
//         </Col>

//         <Col>
//           <span className="product-name">
//             {props?.data?.name} {getActiveVariant(props?.data)}
//           </span>
//         </Col>

//         <Col>
//           <div style={{ color: " #777777" }}>
//             {props?.Settings?.currency} {Number(props?.data?.price).toFixed(2)} {Settings?.currency}
//           </div>
//         </Col>

//         <Col>
//           <div className="d-flex align-items-center quantity-wrapper">
//             <Button
//               className="quantity-btn"
//               onClick={() => {
//                 if (!props?.loading) {
//                   props?.updateQuantity("reduce", props?.data) ;
//                 }
//               }}
//             >
//               -
//             </Button>
//             <Button className="quantity-count mx-2">
//               {props?.data?.quantity}
//             </Button>
//             <Button
//               className="quantity-btn"
//               onClick={() => {
//                 if (!props?.loading) {
//                   props?.updateQuantity("add", props?.data);
//                 }
//               }}
//             >
//               +
//             </Button>
//           </div>
//         </Col>

//         <Col>
//           <div style={{ color: "#E9421A", fontWeight: "bold" }}>
//             {props?.Settings?.currency}{" "}
//             {Number(props?.data?.totalPrice).toFixed(2)} {Settings?.currency}
//           </div>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default CartItem;

import React, { useState, useEffect } from "react";
import { Button, Popconfirm } from "antd";
import { VscClose } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { Col, Row } from "react-bootstrap";
import { reduxSettings } from "../../../../redux/slice/settingsSlice";
import { useSelector } from "react-redux";

const CartItem = (props: any) => {
  const Settings = useSelector(reduxSettings);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function capitalizeFirstLetter(text: any) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const getActiveVariant = (data: any) => {
    let variantInfo = "";
    if (Array.isArray(data?.combination)) {
      data?.combination.forEach((item: any) => {
        variantInfo += ` ${capitalizeFirstLetter(item.value)}`;
      });
    }
    return variantInfo;
  };

  // Desktop Layout
  const DesktopLayout = () => (
    <Row className="cart-item-row">
      <Col xs={2} className="d-flex align-items-center justify-content-between">
        <VscClose
          onClick={() => props?.removeItem(props?.data?.id, props?.data)}
          size={20}
          className="remove-btn"
        />

        <div
          onClick={() =>
            router.push(
              `/${props?.data?.slug}/?pid=${props?.data?.pid}&review=2`
            )
          }
          className="image-wrapper me-2"
          style={{ cursor: "pointer" }}
        >
          <img
            src={props?.data?.image}
            alt={props?.data?.name}
            className="product-image"
            style={{ width: "60px", height: "60px", objectFit: "contain" }}
          />
        </div>
      </Col>

      <Col>
        <span className="product-name">
          {props?.data?.name} {getActiveVariant(props?.data)}
        </span>
      </Col>

      <Col>
        <div style={{ color: "#777777" }}>
          {props?.Settings?.currency} {Number(props?.data?.price).toFixed(2)}{" "}
          {Settings?.currency}
        </div>
      </Col>

      <Col>
        <div className="d-flex align-items-center quantity-wrapper">
          <Button
            className="quantity-btn"
            onClick={() => {
              if (!props?.loading) {
                props?.updateQuantity("reduce", props?.data);
              }
            }}
          >
            -
          </Button>
          <Button className="quantity-count mx-2">
            {props?.data?.quantity}
          </Button>
          <Button
            className="quantity-btn"
            onClick={() => {
              if (!props?.loading) {
                props?.updateQuantity("add", props?.data);
              }
            }}
          >
            +
          </Button>
        </div>
      </Col>

      <Col>
        <div style={{ color: "#E9421A", fontWeight: "bold" }}>
          {props?.Settings?.currency}{" "}
          {Number(props?.data?.totalPrice).toFixed(2)} {Settings?.currency}
        </div>
      </Col>
    </Row>
  );

  // Mobile Layout
  const MobileLayout = () => (
    <div className="border-bottom py-3">
      <div className="d-flex align-items-start">
        <div
          onClick={() =>
            router.push(
              `/${props?.data?.slug}/?pid=${props?.data?.pid}&review=2`
            )
          }
          className="flex-shrink-0"
        >
          <img
            src={props?.data?.image}
            alt={props?.data?.name}
            className="img-fluid"
            style={{ width: "64px", height: "64px", objectFit: "contain" }}
          />
        </div>

        <div className="flex-grow-1 ms-3">
          <div className="d-flex justify-content-between align-items-start">
            <span className="fs-6 ">
              {props?.data?.name} {getActiveVariant(props?.data)}
            </span>

            <VscClose
              onClick={() => props?.removeItem(props?.data?.id, props?.data)}
              size={18}
              className="cursor-pointer mt-1"
            />
          </div>

          <div className="mt-2">
            <div className="d-flex justify-content-between">
              <span
                className="text-uppercase text-muted"
                style={{ fontSize: "12px" }}
              >
                Price
              </span>
              <span style={{ fontSize: "12px" }}>
                {Number(props?.data?.price).toFixed(2)} {Settings?.currency}
              </span>
            </div>
            <hr
              className="my-1"
              style={{ borderStyle: "dashed", borderColor: "#E4E4E4" }}
            />
          </div>

          <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center">
              <span
                className="text-uppercase text-muted"
                style={{ fontSize: "12px" }}
              >
                Quantity
              </span>
              <div className="d-flex align-items-center quantity-wrapper">
                <Button
                  className="quantity-btn p-0"
                  style={{
                    width: "24px",
                    height: "24px",
                    fontSize: "16px",
                    lineHeight: "20px",
                  }}
                  onClick={() => {
                    if (!props?.loading) {
                      props?.updateQuantity("reduce", props?.data);
                    }
                  }}
                >
                  -
                </Button>
                <span
                  className="mx-2"
                  style={{
                    fontSize: "12px",
                    width: "24px",
                    textAlign: "center",
                  }}
                >
                  {props?.data?.quantity}
                </span>
                <Button
                  className=" quantity-btn p-0"
                  style={{
                    width: "24px",
                    height: "24px",
                    fontSize: "16px",
                    lineHeight: "20px",
                  }}
                  onClick={() => {
                    if (!props?.loading) {
                      props?.updateQuantity("add", props?.data);
                    }
                  }}
                >
                  +
                </Button>
              </div>
            </div>
            <hr
              className="my-1"
              style={{ borderStyle: "dashed", borderColor: "#E4E4E4", }}
            />
          </div>

          <div className="mt-2">
            <div className="d-flex justify-content-between">
              <span
                className="text-uppercase text-muted"
                style={{ fontSize: "12px" }}
              >
                Subtotal
              </span>
              <span
                className="fw-bold"
                style={{ fontSize: "12px", color: "#E9421A" }}
              >
                {Number(props?.data?.totalPrice).toFixed(2)}{" "}
                {Settings?.currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <>{isMobile ? <MobileLayout /> : <DesktopLayout />}</>;
};

export default CartItem;
