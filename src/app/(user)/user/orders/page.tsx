// "use client";
// import { Avatar, List, notification, Pagination, Select, Tag } from "antd";
// import React, { useCallback, useEffect, useState } from "react";
// import { FaBoxOpen } from "react-icons/fa6";
// import Search from "antd/es/input/Search";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useAppSelector } from "@/redux/hooks";
// import { reduxSettings } from "@/redux/slice/settingsSlice";
// import moment from "moment";
// import API from "@/config/API";
// import CONFIG from "@/config/configuration";
// import { useQuery } from "@tanstack/react-query";
// import { GET } from "@/util/apicall";
// import { MdError } from "react-icons/md";
// import { Suspense } from "react";
// const actions = [
//   { title: "Delivered", value: "delivered" },
//   { title: "Cancelled", value: "cancelled" },
//   { title: "Pending", value: "pending" },
// ];
// const options = [
//   { value: "30days", label: "last 30 days" },
//   { value: "3months", label: "past 3 months" },
//   { value: "6months", label: "past 6 months" },
//   { value: "2023", label: "2023" },
// ];
// const getVariantInfo = (data: any) => {
//   let variantss = "";
//   if (Array.isArray(data?.combination) == true) {
//     data?.combination.map((item: any) => {
//       variantss += `${item.value} `;
//     });
//   }
//   return variantss;
// };
// function OrdersPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <UserOrders />
//     </Suspense>
//   );
// }

// function UserOrders() {
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const currpage = searchParams.get("page") || 1;
//   const [dateFilter, setDateFilter] = useState("");
//   const [page, setPage] = useState(
//     isNaN(Number(currpage)) ? 1 : Number(currpage)
//   );
//   const pageSize = 5;
//   const router = useRouter();
//   const [notificationApi, contextHolder] = notification.useNotification();
//   const Settings = useAppSelector(reduxSettings);
//   const [oderStatus, setOrderStatus] = useState("");

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [search]);
//   const {
//     data: orders,
//     isLoading,
//     isFetching,
//     isError,
//     error,
//   } = useQuery({
//     queryFn: async () =>
//       await GET(API.ORDER_GET, {
//         order: "DESC",
//         page: page,
//         take: pageSize,
//         ...(debouncedSearch && { name: debouncedSearch }),
//         status: oderStatus,
//         sort: dateFilter,
//       }),
//     queryKey: ["order_items", page, debouncedSearch, oderStatus, dateFilter],
//     retry: 1,
//   });

//   const createQueryString = useCallback(
//     (name: string, value: string) => {
//       const params = new URLSearchParams(searchParams.toString());
//       params.set(name, value);

//       return params.toString();
//     },
//     [searchParams]
//   );

//   const changePage = async (page: number) => {
//     setPage(page);
//   };
//   return (
//     <>
//       {contextHolder}
//       <div className="profile-header">
//         <div className="fs-5 fw-medium">
//           My Orders ({orders?.meta?.itemCount ?? 0})
//         </div>
//         <div style={{ flex: 1 }} />
//       </div>
//       <hr />
//       <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
//         <div>
//           {actions?.map((item: any, index: number) => (
//             <Tag
//               style={{ cursor: "pointer" }}
//               color={item?.value == oderStatus ? CONFIG.COLOR : ""}
//               onClick={() => {
//                 if (!isLoading) {
//                   if (oderStatus == item?.value) {
//                     setOrderStatus("");
//                     return;
//                   }
//                   setOrderStatus(item?.value);
//                   setPage(1);
//                 }
//               }}
//             >
//               {item?.title}
//             </Tag>
//           ))}
//         </div>
//         {/* <div style={{ flex: 1 }} /> */}

