"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PageHeader from "./_components/pageHeader";
import { Pagination, Space, Tag, notification } from "antd";
import { useSelector } from "react-redux";
import PageSider from "./_components/pageSider";
import { GET } from "@/util/apicall";
import API from "@/config/API";
import Loading from "@/components/loading";
import useDidUpdateEffect from "@/shared/hook/useDidUpdate";
import ProductItem from "@/components/productItem/page";
import NoData from "@/components/noData";
import MultiSearchProductList from "@/components/multiSearchCard/productSlider";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import "./styles.scss";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import { FaArrowLeft } from "react-icons/fa6";
import BannerHead from "../../banner_path/page";
import { germanStandardApi } from "@/services/germanStandardApi";
import { useAppDispatch } from "@/redux/hooks";
import { storeCategory } from "@/redux/slice/categorySlice";

const getCategoryId = (cid: any): string => {
  try {
    return window.atob(String(cid));
  } catch (err) {
    return "0";
  }
};

const ProductByCategory = () => {
  const pageSize = 9;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [Notifications, contextHolder] = notification.useNotification();
  const [meta, setMeta] = useState<any>({});
  const Settings = useSelector(reduxSettings);
  const Location = useSelector((state: any) => state.Location.location);
  const lattitude = Settings?.isLocation === true ? Location?.latitude : "";
  const longitude = Settings?.isLocation === true ? Location?.longitude : "";

  const [page, setPage] = useState(Number(searchParams?.get("page")) || 1);
  const [initial, setInitial] = useState(true);

  const categoryId = searchParams.get("id")
    ? getCategoryId(searchParams.get("id"))
    : "";
  const ogcategory = searchParams.get("ogCategory");
  const categories = useSelector((state: any) => state.Category.categries);

  const updateSearchParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.replace(pathname + "?" + params.toString());
    },
    [searchParams, pathname, router]
  );

  const initialValues = [
    {
      status: searchParams.get("order") === "DESC",
      value: searchParams.get("order") || "ASC",
      title: "New",
    },
    {
      status:
        searchParams.get("price") === "DESC" &&
        searchParams.get("order") === "ASC",
      value: "ASC",
      title: "Price: High to Low",
    },
    {
      status:
        searchParams.get("price") === "ASC" &&
        searchParams.get("order") === "ASC",
      value: "ASC",
      title: "Price: Low to High",
    },
  ];

  const [selectedTags, setSelectedTags] = useState(initialValues);

  // Fetch categories if not already loaded
  const getCategoriesIfNeeded = async () => {
    if (!categories || categories.length === 0) {
      try {
        console.log(
          "Categories not loaded, fetching from German Standard API..."
        );
        const categoriesData = await germanStandardApi.getCategories(1, 1);

        if (categoriesData && categoriesData.length > 0) {
          // Transform and store categories in Redux
          const transformedCategories =
            germanStandardApi.transformCategoriesForRedux(categoriesData);
          dispatch(storeCategory(transformedCategories));
          console.log(
            "Categories loaded and stored in Redux:",
            transformedCategories.length
          );
        }
      } catch (err) {
        console.log("Failed to fetch categories:", err);
      }
    }
  };

  const getProductsBySubCategory = async (currentPage: number) => {
    if (!categoryId && !ogcategory) {
      Notifications["warning"]({ message: "Please select a Category" });
      return;
    }

    try {
      setLoading(true);

      // Determine if this is a main category or subcategory by checking against categories data
      let mainCategoryId = null;
      let subCategoryId = null;

      if (categories && categories.length > 0) {
        const currentId = categoryId || ogcategory;

        // First check if it's a main category
        const mainCategory = categories.find(
          (cat: any) => (cat._id || cat.id) === currentId
        );
        if (mainCategory) {
          // This is a main category
          mainCategoryId = parseInt(mainCategory._id || mainCategory.id) || 1;
          console.log(
            "Loading products for main category:",
            mainCategoryId,
            mainCategory.name
          );
        } else {
          // Check if it's a subcategory
          for (const category of categories) {
            if (category.sub_categories) {
              const foundSubCategory = category.sub_categories.find(
                (subCat: any) => {
                  const subCatId = subCat._id || subCat.id;
                  return subCatId === currentId;
                }
              );
              if (foundSubCategory) {
                mainCategoryId = parseInt(category._id || category.id) || 1;
                subCategoryId = parseInt(
                  foundSubCategory._id || foundSubCategory.id
                );
                console.log(
                  "Loading products for subcategory:",
                  subCategoryId,
                  "in main category:",
                  mainCategoryId
                );
                break;
              }
            }
          }
        }
      }

      // Fallback if we can't find the category in our data
      if (!mainCategoryId) {
        mainCategoryId =
          parseInt(categoryId) || parseInt(ogcategory || "0") || 1;
        console.log("Using fallback category ID:", mainCategoryId);
      }

      console.log("Fetching products with German Standard API:", {
        category: mainCategoryId,
        subcategory: subCategoryId,
        page: currentPage,
        pageSize,
      });

      // Use the new German Standard API service
      const result = await germanStandardApi.getProducts(
        true, // refreshFlag
        currentPage,
        pageSize,
        mainCategoryId,
        subCategoryId || undefined
      );

      // Transform products for display compatibility
      const transformedProducts = germanStandardApi.transformProductsForDisplay(
        result.products,
        mainCategoryId.toString(),
        subCategoryId?.toString()
      );

      setProducts(transformedProducts);
      setMeta({
        itemCount: result.totalRows,
        totalPages: result.totalPages,
        currentPage: currentPage,
        pageSize: pageSize,
      });

      console.log(
        "Products loaded from German Standard API:",
        transformedProducts?.length
      );
      console.log(
        "Total rows:",
        result.totalRows,
        "Total pages:",
        result.totalPages
      );
    } catch (err: any) {
      console.error("German Standard API Error:", err);
      Notifications["error"]({
        message: "Something went wrong",
        description: err.message || "Failed to load products",
      });
      setProducts([]);
      setMeta({});
    } finally {
      setLoading(false);
      setInitial(false);
    }
  };

  const handleChange = (index: number) => {
    const newTags = [...selectedTags];
    const activeIndex = newTags.findIndex((item) => item.status);

    if (activeIndex !== -1 && activeIndex !== index) {
      newTags[activeIndex].status = false;
      newTags[activeIndex].value = "ASC";
    }

    newTags[index].status = !newTags[index].status;
    newTags[index].value = newTags[index].status ? "DESC" : "ASC";

    setSelectedTags(newTags);
    updateSearchParams({
      order: newTags[0].value,
      price: newTags[1].status ? "DESC" : newTags[2].status ? "ASC" : "RAND",
      page: "1",
    });
  };

  const handlePageChange = async (newPage: number) => {
    await getProductsBySubCategory(newPage);
    setPage(newPage);
    updateSearchParams({ page: String(newPage) });
    window.scrollTo(0, 0);
  };

  useDidUpdateEffect(() => {
    getProductsBySubCategory(page);
    window.scrollTo(0, 0);
  }, [selectedTags]);

  useEffect(() => {
    const id = searchParams.get("id");
    const ogCat = searchParams.get("ogCategory");
    const type = searchParams.get("type");

    if (!id && !ogCat) return;

    // Fetch categories first if needed, then fetch products
    const loadData = async () => {
      await getCategoriesIfNeeded();
      window.scrollTo(0, 0);
      await getProductsBySubCategory(1);
      setPage(1);
    };

    loadData();
  }, [searchParams.toString(), Location]);

  // Listen for filter changes from sidebar
  useEffect(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const brands = searchParams.get("brand");
    const proPlan = searchParams.get("proPlan");

    // If any filter parameters change, refetch products
    if (minPrice || maxPrice || brands || proPlan) {
      console.log("Filters changed, refetching products...");
      console.log("Brand filter value:", brands);
      getProductsBySubCategory(1);
      setPage(1);
    }
  }, [
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("brand"),
    searchParams.get("proPlan"),
  ]);

  return (
    <div className="Screen-box">
      <BannerHead
        head={searchParams.get("type")}
        path={`/ category / ${searchParams.get("type")}`}
      />
      {contextHolder}
      <Container>
        <Row>
          <Col lg={3} style={{ margin: 0, padding: 0 }}>
            <div className="productByCat-PageSider">
              <PageSider />
              <br />
            </div>
          </Col>
          <Col lg={9} style={{ margin: 0 }}>
            <PageHeader
              title={searchParams.get("type")}
              page={page}
              pageSize={pageSize}
              meta={meta}
              initial={initial}
              type={Settings?.type}
              count={products?.length}
            >
              <Space wrap>
                {selectedTags.map((tag, i) => (
                  <Tag
                    key={i}
                    color={tag.status ? API.COLOR : ""}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleChange(i)}
                  >
                    {tag.title}
                  </Tag>
                ))}
              </Space>
            </PageHeader>
            {loading ? (
              <Loading />
            ) : products?.length ? (
              Settings?.type === "multi" ? (
                products.map((item: any) => (
                  <MultiSearchProductList
                    key={item.id}
                    data={item}
                    type="category"
                    cid={categoryId}
                    cname={searchParams.get("type")}
                    count={3}
                    ogcategory={ogcategory}
                  />
                ))
              ) : (
                <Row className="gy-3 py-3">
                  {products?.map((item: any, i: number) => (
                    <Col xs={6} key={i} md="4">
                      <ProductItem item={item} />
                    </Col>
                  ))}
                </Row>
              )
            ) : (
              <NoData
                header="No Products"
                text1={`No Products found for "${
                  searchParams.get("type") ?? ""
                }"`}
              />
            )}
            <Pagination
              current={page}
              pageSize={pageSize}
              total={meta?.itemCount || 0}
              defaultCurrent={1}
              responsive={true}
              defaultPageSize={pageSize}
              disabled={false}
              hideOnSinglePage={true}
              onChange={handlePageChange}
            />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductByCategory;
