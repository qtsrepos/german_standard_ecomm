"use client";
import React, { use } from "react";
import { Row, Col } from "react-bootstrap";
import { Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

const DownloadsPage = () => {
    return (
        <div style={{ backgroundColor: "#e64017", padding: "1rem" }}>
          <Row className="align-items-center text-white">
            <Col xs="auto">
              <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
            </Col>
            <Col>
              <Text style={{ color: "white",}}>
                No downloads available yet. 
              </Text>
              <Text>  </Text>
              <Link href="/products">
                <Text strong underline style={{ color: "white", cursor: "pointer" }}>
                  BROWSE PRODUCTS
                </Text>
              </Link>
            </Col>
          </Row>
        </div>
      );
}

export default DownloadsPage;