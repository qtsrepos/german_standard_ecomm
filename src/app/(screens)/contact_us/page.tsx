// "use client";

// import {
//   Breadcrumb,
//   Row,
//   Form,
//   Input,
//   Select,
//   Button,
//   notification,
// } from "antd";
// import Link from "next/link";
// import React, { useState } from "react";
// import { Col, Container } from "react-bootstrap";
// import { MdWhatsapp } from "react-icons/md";
// import { IoCallOutline, IoMailUnreadOutline } from "react-icons/io5";
// import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
// import { useSelector } from "react-redux";
// import API from "@/config/API";
// import { useTranslation } from "react-i18next";
// import { POST } from "@/util/apicall";
// import Loading from "@/components/loading";

// function ContactUs() {
//   const [form] = Form.useForm();
//   const { t, ready } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);
//   const Settings = useSelector((state: any) => state.Settings.Settings);
//   const [notificationApi, contextHolder] = notification.useNotification();

//   const map = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500981.5435332914!2d75.90183339273558!3d11.193679953593888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7cd005326b01f%3A0x8723aaad9850c814!2sNALAKATH%20FRUITS%20PERINTHALMANNA!5e0!3m2!1sen!2sin!4v1743585687039!5m2!1sen!2sin" width="100%" height="300" style="border:0;border-radius:10px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

//   const onFinish = async (values: any) => {
//     try {
//       setIsLoading(true);
//       const response = await POST(API.ENQUIRY_CREATE, values);

//       if (response.status) {
//         notificationApi.success({ message: "Successfully Submitted" });
//         form.resetFields();
//       } else {
//         notificationApi.error({ message: "Failed to Submit Request" });
//       }
//     } catch (error) {
//       notificationApi.error({ message: "An error occurred" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <> 
//       {!ready ? <Loading /> : (
//         <div className="contact-container">
//           <Container>
//             {contextHolder}
//             <Breadcrumb
//               items={[
//                 { title: <Link href="/">Home</Link> },
//                 { title: "Contact Us" },
//               ]}
//             />
//             <h1 className="contact-title py-md-5 py-2">{t("contact_us1.contact.contact_us_a")}</h1>

//             <Row className="contact-row">
//               {/* Left Section - Map & Contact Info */}
//               <Col md={6} xs={12}>
//                 <div className="map-container" dangerouslySetInnerHTML={{ __html: map }} />
//                 <div className="contact-details">
//                   <div className="contact-item">
//                     <MdWhatsapp style={{ fontSize: "28px", color: "#25D366", marginRight: "15px" }} />
//                     <a href={`https://wa.me/${Settings?.contactNumber}`} target="_blank" rel="noreferrer">
//                       WhatsApp: {Settings?.contactNumber}
//                     </a>
//                   </div>
//                   <div className="contact-item">
//                     <IoCallOutline style={{ fontSize: "28px", color: "#007BFF", marginRight: "15px" }} />
//                     <a href={`tel:${Settings?.contactNumber}`}>
//                       Support: {Settings?.contactNumber}
//                     </a>
//                   </div>
//                   <div className="contact-item">
//                     <IoMailUnreadOutline style={{ fontSize: "28px", color: "#FF5733", marginRight: "15px" }} />
//                     <a href={`mailto:${Settings?.contactEmail}`}>
//                       Email: {Settings?.contactEmail}
//                     </a>
//                   </div>
//                   <div className="contact-item">
//                     <HiOutlineBuildingOffice2 style={{ fontSize: "28px", color: "#5A189A", marginRight: "15px" }} />
//                     <span>Office: {Settings?.address}</span>
//                   </div>
//                 </div>
//               </Col>

