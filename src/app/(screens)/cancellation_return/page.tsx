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

function CancellationReturn() {
  return (
    <div className="page-Box">
      <Container>
        <Breadcrumb
          items={[
            {
              title: <Link href="/">Home</Link>,
            },
            {
              title: " Cancellation Return",
            },
          ]}
        />
        <br />
        <h1 className="page-text1"> Cancellation Return</h1>
        <br />
        <Row>
          <Col sm={8} xs={12}>
            <h4 className="page-text2">
              {" "}
              1. When & how can I cancel my order?
            </h4>
            <ul className="page-text3">
              <li>
                You can cancel your order within the first 5 minutes after the
                order being placed
              </li>
              <li>Within 3 minutes after substitution request</li>
              <li>
                In any other cases, please contact German Standard Group  at{" "}
                <a href="mailto:contact@connect.com.sa">
                  contact@connect.com.sa
                </a>{" "}
              </li>
            </ul>
            <br />
            <h4 className="page-text2">
              {" "}
              2. What if the delivered product is incorrect or damaged?
            </h4>
            <p className="page-text3">
              {" "}
              We highly advise you to review the items upon receiving them at
              the door. However, if for any reason you were unable to review the
              products at the time of delivery and a certain product is
              incorrect or damaged, please contact us for a replacement or
              refund. German Standard Group  will initiate the required action immediately; given
              that, the issue is reported within 24 hours.
            </p>
            <br />
            <h4 className="page-text3">
              {" "}
              Refunds will be done only through the Original Mode of Payment.
            </h4>
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

export default CancellationReturn;