//         <div className="ms-auto d-flex gap-2">
//           <Select
//             defaultValue="Order Time"
//             style={{ width: 130 }}
//             options={options}
//             onChange={(v) => setDateFilter(v)}
//           />
//           <Search
//             placeholder="Search all Orders"
//             allowClear
//             enterButton="Search"
//             size="middle"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             // onSearch={(sear) => {
//             //   setSearch(sear);
//             // }}
//             // loading={searching}
//           />
//         </div>
//         <div></div>
//       </div>
//       <div style={{ padding: 10 }} />
//       {isLoading ? (
//         <div></div>
//       ) : Array.isArray(orders?.data) ? (
//         <List
//           className="demo-loadmore-list"
//           loading={isLoading}
//           itemLayout="horizontal"
//           // loadMore={loadMore}
//           dataSource={orders?.data}
//           size="small"
//           renderItem={(item: any) => (
//             <List.Item
//               onClick={() => router.push(`/user/orders/${item?.order_id}`)}
//               className="order-list-item d-block d-md-flex "
//               style={{ cursor: "pointer" }}
//             >
//               <List.Item.Meta
//                 key={4}
//                 className="mt-2"
//                 description={
//                   Array.isArray(item?.orderItems) == true
//                     ? item?.orderItems.map((orderItem: any, index: number) => (
//                         <List.Item.Meta
//                           key={index}
//                           className="mt-2"
//                           avatar={
//                             <Avatar
//                               shape="square"
//                               src={orderItem?.image}
//                               size={80}
//                             />
//                           }
//                           title={
//                             <>
//                               <div className="text-capitalize d-block">{`${
//                                 orderItem?.name
//                               } ${getVariantInfo(orderItem?.variantDetails)} (${
//                                 orderItem.quantity
//                               } item)`}</div>
//                               <div>
//                                 <span>Ordered on:</span>
//                                 <span className="text-success">{` ${moment(
//                                   item?.createdAt
//                                 ).format("DD/MM/YYYY")}`}</span>
//                               </div>
//                               <div className="fw-bold">{`Actual Amount : ${
//                                 Number(orderItem?.totalPrice)?.toFixed(2) ?? ""
//                               } ${Settings.currency ?? ""}`}</div>
//                             </>
//                           }
//                         />
//                       ))
//                     : null
//                 }
//               />
//               <div className="d-flex justify-content-between d-md-block">
//                 <span className="fw-bold pe-2">
//                   Total Amount: {Number(item?.grandTotal)?.toFixed(2)}{" "}
//                   {Settings.currency}
//                 </span>
//                 <Tag bordered={false}>{item?.status}</Tag>
//               </div>
//             </List.Item>
//           )}
//         ></List>
//       ) : isError ? (
//         <div></div>
//       ) : (
//         <div></div>
//       )}
//       <div className="d-flex justify-content-center mt-3">
//         <Pagination
//           current={page || 1}
//           pageSize={pageSize || 10}
//           total={orders?.meta?.itemCount || 0}
//           defaultCurrent={1}
//           responsive={true}
//           defaultPageSize={pageSize || 10}
//           disabled={false}
//           hideOnSinglePage={true}
//           onChange={(current: any, size: any) => {
//             changePage(current);
//           }}
//         />
//       </div>
//     </>
//   );
// }

// export default OrdersPage;

