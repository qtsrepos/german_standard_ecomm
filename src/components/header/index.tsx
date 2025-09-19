"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import CONFIG from "@/config/configuration";
import { 
  // useGetSettings
   useTokenExpiration } from "./services";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import Logo from "../../assets/images/headerlogonew.avif";
import { FaArrowLeft } from "react-icons/fa";
import {
  IoGlobeOutline,
  IoCartOutline,
  IoPersonOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";

import Search from "./search";
import Location from "./location";
import { Badge, Button, Popover } from "antd";
import { reduxSettings } from "../../redux/slice/settingsSlice";
import { signOut, useSession } from "next-auth/react";
import { PiUserCircle } from "react-icons/pi";
import ProfileMenu from "./profileMenu";
import dynamic from "next/dynamic";
import { setCount } from "@/redux/slice/favouriteSlice";
import { FiHeart } from "react-icons/fi";
import { MdHome, MdOutlineMailOutline } from "react-icons/md";
import { BsShopWindow } from "react-icons/bs";
import { LuClipboardPenLine } from "react-icons/lu";
import { TbTriangle } from "react-icons/tb";
import { VscHome } from "react-icons/vsc";
import CustomDrawerMenu from "./drowerMenu";
import { FaRegUserCircle } from "react-icons/fa";
import CartDrawer from "../../components/cartDrawer";

const CateogreyList = dynamic(() => import("./categoryList"), {
  ssr: false,
});

function Header() {
  const Settings = useSelector(reduxSettings);
  const cart = useSelector((state: any) => state.Cart);
  const LocalCart = useSelector((state: any) => state.LocalCart);
  const pathname = usePathname();
  const { data: user, status }: any = useSession();
  const [issharepopovervisible, setissharepopovervisible] = useState(false);
  const [open, setOpen] = useState<any>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session }: any = useSession();
  const cartItems = session?.token ? cart.items : LocalCart.items;


  // useGetSettings();
  useTokenExpiration();

  const handlepopovervisiblechange = () => {
    setissharepopovervisible(!issharepopovervisible);
  };

  const { data: User }: any = useSession();

  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  useEffect(() => {
    if (User?.user && !localStorage.getItem("favoritesLoaded")) {
      localStorage.setItem("favoritesLoaded", "true");
      dispatch(setCount(User?.user?.wishlist));
    }

    if (!User?.user) {
      localStorage.removeItem("favoritesLoaded");
    }
  }, [User, dispatch]);

  return pathname?.includes("/auth") ||
    pathname === "/" ||
    pathname === "/login" ? null : (
    <>
      <Container>
        <header className="position-sticky top-0" style={{ zIndex: 1000 }}>
          <div className="Header py-2 ">
            <div className="Header-Box">
              <div
                className="Header_logoBox d-md-flex align-items-center"
                style={{ cursor: session?.token ? "pointer" : "default" }}
              >
                <div>
                  <Button
                    className="menu-btn d-lg-none"
                    onClick={() => setOpen(true)}
                  >
                    ☰
                  </Button>
                </div>
                <div 
                onClick={() => {
                  if (session?.token) {
                    router.push("/home");
                  }
                }}>
                  <Image
                    alt="headerlogo"
                    width="584"
                    height="427"
                    src={Logo}
                    className="Header_logo"
                  />
                </div>
              </div>

              {/* {Settings?.isLocation ? (
                <div className="Header-location desktop">
                  <Location />
                </div>
              ) : null} */}

              <div className="Header-search desktop">
                <Search />
              </div>

              <div className="Header-menu">
                <div
                  className="Header-menu-items"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    className="Header-favorites me-2 hover d-none d-lg-block"
                    onClick={() => router.push("user/favorites")}
                    style={{ cursor: "pointer" }}
                  >
                    <FiHeart size={21} color="#FF4D4F" className="hover" />
                  </div>

                  <div
                    className="Header-cart"
                    onClick={showDrawer}
                    style={{ cursor: "pointer" }}
                  >
                    <Badge count={cartItems.length} size="small">
                      <IoCartOutline
                        size={25}
                        color="#262941"
                        className="hover"
                      />
                    </Badge>
                  </div>

                  <Popover
                    placement="bottomRight"
                    trigger="hover"
                    content={<ProfileMenu close={handlepopovervisiblechange} />}
                    arrow={false}
                    open={issharepopovervisible}
                    onOpenChange={handlepopovervisiblechange}
                    overlayStyle={{ width: 230 }}
                  >
                    <div
                      className={
                        user?.user
                          ? "Header-desk-menu Header-deskactive"
                          : "Header-desk-menu"
                      }
                      onClick={() => router.push("/user/profile")}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FaRegUserCircle
                        style={{ fontSize: "21px" }}
                        className="d-lg-none"
                      />
                      <span className="Header-desk-menu-text hover d-none d-lg-block">
                        MY ACCOUNT
                      </span>
                    </div>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="Header-search mobile">
              <Search />
            </div>
          </div>

          <div className="Header-sectionBox" />

          {/* {Settings?.isLocation ? (
            <div className="Header-location mobile">
              <Location />
            </div>
          ) : null} */}
        </header>
      </Container>

      <div className="header-bottom-wrapper d-none d-lg-block">
      <Container>
  <div className="header-bottom">
    <div className="d-flex gap-4">
      <div
        className={`header-bottom-title ${pathname?.includes("home") ? "active" : ""}`}
        onClick={() => router.push("/home")}
      >
        <VscHome className="icon" /> HOME
      </div>
      <div
        className={`header-bottom-title ${pathname?.includes("/category") ? "active" : ""}`}
        onClick={() => router.push("/category/undefined?id=dW5kZWZpbmVk&type=Species")}
      >
        <BsShopWindow className="icon" /> SHOP
      </div>
      <div
        className={`header-bottom-title ${pathname?.includes("rise_a_ticket") ? "active" : ""}`}
        onClick={() => router.push("/rise_a_ticket")}
      >
        <LuClipboardPenLine className={`icon ${pathname?.includes("rise_a_ticket") ? "active" : ""}`} /> RAISE A TICKET
      </div>
      <div
        className={`header-bottom-title ${pathname?.includes("events") ? "active" : ""}`}
        onClick={() => router.push("/events")}
      >
        <TbTriangle className={`icon ${pathname?.includes("events") ? "active" : ""}`} /> EVENTS
      </div>
      <div
        className={`header-bottom-title ${pathname?.includes("contact_us") ? "active" : ""}`}
        onClick={() => router.push("/contact_us")}
      >
        <MdOutlineMailOutline className={`icon ${pathname?.includes("contact_us") ? "active" : ""}`} /> CONTACT US
      </div>
      <div
        className={`header-bottom-title ${pathname?.includes("certificate_vault_manager") ? "active" : ""}`}
        onClick={() => router.push("/certificate_vault_manager")}
      >
        CERTIFICATE VAULT MANAGER
      </div>
    </div>
    <div className="contact-info">
      <div className="phone-number">+971 4 2668871</div>
      <p>24/7 support center</p>
    </div>
  </div>
</Container>
      </div>
      <CustomDrawerMenu open={open} setOpen={setOpen} />

      <CartDrawer showDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </>
  );
}

export default Header;
