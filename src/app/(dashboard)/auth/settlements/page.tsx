"use client";
import React from "react";
import PageHeader from "@/app/(dashboard)/_components/pageHeader";
import { Button, Tabs } from "antd";
import History from "./_components/history";
import Summary from "./_components/summary";

function Page() {
  const onChange = (key: string) => {};
  return (
    <>
      <PageHeader title={"Settlements"} bredcume={"Dashboard / Settlements"}>
        <div className="d-flex gap-3"></div>
      </PageHeader>
      <Tabs
        size="small"
        style={{ marginTop: -12 }}
        defaultActiveKey="1"
        onChange={onChange}
      >
        <Tabs.TabPane tab={<span>Settlement Summary</span>} key="2">
          <Summary />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>Settlement History</span>} key="3">
          <History />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}

export default Page;
