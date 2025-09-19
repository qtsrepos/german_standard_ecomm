import React, { useState, useEffect } from "react";
import { Col, Row, Container } from "react-bootstrap";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Radio,
  notification,
  Space,
} from "antd";
import LocationPicker from "../../../../(dashboard)/_components/location_picker";
import API from "../../../../../config/API";

function Step2({ businessType, formData, moveToNextStep, goBack }: any) {
  const [form] = Form.useForm();
  const [location, setLocation] = useState<any>(null); 
  const [OpenPicker, setOpenPicker] = useState(false);
  const [Notifications, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (formData?.business_location) {
      const [lat, lng] = formData.business_location.split(" ").map(Number);
      setLocation({ lat, lng });
    }
  }, [formData]);

  const onFinish = async (values: any) => {
    if (location?.lat && location?.lng) {
      const data = { ...values, lat: location.lat, long: location.lng };
      moveToNextStep({ step2Data: data });
    } else {
      Notifications["warning"]({
        message: `Please choose your location`,
      });
    }
  };

  const array = Array.isArray(businessType)
    ? businessType.map((item: any) => ({
        ...item,
        value: item.name,
      }))
    : [];

  return (
    <div className="sellerRegister-stepbox">
      {contextHolder}
      <Container>
        <Row>
          <Col md={4}>
            <Form
              form={form}
              onFinish={onFinish}
              initialValues={{
                store_name: formData?.store_name,
                business_address: formData?.business_address,
                business_location: formData?.business_location,
                business_types: formData?.business_types,
                trn_number: formData?.trn_number,
                trade_licencse_no: formData?.trade_licencse_no,
                upscs: formData?.upscs,
                manufacture: formData?.manufacture,
                agreement: formData?.agreement,
              }}
            >
              <div className="input-form-label">Store Name</div>
              <Form.Item
                name="store_name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Store Name",
                  },
                  {
                    max: 50,
                    message: "Store Name is too long",
                  },
                ]}
              >
                <Input placeholder="Store Name" size="large" />
              </Form.Item>
              <div className="input-form-label">Business Location</div>
              <Form.Item
                name="business_address"
                rules={[
                  {
                    required: true,
                    message: "Please enter Business Location",
                  },
                  {
                    max: 200,
                    message: "Business Location is too long",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter your Business Location"
                  size="large"
                  rows={3}
                />
              </Form.Item>
              <div className="input-form-label">Locate your Business</div>
              <Form.Item
                name="business_location"
                rules={[
                  {
                    required: true,
                    message: "Please locate your Business",
                  },
                  {
                    max: 100,
                    message: "Location is too long",
                  },
                ]}
              >
                <Input
                  placeholder="Store Location"
                  size="large"
                  onClick={() => setOpenPicker(true)}
                />
              </Form.Item>
              <div className="input-form-label">Business Type</div>
              <Form.Item
                name="business_types"
                rules={[
                  {
                    required: true,
                    message: "Please select Business Type",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={array}
                />
              </Form.Item>
              <div className="input-form-label">Trn Number</div>
              <Form.Item
                name="trn_number"
                rules={[
                  {
                    required: true,
                    message: "TRN Number is required",
                  },
                  {
                    max: 30,
                    message: "TRN Number is too long",
                  },
                ]}
              >
                <Input placeholder="Enter TRN Number" size="large" />
              </Form.Item>
              <div className="input-form-label">Trade License No</div>
              <Form.Item
                name={"trade_licencse_no"}
                rules={[
                  {
                    required: true,
                    message: "License Number is required",
                  },
                  {
                    max: 30,
                    message: "Trade License Number is too long",
                  },
                ]}
              >
                <Input placeholder="Enter Trade License No" size="large" />
              </Form.Item>
              <Row>
                <Col md="6" xs={6}>
                  <Button onClick={() => goBack()} block size="large">
                    Back
                  </Button>
                </Col>
                <Col md="6" xs={6}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block size="large">
                      Continue
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
      {OpenPicker && (
        <LocationPicker
          open={OpenPicker}
          defaultLocation={location}
          close={() => setOpenPicker(false)}
          onChange={(lat: number, lng: number) => {
            setLocation({ lat, lng });
            form.setFieldValue("business_location", `${lat} ${lng}`);
          }}
        />
      )}
    </div>
  );
}

export default Step2;
