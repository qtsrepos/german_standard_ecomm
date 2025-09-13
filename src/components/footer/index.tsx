"use client";
import React from "react";

import "./styles.scss";
import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import { usePathname } from "next/navigation";
import i18n from "../../lib/i18n";
import API from "@/config/configuration";
import Image from "next/image";

import { RiFacebookBoxFill } from "react-icons/ri";
import { BiLogoInstagramAlt } from "react-icons/bi";
import {
  FaFacebook,
  FaFacebookF,
  FaLinkedinIn,
  FaLocationArrow,
  FaPinterest,
  FaSquareTwitter,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa6";
import { I18nextProvider, useTranslation } from "react-i18next";

import Logo from "../../config/logoBox.png";
import GooglePlay from "../../assets/images/googleplay.png";
import AppleStore from "../../assets/images/appstore.png";

import Visa from "../../assets/images/visa.png";
import Mastercard from "../../assets/images/mastercard.png";
import Dinners from "../../assets/images/dinners.png";
import samsungpay from "../../assets/images/samsungpay.png";
import { FaMobileAlt, FaTelegramPlane } from "react-icons/fa";
import { MdEmail, MdOutlineEmail } from "react-icons/md";
import { AiFillTwitterCircle } from "react-icons/ai";
import Slider from "react-slick";

const Footer = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const items = [
    {
      id: 1,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4967c883-c8ab-456b-7afe-d8629fc7e500/w=160,h=60",
    },
    {
      id: 2,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4bc21142-4196-408f-5e58-ca3771914400/w=177,h=71",
    },
    {
      id: 3,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/0a9d9196-4d77-4772-7d07-bb9be5a3cc00/w=168,h=154",
    },
    {
      id: 4,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/57a96d3b-e63c-46d9-884c-c604f3cd5e00/w=2751,h=1380",
    },
    {
      id: 5,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/0e281524-a199-4a37-7343-45a3a8e46b00/w=200,h=108",
    },
    {
      id: 6,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4667d9be-ce53-4a95-d9b3-f86c9cd90f00/w=418,h=142",
    },
    {
      id: 7,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4bc21142-4196-408f-5e58-ca3771914400/w=177,h=71",
    },
    {
      id: 8,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/0a9d9196-4d77-4772-7d07-bb9be5a3cc00/w=168,h=154",
    },
    {
      id: 9,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/57a96d3b-e63c-46d9-884c-c604f3cd5e00/w=2751,h=1380",
    },
    {
      id: 10,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/0e281524-a199-4a37-7343-45a3a8e46b00/w=200,h=108",
    },
    {
      id: 11,
      image:
        "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4667d9be-ce53-4a95-d9b3-f86c9cd90f00/w=418,h=142",
    },
  ];

  const settings = {
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    speed: 500,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 7 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };
  return pathname?.includes("/auth") ||
    pathname === "/" ||
    pathname === "/login" ? null : (
    <>
      <div style={{ backgroundColor: "#F5F5F5" }}>
        <Container className="mt-5">
          <div>
            <Slider {...settings}>
              {items.map((item) => (
                <div key={item.id}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100px",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt="App Store"
                      fill
                      style={{ objectFit: "contain", padding: "20px" }}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </Container>
      </div>

      <footer className="Footer">
        <I18nextProvider i18n={i18n}>
          <Container>
            <Row>
              <Col sm={6} md={12} xs={12} lg={3}>
                <Link href={"/"} className="Footer_logoBox">
                  <div>
                    <Image alt="german" src={Logo} className="Footer_logo" />
                  </div>
                </Link>
                <br />
                {/* <div className="Footer-text3">
                Discover a world of exceptional products and unbeatable deals at
                {API.NAME}. Your one-stop destination for the latest in fashion,
                electronics, home decor, beauty, and more.
              </div>wd-phone-dark.svg
              <div style={{ margin: 10 }} /> */}
                <div className="mb-2">
                  <a className="contact-foot" href="tel:+97142668871">
                    <FaMobileAlt /> WhatsApp: {API.CONTACT_NUMBER}
                  </a>
                </div>
                <div className="mb-2">
                  <a
                    className="contact-foot"
                    href={`mailto:${API.CONTACT_MAIL}`}
                  >
                    <MdOutlineEmail /> Email: {API.CONTACT_MAIL}
                  </a>
                  <br />
                </div>
                <div className="mb-2">
                  <a className="contact-foot">
                    <FaLocationArrow /> Dubai, United Arab Emirates
                  </a>
                  <br />
                </div>

                <Row className="mt-4">
                  <Col sm={1} xs={1} className="Footer-icon facebook-bg">
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebookF size={18} />
                    </a>
                  </Col>
                  <Col sm={1} xs={1} className="Footer-icon twitter-bg">
                    <a
                      href="https://www.twitter.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter size={18} />
                    </a>
                  </Col>
                  <Col sm={1} xs={1} className="Footer-icon email-bg">
                    <a
                      href="mailto:example@example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MdEmail size={18} />
                    </a>
                  </Col>
                  <Col sm={1} xs={1} className="Footer-icon pinterest-bg">
                    <a
                      href="https://www.pinterest.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaPinterest size={18} />
                    </a>
                  </Col>
                  <Col sm={1} xs={1} className="Footer-icon linkedin-bg">
                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedinIn size={18} />
                    </a>
                  </Col>
                  <Col sm={1} xs={1} className="Footer-icon telegram-bg">
                    <a
                      href="https://www.telegram.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTelegramPlane size={18} />
                    </a>
                  </Col>
                </Row>
              </Col>

              <Col sm={6} md={6} xs={12} lg={3}>
                <div className="Footer-text1">
                  {t("Most Popular Categories")}
                </div>
                <div className="Footer-text2">
                  <Link href="/category/species?id=MQ==&type=Species">
                    {t("Brand by Dogs")}
                  </Link>
                </div>
                <div className="Footer-text2">
                  <Link href="/category/cat?id=Mg==&type=cat">
                    Brand by Cats
                  </Link>
                </div>
                <div className="Footer-text2">
                  <Link href="/category/species?id=MQ==&type=Species">
                    {t("Brand by Cattle")}
                  </Link>
                </div>
                <div className="Footer-text2">
                  <Link href="/category/sheep?id=Ng==&type=sheep">
                    {t("Brand by Goat")}
                  </Link>
                </div>
                <div className="Footer-text2">
                  <Link href="/category/camel?id=NQ==&type=camel">
                    Brand by Camel
                  </Link>
                </div>
                <div className="Footer-text2">
                  <Link href="/category/horse?id=NA==&type=%20Horse">
                    Brand by Horse
                  </Link>
                </div>
              </Col>
              <Col sm={6} md={6} xs={12} lg={2}>
                <div className="Footer-text1">{t("Customer Services")}</div>
                <div className="Footer-text2">
                  <Link href="terms_of_service">{t("Terms & Conditions")}</Link>
                </div>
                <div className="Footer-text2">
                  <Link href="/fa-questions">FAQ</Link>
                </div>
                <div className="Footer-text2 Footer-mail-text">
                  <a href="privacy_policy">Privacy Policy</a>
                </div>
                {/* <div className="Footer-text2">
                <a href="tel:+918590551994">{API.CONTACT_NUMBER}</a>
              </div> */}
              </Col>
              <Col sm={6} md={6} xs={12} lg={4}>
                <div className="Footer-text1">{t("Download App")}</div>
                <Row>
                  <Col sm={6} xs={6}>
                    <Link href="https://apps.apple.com/ae/app/gsg-vet/id6740236140">
                      <Image
                        alt="german"
                        src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/18a4c6ea-516a-46de-180e-d1c6efcd7f00/w=200,h=65"
                        width={200}
                        height={65}
                        className="Footer_icon2"
                      />
                    </Link>
                  </Col>
                  <Col sm={6} xs={6}>
                    <Link href="https://play.google.com/store/apps/details?id=com.gsgapp&pli=1">
                      <Image
                        alt="german"
                        src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/cabc2601-8c93-4d90-67ba-b5dbfcd4a200/w=200,h=65"
                        width={200}
                        height={65}
                        className="Footer_icon2"
                      />
                    </Link>
                  </Col>
                  {/* <Col sm={3} xs={3}>
                  <Image
                    alt="nalakathfruits"
                    src={Dinners}
                    className="Footer_icon2"
                  />
                </Col>
                <Col sm={3} xs={3}>
                  <Image
                    alt="nalakathfruits"
                    src={samsungpay}
                    className="Footer_icon2"
                  />
                </Col> */}
                </Row>
                {/* <div className="Footer-text1">{t("download_app")}</div> */}
              </Col>
            </Row>
          </Container>
        </I18nextProvider>
        <br />
        <Row
          className="border-top border-bottom pt-4"
          style={{ width: "100%", paddingBottom: "80px" }}
        >
          <Col md={6}>
            <div className="Footer-Box1">
              All Rights Reserved © 2024 GERMAN STANDARD GROUP .
            </div>
          </Col>
          <Col md={6} className="d-flex justify-content-evenly ">
            <Image
              alt="german"
              src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/3df87762-77a9-4cb4-4126-f00fe1aefd00/w=225,h=32"
              width={225}
              height={32}
              className="Footer_icon2"
            />
          </Col>
        </Row>
      </footer>
    </>
  );
};

export default Footer;