//               {/* Right Section - Contact Form */}
//               <Col className="px-md-5" md={6} xs={12}>
//                 <div className="form-container">
//                   <h2 className="form-title">{t("contact_us1.contact.send_message")}</h2>
//                   <Form form={form} onFinish={onFinish} layout="vertical">
//                     <Form.Item name="subject" label={t("contact_us1.contact.subject")} rules={[{ required: true }]}>
//                       <Select>
//                         <Select.Option value="booking">Booking</Select.Option>
//                         <Select.Option value="orders">Orders</Select.Option>
//                         <Select.Option value="services">Services</Select.Option>
//                         <Select.Option value="others">Others</Select.Option>
//                       </Select>
//                     </Form.Item>
//                     <Form.Item name="name" label={t("contact_us1.contact.name")} rules={[{ required: true }]}>
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="email" label={t("contact_us1.contact.email")} rules={[{ required: true, type: "email" }]}>
//                       <Input />
//                     </Form.Item>
//                     <Form.Item name="phone" label={t("contact_us1.contact.phone")} rules={[{ required: true }]}>
//                       <Input type="number" />
//                     </Form.Item>
//                     <Form.Item name="message" label={t("contact_us1.contact.message")} rules={[{ required: true }]}>
//                       <Input.TextArea rows={4} />
//                     </Form.Item>
//                     <Form.Item>
//                       <Button type="primary" htmlType="submit" loading={isLoading} className="submit-btn">
//                         Send Message
//                       </Button>
//                     </Form.Item>
//                   </Form>
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       )}
//     </>
//   );
// }

// export default ContactUs;

"use client";

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Form,
  Input,
  Select,
  Button,
  notification,
  Breadcrumb,
} from "antd";
import Link from "next/link";
import BannerHead from "../banner_path/page";
import { POST } from "@/util/apicall";
import API from "@/config/API";

const { Option } = Select;

const ContactUs = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();

  // const onFinish = async (values:any) => {
  //   try {
  //     setIsLoading(true);
  //     // Simulate API call
  //     setTimeout(() => {
  //       notificationApi.success({ message: "Successfully Submitted" });
  //       form.resetFields();
  //       setIsLoading(false);
  //     }, 1000);
  //   } catch (error) {
  //     notificationApi.error({ message: "Submission failed" });
  //     setIsLoading(false);
  //   }
  // };
    const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      const response = await POST(API.ENQUIRY_CREATE, values);

      if (response.status) {
        notificationApi.success({ message: "Successfully Submitted" });
        form.resetFields();
      } else {
        notificationApi.error({ message: "Failed to Submit Request" });
      }
    } catch (error) {
      notificationApi.error({ message: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="contact-page">
      <BannerHead head={"Contact Us"} path={`/ Contact us`}/>
      <Container>
        {contextHolder}
        <h2 className="fw-bold py-3">Contact Us</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mb-4"
        >
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label={<b>Name</b>}
                required
                style={{ marginBottom: 0 }}
              >
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      rules={[{ required: true, message: "First name is required" }]}
                      noStyle
                    >
                      <Input placeholder="First" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      rules={[{ required: true, message: "Last name is required" }]}
                      noStyle
                    >
                      <Input placeholder="Last" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
              className="mt-2"
                label={<b>How can we help you?</b>}
                name="helpTopic"
                rules={[{ required: true, message: "Please select a topic" }]}
              >
                <Select placeholder="Select an option">
                  <Option value="account">Account Help</Option>
                  <Option value="order">Order Related</Option>
                  <Option value="technical">Product Related</Option>
                  <Option value="technical">General Inquiry</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={<b>Email</b>}
                name="email"
                rules={[{ required: true, type: "email", message: "Valid email required" }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item label={<b>Comment or Message</b>} name="message">
                <Input.TextArea rows={4} placeholder="Type your message here" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading} className="px-4">
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div className="map-container mt-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5717429645847!2d55.4674216!3d25.1549539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f63963b884b69%3A0xecaab1c95cb58a06!2sGerman%20Standard%20Group!5e0!3m2!1sen!2sae!4v1715513134231"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: 10 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Container>
    </div>
  );
};

export default ContactUs;
