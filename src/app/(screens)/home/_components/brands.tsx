import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";

function Brands() {
  const brandLogos = [
    {
      src: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4667d9be-ce53-4a95-d9b3-f86c9cd90f00/w=418,h=142",
      alt: "Brand 1",
      width: 418,
      height: 142,
    },
    {
      src: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4bc21142-4196-408f-5e58-ca3771914400/w=177,h=71",
      alt: "Brand 2",
      width: 177,
      height: 71,
    },
    {
      src: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/bba1073d-9a8e-4fb9-c584-4c4cf5d85e00/w=218,h=194",
      alt: "Brand 3",
      width: 218,
      height: 194,
    },
    {
      src: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/23350738-871b-4b6c-a00a-1b2cdc7b3d00/w=276,h=116",
      alt: "Brand 4",
      width: 276,
      height: 116,
    },
    {
      src: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/32e0630b-346e-47a3-cc4c-c8d351bac700/w=960,h=397",
      alt: "Brand 5",
      width: 960,
      height: 397,
    },
    {
      src: "https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/4967c883-c8ab-456b-7afe-d8629fc7e500/w=160,h=60",
      alt: "Brand 6",
      width: 160,
      height: 60,
    },
  ];

  return (
    <Container className="brands-section my-5">
    <h2 className="category-heading">Brands</h2>
    <div className="line-div"></div>

    <Row className="align-items-center justify-content-center">
      {brandLogos.map((logo, index) => (
        <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-4">
          <div className="brand-logo-container">
            <div className="brand-logo-wrapper">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="brand-logo"
                sizes="(max-width: 768px) 100px, 150px"
                unoptimized={true}
              />
            </div>
          </div>
        </Col>
      ))}
    </Row>
  </Container>
  );
}

export default Brands;
