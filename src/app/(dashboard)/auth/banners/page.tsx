"use client";
import React, { useState } from "react";
import { Button, Input } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import PageHeader from "@/app/(dashboard)/_components/pageHeader";
import Loading from "@/app/(dashboard)/_components/loading";
import DataTable from "./_components/dataTable";
import FormModal from "./_components/formModal";
import API from "@/config/API_ADMIN";
import { GET } from "@/util/apicall";
import { useQuery } from "@tanstack/react-query";
import useDebounceQuery from "@/shared/hook/useDebounceQuery";
import Error from "@/app/(dashboard)/_components/error";
import './styles.scss'
function Banners() {
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [debounce, search, handleChange] = useDebounceQuery("", 300);

  const editItem = (value: any) => {
    setSelectedItem(value);
    setOpenForm(!openForm);
  };

  const {
    data: banners,
    isLoading,
    isFetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      // await GET(API.BANNERS_LIST, {
      //   order: "DESC",
      //   page,
      //   take,
      //   search,
      // });
      // Mock banners data since API is not defined
      return {
        data: [],
        meta: { itemCount: 0 }
      };
    },
    queryKey: ["admin_banners", page, debounce, take],
  });

  const onEdit = (item: any) => {
    setOpenForm(true);
    setSelectedItem(item);
  };
  return (
    <div>
      <PageHeader title={"Banners"} bredcume={"Dashboard / Banners"}>
        <Input
          allowClear
          suffix={<IoSearchOutline />}
          placeholder="Search . . ."
          onChange={(e) => {
            handleChange(e?.target?.value);
            setPage(1);
          }}
        />
        <Button type="primary" onClick={() => setOpenForm(true)}>
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
          data={Array.isArray(banners?.data) ? banners?.data : []}
          count={banners?.meta?.itemCount ?? 0}
          setPage={setPage}
          setTake={setTake}
          pageSize={take}
          page={page}
          edit={onEdit}
        />
      )}
      <FormModal
        visible={openForm}
        data={selectedItem}
        onClose={() => editItem({})}
        onChange={() => {}}
      />

      <br />
    </div>
  );
}

export default Banners;
