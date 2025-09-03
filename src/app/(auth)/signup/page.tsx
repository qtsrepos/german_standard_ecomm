"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "antd";
import { BiErrorCircle } from "react-icons/bi";
import { InputOTP } from "antd-input-otp";
import { Auth } from "@/util/firebaseProvider";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Container, Row, Col } from "react-bootstrap";
import SummaryCard from "./summarycard";
import GmailLogin from "../login/gmailLogin";
import PrefixSelector from "@/components/prefixSelector/page";
import { GET, POST } from "@/util/apicall";
import API from "@/config/API_ADMIN";
import useDebounceQuery from "@/shared/hook/useDebounceQuery";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/userSlice";
import "./style.scss";
export default function SignupScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState(false);
  const [datas, setDatas] = useState<any>({});
  const [verification, setVerification] = useState(false);
  const [autho, setAutho] = useState<any>(null);
  const [phoneTaken, setPhoneTaken] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const debouncePhone = useDebounceQuery(phoneNumber, 300);
  const debounceEmail = useDebounceQuery(emailId, 300);
  const [successmodal, setSuccessmodal] = useState(false);
  const LoginPhone = async (values: any) => {
    try {
      setDatas(values);
      setIsLoading(true);
      const recaptchas = new RecaptchaVerifier(Auth, "recaptcha", {});
      const phone = `${values.code}${values.phone}`;

      const checkPhone = await signInWithPhoneNumber(Auth, phone, recaptchas);

      if (checkPhone?.verificationId) {
        setAutho(checkPhone);
        setVerification(true);
      } else {
        setError("Something went wrong");
      }
    } catch (err: any) {
      setVerification(false);
      if (err?.message?.includes("invalid-phone")) {
        setError("Invalid Phone Number.. Please try another one");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (values: any) => {
    try {
      setIsLoading(true);
      const otp = values.otp.join("");
      const verify = await autho.confirm(otp);
      const token = await verify?.user?.getIdToken();

      if (token) {
        await Signup(token);
      }
    } catch (err: any) {
      if (err?.message?.includes("code-expired")) {
        setError("OTP has expired.");
      } else if (err?.message?.includes("invalid-verification-code")) {
        setError("Invalid OTP. Please check");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const Signup = async (token: string) => {
    try {
      const body = {
        email: datas?.email,
        username: datas?.username,
        password: datas?.password,
        first_name: datas?.firstname,
        last_name: datas?.lastname,
        countrycode: datas?.code,
        idToken: token,
      };

      const signupRes = await POST(API.SIGNUP, body);

      if (signupRes.status) {
        dispatch(login(signupRes));
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          if (signupRes?.data?.type === "user") {
            router.push("/");
          } else {
            router.push("/dashboard");
          }
        }, 2000);
      } else {
        setError(signupRes.message);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }

  };

  const checkPhoneNumber = async () => {
    if (phoneNumber?.length > 8) {
      try {
        const response = await GET(`${API.USER_CHECK_PHONE}${phoneNumber}`);
        setPhoneTaken(response?.status ? response?.data : false);
      } catch (err) {
        setPhoneTaken(false);
      }
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailId = async () => {
    if (isValidEmail(emailId)) {
      try {
        const response = await GET(`${API.USER_CHECK_EMAIL}${emailId}`);
        setEmailTaken(response?.status ? response?.data : false);
      } catch (err) {
        setEmailTaken(false);
      }
    } else {
      setEmailTaken(false);
    }
  };

  useEffect(() => {
    checkPhoneNumber();
  }, [debouncePhone]);

  useEffect(() => {
    checkEmailId();
  }, [debounceEmail]);

  return (
    <div className="Screen-box">
      <br /> <br />
      <h2 className="signupScreen-txt1">Create your account</h2>
      <div className="signupScreen-txt2">
        Please enter the following details to signup to your account
      </div>
      <Container>
        <Row>
          <Col sm={4} xs={12}></Col>
          <Col sm={4} xs={12}>
            <div className="LoginScreen-box1">
              {verification ? (
                <>
                  <SummaryCard data={datas} />
                  <div className="signupScreen-txt2">
                    Enter OTP send to your mobile number
                  </div>
                  <Form onFinish={verifyOtp} form={form}>
                    <Form.Item
                      name="otp"
                      rules={[
                        {
                          required: true,
                          message: "Input 6 digit verification code !",
                        },
                      ]}
                    >
                      <InputOTP autoFocus inputType="numeric" length={6} />
                    </Form.Item>
                    {error ? (
                      <div className="signupScreen-errortxt">
                        <BiErrorCircle /> &nbsp;
                        {error}
                      </div>
                    ) : null}
                    <Button
                      block
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={isLoading}
                      style={{ height: 45 }}
                    >
                      Verify
                    </Button>
                    {error ? (
                      <Button
                        className="mt-2"
                        block
                        size="large"
                        style={{ height: 40 }}
                        htmlType="submit"
                        onClick={(values: any) => {
                          LoginPhone(datas);
                        }}
                      >
                        {"Resend OTP"}
                      </Button>
                    ) : null}
                  </Form>
                </>
              ) : (
                <>
                  <div className="signupScreen-txt2">
                    Enter your Email and and Phone Number
                  </div>
                  <br />
                  <Form
                    onFinish={LoginPhone}
                    initialValues={{ code: "+971" }}
                    layout="vertical"
                  >
                    <Row>
                      <Col sm={6} xs={6}>
                        <Form.Item
                          name={"firstname"}
                          rules={[
                            {
                              required: true,
                              message: "Please enter firstname",
                            },
                            {
                              max: 30,
                              message: "Firstname is too long",
                            },
                          ]}
                        >
                          <Input placeholder="First Name" size="large" />
                        </Form.Item>
                      </Col>
                      <Col sm={6} xs={6}>
                        <Form.Item
                          name={"lastname"}
                          rules={[
                            {
                              required: true,
                              message: "Please enter lastname",
                            },
                            {
                              max: 30,
                              message: "Lastname is too long",
                            },
                          ]}
                        >
                          <Input placeholder="Last Name" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                    {phoneTaken ? (
                      <p className="text-danger my-0 py-0">
                        This Phone number is already used
                      </p>
                    ) : null}
                    <Form.Item
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please input your phone number",
                        },
                        {
                          max: 14,
                          message: "Phone Number is Invalid",
                        },
                        {
                          min: 8,
                          message: "Please enter a valid phone number",
                        },

                        () => ({
                          validator(_, value) {
                            if (phoneTaken) {
                              return Promise.reject(new Error(""));
                            }
                            return Promise.resolve("Phone Number available");
                          },
                        }),
                      ]}
                    >
                      <Input
                        addonBefore={<PrefixSelector />}
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Enter Phone Number"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onKeyPress={(e) => {
                          const isNumber = /^[0-9]*$/;
                          if (!isNumber.test(e?.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(ph) => setPhoneNumber(ph?.target?.value)}
                      />
                    </Form.Item>

                    {emailTaken ? (
                      <p className="text-danger my-0 py-0">
                        This Email Id is already used
                      </p>
                    ) : null}
                    <Form.Item
                      name={"email"}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your email id",
                        },
                        {
                          type: "email",
                          message: "Please enter valid email id",
                        },
                        {
                          max: 60,
                          message: "Email id is Invalid",
                        },
                        () => ({
                          validator(_, value) {
                            if (emailTaken) {
                              return Promise.reject(new Error(""));
                            }
                            return Promise.resolve("EmailId available");
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder="Enter Email Address"
                        size="large"
                        onChange={(em) => setEmailId(em?.target?.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name={"password"}
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        {
                          min: 8,
                          message: "Password must be minimum 8 characters.",
                        },
                        {
                          max: 16,
                          message: "Password is too long",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password
                        size="large"
                        placeholder="Enter Password"
                      />
                    </Form.Item>
                    <Form.Item
                      name={"confirm"}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                "The new password that you entered do not match!"
                              )
                            );
                          },
                        }),
                      ]}
                      dependencies={["password"]}
                      hasFeedback
                    >
                      <Input.Password
                        size="large"
                        placeholder="Confirm Password"
                      />
                    </Form.Item>
                    {error ? (
                      <div className="signupScreen-errortxt">
                        <BiErrorCircle /> &nbsp;
                        {error}
                      </div>
                    ) : null}
                    <div id="recaptcha"></div>
                    <Button
                      block
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={isLoading}
                      style={{ height: 45 }}
                    >
                      Create Account
                    </Button>
                  </Form>
                </>
              )}
              <br />

              <GmailLogin
                closeModal={() => setSuccessmodal(false)}
                openModal={() => setSuccessmodal(true)}
              />
              <br />
              <div
                className="signupScreen-txt4"
                onClick={() => router.push("/login")}
              >
                Already have an account?{" "}
                <span className="signupScreen-txt5">Login</span>
              </div>
            </div>
          </Col>
          <Col sm={4} xs={12}></Col>
        </Row>
      </Container>
      <br />
      <br />
      {/* {successmodal ? (
        <SuccessModal
          visible={successmodal}
          onCancel={() => setSuccessmodal(false)}
          title="Success"
          body="Congartulation Account created successfully"
          onButtonClick={() => setSuccessmodal(false)}
          buttonText="Start Purchasing"
        />
      ) : null} */}
    </div>
  );
}
