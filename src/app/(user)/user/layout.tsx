"use client";
import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { options } from "@/app/api/auth/[...nextauth]/options";
import "./style.scss";
import Sidebar from "./_components/sidebar";
import Image from "next/image";
import Avatar from "../../../assets/images/avatar.jpg";
import { useSession } from "next-auth/react";
import EditProfilePhoto from "./profile/_components/editProfilePhoto";
import { FaArrowLeft } from "react-icons/fa6";
import BannerHead from "@/app/(screens)/banner_path/page";
function Layout({ children }: { children: React.ReactNode }) {
  const [profileModal, setProfileModal] = useState(false);
  // const session: any = await getServerSession(options);
  const { data: session } = useSession();
  const User = session?.user;
  return (<>
<BannerHead head="My Account" path="/ MY ACCOUNT"/>
    <main className="container mt-4">
      <div className="row">
        <div className="px-4 col-sm-12 col-xs-12 col-md-3 border-1 border-end">
          <div
            className="d-flex flex-column  "
            style={{ top: "110px", zIndex: "0" }}
          >
            {/* <div className="userSidebar-storeBox">
              <div
                onClick={() => {
                  setProfileModal(true);
                }}
              >
                <Image
                  src={User?.image || Avatar}
                  width={40}
                  height={40}
                  className="userSidebar-logo"
                  alt="userImage"
                />
              </div>
              <div style={{ marginLeft: 10, overflow: "hidden" }}>
                <div className="userSidebar-txt1 text-uppercase">
                  {session?.user?.name ?? ""}
                </div>
                <div className="userSidebar-txt2">
                  {session?.user?.email ?? ""}
                </div>
              </div>
            </div> */}
            <div  className=" my_account pt-4 pb-2">
              <h4>MY ACCOUNT</h4>
            </div>
            <Sidebar />
          </div>
        </div>
        <div className="col-12 col-md-9">{children}</div>
        <EditProfilePhoto
          open={profileModal}
          close={() => setProfileModal(false)}
        />
      </div>
    </main>
    </>
  );
}

export default Layout;
