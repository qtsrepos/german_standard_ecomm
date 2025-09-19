"use client";
import React, { useEffect, useState } from "react";
import { notification, Pagination, Space, Spin, Tag } from "antd";
import PageHeader from "../../../../components/pageHeader/pageHeader";
import { useParams, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { reduxSettings } from "../../../../redux/slice/settingsSlice";
import { reduxLatLong } from "../../../../redux/slice/locationSlice";
import useDidUpdateEffect from "../../../../shared/hook/useDidUpdate";
import NoData from "../../../../components/noData";
import { germanStandardApi } from "../../../../services/germanStandardApi";
import { Col, Row } from "react-bootstrap";
import ProductItem from "../../../../components/productItem/page";

function Page() {
  const [product, setProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [Notifications, contextHolder] = notification.useNotification();
  const searchParams = useSearchParams();
  const Settings = useSelector(reduxSettings);
  const Location = useSelector(reduxLatLong);
  const params = useParams();
  const currentPage =
    Number(searchParams.get("page")) > 0 ? Number(searchParams.get("page")) : 1;
  const initialValues = [
    {
      status: searchParams.get("order") === "DESC" ? true : false,
      value:
        searchParams.get("order") === "ASC" ||
        searchParams.get("order") === "DESC"
          ? searchParams.get("order")
          : "ASC",
      title: "New",
    },
    {
      status:
        searchParams.get("price") === "DESC" &&
        searchParams.get("order") === "ASC"
          ? true
          : false,
      value: "ASC",
      title: "Price: High to Low",
    },
    {
      status:
        searchParams.get("price") === "ASC" &&
        searchParams.get("order") === "ASC"
          ? true
          : false,
      value: "ASC",
      title: "Price: Low to High",
    },
  ];
  const [page, setPage] = useState(currentPage);
  const pageSize = 12;
  const [meta, setMeta] = useState<any>({});
  const [initial, setInitial] = useState(true);
  const [selectedTags, setSelectedTags] = useState<any>(initialValues);
  const serchInput:any = params?.query;
  
  const getProducts = async (page: number) => {
    setLoading(true);
    try {
      if (serchInput) {
        // Decode the search input to handle URL encoding
        const decodedSearchInput = decodeURIComponent(serchInput);

        // Determine sort parameters based on selected tags
        let sortType: number | undefined;
        let sortOrder = "ASC";

        // Check which sorting tag is active
        const activeSortTag = selectedTags.find((tag: any) => tag.status === true);
        if (activeSortTag) {
          if (activeSortTag.title === "New") {
            sortType = 1; // Sort by date
            sortOrder = activeSortTag.value;
          } else if (activeSortTag.title.includes("Price")) {
            sortType = 2; // Sort by price
            sortOrder = activeSortTag.title.includes("High to Low") ? "DESC" : "ASC";
          }
        }

        // Call German Standard API for product search
        console.log(`🔍 Searching with parameters:`, {
          search: decodedSearchInput,
          category: 0,
          pageNumber: page,
          pageSize: pageSize,
          be: 1,
          type: sortType
        });

        const response = await germanStandardApi.getProductList({
          search: decodedSearchInput,
          category: 0, // Set to 0 for general search across all categories
          subCategory: 0, // Set to 0 for general search across all subcategories
          pageNumber: page,
          pageSize: pageSize,
          be: 1, // Business entity ID
          type: sortType || 0, // Add sort type if available, default to 0
          brand: 0, // Set to 0 for all brands
        });

        console.log("🔍 API Response received:", response);

        if (response && response.result) {
          // Parse the response result which is a JSON string
          const parsedResult = JSON.parse(response.result);
          const products = parsedResult.Data || [];
          const pageSummary = parsedResult.PageSummary?.[0] || { TotalRows: 0, TotalPages: 0 };

          console.log("📊 Parsed result:", {
            productsCount: products.length,
            totalRows: pageSummary.TotalRows,
            totalPages: pageSummary.TotalPages,
            sampleProduct: products[0]
          });

          // Transform products for display compatibility with enhanced data
          const transformedProducts = products.map((product: any) => ({
            _id: product.Id?.toString() || "0",
            id: product.Id?.toString() || "0",
            name: product.Name || "Unnamed Product",
            description: product.Description || "",
            image: product.Image || "/images/no-image.jpg",
            images: product.Image ? [product.Image] : [],
            price: 0, // Will be populated from rates API if needed
            originalPrice: 0,
            discount: 0,
            inStock: true,
            category: "",
            subCategory: "",
            code: product.Code || "",
            extraDescription: product.ExtraDescription || "",
            // ENHANCED: Complete German Standard API data for product detail navigation
            fullProductData: {
              // Core German Standard API fields
              Id: product.Id,
              Name: product.Name,
              Code: product.Code,
              Description: product.Description,
              ExtraDescription: product.ExtraDescription,
              Image: product.Image,

              // Additional metadata for optimization
              source: 'german_standard_api',
              fetchedAt: new Date().toISOString(),
              searchQuery: decodedSearchInput,
              pageInfo: {
                page: page,
                pageSize: pageSize,
                sortType: sortType,
                sortOrder: sortOrder
              },

              // Preserve any additional fields from API response
              ...product,

              // Standardized dual-format support
              id: product.Id,
              pid: product.Id,
              name: product.Name,
              description: product.Description,
              extraDescription: product.ExtraDescription,
              image: product.Image,
              code: product.Code
            },
            // For backward compatibility - keep original productData
            productData: {
              Id: product.Id,
              Name: product.Name,
              Description: product.Description,
              ExtraDescription: product.ExtraDescription,
              Image: product.Image,
              Code: product.Code,
            },
            // For product detail page routing
            slug: `product-${product.Id}`,
            pid: product.Id,
          }));

          // Apply client-side sorting if needed (fallback)
          let sortedProducts = [...transformedProducts];
          if (activeSortTag && activeSortTag.title.includes("Price")) {
            // Note: Price sorting would work better with actual price data from rates API
            sortedProducts.sort((a, b) => {
              if (sortOrder === "DESC") {
                return b.price - a.price;
              }
              return a.price - b.price;
            });
          }

          setProduct(sortedProducts);
          setMeta({
            itemCount: pageSummary.TotalRows || 0,
            pageCount: pageSummary.TotalPages || 0,
            hasNextPage: page < (pageSummary.TotalPages || 0),
            hasPrevPage: page > 1,
            currentPage: page,
          });

          console.log(`✅ Successfully fetched ${sortedProducts.length} products for search: ${decodedSearchInput}`, {
            sortType,
            sortOrder,
            activeSortTag: activeSortTag?.title,
          });
        } else {
          console.warn("No products found or invalid response structure:", {
            hasResponse: !!response,
            hasResult: !!(response?.result),
            responseType: typeof response?.result,
            responseContent: response?.result
          });
          setProduct([]);
          setMeta({ itemCount: 0, pageCount: 0, hasNextPage: false, hasPrevPage: false, currentPage: page });
        }
      } else {
        // Clear results if no search input
        setProduct([]);
        setMeta({ itemCount: 0, pageCount: 0, hasNextPage: false, hasPrevPage: false, currentPage: page });
      }
    } catch (err: any) {
      console.error("Search API Error:", err);
      Notifications["error"]({
        message: "Failed to search products",
        description: err.message || "Please try again later",
      });
      setProduct([]);
      setMeta({ itemCount: 0, pageCount: 0, hasNextPage: false, hasPrevPage: false, currentPage: page });
    } finally {
      setInitial(false);
      setLoading(false);
    }
  };
  
  const changePage = async (page: number) => {
    await getProducts(page);
    setPage(page);
  };
  
  const handleChange = (index: number) => {
    const array = [...selectedTags];
    const findex = array.findIndex((item: any) => item.status == true);
    if (findex != -1 && findex != index) {
      array[findex].status = false;
      array[findex].value = "ASC";
    }
    array[index].status = !array[index].status;
    array[index].value = array[index].status ? "DESC" : "ASC";
    setSelectedTags(array);
  };
  
  useDidUpdateEffect(() => {
    if (serchInput) {
      getProducts(1);
      window.scrollTo(0, 0);
      setPage(1);
    }
  }, [serchInput, Location]);

  useEffect(() => {
    if (serchInput) {
      getProducts(page);
      window.scrollTo(0, 0);
    }
  }, [selectedTags]);

  // Initial load
  useEffect(() => {
    if (serchInput) {
      getProducts(1);
    }
  }, []);
  
  return (
    <div className="Screen-box mb-4 mt-4">
      <PageHeader
        title={`${serchInput}`}
        page={page}
        pageSize={pageSize}
        meta={meta}
        initial={initial}
        type={Settings?.type}
        count={product?.length}
      >
        <Space size={[0, 8]} wrap>
          {selectedTags.map((tag: any, i: number) => (
            <Tag
              key={i}
              color={selectedTags[i].status ? "red" : ""}
              onClick={() => handleChange(i)}
              style={{ cursor: "pointer" }}
            >
              {tag.title}
            </Tag>
          ))}
        </Space>
      </PageHeader>
      {contextHolder}
      
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : product.length > 0 ? (
        <>
          {/* Display search results using similar layout as PopularItems */}
          <div className="popular-items-container">
            <h3 className="mb-3">{`Search Results for "${serchInput.split('%20').join(" ")}"`}</h3>
            <Row className="gy-2 gy-md-3 mx-0 gx-2 gx-md-3 mt-md-3">
              {product?.map((item: any, index: number) => (
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
          </div>
          
          <div className="d-flex justify-content-center mt-3">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={meta?.itemCount || 0}
              defaultCurrent={1}
              responsive={true}
              defaultPageSize={pageSize}
              disabled={false}
              hideOnSinglePage={true}
              onChange={(current: any) => {
                changePage(current);
              }}
            />
          </div>
        </>
      ) : (
        <NoData header={`No Products for "${serchInput.split('%20').join(" ")}"`} />
      )}
    </div>
  );
}

export default Page;