// davood updated code

"use client";
import React, { useEffect, useState } from "react";
import Banners from "./_components/banner";
import { useSelector } from "react-redux";
import "./style.scss";
import SubCategoryList from "./_components/subCategoryList";
import { reduxSubcategoryItems } from "../../../redux/slice/categorySlice";
import TopSellingStore from "./_components/topSellingStore";
import MergeLocalcartToLogin from "@/app/Middleware/MergeLocalcartToLogin";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Brands from "./_components/brands";
import Details from "./_components/details";
import { germanStandardApi } from "@/services/germanStandardApi";
import { useAppDispatch } from "@/redux/hooks";
import { storeCategory } from "@/redux/slice/categorySlice";
import { notification } from "antd";


function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [banners, setBanners] = useState([]);
  const subCategories = useSelector(reduxSubcategoryItems);
  // const settings = useSelector(reduxSettings);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  console.log("Home - Session status:", status);
  console.log("Home - Session data:", session);
  console.log("Home - Token available:", !!session?.token);
  // const [topRated, setTopRated] = useState<any[]>([]);
  // const [history, setHistory] = useState<any[]>([]);
  // const token = useSelector(reduxAccessToken);
  // const prevLocationRef = useRef<Location>({ latitude: null, longitude: null });
  // const [categories, setCategories] = useState<any[]>([]);

  // const getBanners = async () => {
  //   console.log("Home screen loaded");
  //   const url = API.GET_HOMESCREEN;
  //   try {
  //     const banners: any = await GET(url, {});
  //     if (banners.status) {
  //       setBanners(banners.data);
  //     }
  //   } catch (err) {
  //     console.log("Failed to get banners:", err);
  //   }
  // };
  MergeLocalcartToLogin();

  // const getRecentProducts = async () => {
  //   // const url = `${API.PRODUCT_SEARCH_NEW_SINGLE}?lattitude=${data.latitude}&longitude=${data.longitude}&take=10&radius=${settings?.radius}&tag=recent`;
  //   const url = `${
  //     API.PRODUCT_SEARCH_NEW_SINGLE
  //   }?lattitude=${21.4858}&longitude=${39.1925}&take=10&radius=${
  //     settings?.radius
  //   }&tag=recent`;
  //   try {
  //     setLoading(true);
  //     const response: any = await GET(url);
  //     if (response.status) {
  //       setProducts(response.data);
  //     }
  //   } catch (err) {
  //     console.log("Failed to get recent products:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const getTopRated = async () => {
  //   // const url = `${API.PRODUCT_SEARCH_NEW_SINGLE}?lattitude=${data.latitude}&longitude=${data.longitude}&take=10&radius=${settings?.radius}&tag=top`;
  //   const url = `${API.PRODUCT_SEARCH_NEW_SINGLE}?take=10&tag=top`;
  //   try {
  //     setLoading(true);
  //     const response: any = await GET(url);
  //     if (response.status) {
  //       setTopRated(response.data);
  //     }
  //   } catch (err) {
  //     console.log("Failed to get top rated products:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const getUserHistory = async () => {
  //   const url = API.USER_HISTORY;
  //   try {
  //     if (!token) return;
  //     const decoded: any = jwtDecode(token);
  //     const currentDate = new Date();
  //     if (decoded.exp && decoded.exp * 1000 + 10000 > currentDate.getTime()) {
  //       const response: any = await GET(url);
  //       if (response?.status) {
  //         setHistory(response.data);
  //       }
  //     }
  //   } catch (err) {
  //     console.log("Failed to get user history:", err);
  //   }
  // };

  const getCategoriesWithSubcategories = async (showNotifications: boolean = true, isRetry: boolean = false) => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      // Cache check - avoid refetching if data is recent (5 minutes)
      const now = Date.now();
      const cacheThreshold = 5 * 60 * 1000; // 5 minutes

      if (!isRetry && lastFetchTime && (now - lastFetchTime) < cacheThreshold && subCategories?.length > 0) {
        console.log("📋 Using cached categories data");
        setCategoriesLoading(false);
        return;
      }

      // Check authentication status first
      if (status === "loading") {
        console.log("🔄 Session still loading, waiting...");
        return;
      }

      if (status === "unauthenticated" || !session?.token) {
        const errorMsg = "Authentication required to load categories";
        setCategoriesError(errorMsg);
        console.warn("🔐 User not authenticated or token missing");

        if (showNotifications) {
          notification.warning({
            message: "Login Required",
            description: "Please log in to view categories and products.",
            placement: "topRight",
            duration: 5,
          });
        }
        return;
      }

      // Enhanced token validation before API call
      if (typeof session.token !== 'string' || !session.token.trim()) {
        const errorMsg = "Invalid token format";
        setCategoriesError(errorMsg);
        console.error("❌ Invalid token format received from session");
        return;
      }

      console.log("🔄 Fetching categories with subcategories from German Standard API...");
      console.log("🔐 Using token:", session.token ? "✓ Available" : "✗ Missing");
      console.log("🔍 Token preview:", `${session.token.substring(0, 20)}...`);

      // Add a small delay to ensure session is fully established
      if (!isRetry) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Use optimized API call to get all categories (no category parameter for broader retrieval)
      const categoriesData = await germanStandardApi.getCategories(1);

      if (categoriesData && categoriesData.length > 0) {
        // Transform and set categories for Redux store with enhanced validation
        const transformedCategories = germanStandardApi.transformCategoriesForRedux(categoriesData);

        // Enhanced data structure logging
        console.log("📊 Category data processing summary:", {
          rawCategoriesCount: categoriesData.length,
          transformedCategoriesCount: transformedCategories.length,
          categoriesWithSubcategories: transformedCategories.filter(cat => cat.sub_categories?.length > 0).length,
          totalSubCategories: transformedCategories.reduce((sum, cat) => sum + (cat.sub_categories?.length || 0), 0)
        });

        // Log first few category structures for debugging
        if (transformedCategories.length > 0) {
          console.log("📋 Sample category structure:", {
            firstCategory: {
              id: transformedCategories[0].id,
              name: transformedCategories[0].name,
              slug: transformedCategories[0].slug,
              subCategoryCount: transformedCategories[0].sub_categories?.length || 0
            }
          });

          if (transformedCategories[0]?.sub_categories?.length > 0) {
            console.log("📋 Sample subcategory structure:", {
              firstSubCategory: {
                id: transformedCategories[0].sub_categories[0].id,
                name: transformedCategories[0].sub_categories[0].name,
                slug: transformedCategories[0].sub_categories[0].slug,
                categoryId: transformedCategories[0].sub_categories[0].categoryId
              }
            });
          }
        }

        // Validate transformed data before storing
        const validCategories = transformedCategories.filter(cat =>
          cat && cat.id && cat.name && cat.name.trim() !== ""
        );

        if (validCategories.length > 0) {
          dispatch(storeCategory(validCategories));
          setLastFetchTime(Date.now()); // Update cache timestamp
          setRetryCount(0); // Reset retry count on success
          console.log("✅ Categories stored in Redux successfully:", validCategories.length);

          if (showNotifications && !isRetry) {
            notification.success({
              message: "Categories loaded successfully",
              description: `Loaded ${validCategories.length} categories with ${validCategories.reduce((sum, cat) => sum + (cat.sub_categories?.length || 0), 0)} subcategories`,
              placement: "topRight",
              duration: 3,
            });
          }
        } else {
          const errorMsg = "No valid categories after transformation";
          setCategoriesError(errorMsg);
          console.warn("⚠️", errorMsg);

          if (showNotifications) {
            notification.warning({
              message: "Category Data Issues",
              description: "Categories were found but couldn't be processed correctly.",
              placement: "topRight",
              duration: 4,
            });
          }
        }
      } else {
        const errorMsg = "No categories found in API response";
        setCategoriesError(errorMsg);
        console.warn("⚠️", errorMsg);

        if (showNotifications) {
          notification.warning({
            message: "No Categories Available",
            description: "No categories were found. Please try again later.",
            placement: "topRight",
            duration: 4,
          });
        }
      }
    } catch (err: any) {
      let errorMessage = err?.message || "Failed to load categories";
      setCategoriesError(errorMessage);
      console.error("Failed to get categories:", err);

      // Implement retry logic for network errors
      const maxRetries = 2;
      const shouldRetry = retryCount < maxRetries &&
                         !errorMessage.includes("401") &&
                         !errorMessage.includes("403") &&
                         !isRetry;

      if (shouldRetry) {
        console.log(`🔄 Retrying category fetch (attempt ${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);

        // Exponential backoff: wait 1s, then 2s
        const delayMs = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          getCategoriesWithSubcategories(false, true);
        }, delayMs);

        return; // Don't show error notification on retry
      }

      // Enhanced error handling for different types of authentication issues
      if (err?.response?.status === 401 || errorMessage.includes("401") || errorMessage.includes("Token is invalid or expired")) {
        errorMessage = "Session expired or invalid. Please log in again.";
        console.error("🔐 Authentication error detected:", {
          status: err?.response?.status,
          message: err?.message,
          sessionStatus: status,
          hasToken: !!session?.token
        });

        if (showNotifications) {
          notification.error({
            message: "Authentication Required",
            description: "Your session has expired or is invalid. Please log in again to access categories.",
            placement: "topRight",
            duration: 6,
            btn: (
              <button
                className="ant-btn ant-btn-primary ant-btn-sm"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
            ),
          });
        }
      } else if (errorMessage.includes("Invalid token format")) {
        errorMessage = "Token format error. Please try logging in again.";
        console.error("🔐 Token format error:", {
          sessionStatus: status,
          tokenType: typeof session?.token,
          tokenLength: session?.token?.length
        });

        if (showNotifications) {
          notification.error({
            message: "Session Error",
            description: "There's an issue with your login session. Please log in again.",
            placement: "topRight",
            duration: 6,
            btn: (
              <button
                className="ant-btn ant-btn-primary ant-btn-sm"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
            ),
          });
        }
      } else if (showNotifications) {
        notification.error({
          message: "Error Loading Categories",
          description: `${errorMessage}${retryCount > 0 ? ` (after ${retryCount} retries)` : ''}`,
          placement: "topRight",
          duration: 5,
          btn: (
            <button
              className="ant-btn ant-btn-primary ant-btn-sm"
              onClick={() => {
                setRetryCount(0);
                getCategoriesWithSubcategories(false, true);
              }}
            >
              Retry
            </button>
          ),
        });
      }
    } finally {
      setCategoriesLoading(false);
    }
  };

  
  useEffect(() => {
    // Only start loading when session status is determined
    if (status !== "loading") {
      getCategoriesWithSubcategories(); // Fetch categories from German Standard API
    }
    // Check if location has actually changed
    // const hasLocationChanged =
    //   prevLocationRef.current.latitude !== data.latitude ||
    //   prevLocationRef.current.longitude !== data.longitude;

    // const hasLocationChanged =
    // prevLocationRef.current.latitude !== data.latitude ||
    // prevLocationRef.current.longitude !== data.longitude;

    // if (hasLocationChanged) {
    // getBanners();
    // getRecentProducts();
    // getTopRated();
    // getUserHistory();

    //     prevLocationRef.current = { latitude: data?.latitude, longitude: data?.longitude };
    //   }
    // }, [data.latitude, data.longitude]); // Depend only on latitude and longitude
  }, [status]); // Depend on session status

  return (
    <>
      <div className="page-Box">
          {banners?.length ? <Banners /> : null}
          <div className="HomeSCreen-space" />
          {categoriesLoading ? (
            <div className="container">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading categories...</span>
                </div>
                <span className="ms-3">Loading categories...</span>
              </div>
            </div>
          ) : categoriesError ? (
            <div className="container">
              <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
                <div>
                  <strong>Authentication Required</strong>
                  <br />
                  <span>Please log in to view categories and products.</span>
                </div>
                <div className="d-flex gap-2">
                  {status === "unauthenticated" ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => router.push('/login')}
                    >
                      Login
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => getCategoriesWithSubcategories(false)}
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : subCategories?.length ? (
            <SubCategoryList data={subCategories} />
          ) : null}
          <div className="HomeSCreen-space" />
          <TopSellingStore />
          <div className="HomeSCreen-space" />
          {/* {loading ? (
            <Loading />
          ) : topRated?.length > 0 ? (
            <>
              <div className="HomeSCreen-space" />
              <PopularItems data={topRated} title="Top Rated Products" type="toprated" />
            </>
          ) : null}
          {loading ? (
            <Loading />
          ) : history?.length > 0 && token ? (
            <>
              <div className="HomeSCreen-space" />
              <PopularItems data={history} title="Recently Visited Products" type="visited" />
            </>
          ) : null} */}
          <div className="HomeSCreen-space" />
          <Brands />
          <Details />
        </div>
    </>
  );
}

export default Home;
