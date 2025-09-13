"use client";
// pages/raise-a-ticket.js
import React from 'react';
import { Form, Input, Select, Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import BannerHead from '../banner_path/page';

const { Option } = Select;
const { Dragger } = Upload;

const RaiseATicket = () => {
  const [form] = Form.useForm();

  const onFinish = (values:any) => {
    console.log('Form submitted: ', values);
  };

  return (
    <>
    <BannerHead head={"Rise A Ticket"} path={`/ Rise a ticket`}/>
    <div className="container my-5">
      <p className="text-secondary">
        Simply fill out the form below to access our expert support team, committed to resolving your queries efficiently and effectively. Your satisfaction is our priority, and we’re here to ensure your experience with German Standard Group remains seamless and successful.
      </p>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
        className='fw-bold'
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter your username' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Email"
          className='fw-bold'
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Select your issue"
          className='fw-bold'
          name="issue"
          rules={[{ required: true, message: 'Please select an issue type' }]}
        >
          <Select placeholder="Choose an issue">
            <Option value="order">Order Related</Option>
            <Option value="product">Product Related</Option>
            <Option value="payment">General Enquiry</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item label="File Upload" name="file" className='fw-bold'>
          <Dragger name="file" multiple={false} beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag a file to this area to upload</p>
          </Dragger>
        </Form.Item>

        <Form.Item label="Additional Comments" name="comments" className='fw-bold'>
          <Input.TextArea rows={5} placeholder="Enter any additional details" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
    </>
  );
};

export default RaiseATicket;
