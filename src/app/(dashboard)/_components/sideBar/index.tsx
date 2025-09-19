"use client";
import React, { Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import DynamicIcon from "./dynamicIcons";
import Routes from "./route.json";
import { signOut } from "next-auth/react";
import { clearReduxData } from "@/lib/clear_redux";
import { useAppDispatch } from "@/redux/hooks";
import { Modal } from "antd";

function SideBar(props: any) {
  const navigation = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
      Modal.confirm({
        title: "Are you sure you want to logout?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          clearReduxData(dispatch);
          signOut();
        },
      });
    };
  return (
    <main className="dashboard-SideBar">
      <div className="dashboard-SideBarBox1">
        {Routes.map((item: any, key) => (
          <Fragment key={key}>
            <div className="dashboard-SideBarDevider">{item?.section}</div>
            {item?.routes
              ?.filter((i: any) => i?.role?.includes(props?.data?.role))
              .map((section: any) => (
                <div
                  className={`dashboard-SideBarItem ${
                    pathname?.includes(section?.route) ? "active" : null
                  }`}
                  onClick={() => navigation.push(section?.route)}
                >
                  <div>
                    <DynamicIcon name={section?.icon} size={20} />
                  </div>
                  <div className="ashboard-SideBartext1">{section?.menu}</div>
                </div>
              ))}
          </Fragment>
        ))}
      </div>
      {props?.data?.role == "admin" ? (
        <div
          className={`dashboard-SideBarItem ${
            "/auth/settings" === pathname ? "active" : null
          }`}
          onClick={() => navigation.push("/auth/settings")}
        >
          <div>
            <IoSettingsOutline />
          </div>
          <div className="ashboard-SideBartext1">Settings</div>
        </div>
      ) : null}
      <div
        className="dashboard-SideBarItem"
        style={{ color: "red" }}
        onClick={() => {
          handleLogout
        }}
      >
        <div>
          <IoLogOutOutline />
        </div>
        <div className="ashboard-SideBartext1">Logout</div>
      </div>
    </main>
  );
}

export default SideBar;
