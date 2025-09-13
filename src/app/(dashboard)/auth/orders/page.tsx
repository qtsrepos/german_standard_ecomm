'use client'
import React, { useEffect, useState } from "react";
import PageHeader from "@/app/(dashboard)/_components/pageHeader";
import { Button, DatePicker, Input, Select } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "@/app/(dashboard)/_components/loading";
import DataTable from "./_components/dataTable";
import { GET } from "@/util/apicall";
import { useQuery } from "@tanstack/react-query";
import API from "@/config/API_ADMIN";
import Error from "@/app/(dashboard)/_components/error";
import options from "@/config/order_status.json";
import useCreateQueryString from "@/shared/hook/useCreateQueryString";
import debounce from "@/shared/helpers/debounce";
import dayjs from "dayjs";
import useOrderNotification from "@/shared/hook/useOrderNotification";

function Page() {
  const { RangePicker } = DatePicker;
  const [searchParams, setQuery] = useCreateQueryString();
  const take = Number(searchParams.get("take")) || 10;
  const page = Number(searchParams.get("page")) || 1;
  const orderId = searchParams.get("orderId") || "";
  const status = searchParams.get("status") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  
  // Use the shared notification hook
  const { testAudioManually } = useOrderNotification({
    onNewOrder: () => {
      // Refresh the orders list when a new order comes in
      refetch();
    }
  });

  const debounceQuery = debounce((val: string) =>
    setQuery({ page: 1, orderId: val })
  );

  const {
    data: orders,
    isLoading,
    isFetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryFn: ({ queryKey }) =>
      GET(API.ORDER_GET_BYSTORE, queryKey[1] as object),
    queryKey: [
      "admin_orders",
      {
        page,
        orderId,
        take,
        status,
        from,
        to,
      },
    ],
  });

  return (
    <>
      <PageHeader title={"Orders"} bredcume={"Dashboard / Orders"}>
        <Input
          suffix={<IoSearchOutline />}
          placeholder="Search orderid"
          type="number"
          onChange={(e) => debounceQuery(e?.target?.value)}
          defaultValue={orderId}
        />
        <RangePicker
          className="w-100"
          onChange={(dates: any, dateString: string[]) => {
            setQuery({ page: 1, from: dateString[0], to: dateString[1] });
          }}
          defaultValue={from && to ? [dayjs(from), dayjs(to)] : undefined}
        />
        <Select
          defaultValue={status}
          options={options}
          onChange={(v) => {
            setQuery({ page: 1, status: v });
          }}
        />
        <Button
          type="primary"
          ghost
          onClick={() => refetch()}
          loading={isFetching && !isLoading}
        >
          Refresh
        </Button>
        
        {/* Manual test button */}
        <Button onClick={testAudioManually}>
          Test Audio
        </Button>
      </PageHeader>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error description={error?.message} />
      ) : (
        <DataTable
          data={Array.isArray(orders?.data) ? orders?.data : []}
          count={orders?.meta?.itemCount}
          setPage={(p, t) => setQuery({ page: p, take: t })}
          pageSize={take}
          page={page}
        />
      )}
    </>
  );
}

export default Page;