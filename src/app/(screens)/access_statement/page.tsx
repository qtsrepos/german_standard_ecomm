import CONFIG from "@/config/configuration";
import { Metadata } from "next";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Breadcrumb } from "antd";
import Link from "next/link";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Privacy and Policy",
    description: `Thank you for using ${CONFIG?.NAME}! We are committed to providing you the best online shopping and delivery experience possible.`,
  };
};

function AccessibilityStatement() {
  return (
    <div className="page-Box">
      <Container>
        <Breadcrumb
          items={[
            {
              title: <Link href="/">Home</Link>,
            },
            {
              title: " Accessibility Statement",
            },
          ]}
        />
        <br />
        <h1 className="page-text1">Accessibility Statement</h1>
        <br />
        <Row>
          <Col sm={8} xs={12}>
            <p className="page-text3">
              {" "}
              At German Standard Group , we are committed to ensuring digital
              accessibility for all our customers, including those with
              disabilities. We strive to continually improve the user experience
              for everyone and adhere to the Web Content Accessibility
              Guidelines (WCAG) 2.1, Level AA standards.
            </p>
            <br />
            <h4 className="page-text2"> Our Commitment to Accessibility</h4>
            <ul className="page-text3">
              <li>
                Accessibility Features: We have implemented accessibility
                features on our website to make it easier to navigate and
                interact with our products and services.
              </li>
              <li>
                Accessibility Training: Our team members are trained in web
                accessibility best practices to ensure that our website is
                inclusive and accessible to all users.
              </li>
              <li>
                Ongoing Monitoring and Testing: We regularly monitor and test
                our website to identify and address any accessibility issues
                that may arise.
              </li>
              <li>
                Feedback and Support: We welcome feedback from our customers
                regarding the accessibility of our website. If you encounter any
                accessibility barriers or have suggestions for improvement,
                please contact us at{" "}
                <a href="mailto:contact@connect.com.sa">
                  contact@connect.com.sa
                </a>{" "}
              </li>
            </ul>
          </Col>
          <Col sm={1} xs={12}></Col>
          <Col sm={3} xs={12}>
            <div className="page-stickeyBox">
              <div className="Footer-text2">
                <Link href="privacy-policy">Privacy and Policy</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="cookies-policy">Cookies Policy</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="terms_of_service">Terms of Service</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="cancellation_return">Refund Policy</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="access_statement">Accessibility Statement</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="fa-questions">FAQ,S</Link>
              </div>
              <hr />
              <div className="Footer-text2">
                <Link href="contact_us">Contact</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AccessibilityStatement;
