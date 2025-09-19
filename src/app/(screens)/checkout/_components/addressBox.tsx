"use client";
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import AddressForm from "./addressForm";
import AddressItem from "./addressItem";
import { storeAddress } from "@/redux/slice/checkoutSlice";
import { GET, PUT } from "@/util/apicall";
import API from "@/config/API";
import { useSession } from "next-auth/react";
import { Checkbox, Form, Input, Select } from "antd";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";

function AddressBox() {
  const dispatch = useDispatch();
  const Checkout = useSelector((state: any) => state?.Checkout);
  const [isLoading, setIsLoading] = useState(true);
  const [addNew, setAddNew] = useState(false);
  const [data, setData] = useState<any>([]);
  const [form] = Form.useForm()

  useEffect(() => {
    getAddress();
  }, []);
  const getDefaultAddress = (addresses: any[]) => {
    if (Array.isArray(addresses)) {
      const defaultAddress = addresses.find(
        (item: any) => item.default == true
      );
      if (defaultAddress) {
        dispatch(storeAddress(defaultAddress));
      }
    }
  };
  const getAddress = async () => {
    try {
      const response: any = await GET(API.ADDRESS_GET);
      if (response.status) {
        getDefaultAddress(response?.data);
        setData(response?.data);
      }
      setAddNew(false);
      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
    }
  };
  const setDefaultAddress = async (addr: any) => {
    const url = API.ADDRESS_SET_DEFAULT + addr.id;
    try {
      // setDefaultLoading(true);
      if (addr.default != true) {
        const response: any = await PUT(url, {});
        if (response.status) {
        }
      }
    } catch (err) {
    } finally {
      // setDefaultLoading(false);
    }
  };


  form.setFieldsValue({
    firstName: data[0]?.userDetails.name,
    lastName: data[0]?.userDetails.name,
    country: 'United Arab Emirates',
    streetAddress1: data[0]?.street,
    streetAddress2: data[0]?.fullAddress,
    city: data[0]?.city,
    phone: data[0]?.code+data[0]?.alt_phone,
    email: 'francie@gegroup.co',
  });

  return (
    // <div>
    //   <div className="Cart-row" style={{ padding: 0 }}>
    //     <div className="Cart-txt1">
    //       <span className="Cart-txt1Icon">
    //         <IoLocationOutline />
    //       </span>
    //       DELIVERY ADDRESS
    //     </div>
    //     <div style={{ flex: 1 }} />
    //     <div>
    //       <div
    //         className="Cart-txt2"
    //         style={{ color: "#000", cursor: "pointer" }}
    //         onClick={() => setAddNew(true)}
    //       >
    //         New Address +{" "}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="Cart-line" />
    //   <div style={{ margin: 20 }} />
    //   {isLoading ? (
    //     <div>Loading . . .</div>
    //   ) : (
    //     <div>
    //       {data?.length && !addNew ? (
    //         <Row>
    //           {data?.map((item: any,key:number) => {
    //             return (
    //               <Col sm={6} xs={12} style={{ marginBottom: 10 }} key={key}>

    //                 <AddressItem
    //                   key={item?.id}
    //                   item={item}
    //                   selected={Checkout?.address?.id}
    //                   onSelect={(value: any) => {
    //                     dispatch(storeAddress(value));
    //                     setDefaultAddress(value)
    //                   }}
    //                 />
    //               </Col>
    //             );
    //           })}
    //         </Row>
    //       ) : (
    //         <AddressForm
    //           closable={data?.length ? true : false}
    //           close={() => setAddNew(false)}
    //           onChange={(value: any) => getAddress()}
    //         />
    //       )}
    //     </div>
    //   )}
    //   <br />
    // </div>
    <div className="container mt-4">
      <h5 className="mt-4 mb-4 mt-5 fw-bold">BILLING DETAILS</h5>
      <Form
        layout="vertical"
        form={form}
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Item
              label="First name *"
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input size="large" className="form-control" />
            </Form.Item>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Item
              label="Last name *"
              name="lastName"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input size="large" className="form-control" />
            </Form.Item>
          </div>
        </div>

        <div className="mb-3">
          <Form.Item
            label="Company name (optional)"
            name="companyName"
          >
            <Input size="large" className="form-control" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            label="Country / Region *"
            name="country"
            rules={[{ required: true, message: 'Please select your country' }]}
          >
            United Arab Emirates
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            label="Street address *"
            name="streetAddress1"
            rules={[{ required: true, message: 'Please enter your street address' }]}
          >
            <Input size="large" className="form-control" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            name="streetAddress2"
          >
            <Input size="large" className="form-control" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            label="Town / City *"
            name="city"
            rules={[{ required: true, message: 'Please enter your city' }]}
          >
            <Input size="large" className="form-control" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            label="State / County (optional)"
            name="state"
          >
            <Input size="large" className="form-control" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            // <Form.Item
            label="Phone *"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input size="large" className="form-control" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            label="Email address *"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input size="large" className="form-control" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item name="shipDifferentAddress" valuePropName="checked">
            <Checkbox >Ship to a different address?</Checkbox>
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            label="Order notes (optional)"
            name="orderNotes"
          >
            <TextArea
              rows={4}
              className="form-control"
              placeholder="Notes about your order, e.g., special notes for delivery."
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
export default AddressBox;
