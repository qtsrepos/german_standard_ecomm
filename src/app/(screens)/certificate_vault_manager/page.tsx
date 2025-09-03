"use client";

import React, { useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import {
  Form,
  Input,
  Button,
  Table,
  notification,
} from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import BannerHead from "../banner_path/page";
const CertificateVaultManager =()=>{
const [form] = Form.useForm();
  const [certificates, setCertificates] = useState([
    { id: 31, title: "Certificate for Ultrasound Course" },
  ]);
  const [gsgCertificates, setGsgCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();

  const onFinish = (values:any) => {
    // Simulate API call
    const newCert = {
      id: Math.floor(Math.random() * 1000),
      title: values.title,
    };
    setCertificates([...certificates, newCert]);
    notificationApi.success({ message: "Certificate uploaded successfully" });
    form.resetFields();
  };

  const handleDelete = (id:any) => {
    setCertificates(certificates.filter((cert) => cert.id !== id));
  };

  const columns = [
    {
      title: "SR.NO",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "VIEW CERTIFICATE",
      key: "view",
      render: () => <EyeOutlined style={{ fontSize: 18 }} />, // Can add link if available
    },
    {
      title: "ACTION",
      key: "action",
      render: (_:any, record:any) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <div className="certificate-page">
        <BannerHead head={"Certificate Vault Manager"} path={`/ Certificate Vault Manager`}/>
      <Container className="mt-2">
        {contextHolder}
        <Accordion defaultActiveKey={['0']} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header className="fw-bold">UPLOAD CERTIFICATE</Accordion.Header>
            <Accordion.Body>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: "Please enter the title" }]}
                >
                  <Input placeholder="Enter the title" />
                </Form.Item>
                <Form.Item
                  name="file"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                >
                  <input type="file" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary" loading={isLoading}>
                    SUBMIT
                  </Button>
                </Form.Item>
              </Form>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>CERTIFICATES</Accordion.Header>
            <Accordion.Body>
              <Table
                columns={columns}
                dataSource={certificates}
                rowKey="id"
                pagination={false}
              />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>GSG CERTIFICATES</Accordion.Header>
            <Accordion.Body>
              {gsgCertificates.length === 0 ? (
                <p className="text-muted mb-0">No records found.</p>
              ) : (
                <Table
                  columns={columns}
                  dataSource={gsgCertificates}
                  rowKey="id"
                  pagination={false}
                />
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </div>
  );
}

export default CertificateVaultManager;