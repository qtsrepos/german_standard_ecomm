import React from "react";
import "./style.scss";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import ScreenLayout from "./screenLayout";
import OrderNotificationWrapper from "./_components/OrderNotificationWrapper";

async function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session: any = await getServerSession(options);
  
  return (
    <OrderNotificationWrapper>
      <ScreenLayout data={session}>{children}</ScreenLayout>
    </OrderNotificationWrapper>
  );
}

export default layout;