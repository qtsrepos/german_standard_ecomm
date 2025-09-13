import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Typography, List } from "antd";
import { RightCircleFilled } from "@ant-design/icons";
import { FaChevronRight } from "react-icons/fa6";
import "../style.scss";

const { Title, Paragraph } = Typography;

const AdditionalInfo = () => {
  const features = [
    "Vestibulum penatibus nunc dui adipiscing convallis bulum parturient suspendisse.",
    "Abitur parturient praesent lectus quam a natoque adipiscing a vestibulum hendre.",
    "Diam parturient dictumst parturient scelerisque nibh lectus.",
  ];

  return (
    <div className=" py-5 border-top border-bottom">
        <Container>
      <Row>
        <Col lg={6} className="d-flex gap-3 mb-4 mb-md-0">
          <img
            src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/346f2927-e011-4351-d399-2f6a4e2ea600/w=350,h=450"
            alt="Delivery 1"
            className="img-fluid w-50 rounded"
          />
          <img
            src="	https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/3d904ca0-ebee-49a8-4e4c-551396c6dd00/w=350,h=450"
            alt="Delivery 2"
            className="img-fluid w-50 rounded"
          />
        </Col>

        <Col lg={6} className="ps-3 pt-md-3">
          <Typography>
            <h4 >MAECENAS IACULIS</h4>
            <Paragraph style={{color: "#777"}}>
              Vestibulum curae torquent diam diam commodo parturient penatibus nunc dui adipiscing convallis bulum parturient suspendisse parturient a. Parturient in parturient scelerisque nibh lectus quam a natoque adipiscing a vestibulum hendrerit et pharetra fames nunc natoque dui.
            </Paragraph>

            <h5>ADIPISCING CONVALLIS BULUM</h5>
            <List
              dataSource={features}
              renderItem={(item) => (
                <List.Item style={{color: "#777" , border: "none"}}>
                  <FaChevronRight className="fav-style"  style={{  marginRight: 8 }} />
                  {item}
                </List.Item>
              )}
            />

            <Paragraph className="mt-3" style={{color: "#777"}}>
              Scelerisque adipiscing bibendum sem vestibulum et in a a a purus lectus faucibus lobortis tincidunt purus lectus nisl class eros. Condimentum at et ullamcorper dictumst mus et tristique elementum nam inceptos hac parturient scelerisque vestibulum amet elit ut volutpat.
            </Paragraph>
          </Typography>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default AdditionalInfo;
