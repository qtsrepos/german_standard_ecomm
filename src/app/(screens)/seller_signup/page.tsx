import API from "@/config/configuration";
import React from "react";
import { Container } from "react-bootstrap";

function SellerSignup() {
  return (
    <div className="page-Box">
      <Container>
        <div className="page-breadcrumbs">Home / Seller Registration</div>
        <br />
        <h1 className="page-text1">Begin your selling journey on {API.NAME}</h1>
        <br />
        <p className="page-text3">
          As an individual user on {API.NAME}, you gain access to a host of
          features designed to enhance your waitlisting experience. Receive
          instant updates on your wait time, allowing you to plan your
          activities with precision. The app ensures that you make the most of
          your valuable time, all while enjoying the convenience of being
          virtually in line.
        </p>
      </Container>
    </div>
  );
}

export default SellerSignup;
