"use client";
import { Tag } from "antd";
import React from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { LuShieldCheck } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";
import { signOut } from "next-auth/react";
import { clearReduxData } from "@/lib/clear_redux";
import { useAppDispatch } from "@/redux/hooks";
import { Modal } from "antd";
function ProfilePopover(props: any) {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        clearReduxData(dispatch);
        signOut({ callbackUrl: "/login" });
      },
    });
  };
  return (
    <div className="dashboard-ProfilePopover">
      <div className="dashboard-ProfilePopoverItem">
        <div>
          {props?.data?.user?.image ? (
            <img src={props?.data?.user?.image} />
          ) : (
            <HiOutlineUserCircle size={60} color="grey" />
          )}
        </div>
        <div>
          <div className="text1">{props?.data?.user?.first_name}</div>
          <div className="text2">{props?.data?.user?.email}</div>
          <Tag color="green" icon={<LuShieldCheck />}>
            {props?.data?.role}
          </Tag>
        </div>
      </div>
      <div className="dashboard-ProfilePopoverItem2">
        <a
          href="https://connect.com.sa/privacypolicy"
          target="_blank"
        >
          Privacy Policy
        </a>
      </div>
      <div className="dashboard-ProfilePopoverItem2">
        <a
          href="https://connect.com.sa/termsofservice"
          target="_blank"
        >
          Terms of Service
        </a>
      </div>
      <div className="dashboard-ProfilePopoverItem2">
        <div>
          <HiOutlineUserCircle size={20} />
        </div>
        <div>View Profile</div>
      </div>
      <div
        className="dashboard-ProfilePopoverItem2"
        onClick={() => {
          handleLogout();
        }}
      >
        <div>
          <IoLogOutOutline size={20} />
        </div>
        <div>Logout</div>
      </div>
    </div>
  );
}

export default ProfilePopover;
