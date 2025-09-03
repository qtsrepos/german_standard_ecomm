"use client";
import React from "react";
import { Layout } from "antd";

import Header from "../_components/header";
import SideBar from "../_components/sideBar";

function ScreenLayout(props: any) {
  return (
    <Layout>
      <Header data={props?.data} />
      <Layout.Sider
        width={230}
        style={{
          backgroundColor: "#fff",
          height: "100vh",
          paddingTop: "8vh",
        }}
      >
        <SideBar data={props?.data} />
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          <div className="dashboard-Layout">{props?.children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default ScreenLayout;
