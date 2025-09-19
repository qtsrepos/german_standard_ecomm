"use client";

import React, { useState } from "react";
import "./styles.scss";
import { Col, Row } from "react-bootstrap";
import { IoCartOutline, IoHomeOutline } from "react-icons/io5";
import { AiFillShop, AiOutlineUser } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { FiHeart } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { Badge } from "antd"; // Import antd Badge
import { LiaShoppingBagSolid } from "react-icons/lia";
import CartDrawer from "../cartDrawer";

function BottomTab() {
  const { data: session } = useSession(); // Get session from NextAuth
  const router = useRouter();
  const cart = useSelector((state: any) => state.Cart);
  const LocalCart = useSelector((state: any) => state.LocalCart);
  const cartItems = session?.token ? cart.items : LocalCart.items;
  const pathname = usePathname()

  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  // Only render BottomTab for logged-in users with role "user"
  if (!session || session.user?.type !== "user") {
    return null;
  }

  return (
    <div className="bottom-tab">
      <Row className="align-items-center justify-content-around">
        <Col className="text-center">
          <div
            onClick={() => router.push("/home")}
            style={{ cursor: "pointer" }}
            className={`botton-icon ${pathname?.includes('/home')?'active':''}`}
          >
            <IoHomeOutline />
            <p>Home</p>
          </div>
        </Col>
        <Col className="text-center">
          <div
            onClick={() => router.push("/category/undefined?id=dW5kZWZpbmVk&type=Species")}
            style={{ cursor: "pointer" }}
            className={`botton-icon ${pathname?.includes('/category')?'active':''}`}
             
          >
            <AiFillShop />
            <p>Shop</p>
          </div>
        </Col>
        <Col className="text-center">
          <div
            onClick={() => router.push("/user/profile")}
            style={{ cursor: "pointer" }}
            className={`botton-icon ${pathname?.includes('user/profile')?'active':''}`}
          >
            <AiOutlineUser />
            <p >My account</p>
          </div>
        </Col>
        <Col className="text-center">
          <div
            onClick={showDrawer}
            style={{ cursor: "pointer" }}
            className={`cart-container botton-icon ${pathname?.includes('/cart')?'active':''}`}
          >
            <Badge count={cartItems.length} size="small">
              <LiaShoppingBagSolid color="#262941" />
            </Badge>
            <p>Cart</p>
          </div>
        </Col>
        <Col className="text-center">
          <div
            onClick={() => router.push("/user/favorites")}
            style={{ cursor: "pointer" }}
            className={`cart-container botton-icon ${pathname?.includes('user/favorites')?'active':''}`}
          >
            <FiHeart />
            <p>Wishlist</p>
          </div>
        </Col>
      </Row>
      <CartDrawer showDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </div>
  );
}

export default BottomTab;
