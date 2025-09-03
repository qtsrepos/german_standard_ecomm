"use client";
import React from "react";
import { Tabs } from "antd";
import PageHeader from "@/app/(dashboard)/_components/pageHeader";

import Settings from "./settings";
import Contacts from "./contacts";
import BusinessType from "./businessType";
import States from "./states";
import DeliveryCharge from "./deliveryCharge";

function Page() {
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <PageHeader title={"Settings"} bredcume={"Dashboard / Settings"}>
        <div style={{ width: "400px" }}>
          <div style={{ fontSize: 12, color: "red" }}>
            {" "}
            Warning: Changing Settings in E-commerce Systems
          </div>
          <div style={{ fontSize: 10 }}>
            Making changes to settings in an e-commerce system can have
            significant impacts on your business operations.
          </div>
        </div>
      </PageHeader>
      <Tabs
        size="small"
        style={{ marginTop: -12 }}
        defaultActiveKey="1"
        onChange={onChange}
      >
        <Tabs.TabPane tab={<span>Settings</span>} key="1">
          <Settings />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>Contacts</span>} key="2">
          <Contacts />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>Business Type</span>} key="3">
          <BusinessType />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>States</span>} key="4">
          <States />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>Delivery Charges</span>} key="5">
          <DeliveryCharge />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Page;
