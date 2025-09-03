import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import "../styles.scss";
import { Container } from "react-bootstrap";

function HeaderBreadcrumbs() {
  const router = useRouter();

  const onChange = (key: string) => {
    switch (key) {
      case "1":
        router.push("/cart");
        break;
      case "2":
        router.push("/checkout");
        break;
      case "3":
      //     router.push("/order-complete");
      //     break;
      //   default:
      //     break;
    }
  };

  // Determine active tab based on current route
  const pathname = usePathname();

  const getActiveKey = () => {
    if (pathname.includes("/checkout")) return "2";
    // if (pathname.includes("/order-complete")) return "3";
    return "1";
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <span className="tab-label">SHOPPING CART</span>,
    },
    {
      key: "2",
      label: <span className="tab-label">CHECKOUT</span>,
    },
    {
      key: "3",
      label: <span className="tab-label">ORDER COMPLETE</span>,
    },
  ];

  return (
    <div className="header-breadcrumb-container header-breadcrumb">
      <div className="tab-wrapper">
        <Container>
          <Tabs
            activeKey={getActiveKey()}
            items={items}
            onChange={onChange}
            className="breadcrumb-tabs pt-2"
            tabBarGutter={80}
            tabBarStyle={{
              fontWeight: 600,
            }}
          />
        </Container>
      </div>
    </div>
  );
}

export default HeaderBreadcrumbs;
