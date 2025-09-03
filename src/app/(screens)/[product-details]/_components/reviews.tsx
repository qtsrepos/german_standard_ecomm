"use client";
import Loading from "@/app/(dashboard)/_components/loading";
import API from "@/config/API";
import { DELETE, GET } from "@/util/apicall";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, notification, Pagination, Popconfirm, Rate } from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import ReviewFormModal from "./reviewFormModal";
import { useRouter, useSearchParams } from "next/navigation";
import { CgProfile } from "react-icons/cg";

type Props = {
  data: any;
};

function Reviews(props: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session }: any = useSession();
  const pid = searchParams.get("pid");
  const [Notifications, contextHolder] = notification.useNotification();
  const [formModal, setFormModal] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const queryClient = useQueryClient();
  const { data: User }: any = useSession();
  

  const reviewsQueryKey = [
    "product_review",
    { productId: props?.data?.pid, page, take, order: "DESC" },
  ];

  const { data: reviews, isLoading: isReviewLoading } = useQuery({
    queryFn: ({ queryKey }) =>
      GET(API.PRODUCT_REVIEW + "review", queryKey[1] as object),
    queryKey: reviewsQueryKey,
  });

  const deleteReview = useMutation({
    mutationFn: async (body: any) => DELETE(API.PRODUCT_REVIEW + body?._id),
    onError: (error) => {
      Notifications["error"]({ message: error.message });
    },
    onSuccess: () => {
      Notifications["success"]({ message: "Review Deleted Successfully" });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: reviewsQueryKey });
    },
  });

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setTake(pageSize);
  };

  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: reviewsQueryKey });
  };
  
  return (
    <div className="reviews-container">
      {contextHolder}
      <div className="reviews-header">
        <h2 className="reviews-title">Customer Reviews</h2>
        {session?.token && !props?.data?.review && (
          <Button
            type="primary"
            onClick={() => setFormModal(true)}
            className="add-review-btn"
          >
            Add Review +
          </Button>
        )}
      </div>

      {isReviewLoading ? (
        <Loading />
      ) : reviews?.data?.length ? (
        <div className="reviews-list">
          {reviews.data.map((item: any, index: number) => (
            <div key={index} className="review-card">
              <div className="review-header">
                {User?.user?.image ? (
                  <img alt="user-logo" className="review-user-image" src={User?.user?.image} />
                ) : (
                  <CgProfile />
                )}
                <span className="reviewer-name">{item?.userName}</span>
                <span className="review-date">
                  {moment(item?.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
              <div className="review-content">
                <Rate
                  disabled
                  allowHalf
                  value={Number(item?.rating)}
                  className="review-rating"
                />
                <p className="review-message">{item?.message}</p>
              </div>
              {item?.isUserReview && (
                <Popconfirm
                  title="Are you sure you want to delete this review?"
                  onConfirm={() => deleteReview.mutate(item)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    icon={<AiOutlineDelete size={20} />}
                    className="delete-btn"
                    danger
                  />
                </Popconfirm>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reviews">
          <p>No reviews available yet</p>
        </div>
      )}

      <div className="d-flex justify-content-center mt-3">
        {reviews?.meta?.itemCount > 0 && (
          <Pagination
            total={reviews?.meta?.itemCount}
            current={page}
            pageSize={take}
            onChange={handlePageChange}
            className="reviews-pagination"
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
          />
        )}
      </div>

      <ReviewFormModal
        visible={formModal}
        onClose={() => setFormModal(false)}
        pid={pid}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
}

export default Reviews;