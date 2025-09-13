"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import PageHeader from "../../../../components/pageHeader/pageHeader";
import SkelotonProductLoading from "../../../../components/skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductItem from "../../../../components/productItem/page";
import { Col, Row } from "react-bootstrap";
import { notification } from "antd";
import { useSelector } from "react-redux";
import { reduxLocation } from "../../../../redux/slice/locationSlice";
import { reduxSettings } from "../../../../redux/slice/settingsSlice";
import API from "../../../../config/API";
import { GET } from "../../../../util/apicall";
import _ from "lodash";
import useMediaQuery from "../../../../shared/hook/useMediaQuery";
import NoData from "../../../../components/noData";
const result: any = {
  recent: "Recently Launched Products",
  toprated: "Top Rated Products",
  visited: "Recently Visited Products",
};

function Page() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [Notifications, contextHolder] = notification.useNotification();
  const Location = useSelector(reduxLocation);
  const Settings = useSelector(reduxSettings);
  const lattitude = Settings?.isLocation === true ? Location.latitude : "";
  const longitude = Settings?.isLocation === true ? Location.longitude : "";
  const [loading, setLoading] = useState(true);
  const mediaQuery = useMediaQuery(762);
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);
  //==================
  const urls: any = {
    recent:
      API.PRODUCT_SEARCH_NEW_SINGLE +
      `?lattitude=${lattitude}&longitude=${longitude}&take=18&radius=${Settings?.radius}&tag=recent`,
    toprated:
      API.PRODUCT_SEARCH_NEW_SINGLE +
      `?lattitude=${lattitude}&longitude=${longitude}&take=18&radius=${Settings?.radius}&tag=top`,
    visited: API.USER_HISTORY + `?take=18`,
  };
  //=====================
  const getProducts = async (page: number) => {
    const url = urls[searchParams.get("type") ?? ""] + `&page=${page}`;
    try {
      const response: any = await GET(url);
      if (response?.status) {
        setProducts((prod) => _.uniqBy([...prod, ...response?.data], "_id"));
        setMeta(response.meta);
      } else {
        Notifications["error"]({
          message: response?.message,
          description: "",
        });
      }
    } catch (err) {
      Notifications["error"]({
        message: "Something went wrong.",
        description: "",
      });
    } finally {
      setLoading(false);
    }
  };
  const changePage = async (page: number) => {
    await getProducts(page);
    setPage(page);
  };
  useEffect(() => {
    getProducts(1);
    // window.scrollTo(0, 0);
  }, []);
  return (
    <div className="Screen-box py-3">
      {contextHolder}
      <PageHeader
        title={result[searchParams.get("type") ?? ""]}
        plain={true}
        page={page}
        // pageSize={pageSize}
        meta={meta}
        // initial={initial}
        type={Settings?.type}
        count={products?.length}
      ></PageHeader>
      {loading ? (
        <SkelotonProductLoading count={mediaQuery ? 6 : 18} />
      ) : products?.length ? (
        <InfiniteScroll
          dataLength={products.length}
          next={() => {
            changePage(page + 1);
          }}
          hasMore={meta?.hasNextPage ?? false}
          loader={<SkelotonProductLoading count={mediaQuery ? 2 : 6} />}
          endMessage={
            <p className="fw-bold text-center mt-3">
              {products?.length > 18 ? `Showing All Products` : ""}
            </p>
          }
        >
          <Row className="gy-2 gy-md-3 mx-0 gx-2 gx-md-3 mt-md-3">
            {products?.map((item: any, index: number) => (
              <Col
                lg="2"
                sm="4"
                className="ps-md-0 col-6 product-card-searchstore lg-25"
                key={index}
              >
                <ProductItem item={item} />
              </Col>
            ))}
          </Row>
        </InfiniteScroll>
      ) : (
        <NoData header={"No Products Found"} />
      )}
    </div>
  );
}

export default function P() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}
