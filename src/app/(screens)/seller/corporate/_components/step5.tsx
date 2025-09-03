
import { useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { Tag, Button, notification, Spin } from "antd";
import { FaMobileAlt } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { LoadingOutlined } from "@ant-design/icons";
import { BiSolidOffer } from "react-icons/bi";
import { Auth } from "../../../../../util/firebaseProvider";
import { useRouter } from "next/navigation";
import Success from "../../../../../assets/images/success.gif";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import useToggle from "../../../../../shared/hook/useToggle";
import OtpModal from "../../_components/otpModal";
import React from "react";
import Image from "next/image";

function Step4({
  loading,
  success,
  formData,
  register,
  goBack,
  phoneNumber,
}: any) {
  const navigation = useRouter();
  const [verification, setverification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autho, setautho] = useState<any>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [openModal, toggleModal] = useToggle(false);
  const [error, setError] = useState<boolean>(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [otpVerified, setOtpVerify] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

  const checkuser = async () => {
    try {
      let user: any = Auth.currentUser;
      if (user?.phoneNumber) {
        signOut(user);
      }
    } catch (err) {
      console.log("checkuser err", err);
    }
  };
  const LoginPhone = async () => {
    try {
      setIsLoading(true);
      checkuser();
      let recaptchas = new RecaptchaVerifier(Auth, "recaptcha", {});
      let phone = phoneNumber;
      let checkPhone: any = await signInWithPhoneNumber(
        Auth,
        phone,
        recaptchas
      );
      if (checkPhone?.verificationId) {
        setautho(checkPhone);
        setverification(true);
        toggleModal(true);
      } else {
        setError(true);
      }
      setIsLoading(false);
    } catch (err) {
      setverification(false);
      toggleModal(false);
      console.log("LoginPhone = = = >", err);
      setIsLoading(false);
      setError(true);
    }
  };
  const verifyOtp = async (otp: string) => {
    try {
      setOtpLoading(true);
      let verify = await autho.confirm(otp);
      const token = await verify?.user?.getIdToken();
      if (token) {
        setOtpVerify(true);
        setError(false);
        register(token);
      }
    } catch (err) {
      setOtpLoading(false);
      setError(true);
      notificationApi.error({ message: `invalid otp plase try again!` });
      setverification(false);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="sellerRegister-stepbox">
      {contextHolder}
      <Container>
        <Row>
          <Col sm={4} />
          <Col sm={4}>
          {success ? (
              <Image src={Success} style={{ width: "100%" }} alt="image" />
            ) : null}
            <h4 className="sellerRegister-subHeading">
              {success
                ? "Successfully Registered"
                : "Complete Your Registration"}
            </h4>
            <br />
            <h6 className="sellerRegister-text2">
              Mobile & Email Verification
            </h6>
            <br />
            <div className="sellerRegister-step3row2">
              <div>
                <FaMobileAlt size={20} color="grey" />
                <span style={{ marginLeft: "20px", textAlign: "left" }}>
                  {phoneNumber}
                </span>
              </div>
              <Tag color={otpVerified ? "green" : "orange"}>
                {otpVerified ? "Verified" : "Pending"}
              </Tag>
            </div>
            <div className="sellerRegister-step3row2">
              <div>
                <FiMail size={20} color="grey" />
                <span style={{ marginLeft: "20px" }}>
                  {formData.step1Data.email && formData.step1Data.email}
                </span>
              </div>
              <Tag color="orange">Pending</Tag>
            </div>
            <hr />
            <h6 className="sellerRegister-text2">Upload Documents</h6>
            <br />
            {formData?.step4Data?.id_proof ? (
              <div className="sellerRegister-fileCard">
                <div></div>
                <div style={{ flex: 1 }}>
                  {formData?.step4Data?.id_proof?.file?.path}
                </div>
                <div>
                  {loading ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <Tag color={success ? "green" : "orange"}>
                      {success ? "Success" : "Pending"}
                    </Tag>
                  )}
                </div>
              </div>
            ) : null}
            {formData?.step4Data?.trn_upload ? (
              <div className="sellerRegister-fileCard">
                <div></div>
                <div style={{ flex: 1 }}>
                  {formData?.step4Data?.trn_upload?.file?.path}
                </div>
                <div>
                  {loading ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <Tag color={success ? "green" : "orange"}>
                      {success ? "Success" : "Pending"}
                    </Tag>
                  )}
                </div>
              </div>
            ) : null}
            <br />
            <hr />
            <h4 className="sellerRegister-text2">Subscription</h4>
            <br />
            <div className="sellerRegister-fileCard">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 30, color: "#DAA520" }}>
                  Premium Plan
                </div>
                <ul>
                  <li>Duration : 1 Year</li>
                  <li>Subscription : 1000 INR</li>
                </ul>
                <div>
                  <span>Offer price</span> <span>0.00 / Year</span>
                  &nbsp;
                </div>
              </div>
              <div>
                <BiSolidOffer color="green" size={30} />
              </div>
            </div>
            <br />
            <Col />
            {verification ? null : <div id="recaptcha"></div>}
            <br />
            {success ? (
              <Row>
                <Col sm={6} xs={6}>
                <Button block size="large" onClick={() => navigation.back()}>
                     Go Back
                   </Button>
                </Col>
                <Col sm={6} xs={6}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => navigation.push("/login")}
                  >
                    Login
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col sm={6} xs={6}>
                  <Button onClick={() => goBack()} block size="large">
                    Back
                  </Button>
                </Col>
                <Col sm={6} xs={6}>
                  <Button
                    type="primary"
                    loading={isLoading || loading}
                    onClick={() => LoginPhone()}
                    block
                    size="large"
                  >
                    {error ? "Resend OTP" : "Register Now"}
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
          <Col sm={4} />
        </Row>
      </Container>
      <OtpModal
        open={openModal}
        closeModal={() => toggleModal(false)}
        getOtp={verifyOtp}
        loading={otpLoading}
      />
    </div>
  );
}
export default Step4;

