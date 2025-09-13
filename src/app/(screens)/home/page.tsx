// davood updated code

"use client";
import React, { useEffect, useState, useRef } from "react";
import Banners from "./_components/banner";
import API from "../../../config/API";
import { useSelector } from "react-redux";
import { reduxLatLong } from "../../../redux/slice/locationSlice";
import { GET } from "../../../util/apicall";
import "./style.scss";
import SubCategoryList from "./_components/subCategoryList";
import { reduxSubcategoryItems } from "../../../redux/slice/categorySlice";
import TopSellingStore from "./_components/topSellingStore";
import PopularItems from "./_components/popularItems";
import { reduxSettings } from "../../../redux/slice/settingsSlice";
import FeaturedItems from "./_components/featured_items";
import { reduxAccessToken } from "../../../redux/slice/authSlice";
import { jwtDecode } from "jwt-decode";
import Loading from "../../../components/loading";
import MergeLocalcartToLogin from "@/app/Middleware/MergeLocalcartToLogin";
import { useSession } from "next-auth/react";
import Brands from "./_components/brands";
import Details from "./_components/details";
import { germanStandardApi } from "@/services/germanStandardApi";
import { useAppDispatch } from "@/redux/hooks";
import { storeCategory } from "@/redux/slice/categorySlice";

interface Location {
  latitude: number | null;
  longitude: number | null;
}

function Home() {
  const dispatch = useAppDispatch();
  const [banners, setBanners] = useState([]);
  // const data = useSelector(reduxLatLong) as Location;
  const data = useSelector(reduxLatLong) as Location;
  const [products, setProducts] = useState<any[]>([]);
  const subCategories = useSelector(reduxSubcategoryItems);
  // const settings = useSelector(reduxSettings);
  const [loading, setLoading] = useState(true);
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

  // const getCategoriesWithSubcategories = async () => {
  //   try {
  //     console.log("Fetching categories with subcategories from German Standard API...");
  //     const categoriesData = await germanStandardApi.getCategories(1, 1);    
  //     if (categoriesData && categoriesData.length > 0) {
  //       // Transform and set categories for Redux store
  //       const transformedCategories = germanStandardApi.transformCategoriesForRedux(categoriesData);
  //       dispatch(storeCategory(transformedCategories));
  //       setCategories(transformedCategories);
  //       console.log("Categories loaded successfully:", transformedCategories.length);
  //     }
  //   } catch (err) {
  //     console.log("Failed to get categories:", err);
  //   }
  // };

  const getProductsData = async () => {
    // Using German Standard API for top rated products
    try {
      setLoading(true);
      const productsData = await germanStandardApi.getProducts(true, 1, 10);
      if (productsData.products && productsData.products.length > 0) {
        setProducts(productsData.products);
      }
    } catch (err) {
      console.log("Failed to get top rated products:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getProductsData();
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
    // getCategoriesWithSubcategories(); // Fetch categories from German Standard API

    //     prevLocationRef.current = { latitude: data?.latitude, longitude: data?.longitude };
    //   }
    // }, [data.latitude, data.longitude]); // Depend only on latitude and longitude
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page-Box">
          {banners?.length ? <Banners /> : null}
          <div className="HomeSCreen-space" />
          {subCategories?.length ? (
            <SubCategoryList data={subCategories} />
          ) : null}
          <div className="HomeSCreen-space" />
          <TopSellingStore />
          <div className="HomeSCreen-space" />
          {loading ? (
            <Loading />
          ) : products?.length > 0 ? (
            <>
              <PopularItems
                data={products}
                title="Featured Products"
                type="recent"
              />
            </>
          ) : null}
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
      )}
    </>
  );
}

export default Home;
