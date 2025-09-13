"use client";
import { Button, List, notification, Popconfirm } from "antd";
import React, { useState } from "react";
import { BsFillBookmarkFill } from "react-icons/bs";
import useToggle from "@/shared/hook/useToggle";
import API from "@/config/API";
import { DELETE, GET } from "@/util/apicall";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdError } from "react-icons/md";
import AddressModal from "./_components/addressModal";
import { Col, Row } from "react-bootstrap";

function UserAddress() {
  const [openModal, toggleModal] = useToggle(false);
  const [type, setType] = useState<string>("update");
  const [selected, setSelected] = useState<any>({});
  const [notificationApi, contextHolder] = notification.useNotification();
  const pageSize = 5;
  const queryClient = useQueryClient();

  const deleteAddress = async (item: any) => {
    const url = API.ADDRESS + item?.id;
    try {
      const response: any = await DELETE(url);
      if (response?.status) {
        notificationApi.success({ message: `Address removed successfully.` });
        // fetchAddresses();
      } else {
        notificationApi.error({ message: response?.message });
      }
    } catch (err) {
      notificationApi.error({ message: `something went wrong!` });
    }
  };

  const {
    data: address,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryFn: async () =>
      await GET(API.ADDRESS_GET, {
        order: "DESC",
        take: pageSize,
      }),
    queryKey: ["address_items"],
    retry: 1,
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => {
      return DELETE(API.ADDRESS + id);
    },
    onError: (error, variables, context) => {
      notificationApi.error({ message: error?.message });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["address_items"] });
      notificationApi.success({ message: `Address removed Successfully..` });
    },
  });
  return (
    <>
      {/* <div className="fs-5 fw-medium py-3 border-bottom">My Address ({`${address?.data?.length>0?address?.data?.length:0}`})</div> */}
      <div className="mb-3">
        {contextHolder}
        <div>
          <Button
            className="w-100 mt-3"
            onClick={() => {
              toggleModal(true);
              setType("add");
            }}
            type="dashed"
          >
            + Add Address
          </Button>
          <h4 className="mt-3">Billing & Shipping Address</h4>
          <p className="text-secondary">The following addresses will be used on the checkout page by default.</p>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error fetching addresses</div>
        ) : Array.isArray(address?.data) && address?.data.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            <Row>
            {address?.data?.map((item: any, index: number) => (
              <Col lg={6} key={item.id} className="mb-3">
              <div className="w-100 border rounded p-3" >
                <span className="text-uppercase">{item?.type}</span>

                <div className="d-flex gap-3 fs-6 fw-bold">
                  <span>{item?.userDetails?.name}</span>
                  <span className="profilescreen-address-phoneno">
                    {item?.code ?? ""} {item?.alt_phone}
                  </span>
                </div>

                <div className="profilescreen-address-fulladdress">
                  {item?.fullAddress}
                </div>

                <div className="profilescreen-address-formaddress">
                  {item?.flat}, {item?.street}, {item?.city}, {item?.state},
                  <span className="fw-bold"> {item?.pin_code}</span>
                </div>

                <div className="d-flex justify-content-end">
                  <span>
                    <a
                      className="pe-3"
                      onClick={() => {
                        setType("update");
                        setSelected(item);
                        toggleModal(true);
                      }}
                    >
                      Edit
                    </a>
                    <Popconfirm
                      placement="topRight"
                      title="Are you sure to delete?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => mutationDelete.mutate(item?.id)}
                    >
                      <a className="text-danger">Delete</a>
                    </Popconfirm>
                  </span>
                </div>
              </div>
              </Col>
            ))}
            </Row>
          </div>
        ) : (
          <div>No address found</div>
        )}

        <AddressModal
          open={openModal}
          modalClose={() => toggleModal(false)}
          type={type}
          selected={selected}
          fetchAddress={refetch}
        />
      </div>
    </>
  );
}

export default UserAddress;

export const dynamic = "force-dynamic";
