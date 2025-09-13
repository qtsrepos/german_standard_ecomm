"use client";

import React from "react";
import { Row, Col } from "react-bootstrap";
import { Typography, Card } from "antd";
import {
  FileTextOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { IoDownloadOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import "./style.scss";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

const items = [
  { title: "Orders", icon: <FileTextOutlined />, path: "/user/orders" },
  { title: "Downloads", icon: <IoDownloadOutline />, path: "/user/downloads" },
  { title: "Purchased Events", icon: <SettingOutlined />, path: "/user/purchased-events" },
  { title: "Addresses", icon: <EnvironmentOutlined />, path: "/user/address"},
  { title: "Buy Again", icon: <SettingOutlined />, path: "/user/buy-again" },
  { title: "Account Details", icon: <FaRegUserCircle />, path: "/user/account-details" },
  { title: "Wishlist", icon: <HeartOutlined />, path: "/user/favorites" },
  { title: "Logout", icon: <LuLogOut />, path: "/user/logout" },
];

const AccountDashboard = () => {
  return (
    <div className="container mt-4">
      <Typography>
        <p style={{ fontSize: "16px",color:"#7a7a7a"}}> 
          Hello <Text style={{ fontSize: "16px",color:"#7a7a7a"}} strong>Francis Rillera</Text> (not <Text style={{ fontSize: "16px",color:"#7a7a7a"}} strong>Francis Rillera</Text>?{" "}
          <Text type="danger">Log out</Text>)
        </p>
        <p style={{ fontSize: "16px",color:"#7a7a7a"}}>
          From your account dashboard you can view your{" "}
          <Link className="text-decoration-none text-danger" href={"/user/orders"} type="danger">recent orders</Link>, manage your{" "}
          <Link className="text-decoration-none text-danger" href={"/user/address"} type="danger">shipping and billing addresses</Link>, and{" "}
          <Link className="text-decoration-none text-danger" href={"/user/account-details"} type="danger">edit your password and account details</Link>.
        </p>
      </Typography>

      <Row className="mt-4 g-4">
        {items.map(({ title, icon, path }) => (
          <Col xs={12} sm={6} md={4} key={title}>
            <Link href={path} className="text-decoration-none">
            <Card
              hoverable
              className={`text-center`}
              style={{ minHeight: 120 }}
            >
              <div className="icon" style={{ fontSize: "50px", fontWeight:400,color:"#bbb"}}>{icon}</div>
              <h6 style={{
                fontSize:"15px",
                fontWeight: 550,
              }}>{title.toUpperCase()}</h6>
            </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AccountDashboard;
