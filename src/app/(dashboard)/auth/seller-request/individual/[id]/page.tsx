"use client";
import React from "react";
import PageHeader from "@/app/(dashboard)/_components/pageHeader";
import { Button, Card, Descriptions } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/util/apicall";
import API from "@/config/API_ADMIN";
import { useParams } from "next/navigation";
import Loading from "@/app/(dashboard)/_components/loading";
import Error from "@/app/(dashboard)/_components/error";
import moment from "moment";

function IndividualSeller() {
  const params = useParams();
  const {
    data: seller,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: ({ signal }) =>
      GET(API.INDIVIDUAL_SELLER_DETAILS + params?.id, {}, signal),
    queryKey: ["admin_individual_seller_details", params?.id],
    select: (data: any) => {
      if (data?.status && typeof data?.data === "object") {
        return Object.keys(data.data)
          .filter((key) =>
            [
              "name",
              "email",
              "phone",
              "visa_status",
              "age",
              "gender",
              "createdAt",
            ].includes(key)
          )
          ?.map((item, index) => ({
            key: index,
            label: item,
            children:
              item == "createdAt"
                ? moment(data?.data?.creatdAt).format("DD/MM/YYYY")
                : data?.data[item],
          }));
      }
      return [];
    },
  });

  return (
    <>
      <PageHeader
        title={"Seller Request Individual"}
        bredcume={"Dashboard / Seller Requests / Individual"}
      >
        <Button type="primary" ghost>
          Request Document
        </Button>
        <Button type="primary">Approve</Button>
        <Button type="primary">Reject</Button>
      </PageHeader>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error description={error.message} />
      ) : (
        <Card>
          <Descriptions
            title="Seller Details"
            layout="horizontal"
            size="middle"
            items={seller}
            labelStyle={{
              color: "black",
              textTransform: "capitalize",
              fontWeight: 600,
            }}
          />
        </Card>
      )}
    </>
  );
}

export default IndividualSeller;
