// import React from "react";
// import { Row, Col } from "react-bootstrap";
// import { Button, Space } from "antd";
// import { useRouter } from "next/navigation";
// import "../styles.scss";
// import { VscClose } from "react-icons/vsc";

// const CartItemDrawer = (props: any) => {
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
//     <div className="cart-item-wrapper d-flex p-3 border-bottom">
//       {/* Product Image */}
//       <div
//         className="cart-image-wrapper me-3"
//         onClick={() =>
//           router.push(`/${props?.data?.slug}/?pid=${props?.data?.pid}&review=2`)
//         }
//       >
//         <img
//           src={props?.data?.image}
//           className="cart-item-image"
//           alt={props?.data?.name}
//         />
//       </div>

//       {/* Product Details and Quantity */}
//       <div style={{ flex: 1 }}>
//         <Row>
//           <Col xs={12} className="d-flex justify-content-between">
//             <div className="cart-item-title fw-bold">
//               {props?.data?.name} {getActiveVariant(props?.data)}
//             </div>
//             <div>
//               <VscClose
//                 size={15}
//                 onClick={() => props?.removeItem(props?.data?.id, props?.data)}
//               />
//             </div>
//           </Col>

//           <Col xs={12} className="d-flex flex-column mt-2">
//             {/* Quantity Controls */}
//             <div className="mb-2 ">
//               <Space.Compact block>
//                 <div className="quantity-wrapper-drawer">
//                   <Button
//                     className="quantity-btn"
//                     onClick={() => {
//                       if (props?.loading == false) {
//                         props?.updateQuantity("reduce", props?.data);
//                       }
//                     }}
//                   >
//                     -
//                   </Button>
//                   <Button className="quantity-count">
//                     {props?.data?.quantity}
//                   </Button>
//                   <Button
//                     className="quantity-btn"
//                     onClick={() => {
//                       if (props?.loading == false) {
//                         props?.updateQuantity("add", props?.data);
//                       }
//                     }}
//                   >
//                     +
//                   </Button>
//                 </div>
//               </Space.Compact>
//             </div>

//             {/* Total Price */}
//             <div className="cart-item-price fw-bold">
//               {props?.Settings?.currency}{" "}
//               {Number(props?.data?.totalPrice).toFixed(2)}
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };

// export default CartItemDrawer;

import React from "react";
import { Row, Col } from "react-bootstrap";
import { Button, Space } from "antd";
import { useRouter } from "next/navigation";
import "../styles.scss";
import { VscClose } from "react-icons/vsc";

// Define proper TypeScript interfaces
interface CombinationItem {
  value: string;
  [key: string]: any;
}

interface CartItemData {
  id: string;
  pid: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  totalPrice: number;
  combination?: CombinationItem[];
  [key: string]: any;
}

interface Settings {
  currency: string;
  [key: string]: any;
}

interface CartItemDrawerProps {
  data: CartItemData;
  loading: boolean;
  Settings: Settings;
  updateQuantity: (action: "add" | "reduce", item: CartItemData) => void;
  removeItem: (id: number|string, item: any) => void;
}

const CartItemDrawer = (props:CartItemDrawerProps) => {
  const router = useRouter();

  function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const getActiveVariant = (data: CartItemData): string => {
    let variantInfo = "";
    if (Array.isArray(data?.combination)) {
      data.combination.forEach((item: CombinationItem) => {
        variantInfo += ` ${capitalizeFirstLetter(item.value)}`;
      });
    }
    return variantInfo;
  };

  // Handle quantity update with immediate visual feedback
  const handleQuantityUpdate = (action: "add" | "reduce") => {
    if (props.loading) return;
    
    // Check if quantity would go below 1 for reduce action
    if (action === "reduce" && props.data.quantity <= 1) {
      // Either prevent reducing below 1 or remove the item
      // Uncomment the line below if you want to remove item when quantity reaches 0
      // props.removeItem(props.data.id, props.data);
      return;
    }
    
    // Call the parent's updateQuantity function
    props.updateQuantity(action, props.data);
  };

  // Handle navigation to product page
  const handleProductNavigation = () => {
    router.push(`/${props.data.slug}/?pid=${props.data.pid}&review=2`);
  };

  // Handle item removal
  const handleRemoveItem = () => {
    props.removeItem(props.data.id, props.data);
  };

  return (
    <div className="cart-item-wrapper d-flex p-3 border-bottom">
      {/* Product Image */}
      <div
        className="cart-image-wrapper me-3"
        onClick={handleProductNavigation}
        style={{ cursor: "pointer" }}
      >
        <img
          src={props.data.image}
          className="cart-item-image"
          alt={props.data.name}
          loading="lazy"
        />
      </div>

      {/* Product Details and Quantity */}
      <div style={{ flex: 1 }}>
        <Row>
          <Col xs={12} className="d-flex justify-content-between">
            <div className="cart-item-title fw-bold">
              {props.data.name} {getActiveVariant(props.data)}
            </div>
            <div>
              <VscClose
                size={15}
                onClick={handleRemoveItem}
                style={{ cursor: "pointer" }}
                title="Remove item"
              />
            </div>
          </Col>

          <Col xs={12} className="d-flex flex-column mt-2">
            {/* Quantity Controls */}
            <div className="mb-2">
              <Space.Compact block>
                <div className="quantity-wrapper-drawer">
                  <Button
                    className="quantity-btn"
                    onClick={() => handleQuantityUpdate("reduce")}
                    disabled={props.loading || props.data.quantity <= 1}
                    title="Decrease quantity"
                  >
                    -
                  </Button>
                  <Button 
                    className="quantity-count bg-transparent"
                    disabled
                  >
                    {props.data.quantity}
                  </Button>
                  <Button
                    className="quantity-btn"
                    onClick={() => handleQuantityUpdate("add")}
                    disabled={props.loading}
                    title="Increase quantity"
                  >
                    +
                  </Button>
                </div>
              </Space.Compact>
            </div>

            {/* Total Price */}
            <div className="cart-item-price fw-bold">
              {props.Settings?.currency || "AED"}{" "}
              {Number(props.data.totalPrice || 0).toFixed(2)}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CartItemDrawer;
