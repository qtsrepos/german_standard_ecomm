import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { FaRegAddressBook, FaShoppingCart } from "react-icons/fa";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { RiNotification2Line } from "react-icons/ri";
import "./style.scss"; // Ensure this path is correct relative to this file
import { Modal } from "antd";
import { clearReduxData } from "@/lib/clear_redux";
import { signOut, useSession } from "next-auth/react";
import { useDispatch } from "react-redux";

const iconSize = 20;
const routes = [
  { title: "Dashboard", path: "/user/dashboard", route: "dashboard" },
  { title: "Orders", path: "/user/orders", route: "orders" },
  { title: "Downloads", path: "/user/downloads", route: "downloads" },
  { title: "Purchased events", path: "/user/purchased_events", route: "purchased_events" },
  { title: "Address", path: "/user/address", route: "address" },
  { title: "Buy again",  path: "/user/buy_again", route: "buy_again" },
  { title: "Account details", path: "/user/profile", route: "profile" },
  { title: "Wishlist", path: "/user/favorites", route: "favourites" },
] as const;

function Sidebar() {
  const pathname = usePathname();
    const dispatch = useDispatch();
     const { data: User }: any = useSession();
     const navigation = useRouter();
  const logotFunction = () => {
    if (User?.user) {
      Modal.confirm({
        title: "Are you sure you want to logout?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          clearReduxData(dispatch);
          signOut({ callbackUrl: "/login" });
        },
      });
    } else {
      navigation.push("/login");
      // props.close();
    }
  };

  return (
    <div className="sidebar d-flex flex-column pt-3 ">
      {routes.map((item, key) => (
        <Link key={key} href={item.path} className="text-black text-decoration-none">
          <div className={`d-flex p-2 sidebar-item ${( pathname?.includes(item.route) || (item.route === "favourites" && pathname?.includes("favorites"))) ? "active" : ""} `}>
            <div className=" profile-sidebar-txt1">{item.title}</div>
          </div>
        </Link>
        // { title: "Logout", path: "/user/logout", route: "logout" },
      ))}
      <div className={`d-flex p-2 sidebar-item  `} onClick={logotFunction}>
            <div className=" profile-sidebar-txt1">Logout</div>
          </div>
    </div>
  );
}

export default Sidebar;
