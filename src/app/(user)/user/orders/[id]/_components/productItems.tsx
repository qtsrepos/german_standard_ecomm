import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Rate,
  Tag,
  notification,
} from "antd";
import Meta from "antd/es/card/Meta";
import moment from "moment";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import API from "../../../../../../config/API";
import { POST } from "../../../../../../util/apicall";
import { reduxSettings } from "../../../../../../redux/slice/settingsSlice";
import { log } from "console";
import "../../../../user/style.scss";
import { useRouter } from "next/navigation";

function ProductItems(props: any) {
  const Settings = useSelector(reduxSettings);
  const [form] = Form.useForm();
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const [showRating, setShowRating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [Notifications, contextHolder] = notification.useNotification();
  const formSubmitHandler = async (values: any) => {
    const url = API.STORE_REVIEW_CREATE;
    const obj = {
      ...values,
      orderId: props?.data?.id,
    };
    setIsLoading(true);
    try {
      const response: any = await POST(url, obj);
      if (response.status) {
        Notifications["success"]({
          message: `Review has been Successfully added`,
          description: "",
        });
        setShowRating(false);
        props?.getOrderDetails();
      } else {
        Notifications["error"]({
          message: response?.message ?? "",
          description: "",
        });
      }
    } catch (err) {
      Notifications["error"]({
        message: `Something went wrong..`,
        description: "",
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log(props?.data);
  return (
    <div className="px-2">
      {contextHolder}
      <p className="p-tag">Order <span >{props?.data?.order_id}</span> was placed on
        <span className="font-weight-bold"> {moment(props?.data?.createdAt).format("MMMM D, YYYY")}</span> and is currently
        <span className="font-weight-bold"> {props?.data?.status}</span> .</p>
      <h4 className="my-4 py-2 font-weight-bold">ORDER DETAILS</h4>
      <div className="mx-2">
        <div className="d-flex justify-content-between gap-2 border-bottom p-3">
          <h6 className="font-weight-bold m-0">PRODUCT</h6>
          <h6 className="font-weight-bold m-0">TOTAL</h6>
        </div>
        {props?.data?.orderItems?.map((item: any) => (
          <div className="row border-bottom p-3 " key={item.id}>
             <div className="col-8 m-0 font-1">{item?.name} × {item?.quantity}</div>
             <div className="col-4 text-end m-0 font-1">{item.totalPrice.toFixed(2)} AED</div>
          </div>
        ))}
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 ">
          <p className="m-0 font-2 ">Subtotal</p>
          <p className="m-0 font-2 text-danger">{props?.data?.total.toFixed(2)} AED</p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3" >
          <p className="m-0 font-2">Shipping</p>
          <p className="m-0 font-2">{props?.data?.deliveryCharge.toFixed(2)} AED</p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 ">
          <p className="m-0 font-2 ">VAT</p>
          <p className="m-0 font-2 text-danger">{props?.data?.tax.toFixed(2)} AED</p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3 " >
          <p className="m-0 font-2">Payment method</p>
          <p className="m-0 font-2">{props?.data?.paymentType} </p>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3" >
          <h5 className="m-0">TOTAL</h5>
          <h5 className="m-0 text-danger">{props?.data?.grandTotal.toFixed(2)} AED</h5>
        </div>
        <div className="d-flex justify-content-between gap-3 border-bottom p-3" >
          <h5 className="m-0">ACTIONS</h5>
          <div className="d-flex gap-2">
            <button className="list-btn" onClick={()=>router.push(`/track_order/${props?.data?.order_id}`)}>TRACK ORDER</button>
            <button className="list-btn">INVOICE</button>
          </div>
        </div>
      </div>

<div className="mt-5 mb-5">
  <p style={{fontSize:"13px"}}>Note:<br/>
  <span className="text-muted">Click The Below To Track Your Order</span></p>
  <Button className="btn-trackOrder" onClick={()=>router.push(`/track_order/${props?.data?.order_id}`)}>TRACK ORDER</Button>
</div>

      <div className="d-flex flex-column gap-3">
        <Card bordered={false} style={{boxShadow:"none"}}>
          <Meta
            title="BILLING & SHIPPING ADDRESS"
            style={{padding:"0px"}}
            description={
              <div className="text-dark">
                <div className="fw-bold">{props?.data?.address?.name}</div>

                <div>City: {props?.data?.address?.city}</div>
                <div>PinCode: {props?.data?.address?.pin_code}</div>
                <div>State: {props?.data?.address?.state}</div>
                <div>Type: {props?.data?.address?.type}</div>
                <div>
                  Address: {props?.data?.address?.fullAddress},
                  {props?.data?.address?.geo_location}
                </div>
                <div className="fw-bold">
                  Phone Number: {props?.data?.address?.code ?? ""}{" "}
                  {props?.data?.address?.alt_phone ?? ""}
                </div>
              </div>
            }
          />
        </Card>
        {/* {Array.isArray(props?.data?.orderItems) == true
          ? props?.data?.orderItems.map((item: any) => (
            <Card bordered={false} className="">
              <Row>
                <Col md="6">
                  <Meta
                    avatar={
                      <Avatar src={item.image} size={80} shape="square" />
                    }
                    title={
                      <div className="text-capitalize">{`${item.name} `}</div> //${getVariantData(item?.variantDetails)}
                    }
                    description={
                      <div className="text-dark">
                        <div>Seller: {props?.data?.store_name}</div>

                        <div>
                          Ordered on:{" "}
                          {moment(item.createdAt).format("DD/MM/YYYY")}
                        </div>
                      </div>
                    }
                  />
                </Col>
                <Col md="6">
                  <div>Quantity: {item?.quantity}</div>
                  <div>
                    Each: {" "}
                    {Number(item?.price)?.toFixed(2)} {Settings.currency}
                  </div>
                  <h6 className="text-dark fw-bold my-2">
                    Total: {" "}
                    {Number(props?.data?.grandTotal)?.toFixed(2)} {Settings.currency}
                  </h6>
                </Col>
              </Row>

              <div className="mt-2">
                {Array.isArray(item?.combination) == true ? (
                  <div>
                    {item?.combination?.map((item: any, key: number) => {
                      return (
                        <Tag bordered={false} key={key}>
                          <span>{`${item.variant}: ${item?.value} `}</span>
                        </Tag>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </Card>
          ))
          : null}
        {props?.data?.review == true ? (
          <Button
            onClick={() => setShowRating((state) => !state)}
            className="mt-2"
            size="middle"
          >
            Rate this store
          </Button>
        ) : props?.data?.review == false &&
          props?.data?.status == "delivered" ? (
          <div className="shadow-sm p-3">
            <div className="d-flex justify-content-between">
              <p className="fw-bold mb-0">Your Review</p>
              <Button
                onClick={() => setShowRating((state) => !state)}
                className="mt-2"
                size="small"
              >
                Edit Review
              </Button>
            </div>
            <p>{props?.data?.storeReviews?.remark}</p>
            <Rate
              tooltips={desc}
              disabled
              value={props?.data?.storeReviews?.rating}
              style={{ fontSize: 20 }}
            />
          </div>
        ) : null}
        {showRating ? (
          <Card bordered={false} className="mt-2">
            <Row>
              <Col md="6">
                Share us your experience with this store to improve.
              </Col>
              <Col md="6">
                <Form form={form} onFinish={formSubmitHandler}>
                  <div className="">
                    <Form.Item
                      name={"rating"}
                      rules={[
                        { required: true, message: "Pease add a Rating" },
                      ]}
                    >
                      <Rate
                        tooltips={desc}
                        value={0}
                        style={{ fontSize: 40 }}
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    name={"remark"}
                    rules={[{ required: true, message: "Enter Your Review" }]}
                  >
                    <Input.TextArea
                      placeholder="Enter your review here . . . "
                      rows={4}
                      name="remark"
                    />
                  </Form.Item>

                  <Row>
                    <Col sm="6" xs="6"></Col>
                    <Col sm="6" xs="6">
                      <Button
                        style={{ height: 49 }}
                        loading={isLoading}
                        size="large"
                        block
                        type="primary"
                        onClick={() => form.submit()}
                      >
                        Done
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Card>
        ) : null} */}
      </div>
    </div >
  );
}

export default ProductItems;
