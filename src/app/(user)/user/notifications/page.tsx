"use client";
import { List, notification, Pagination } from "antd";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineNotification } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/util/apicall";
import API from "@/config/API";
import { MdError } from "react-icons/md";
import { navigateNotification } from "@/util/notifications.util";

function UserNotifications() {
  const [notificationApi, contextHolder] = notification.useNotification();
  const navigation = useRouter();
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const {
    data: notifications,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryFn: async () =>
      await GET(API.USER_NOTIFICATIONS, {
        order: "DESC",
        page: page,
        take: pageSize,
      }),
    queryKey: ["notifications", page, pageSize],
    retry: 1,
  });
  console.log('notifications',notifications)
  const onClick = (item: any) => {
    router.push(navigateNotification(item?.typeId, item?.type));
  };
  return (
    <>
      {contextHolder}
      <div className="fs-5 fw-medium">{`My Notifications (${
        notifications?.meta?.itemCount ?? 0
      })`}</div>
      <hr />
      {isLoading ? (
        <div></div>
      ) : Array.isArray(notifications?.data) ? (
        <>
          <List
            itemLayout="horizontal"
            dataSource={notifications?.data}
            locale={{ emptyText: "You have No Notifactions at the moment.." }}
            renderItem={(item: any, index) => (
              <List.Item
                className="order-list-item"
                onClick={() => onClick(item)}
              >
                <List.Item.Meta
                  avatar={
                    <div className="h-100">
                      <img
                        className=""
                        src={item?.image}
                        style={{
                          width: "50px",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        alt="Image"
                      />
                    </div>
                  }
                  title={<h6>{item?.title}</h6>}
                  description={item?.message}
                />
              </List.Item>
            )}
          />
          <div></div>
        </>
      ) : isError ? (
        <div></div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default UserNotifications;
