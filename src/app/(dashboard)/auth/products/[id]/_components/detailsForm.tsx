import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, notification, Select, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import API from "@/config/API_ADMIN";
import Loading from "../../../../_components/loading";
import Error from "../../../../_components/error";
import { PUT } from "@/util/apicall";

function DetailsForm() {
  const params = useParams();
  const [form] = Form.useForm();
  const [selectedC, setCategory] = useState<null | string | number>(null);
  const [Notifications, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const { data: category } = useQuery<any>({
    queryKey: [API.CATEGORY],
    select: (res) => {
      if (res?.status) return res?.data;
      return [];
    },
  });

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<any>({
    queryKey: [API.PRODUCTS_GETONE_STORE + params.id],
    select: (res) => {
      if (res?.status) return res?.data;
      return {};
    },
  });

  const subcategory = useMemo(() => {
    if (Array.isArray(category)) {
      const selected = category?.find(
        (item: any) => item?.id == (selectedC || product?.category)
      );
      if (selected) return selected?.sub_categories;
    }
    return [];
  }, [selectedC, product?.category]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        category: String(product?.category),
        subCategory: String(product?.subCategory),
      });
    }
  }, [product]);

  const mutationUpdate = useMutation({
    mutationFn: async (body: object) =>
      await PUT(API.PRODUCTS_UPDATE + params.id, body),
    onError: (error, variables, context) => {
      Notifications["error"]({
        message: error.message,
      });
    },
    onSuccess: (data, variables, context) => {
      Notifications["success"]({
        message: `Product Upated Successfully`,
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    },
  });
  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{}}
      onFinish={(value) => mutationUpdate.mutate(value)}
    >
      {contextHolder}
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error title={error?.message} />
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-12">
                <Form.Item
                  label="Product Name"
                  name={"name"}
                  rules={[
                    { required: true, message: "Please Enter Product Name" },
                    { max: 200, message: "Product name length is too much" },
                  ]}
                >
                  <Input placeholder="Title" size="large" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name={"description"}
                  label="Product Description"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter product Description",
                    },
                    {
                      max: 250,
                      message: "Product Description length is too much",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Description"
                    maxLength={250}
                  />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name={"category"}
                  label={"Product Category"}
                  rules={[{ required: true, message: "Please chose Category" }]}
                >
                  <Select
                    style={{ width: "100%" }}
                    size="large"
                    allowClear
                    onSelect={(v) => {
                      setCategory(v);
                      form.setFieldsValue({ subCategory: undefined });
                    }}
                    placeholder="Select category"
                    loading={isLoading}
                    options={
                      Array.isArray(category)
                        ? category?.map((it: any) => ({
                            value: it?.id,
                            label: it?.name,
                          }))
                        : []
                    }
                  ></Select>
                </Form.Item>
              </div>
              <div className="col-12">
                  <Form.Item
                    label={"Product Subcategory"}
                    name={"subCategory"}
                    rules={[
                      { required: true, message: "Please chose Subcategory" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      size="large"
                      allowClear
                      placeholder="Select Subcategory"
                      options={
                        Array.isArray(subcategory)
                          ? subcategory?.map((it: any) => ({
                              value: it?._id,
                              label: it?.name,
                            }))
                          : []
                      }
                    ></Select>
                  </Form.Item>
                </div>
              {/* <div className="col-12">
              <Form.Item
                name="is_vegetarian"
                label="Food Type"
                rules={[{ required: true, message: "Please select food type" }]}
              >
                <Radio.Group>
                  <Radio value= {true}>Vegetarian</Radio>
                  <Radio value= {false}>Non-Vegetarian</Radio>
                </Radio.Group>
              </Form.Item>
            </div> */}
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  name={"brand"}
                  label="Brand"
                  rules={[
                    { required: true, message: "Please Enter Brand Name" },
                    { max: 200, message: "Length is too much" },
                  ]}
                >
                  <Input placeholder="Brand Name" size="large" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Manufacture"
                  name={"manufacture"}
                  rules={[
                    { required: true, message: "Please Enter Manufacturer" },
                    { max: 200, message: "Length is too much" },
                  ]}
                >
                  <Input placeholder="Manufacture" size="large" />
                </Form.Item>
              </div>

              <div className="col-md-6">
                <Form.Item
                  label="Barcode"
                  name={"bar_code"}
                  rules={[
                    { required: true, message: "Please Enter Barcode" },
                    {
                      max: 16,
                      message: "Product SKU length must be below 16 chars",
                    },
                    {
                      min: 10,
                      message:
                        "Product SKU length must be atleast 10 characters",
                    },
                  ]}
                >
                  <Input placeholder="Barcode" size="large" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  name={"sku"}
                  label="SKU"
                  rules={[
                    { required: true, message: "Please Enter SKU" },
                    {
                      max: 16,
                      message: "Product SKU length must be below 16 chars",
                    },
                    {
                      min: 10,
                      message:
                        "Product SKU length must be atleast 10 characters",
                    },
                  ]}
                >
                  <Input placeholder="sku" size="large" />
                </Form.Item>
              </div>

              <div className="col-md-6">
                <Form.Item
                  label="Purchase Price"
                  name={"purchase_rate"}
                  rules={[
                    {
                      required: true,
                      message: "Enter Purchase rate of the Product",
                    },
                  ]}
                >
                  <Input
                    placeholder="0.00"
                    type="number"
                    max={1000000}
                    size="large"
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Retail Price"
                  name={"retail_rate"}
                  rules={[
                    {
                      required: true,
                      message: "Enter Reail Rate of the product",
                    },
                  ]}
                >
                  <Input
                    placeholder="0.00"
                    type="number"
                    max={1000000}
                    size="large"
                  />
                </Form.Item>
              </div>

              <div className="col-md-6">
                <Form.Item
                  label="Available Unit"
                  name={"unit"}
                  rules={[
                    {
                      required: true,
                      message: "Enter Available Units.",
                    },
                  ]}
                >
                  <Input
                    placeholder="Unit"
                    type="number"
                    max={10000}
                    size="large"
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  name={"units"}
                  label="Available Unit for Bulk order"
                  rules={[
                    {
                      required: true,
                      message: "Enter Available units for Bulk Order",
                    },
                  ]}
                >
                  <Input
                    placeholder="Available Units"
                    max={10000}
                    size="large"
                    type="number"
                    prefix={0}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  name={"bulk_order"}
                  label="Bulk Order Status"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please Select if you suppor Bulk order for this Product",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    allowClear
                    onChange={() => {}}
                    placeholder="Select Bulk Order"
                    size="large"
                    options={[
                      { value: true, label: "Accept Bulk Order" },
                      { value: false, label: "Not Accept" },
                    ]}
                  ></Select>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Product Status"
                  name={"status"}
                  rules={[
                    {
                      required: true,
                      message: "Please Choose the Status of The product",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    size="large"
                    allowClear
                    onChange={() => {}}
                    placeholder="Select Status"
                    options={[
                      { value: true, label: "Available" },
                      { value: false, label: "Not Available" },
                    ]}
                  ></Select>
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="col-12" style={{ height: "270px" }}>
            <p className="mb-2">Product Speicifications</p>
            <div style={{ backgroundColor: "white" }} className="h-100">
              <Form.Item name={"specifications"}>
                <ReactQuill
                  theme="snow"
                  value={product?.specifications || ""}
                  onChange={(v) => form.setFieldValue("specifications", v)}
                  style={{ backgroundColor: "white", height: "230px" }}
                />{" "}
              </Form.Item>
            </div>
          </div>
          <div className="col-8"></div>
          <div className="col-4 mt-5">
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={mutationUpdate.isPending}
            >
              Update Details
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
}

export default DetailsForm;
