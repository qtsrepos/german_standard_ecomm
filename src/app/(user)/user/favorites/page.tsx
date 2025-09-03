"use client";
import { Avatar, Button, List, notification, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaStar } from "react-icons/fa6";
import { BsFillBookmarkFill } from "react-icons/bs";
import API from "@/config/API";
import { useRouter } from "next/navigation";
import { DELETE, GET } from "@/util/apicall";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import showPrice from "@/shared/helpers/showPrice";
import { MdError } from "react-icons/md";
import { decrement } from "@/redux/slice/favouriteSlice";
import { useDispatch } from "react-redux";
import { HeartOutlined } from "@ant-design/icons";
import { Col, Row } from "react-bootstrap";
import ProductItem from "@/components/productItem/page";

const getVariantInfo = (data: any) => {
  let variantss = "";
  if (Array.isArray(data?.combination) == true) {
    data?.combination.map((item: any) => {
      variantss += `${item.value} `;
    });
  }
  return variantss.length ? `${variantss}` : variantss;
};
function WishListScreen() {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const {
    data: whishlist,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryFn: async () =>
      await GET(API.WISHLIST_GETALL, {
        order: "DESC",
        page: page,
        take: pageSize,
      }),
    queryKey: ["wishlist_items"],
    retry: 1,
    staleTime: 0,
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => {
      return DELETE(API.WISHLIST + id);
    },
    onError: (error, variables, context) => {
      notificationApi.error({ message: error?.message });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist_items"] });
      notificationApi.success({ message: `Item removed from wishlist.` });
      dispatch(decrement());
    },
  });

  const itemClick = (item: any) => {
    const url = new URLSearchParams({
      pid: item?.pid,
      ...(item?.variantId && { vid: item?.variantId }),
    });
    navigate.push(`/${item?.slug}?${url.toString()}`);
  };

  const EmptyWishlist = () => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
        <div style={{ fontSize: "120px", color: "#f0f0f0" }}>
          <HeartOutlined />
        </div>
        <h2 className="fw-bold mt-3">Wishlist is empty.</h2>
        <p className="text-muted mb-1">
          You don't have any products in the wishlist yet.
        </p>
        <p className="text-muted">
          You will find a lot of interesting products on our "Shop" page.
        </p>
        <Button
          type="primary"
          shape="round"
          className="mt-3"
          style={{
            backgroundColor: "#e63900",
            borderColor: "#e63900",
            padding: "0 32px",
            height: "40px",
          }}
          onClick={() => navigate.push("/category")}
        >
          RETURN TO SHOP
        </Button>
      </div>
    )
  }
  return (
    <>
      <div>
        {contextHolder}
        <div className="fs-5 mt-3 fw-medium">{`Your products wishlist`}</div>
        <hr />
        {isLoading ? (
          <div></div>
        ) : whishlist?.data.length == 0 ? EmptyWishlist() : Array.isArray(whishlist?.data) ? (
          // <List
          //   itemLayout="horizontal"
          //   dataSource={whishlist?.data}
          //   renderItem={(item: any, index) => (
          //     <List.Item
          //       className="favorite_list_item order-list-item"
          //       actions={[
          //         <Popconfirm
          //           placement="bottomRight"
          //           title={"Are you sure to Remove item from wishlist?"}
          //           okText="Yes"
          //           cancelText="No"
          //           onConfirm={async () => mutationDelete.mutate(item?.id)}
          //         >
          //           <a key="list-loadmore-edit" className="text-danger">
          //             <span className="d-none d-md-flex">Delete</span>
          //             <RiDeleteBinLine size={20} className="d-flex d-md-none" />
          //           </a>
          //         </Popconfirm>,
          //       ]}
          //     >
          //       <List.Item.Meta
          //         avatar={
          //           <div className="d-flex flex-column h-100 align-items-center gap-1">
          //             <Avatar
          //               src={item?.image ?? ""}
          //               shape="square"
          //               size={80}
          //               onClick={() => itemClick(item)}
          //             />
          //             {item?.status == false || item?.unit == 0 ? (
          //               <span
          //                 className="mt-0 text-danger fw-medium"
          //                 style={{ fontSize: "14px" }}
          //               >
          //                 Out of Stock
          //               </span>
          //             ) : null}
          //           </div>
          //         }
          //         title={
          //           <div
          //             style={{ cursor: "pointer" }}
          //             onClick={() => itemClick(item)}
          //           >
          //             <span
          //               style={{ textTransform: "capitalize" }}
          //               className={"favorite_product_name"}
          //             >
          //               {item?.name ?? ""}
          //               {getVariantInfo(item)}
          //             </span>
          //           </div>
          //         }
          //         description={
          //           <div
          //             onClick={() => itemClick(item)}
          //             style={{ cursor: "pointer" }}
          //           >
          //             {true ? (
          //               <div className="d-flex gap-2">
          //                 <div className="">
          //                   <FaStar color="#f5da42" /> &nbsp;
          //                   {isNaN(Number(item?.averageRating)) == false
          //                     ? Number(item?.averageRating)?.toFixed(1)
          //                     : 0}
          //                 </div>
          //                 <span className=" text-dark">
          //                   {item?.totalReviews
          //                     ? ` (${item?.totalReviews})`
          //                     : ""}
          //                 </span>
          //               </div>
          //             ) : null}
          //             <h6 className="mt-0 text-dark fw-bold mt-2">
          //               {showPrice(item?.price)}
          //             </h6>
          //           </div>
          //         }
          //       />
          //     </List.Item>
          //   )}
          // />
          <Row>
            {whishlist?.data?.map((item: any, index: number) => (
              <Col key={item.id || index} md={6} lg={3} className="mb-4">
                <Popconfirm
                  placement="bottomRight"
                  title={"Are you sure to Remove item from wishlist?"}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={async () => mutationDelete.mutate(item?.id)}
                >
                  <a key="list-loadmore-edit" className="text-danger"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      position: "relative",
                      top: "27px",
                      right: "16px",
                      zIndex: "1000",
                      cursor: "pointer",
                    }}>
                    <span className="d-none d-md-flex">Remove</span>
                    <RiDeleteBinLine size={20} className="d-flex d-md-none" />
                  </a>
                </Popconfirm>
                <ProductItem item={item} ></ProductItem>
              </Col>
            ))}
          </Row>
        )
          : isError ? (
            <div></div>
          ) : (
            <div></div>
          )}
      </div>
    </>
  );
}

export default WishListScreen;



