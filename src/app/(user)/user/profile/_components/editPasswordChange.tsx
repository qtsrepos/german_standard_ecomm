"use client";
import { Button, Col, Form, Input, Row, notification } from "antd";
import React from "react";
function EditPasswordChange(props: any) {
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();

  return (
    <Form form={form} onFinish={props?.editPassowrd}>
      {contextHolder}
      <div className="">
        {props?.type == "update" ? (
          <div>
            <Form.Item
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Previous password",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter Previous password"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
        ) : null}

        <div>
          <Form.Item
            name="newPassword"
            hasFeedback
            rules={[
              {
                required: true,
                message: "enter your password!",
              },
              {
                min: 8,
                message: "At least 8 characters",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter New Password"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="confirm"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Confirm Password"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>
        <div>
          <Button
            loading={props?.loading}
            type="primary"
            size="large"
            onClick={() => form.submit()}
          >
            Update
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default EditPasswordChange;
