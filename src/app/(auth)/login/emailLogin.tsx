"use client";
import { useState } from "react";
import { Button, Form, Input, notification, Select } from "antd";
import { BiErrorCircle } from "react-icons/bi";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useAppDispatch } from "@/redux/hooks";

import { updateTokens } from "@/redux/slice/authSlice";
import { IoCaretDownSharp } from "react-icons/io5";
import bh from "@/assets/images/bahrain.avif";
import eg from "@/assets/images/egypt.avif";
import qa from "@/assets/images/qatar.avif";
import sa from "@/assets/images/saudi.avif";
import ae from "@/assets/images/uae.avif";

// Country data with flags and names
const countries = [
  { code: "qa", name: "Qatar", flag: qa.src },
  { code: "ae", name: "UAE", flag: ae.src },
  { code: "sa", name: "Saudi", flag: sa.src },
  { code: "bh", name: "Bahrain", flag: bh.src },
  { code: "eg", name: "Egypt", flag: eg.src },
];

function EmailLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [notificationApi, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();
  const [selectedCountry, setSelectedCountry] = useState("ae");

  const LoginEmail = async (values: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Map country codes to entity IDs
      const countryEntityMap: { [key: string]: number } = {
        qa: 1, // Qatar
        ae: 1, // UAE (default)
        sa: 1, // Saudi Arabia
        bh: 1, // Bahrain
        eg: 1, // Egypt
      };

      // Use NextAuth signIn - this will call the German Standard API through the provider
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        entityId: countryEntityMap[selectedCountry] || 1,
        channelId: 1,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        // Get the session to access user data and tokens
        const session = await getSession();
        
        if (session?.token && session?.refreshToken) {
          // Store tokens in Redux for app-wide access
          dispatch(
            updateTokens({
              token: session.token,
              refreshToken: session.refreshToken,
            })
          );
        }

        notificationApi.success({
          message: "Login Successful",
          description: "You have successfully signed in",
        });

        // Redirect based on user role
        const userRole = session?.role || "user";
        if (userRole === "admin") {
          router.push("/auth/dashboard"); // Admin dashboard route
        } else if (userRole === "seller") {
          router.push("/auth/dashboard"); // Seller dashboard route
        } else {
          router.push("/home"); // Regular user home route
        }

        // Force a page refresh to ensure proper state update
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      notificationApi.error({
        message: "Login Failed",
        description: err.message || "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">UAE User Login</h1>
      {contextHolder}

      <Form onFinish={LoginEmail} className="login-form">
        {/* Country Selector */}
        <Form.Item name="country" className="country-selector">
          <Select
            defaultValue="ae"
            onChange={setSelectedCountry}
            className="custom-input"
            size="small"
            placeholder="Select your country"
            suffixIcon={null}
            optionLabelProp="label"
          >
            {countries.map((country) => (
              <Select.Option
                key={country.code}
                value={country.code}
                label={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="flags"
                      width={20}
                    />
                    <span>{country.name}</span>
                    <IoCaretDownSharp
                      style={{ fontSize: "12px", marginLeft: "5px" }}
                    />
                  </span>
                }
              >
                <div
                  className="country-option"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="country-flag"
                    width={20}
                  />
                  <span className="country-name">{country.name}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={"email"}
          rules={[
            { required: true, message: "Please Enter your Username" },
            // { type: "email", message: "Please enter a Valid Email" },
          ]}
          className="no-bottom-margin"
        >
          <Input
            prefix={<FaUser className="input-icon email-icon" />}
            size="large"
            placeholder="Username"
            className="custom-input email-input"
          />
        </Form.Item>

        <Form.Item
          name={"password"}
          rules={[
            { required: true, message: "Please Enter Password" },
            { max: 20, message: "" },
          ]}
          className="no-bottom-margin"
        >
          <Input.Password
            prefix={<FaLock className="input-icon" />}
            size="large"
            placeholder="Password"
            className="custom-input"
            iconRender={(visible) =>
              visible ? (
                <FaEye className="eye-icon" />
              ) : (
                <FaEyeSlash className="eye-icon" />
              )
            }
          />
        </Form.Item>

        {error && (
          <div className="error-message">
            <BiErrorCircle />
            &nbsp;
            {error}
          </div>
        )}

        <div className="remember-me">
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <input
              type="checkbox"
              id="remember"
              className="remember-checkbox"
            />
            <label htmlFor="remember">Remember me</label>
          </div>
        </div>

        <div className="button-row">
          <Button
            className="login-button"
            loading={isLoading}
            block
            type="primary"
            htmlType="submit"
          >
            LOGIN
          </Button>
        </div>
      </Form>

      <button
        className="register-button"
        onClick={() => router.push("/register")}
      >
        REGISTER
      </button>
    </div>
  );
}

export default EmailLogin;
