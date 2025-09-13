"use client";
import { Button, Checkbox, Form, Input, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ImagePicker from "@/app/(dashboard)/_components/ImagePicker/imagePicker";
import API from "@/config/API_ADMIN";
import { COMPRESS_IMAGE, POST, PUT } from "@/util/apicall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import '../styles.scss'
type Props = {
  visible: boolean;
  data: any;
  onClose: () => void;
  onChange: () => void;
};
function FormModal(props: Props) {
  const [form] = Form.useForm();
  const [image, setImage] = useState<any>();
  const [Notifications, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const { data: session }: any = useSession();
  //functions

  useEffect(() => {
    if (props?.data?.id) {
      form.setFieldsValue({
        description: props?.data?.description,
        title: props?.data?.title,
        status: props?.data?.status,
      });
      setImage({ url: props?.data?.img_desk });
    } else {
      form.resetFields();
    }
  }, [props?.visible]);
  const mutationCreate = useMutation({
    mutationFn: async (body: any) => {
      let imageUrl: any = { url: props?.data?.img_desk };
      if (image?.file) {
        imageUrl = await COMPRESS_IMAGE(image?.file);
      }
      const obj = {
        description: body?.description,
        img_desk: imageUrl.url,
        status:
          session?.role === "admin" && props?.data?.id ? body?.status : true,
        title: body?.title,
      };
      if (props?.data?.id) {
        return PUT(API.BANNER_EDIT + props?.data?.id, obj);
      }
      return POST(API.BANNER_ADD, obj);
    },
    onError: (error, variables, context) => {
      Notifications["error"]({
        message: error.message,
      });
    },
    onSuccess: (data, variables, context) => {
      onClose();
      Notifications["success"]({
        message: `Successfully ${props?.data?.id ? "updated" : "Added"} Banner`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin_banners"] });
    },
  });
  const onClose = () => {
    props?.onClose();
    form.resetFields();
    setImage({});
  };

  const onFinish = async (val: any) => {
    if (!image) {
      Notifications["error"]({
        message: `Please Add Banner Image`,
      });
    } else {
      mutationCreate.mutate({ ...val });
    }
  };

  return (
    <Modal
      open={props?.visible}
      title={`${props?.data?._id ? "Edit" : "New"} Banner`}
      onCancel={() => props.onClose()}
      footer={false}
      centered
      width={900}
    >
      {contextHolder}
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row>
          <Col sm={6}>
            <div className="pb-2">Banner Image</div>
            <ImagePicker
              fileURL={image?.url ?? props?.data?.img_desk}
              onChange={(val:any) => setImage(val)}
              aspectRatio={17 / 5}
              width={"100%"}
              height={
                session?.role === "admin" && props?.data?.id ? "47vh" : "40vh"
              }
            />
          </Col>
          <Col sm={6}>
            <Form.Item label="Title" name="title">
              <Input placeholder="Title" size="large" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea placeholder="Description" rows={3} size="large" />
            </Form.Item>
            {session?.role === "admin" && props?.data?.id ? (
              <Form.Item name="status" label="Status" valuePropName="checked">
                <Checkbox defaultChecked>Show in HomePage</Checkbox>
              </Form.Item>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col sm={6}></Col>
          <Col sm={6}>
            <Row>
              <Col sm={6}>
                <Button block size="large" onClick={() => props.onClose()}>
                  Close
                </Button>
              </Col>
              <Col sm={6}>
                <Button
                  htmlType="submit"
                  block
                  size="large"
                  type="primary"
                  loading={mutationCreate.isPending}
                >
                  Done
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default FormModal;