"use client";
import {
  Table,
  Button,
  Tag,
  Select,
  Input,
  Pagination,
  notification,
  Modal,
  Form,
} from "antd";
import React, { useCallback, useEffect, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import moment from "moment";
import API from "@/config/API";
import CONFIG from "@/config/configuration";
import { useQuery } from "@tanstack/react-query";
import { GET, PUT } from "@/util/apicall";
import TextArea from "antd/es/input/TextArea";
import "../../user/style.scss";
import { useMediaQuery } from 'react-responsive';

const { Search } = Input;

const actions = [
  { title: "Delivered", value: "delivered" },
  { title: "Cancelled", value: "cancelled" },
  { title: "Pending", value: "pending" },
];

const options = [
  { value: "30days", label: "last 30 days" },
  { value: "3months", label: "past 3 months" },
  { value: "6months", label: "past 6 months" },
  { value: "2023", label: "2023" },
];

const OrdersTable = () => {
  const searchParams = useSearchParams();
  const currpage = searchParams.get("page") || 1;
  const [page, setPage] = useState(isNaN(Number(currpage)) ? 1 : Number(currpage));
  const [dateFilter, setDateFilter] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const pageSize = 5;
  const Settings = useAppSelector(reduxSettings);
  const router = useRouter();
  const [Notifications, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const isMediumOrBelow = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryFn: async () => {
      const res = await GET(API.ORDER_GET, {
        order: "DESC",
        page,
        take: pageSize,
        ...(debouncedSearch && { name: debouncedSearch }),
        status: orderStatus,
        sort: dateFilter,
      });

      // Add totalItems per order for display
      res.data = res.data.map((order:any) => ({
        ...order,
        totalItems: Array.isArray(order.orderItems) ? order.orderItems.length : 0,
      }));

      return res;
    },
    queryKey: ["order_items", page, debouncedSearch, orderStatus, dateFilter],
    retry: 1,
  });

  const getActionButtons = (status:any, orderId:any) => {
    const base = [
      <Button style={{borderRadius:"25px"}} key="view" type="primary" onClick={() => 
        router.push(`/user/orders/${orderId}`)}>View</Button>,
      <Button style={{borderRadius:"25px"}} key="track" type="primary"
      onClick={()=>router.push(`/track_order/${orderId}`)}>Track Order</Button>,
    ];

    const extra:any = {
      "pending": [
        <Button key="pay" style={{borderRadius:"25px"}} type="primary">Pay</Button>,
        <Button key="cancel" style={{borderRadius:"25px"}} type="primary" onClick={()=>{setSelectedOrderId(orderId);
          setOpen(true)}}>Cancel</Button>,
      ],
      "Cancelled": [],
      "Processing": [],
      "On hold": [],
    };

    const invoice = <Button style={{borderRadius:"25px"}} key="invoice" type="primary">Invoice</Button>;

    return [...(extra[status] || []), ...base, invoice];
  };

  const columns = [
    {
      title: "ORDER",
      dataIndex: "order_id",
      render: (id:any) => <span onClick={() => router.push(`/user/orders/${id}`)} 
      className="table-highlight"
      style={{cursor:"pointer"}}>{id}</span>,
    },
    {
      title: "DATE",
      dataIndex: "createdAt",
      render: (date:any) => moment(date).format("MMM D, YYYY"),
    },
    {
      title: "SATATUS",
      dataIndex: "status",
      render: (status:any) => <span>{status}</span>,
    },
    {
      title: "TOTAL",
      dataIndex: "grandTotal",
      render: (total:any, record:any) => (
        <span>
          <strong className="table-highlight">{Number(total).toFixed(2)} AED</strong> for {record.totalItems} items
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_:any, record:any) => <div className="d-flex flex-wrap gap-2">{getActionButtons(record.status, record.order_id)}</div>,
    },
  ];

  const cancelOrder = async (values: any) => {
    setOpen(true)
      const url = API.ORDER_CANCEL + selectedOrderId;
      try {
        setLoading(true);
        const response: any = await PUT(url, values);
        if (response.status) {
          Notifications["success"]({
            message: response?.message ?? "",
          });
          setOpen(false);
          form.resetFields();
          // props?.getOrderDetails();
        } else {
          Notifications["error"]({
            message: response?.message ?? "",
          });
        }
      } catch (err) {
        Notifications["error"]({
          message: "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      {contextHolder}
      {/* <div className="d-flex flex-column flex-md-row gap-2 mb-3">
        <div>
          {actions.map((action) => (
            <Tag
              key={action.value}
              color={orderStatus === action.value ? CONFIG.COLOR : ""}
              style={{ cursor: "pointer" }}
              onClick={() => setOrderStatus(orderStatus === action.value ? "" : action.value)}
            >
              {action.title}
            </Tag>
          ))}
        </div>
        <div className="ms-auto d-flex gap-2">
          <Select
            defaultValue="Order Time"
            style={{ width: 130 }}
            options={options}
            onChange={(v) => setDateFilter(v)}
          />
          <Search
            placeholder="Search Orders"
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            enterButton
          />
        </div>
      </div> */}
       {!isMediumOrBelow && (
      <Table
        rowKey="order_id"
        columns={columns}
        dataSource={orders?.data || []}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: orders?.meta?.itemCount || 0,
          onChange: (page) => setPage(page),
        }}
      />)}

       {/* Card view for medium and small screens */}
    {isMediumOrBelow && (
      <div className="flex flex-col gap-4">
        {(orders?.data || []).map((order:any) => (
          <div key={order.order_id} className="p-4 rounded-lg shadow-md bg-white">
            <div className="d-flex justify-content-between text-sm mb-2">
              <span className="table-head">DATE</span>
              <span className="table-body">{moment(order.createdAt).format("MMMM D, YYYY")}</span>
            </div>
            <div className="d-flex justify-content-between text-sm mb-2">
              <span className="table-head">STATUS</span>
              <span className="table-body">{order.status}</span>
            </div>
            <div className="d-flex justify-content-between text-sm mb-2">
              <span className="table-head">TOTAL</span>
              <span className="table-body">
                <span className="table-highlight">{Number(order.grandTotal).toFixed(2)} AED</span> for {order.totalItems} items
              </span>
            </div>
            <div className="d-flex justify-content-end flex-wrap gap-2 mt-3">
              {getActionButtons(order.status, order.order_id)}
            </div>
          </div>
        ))}
      </div>
    )}
      <Modal
        title="Cancel Your Order"
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        centered
        okText="Confirm"
      >
        <Form layout="vertical" form={form} onFinish={cancelOrder}>
          <Form.Item
            label="Reason for Cancellation"
            name={"remark"}
            rules={[
              {
                required: true,
                message: "Please enter reason for order cancellation",
              },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
        <p style={{ fontSize: "12px", marginBottom: 0 }}>
          Once you cancel your order, The order will not be processed by the
          seller and The amount will be refunded to your Bank account within 2
          days if any amount is debited.
        </p>
      </Modal>
    </>
  );
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersTable />
    </Suspense>
  );
}

