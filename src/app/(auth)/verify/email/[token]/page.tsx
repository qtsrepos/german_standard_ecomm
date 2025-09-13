'use client';
import React, { useEffect, useState } from "react";
import { notification } from "antd";
// import { useParams, useNavigate } from "react-router-dom";
// import Loading from "../../components/loading";
// import API from "../../config/API";
// import { POST } from "../../utils/apiCalls";
import { useDispatch, useSelector } from "react-redux";
// import { update } from "../../redux/slices/userSlice";
import { Container, Row } from "react-bootstrap";
import { MdMarkEmailRead } from "react-icons/md";
import "./style.scss";
import { useParams, useRouter } from "next/navigation";
import API from "@/config/API";
import { POST } from "@/util/apicall";
import { update } from "@/redux/slice/userSlice";
import { useSession } from "next-auth/react";

function EmailVerify() {
  const { token } = useParams();
  console.log('token',token)
  const navigate = useRouter();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  // const User = useSelector((state: any) => state.User.user);
  const Auth = useSelector((state: any) => state.User);
  const { data: session } = useSession();
  console.log('session',session)

  const User:any = session?.user;
  const dispatch = useDispatch();

  const verifyEmail = async () => {
    if (token) {
      const url = API.USER_VERIFY_EMAIL;
      try {
        const response: any = await POST(url, {
          token: token,
        });
        if (response.status === true) {
          notificationApi.success({message:response?.message});
          // if (Auth.auth && User?.data?._id === response?.data?._id) {
          //   dispatch(update(response?.data));
          // }
          setTimeout(() => {
            navigate.push("/");
          }, 1000);
        } else {
          notificationApi.error({message:response?.message});
        }
      } catch (error) {
        notificationApi.error({message:`Failed to verify your email. try again.`});
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setVerified(true);
    }, 3000);
    verifyEmail();
  }, []);

  return (
    <div className="Screen-box">
      {contextHolder}
      <Container className="d-flex justify-content-center">
        <Row className="verifyMail-card m-5">
          <MdMarkEmailRead size={100} color={API.COLOR} />
          <h1 className="verifyMail-text1">
            {verified ? "Verified!" : "Verifying..."}
          </h1>
          <p className="verifyMail-text2">
            {verified
              ? "You have successfully verified account."
              : "Please wait while we verify your account."}
          </p>
        </Row>
      </Container>
    </div>
  );
}

export default EmailVerify;
