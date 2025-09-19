import React from "react";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import img1 from "/src/assets/images/appstoreblack.png";
import img2 from "/src/assets/images/playstoreblack.png";
import img3 from "/src/assets/images/icon1.avif";
import img4 from "/src/assets/images/icon2.avif";
import img5 from "/src/assets/images/icon3.avif";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Details() {

  // const items = [
  //   { id: 1, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4967c883-c8ab-456b-7afe-d8629fc7e500/w=160,h=60" },
  //   { id: 2, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4bc21142-4196-408f-5e58-ca3771914400/w=177,h=71" },
  //   { id: 3, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/0a9d9196-4d77-4772-7d07-bb9be5a3cc00/w=168,h=154" },
  //   { id: 4, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/57a96d3b-e63c-46d9-884c-c604f3cd5e00/w=2751,h=1380" },
  //   { id: 5, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/0e281524-a199-4a37-7343-45a3a8e46b00/w=200,h=108" },
  //   { id: 6, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4667d9be-ce53-4a95-d9b3-f86c9cd90f00/w=418,h=142" },
  //   { id: 7, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4bc21142-4196-408f-5e58-ca3771914400/w=177,h=71" },
  //   { id: 8, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/0a9d9196-4d77-4772-7d07-bb9be5a3cc00/w=168,h=154" },
  //   { id: 9, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/57a96d3b-e63c-46d9-884c-c604f3cd5e00/w=2751,h=1380" },
  //   { id: 10, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/0e281524-a199-4a37-7343-45a3a8e46b00/w=200,h=108" },
  //   { id: 11, image: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4667d9be-ce53-4a95-d9b3-f86c9cd90f00/w=418,h=142" },
  // ];

  // const settings = {
  //   infinite: true,
  //   slidesToShow: 7,
  //   slidesToScroll: 1,
  //   speed: 500,
  //   arrows: false,
  //   responsive: [
  //     { breakpoint: 1024, settings: { slidesToShow: 7 } },
  //     { breakpoint: 768, settings: { slidesToShow: 3 } },
  //     { breakpoint: 480, settings: { slidesToShow: 2 } },
  //   ],
  // };

  return (
    <><div className="border-bottom mb-5">
      <Container>
        <div className="details-wrapper">
          <Row className="align-items-center gsgdetails-row">
            <Col lg={6} className="text-section">
              <h3>
                Shop Faster <br /> With GSG App
              </h3>
              <p>Available on both iOS & Android</p>
              <div className="store-icons">
                <Image width={140} height={45} src={img1} alt="App Store" />
                <Image width={140} height={45} src={img2} alt="Google Play" />
              </div>
            </Col>
            <Col lg={6} className="image-section">
              <Image
                src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/fdeb7a01-6602-4dd8-e4a9-ee4ae7244f00/w=706,h=735"
                alt="GSG App Preview"
                width={550}
                height={550}
                style={{ objectFit: "contain", width: "100%" }}
              />
            </Col>
          </Row>
        </div>
        <Row className="align-items-center mt-5 pb-4 ">
          <Col md={4} className="last-Section mt-4 mt-md-0 ">
            <div className="d-flex align-items-center">
              <Image width={50} height={50} src={img3} alt="App Store" />
              <div className="ms-3">
                <h6>BEST PRICES & DEALS</h6>
                <p>Don’t miss our daily amazing deals and prices</p>
              </div>
            </div>
          </Col>
          <Col md={4} className="last-Section  mt-4 mt-md-0">
            <div className="d-flex align-items-center">
              <Image width={50} height={50} src={img4} alt="App Store" />
              <div className="ms-3">
                <h6>REFUNDABLE</h6>
                <p>If your items have damage we agree to refund it</p>
              </div>
            </div>
          </Col>

          <Col md={4} className="last-Section  mt-4 mt-md-0">
            <div className="d-flex align-items-center">
              <Image width={50} height={50} src={img5} alt="App Store" />
              <div className="ms-3">
                <h6 className="mb-1">FREE DELIVERY</h6>
                <p className="mb-0">
                  Do purchase over AED 500 and get free delivery anywhere
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      </div>
      {/* <div className="end-div"></div> */}

      {/* <div style={{ backgroundColor: "#F5F5F5" }}>
        <Container className="mt-5">
          <div >
            <Slider {...settings}>
              {items.map((item) => (
                <div key={item.id}>
                  <div style={{ position: "relative", width: "100%", height: "100px" }}>
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
      </div> */}
    </>
  );
}

export default Details;
