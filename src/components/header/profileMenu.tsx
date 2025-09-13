import { Badge, Button, Modal, notification } from "antd";
import React, { useState } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { RiListUnordered } from "react-icons/ri";
import { PiAddressBook } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { FiUser } from "react-icons/fi";
import API from "../../config/API";
import { GET } from "../../util/apicall";
import { RiNotification2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { clearReduxData } from "@/lib/clear_redux";

const ProfileMenu = (props: any) => {
  const navigation = useRouter();
  const { data: User }: any = useSession();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const favouritesCount = useSelector((state: any) => state?.Favorites?.count);
  const [Notifications, contextHolder] = notification.useNotification();
  const iconSize = 17;
  const OpenLink = (link: any) => {
    if (User?.user) {
      navigation.push(link);
    } else {
      navigation.push("/login");
    }
  };

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
      props.close();
    }
  };

  // const signout = async () => {
  //   const url = API.USER_LOGOUT;
  //   try {
  //     setLoading(true);
  //     const response: any = await GET(url);
  //     if (response?.status) {
  //       Notifications["success"]({
  //         message: `You have been Logged Out.`,
  //         description: "",
  //       });
  //       props.close();
  //       signOut();
  //     } else {
  //       alert("Unable to logout.. please try again..");
  //     }
  //   } catch (err) {
  //     alert("Unable to logout.. please try again..");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="profileMenu-Box1">
      {contextHolder}
      {/* <div className="profileMenu-Icon">
        {User?.user?.image ? (
          <img
            src={User?.user?.image}
            className="Header-ProfileImag"
            alt="profile"
          />
        ) : (
          <HiOutlineUserCircle size={45} color="#d9d9d9" />
        )}
        <div style={{ marginTop: 5, marginBottom: 5, fontWeight: "900" }}>
          {User?.user?.first_name || "User"}
        </div>
      </div> */}

      {User?.user && (
        <>
        <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/dashboard");
              props.close();
            }}
          >
            {/* <div>
              <FiUser size={iconSize} className="profileMenu-Img1" />
            </div> */}
            <div className="profileMenu-Txt1">Dashboard</div>
          </div>
          <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/orders");
              props.close();
            }}
          >
            {/* <div>
              <RiListUnordered size={iconSize} className="profileMenu-Img1" />
            </div> */}
            <div className="profileMenu-Txt1">Orders</div>
          </div>
          <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/downloads");
              props.close();
            }}
          >
            {/* <div>
              <RiListUnordered size={iconSize} className="profileMenu-Img1" />
            </div> */}
            <div className="profileMenu-Txt1">Downloads</div>
          </div>
          <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/purchased_events");
              props.close();
            }}
          >
            {/* <div>
              <RiListUnordered size={iconSize} className="profileMenu-Img1" />
            </div> */}
            <div className="profileMenu-Txt1">Purchased events</div>
          </div>
          <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/address");
              props.close();
            }}
          >
            {/* <div>
              <PiAddressBook size={iconSize} className="profileMenu-Img1" />
            </div> */}
            <div className="profileMenu-Txt1">Address</div>
          </div>
          <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/buy_again");
              props.close();
            }}
          >
            {/* <div>
              <RiListUnordered size={iconSize} className="profileMenu-Img1" />
            </div> */}
            <div className="profileMenu-Txt1">Buy again</div>
          </div>
          <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/profile");
              props.close();
            }}
          >
            {/* <div>
              <FiUser size={iconSize} className="profileMenu-Img1" />
            </div> */}
            <div className="profileMenu-Txt1">Account details</div>
          </div>
          
          <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/favorites");
              props.close();
            }}
          >
            {/* <div>
              <MdFavoriteBorder size={iconSize} className="profileMenu-Img1" />
            </div> */}
            <Badge count={favouritesCount ?? ""} size="small" color={API.COLOR}>
              <div className="profileMenu-Txt1">Wishlist</div>
            </Badge>
          </div>

          {/* <div
            className="profileMenu-Box2"
            onClick={() => {
              OpenLink("/user/notifications");
              props.close();
            }}
          >
            <div>
              <RiNotification2Line
                size={iconSize}
                className="profileMenu-Img1"
              />
            </div>
            <div className="profileMenu-Txt1">Notifications</div>
          </div> */}
        </>
      )}
      <div
            className="profileMenu-Box2"
            onClick={() => logotFunction()}
          >
            {/* <div>
              <MdFavoriteBorder size={iconSize} className="profileMenu-Img1" />
            </div> */}
              <div className="profileMenu-Txt1">{User?.user ? "Logout" : "Login"}</div>
          </div>
      {/* <div style={{ margin: 5 }} />
      <Button
        size="large"
        type="primary"
        block
        onClick={() => logotFunction()}
        loading={loading}
      >
        {User?.user ? "Logout" : "Login"}
      </Button> */}
      {/* {User?.user ? null : (
        <div style={{ marginTop: "10px" }}>
          New Customer? &nbsp;&nbsp;
          <Link
            href="/signup"
            onClick={() => {
              if (typeof props.close === "function") {
                props.close();
              }
            }}
          >
            Sign Up
          </Link>
        </div>
      )} */}
    </div>
  );
};

export default ProfileMenu;
