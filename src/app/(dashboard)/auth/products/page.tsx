"use client";
import React, { useMemo, useReducer, useState } from "react";
import PageHeader from "@/app/(dashboard)/_components/pageHeader";
import { Button, Input, Select, TreeSelect } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "@/app/(dashboard)/_components/loading";
import DataTable from "./_components/dataTable";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/util/apicall";
import API from "@/config/API_ADMIN";
import useDebounceQuery from "@/shared/hook/useDebounceQuery";
import options from "@/app/(dashboard)/auth/products/_components/options.json";
import { useAppSelector } from "@/redux/hooks";
import { reduxCategoryItems } from "@/redux/slice/categorySlice";
import convertInput from "./_components/functions";
import Error from "@/app/(dashboard)/_components/error";
import { useRouter } from "next/navigation";

function reducer(state: any, action: any) {
  if (action?.value) {
    return convertInput(action.value);
  }
  return {};
}
function Products() {
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [query, , handleChange] = useDebounceQuery("", 300);
  const categories = useAppSelector(reduxCategoryItems);
  const [category, dispatch] = useReducer(reducer, {});
  const [status, setStatus] = useState("all");
  const router = useRouter();

  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryFn: ({ queryKey, signal }) =>
      GET(API.PRODUCTS_BYSTORE, queryKey[1] as object, signal),
    queryKey: [
      "admin_products",
      { page, query, take, ...category, status, order: "DESC" },
    ],
  });

  const treeData = useMemo(
    () =>
      categories?.map((item: any) => ({
        title: item?.name,
        value: item?.id,
        children: item?.sub_categories?.map((ite: any) => ({
          title: ite?.name,
          value: `${item?.id}|${ite?._id}`,
        })),
      })),
    [categories]
  );

  return (
    <>
      <PageHeader title={"Products"} bredcume={"Dashboard / Products"}>
        <Input
          suffix={<IoSearchOutline />}
          placeholder="Search . . ."
          onChange={(e) => {
            handleChange(e?.target?.value);
            setPage(1);
          }}
        />
        <Select
          defaultValue="Select Status"
          options={options}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
        <TreeSelect
          dropdownStyle={{ maxHeight: 400, overflow: "auto", width: "200px" }}
          treeData={[...treeData, { title: "All Category", value: "" }]}
          placeholder="Select Category"
          onChange={(val) => {
            dispatch({ value: val });
            setPage(1);
          }}
          className="w-100"
        />
        <Button
          type="primary"
          onClick={() => router.push("/auth/products/create")}
        >
          New +{" "}
        </Button>
        <Button
          type="primary"
          ghost
          onClick={() => refetch()}
          loading={isFetching && !isLoading}
        >
          Refresh
        </Button>
      </PageHeader>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error description={error?.message} />
      ) : (
        <DataTable
          data={Array.isArray(products?.data) ? products?.data : []}
          count={products?.meta?.itemCount}
          setPage={setPage}
          setTake={setTake}
          pageSize={take}
          page={page}
        />
      )}
    </>
  );
}

export default Products;
