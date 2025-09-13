// "use client";
// import { Button, Form, Popconfirm, Tag, message, notification } from "antd";
// import React, { useEffect, useState } from "react";
// import { Container, Col, Row } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import "../style.scss";
// import EditModal from "./_components/editModal";
// import EditEmail from "./_components/editEmail";
// import EditName from "./_components/editName";
// import PhoneVerifyOtp from "./_components/phoneVerify";
// import DeactivateModal from "./_components/deactivateModal";
// import EditProfilePhoto from "./_components/editProfilePhoto";
// import EditPassword from "./_components/updatePassword";
// import EmailVerificationModal from "./_components/emailVerficationModal";
// import EditNameChange from "./_components/editNameChange";
// import EditEmailChange from "./_components/editEmailChange";
// import EditMobilenumberChange from "./_components/editMobilenumberChange";
// import EditPasswordChange from "./_components/editPasswordChange";
// import API from "@/config/API";
// import { GET, PUT } from "@/util/apicall";
// import { signOut, useSession } from "next-auth/react";
// import Loading from "@/app/(dashboard)/_components/loading";
// import { Collapse } from "antd";

// const ProfileDashboard = () => {
//   const { data: session, update }: any = useSession();
//   const User = session?.user;
//   const [userDetails, setUserDetails] = useState<any>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [modal, setModal] = useState(false);
//   const [modal1, setModal1] = useState(false);
//   const [modal2, setModal2] = useState(false);
//   const [modal3, setModal3] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [emailopen, setEmailopen] = useState(false);
//   const [numberopen, setNumberopen] = useState(false);
//   const [passwordopen, setPasswordopen] = useState(false);
//   const [passwordModal, setPasswordModal] = useState(false);
//   const [passwordType, setPasswordType] = useState<"add" | "update">("update");
//   const [notificationApi, contextHolder] = notification.useNotification();
//   const [verifyEmailModalVisible, setVerifyEmailModalVisible] = useState(false);
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [emailLoading, setEmailLoading] = useState(false);
//   const { Panel } = Collapse;
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleeditcancel = () => {
//     setModal(false);
//     setModal1(false);
//     setModal2(false);
//     setModal3(false);
//     setPasswordModal(false);
//   };

//   useEffect(() => {
//     getUserDetails();
//   }, []);

//   const getUserDetails = async () => {
//     setLoading(true);
//     try {
//       let url = API.USER_REFRESH;
//       const response: any = await GET(url);
//       if (response?.status) {
//         setUserDetails(response?.data);
//       } else {
//         message.error("Failed to fetch users details.");
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   const openVerifyEmailModal = () => {
//     setVerifyEmailModalVisible(true);
//   };

//   const closeVerifyEmailModal = () => {
//     setVerifyEmailModalVisible(false);
//   };

//   const updateEmail = async (values: any) => {
//     try {
//       const { email } = values;
//       const obj = {
//         email,
//       };
//       setEmailLoading(true);
//       const url = API.USER_EMAIL_UPDATE;
//       const Response: any = await PUT(url, obj);
//       if (Response.status) {
//         await update({
//           user: {
//             ...session?.user,
//             email,
//             mail_verify: false,
//           },
//         });
//         notificationApi.success({ message: "Email Updated Successfully" });
//         setEmailopen(false);
//       } else {
//         notificationApi.error({ message: Response.message });
//       }
//     } catch (error) {
//       notificationApi.error({ message: "Something went wrong." });
//     } finally {
//       setEmailLoading(false);
//     }
//   };

//   const updateName = async (values: any) => {
//     try {
//       const { first_name, last_name } = values;
//       const obj = {
//         first_name,
//         last_name,
//       };
//       const url = API.USER_NAME_UPDATE;
//       setEmailLoading(true);
//       const Response: any = await PUT(url, obj);
//       if (Response.status) {
//         await update({
//           user: {
//             ...session?.user,
//             first_name,
//             last_name,
//             name: `${first_name} ${last_name}`,
//           },
//         });
//         notificationApi.success({ message: "Successfully Updated your Name" });
//         setOpen(false);
//       } else {
//         notificationApi.error({ message: Response.message ?? "" });
//       }
//     } catch (error) {
//       notificationApi.error({ message: "Something went wrong." });
//     } finally {
//       setEmailLoading(false);
//     }
//   };

//   const editPassowrd = async (values: any) => {
//     const url =
//       passwordType == "update"
//         ? API.USER_CHANGE_PASSWORD
//         : passwordType == "add"
//         ? API.USER_ADDNEW_PASSWORD
//         : "";
//     try {
//       setPasswordLoading(true);
//       const response: any = await PUT(url, values);
//       if (response?.status) {
//         getUserDetails();
//         notificationApi.success({ message: `Password updated successfully.` });
//         setPasswordopen(false);
//       } else {
//         notificationApi.error({ message: response.message });
//       }
//     } catch (error: any) {
//       notificationApi.error({
//         message: "Something went wrong. please try again.",
//       });
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   async function signoutFromAll() {
//     try {
//       const response: any = await GET(API.USER_LOGOUTALL);
//       if (response?.status) {
//         notificationApi.success({
//           message: response?.message,
//         });
//         setTimeout(() => {
//           signOut();
//         }, 1500);
//       }
//     } catch (err) {
//       notificationApi.error({
//         message: "Something went wrong. please try again.",
//       });
//     }
//   }

//   return (
//     <Container fluid className="px-md-4">
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="profile-dashboard-container">
//           {contextHolder}
//           <div className="profile-header mb-3">
//             <div className="profile-txt1">My Account</div>
//           </div>
          
//           <Form>
//             {/* Username Section */}
//             <Row className="mb-3 align-items-center">
//               <Col xs={12} md={12} className="mb-2 mb-md-0">
//                 <div className="profile-dashboard-txt5">User Name</div>
//               </Col>
//               <Col xs={12} md={8}>
//                 <div className="profile-dashboard-Box5">{User?.user_name}</div>
//               </Col>
//             </Row>
//             <hr className="profile-divider" />

//             {/* Name Section */}
//             <Row className="mb-3">
//               <Col xs={12} md={12} className="mb-2 mb-md-0">
//                 <div className="profile-dashboard-txt5">Name</div>
//               </Col>
//               <Col xs={6} md={6}>
//                 <div className="profile-dashboard-Box5 mb-2">
//                   {User?.first_name} {User?.last_name}
//                 </div>
//                 {open && (
//                   <EditNameChange
//                     firstname={User?.first_name}
//                     lastname={User?.last_name}
//                     updateName={updateName}
//                     loading={emailLoading}
//                   />
//                 )}
//               </Col>
//               <Col xs={6} md={6} className="text-end">
//                 <div
//                   className="profile-edit-btn"
//                   onClick={() => setOpen(!open)}
//                 >
//                   {open ? "Cancel" : "Edit"}
//                 </div>
//               </Col>
//             </Row>
//             <hr className="profile-divider" />

//             {/* Email Section */}
//             <Row className="mb-3 align-items-center">
//               <Col xs={12} md={12} className="mb-2 mb-md-0">
//                 <div className="profile-dashboard-txt5">Email Address</div>
//               </Col>
//               <Col xs={7} md={8}>
//                 <div className="profile-dashboard-Box5 mb-2">
//                   {User?.email || ""}
//                 </div>
//                 {emailopen && (
//                   <EditEmailChange
//                     email={User?.email}
//                     updateEmail={updateEmail}
//                     loading={emailLoading}
//                   />
//                 )}
//               </Col>
//               <Col xs={12} md={4} className="d-flex  justify-content-between">
//                 {User?.email && (
//                   User?.mail_verify || userDetails?.mail_verify ? (
//                     <Tag  color="green" bordered={false}>Verified</Tag>
//                   ) : (
//                     <Tag
//                       color="orange"
//                       bordered={false}
//                       onClick={openVerifyEmailModal}
//                       style={{ cursor: "pointer" }}
//                     >
//                       Verify
//                     </Tag>
//                   )
//                 )}
//                 <div
//                   className="profile-edit-btn"
//                   onClick={() => setEmailopen(!emailopen)}
//                 >
//                   {emailopen ? "Cancel" : "Edit"}
//                 </div>
//               </Col>
//             </Row>
//             <hr className="profile-divider" />

//             {/* Mobile Number Section */}
//             <Row className="mb-3 align-items-center ">
//               <Col xs={12} md={12} className="mb-2 mb-md-0">
//                 <div className="profile-dashboard-txt5">Mobile Number</div>
//               </Col>
//               <Col xs={6} md={8}>
//                 <div className="profile-dashboard-Box5 mb-2">
//                   {User?.phone ? (
//                     <>{User?.countrycode} {User?.phone}</>
//                   ) : null}
//                 </div>
//                 {numberopen && (
//                   <EditMobilenumberChange phone={User?.phone} />
//                 )}
//               </Col>
//               <Col xs={6} md={4} className="text-end">
//                 {User?.phone && (
//                   User?.phone_verify || userDetails?.phone_verify ? (
//                     <Tag color="green" bordered={false}>Verified</Tag>
//                   ) : (
//                     <Tag color="red" bordered={false}>Not Verified</Tag>
//                   )
//                 )}
//                 <div
//                   className="profile-edit-btn"
//                   onClick={() => setNumberopen(!numberopen)}
//                 >
//                   {numberopen ? "Cancel" : "Edit"}
//                 </div>
//               </Col>
//             </Row>
//             <hr className="profile-divider" />


//             {/* Password Section */}
//             <Row className="mb-3 align-items-center">
//               <Col xs={12} md={12} className="mb-2 mb-md-0">
//                 <div className="profile-dashboard-txt5">Password</div>
//               </Col>
//               <Col xs={12} md={8} className="">
//                 <div className="profile-dashboard-Box5">
//                   {User?.password ? "********" : ""}
//                 </div>
//                 {passwordopen && (
//                   <EditPasswordChange
//                     type={passwordType}
//                     closePassword={() => setPasswordopen(false)}
//                     loading={passwordLoading}
//                     editPassowrd={editPassowrd}
//                   />
//                 )}
//               </Col>
//               <Col xs={12} md={4} className="text-end">
//                 <div
//                   className="profile-edit-btn"
//                   onClick={() => {
//                     setPasswordType(User?.password ? "update" : "add");
//                     setPasswordopen(!passwordopen);
//                   }}
//                 >
//                   {passwordopen ? "Cancel" : "Edit"}
//                 </div>
//               </Col>
//             </Row>
//           </Form>

//           {/* FAQ Section */}
//           <div className="profile-dashboard-faq-section mt-4">
//             <div className="profile-dashboard-txt6 mt-4 mb-3">FAQs</div>
//             <Collapse accordion>
//               <Panel
//                 header="What happens when I update my email address (or mobile number)?"
//                 key="1"
//               >
//                 <p>
//                   Your login email id (or mobile number) changes, likewise.
//                   You'll receive all your account-related communication on your
//                   updated email address (or mobile number).
//                 </p>
//               </Panel>
//               <Panel
//                 header={`When will my ${API.NAME} account be updated with the new email address (or mobile number)?`}
//                 key="2"
//               >
//                 <p>
//                   It happens as soon as you confirm the verification code sent
//                   to your email (or mobile) and save the changes.
//                 </p>
//               </Panel>
//               <Panel
//                 header={`What happens to my existing ${API.NAME} account when I update my email address (or mobile number)?`}
//                 key="3"
//               >
//                 <p>
//                   Updating your email address (or mobile number) doesn't
//                   invalidate your account. Your account remains fully
//                   functional. You'll continue seeing your Order history, saved
//                   information, and personal details.
//                 </p>
//               </Panel>
//               <Panel
//                 header={`Does my Seller account get affected when I update my email address?`}
//                 key="4"
//               >
//                 <p>
//                   {`${API.NAME} has a 'single sign-on' policy. Any changes will reflect in
//                   your Seller account also.`}
//                 </p>
//               </Panel>
//             </Collapse>
//           </div>

//           {/* Action Buttons */}
//           <div className="d-flex flex-column flex-md-row gap-2 mt-4">
//             <Button 
//               className="profile-dashboard-txt9 flex-fill mb-2 mb-md-0" 
//               onClick={showModal}
//             >
//               Deactivate Account
//             </Button>
//             <Popconfirm
//               placement="bottomRight"
//               title={"You will be signed out from all devices including this."}
//               okText="Yes"
//               cancelText="No"
//               onConfirm={signoutFromAll}
//             >
//               <Button className="profile-dashboard-txt9 flex-fill">
//                 Signout from all Devices
//               </Button>
//             </Popconfirm>
//           </div>

//           {/* Modals */}
//           {modal && (
//             <EditModal
//               ui={<EditEmail close={handleeditcancel} />}
//               open={modal}
//               close={handleeditcancel}
//             />
//           )}
//           {modal1 && (
//             <EditModal
//               ui={<EditName close={handleeditcancel} />}
//               open={modal1}
//               close={handleeditcancel}
//             />
//           )}
//           {modal2 && (
//             <EditModal
//               ui={<PhoneVerifyOtp close={handleeditcancel} />}
//               open={modal2}
//               close={handleeditcancel}
//             />
//           )}
//           <EditModal
//             ui={<EditPassword close={handleeditcancel} type={passwordType} />}
//             open={passwordModal}
//             close={handleeditcancel}
//           />
//           {modal3 && (
//             <EditProfilePhoto open={modal3} close={handleeditcancel} />
//           )}
//           <DeactivateModal open={isModalOpen} cancelModal={handleCancel} />
//           <EmailVerificationModal
//             visible={verifyEmailModalVisible}
//             onClose={closeVerifyEmailModal}
//           />
//         </div>
//       )}
//     </Container>
//   );
// };

// export default ProfileDashboard;
"use client"; 
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "@/config/API";
import { GET } from "@/util/apicall";

const ProfileDashboard = () => {
  const [form] = Form.useForm();
    const [userDetails, setUserDetails] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: any) => {
    console.log("Form submitted:", values);
    // Handle profile + password update here
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
        setLoading(true);
        try {
          let url = API.USER_REFRESH;
          const response: any = await GET(url);
          if (response?.status) {
            setUserDetails(response?.data);
          } else {
            message.error("Failed to fetch users details.");
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
  form.setFieldsValue({
    firstName: userDetails.first_name,
    lastName:userDetails.last_name,
    displayName: userDetails.name,
    email:userDetails.email
  })

  return (
    <div className="container my-4">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className="p-4 border rounded bg-white"
      >
        {/* Section: Profile Info */}
        <h4 className="mb-3">Account Details</h4>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="First name"
              name="firstName"
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input placeholder="First name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Last name"
              name="lastName"
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input placeholder="Last name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Display name"
          name="displayName"
          rules={[{ required: true, message: "Display name is required" }]}
          extra="This will be how your name will be displayed in the account section and in reviews"
        >
          <Input placeholder="Display name" />
        </Form.Item>

        <Form.Item
          label="Email address"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Email address" />
        </Form.Item>

        {/* Section: Password Change */}
        <hr className="my-4" />
        <h4 className="mb-3">Password change</h4>

        <Form.Item
          label="Current password (leave blank to leave unchanged)"
          name="currentPassword"
        >
          <Input.Password placeholder="Current password" />
        </Form.Item>

        <Form.Item
          label="New password (leave blank to leave unchanged)"
          name="newPassword"
        >
          <Input.Password placeholder="New password" />
        </Form.Item>

        <Form.Item
          label="Confirm new password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" />
        </Form.Item>

        <Form.Item className="mt-4">
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#e2401c", borderColor: "#e2401c" }}
          >
            SAVE CHANGES
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileDashboard;
