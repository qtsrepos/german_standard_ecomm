"use client";
import React from "react";
import Image from "next/image";
import { Tag, Popover } from "antd";

import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoNotifications, IoSettingsOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineErrorOutline } from "react-icons/md";
import { LuShieldCheck } from "react-icons/lu";

import LogoBox from "@/config/logoBox.png";
import ProfilePopover from "./profilePopover";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Clock = dynamic(() => import("react-live-clock"), {
  ssr: false,
});
function Header(props: any) {
  const router = useRouter();
  return (
    <header className="dashboard-Header">
      <div className="dashboard-HeaderBox5">
        <div>
          <Image src={LogoBox} alt="logo" />
        </div>
        <div>
          {props?.data?.role === "admin" ? "Admin" : "Seller"} Panel
          <br />
          <div className="dashboard-Headertext3">V 1.0.0</div>
        </div>
      </div>
      <div className="dashboard-HeaderBox3">
        <a href="/">Website</a>
      </div>
      <div className="dashboard-HeaderBox3">
        <Clock format={"h:mm:ss A"} ticking={true} />
      </div>
      <div style={{ flex: 1 }} />
      <div className="dashboard-HeaderBox1">
        {props?.data?.user?.mail_verify ? null : (
          <Tag color="red" icon={<MdOutlineErrorOutline />}>
            Verify Mail
          </Tag>
        )}
        <div>
          <Tag color="green" icon={<LuShieldCheck />}>
            {props?.data?.role}
          </Tag>
        </div>

        {/* <div className="dashboard-HeaderBox3">help</div> */}
        {/* <div className="dashboard-HeaderBox3">
          <IoNotifications size={23} />
        </div> */}
        {props?.data?.role === "admin" ? (
          <div
            className="dashboard-HeaderBox3"
            onClick={() => router.push("/auth/settings")}
          >
            <IoSettingsOutline size={23} />
          </div>
        ) : null}
        <Popover
          content={<ProfilePopover data={props?.data} />}
          placement="bottomLeft"
          arrow={false}
        >
          <div className="dashboard-HeaderBox2">
            {props?.data?.user?.image ? (
              <img src={props?.data?.user?.image} />
            ) : (
              <HiOutlineUserCircle size={40} />
            )}
            <div className="dashboard-HeaderBox4">
              <div className="dashboard-Headertext1">
                {props?.data?.user?.first_name}
              </div>
              <div className="dashboard-Headertext2">
                {props?.data?.user?.email}
              </div>
            </div>
            <div>
              <IoIosArrowDown size={20} />
            </div>
          </div>
        </Popover>
      </div>
    </header>
  );
}

export default Header;
