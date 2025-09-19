"use client";
import ProductItem from "@/components/productItem/page";
import API from "@/config/API";
import { useAppSelector } from "@/redux/hooks";
import { reduxLatLong } from "@/redux/slice/locationSlice";
import { reduxSettings } from "@/redux/slice/settingsSlice";
import { GET } from "@/util/apicall";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Row, Col } from "react-bootstrap";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import Slider from "react-slick";
import { germanStandardApi } from "@/services/germanStandardApi";
import { getProductId } from "./functions";
import "../style.scss";
type Props = {
  data: any;
};
function RelatedProducts(props: Props) {
  //const
  const setting = useAppSelector(reduxSettings);
  const latLong = useAppSelector(reduxLatLong);

  // Fetch related products using German Standard API
  const { data: relatedProducts, isLoading } = useQuery({
    queryFn: async () => {
      try {
        // Get products from the same category, excluding current product
        const currentProductId = getProductId(props?.data);

        // First try to get products from same category
        const result = await germanStandardApi.getProducts(
          true, // refreshFlag
          1,    // pageNumber
          10,   // pageSize
          props?.data?.category || 0, // category
          props?.data?.subCategory || 0 // subCategory
        );

        // Filter out the current product and transform data
        const filteredProducts = result.products.filter(
          (product: any) => product.Id !== currentProductId
        );

        // Transform products for display compatibility
        const transformedProducts = germanStandardApi.transformProductsForDisplay(
          filteredProducts,
          props?.data?.category || "0",
          props?.data?.subCategory || "0"
        );

        return { data: transformedProducts };
      } catch (error) {
        console.error("Error fetching related products:", error);
        return { data: [] };
      }
    },
    queryKey: [
      "related_products",
      getProductId(props?.data),
      props?.data?.category,
      props?.data?.subCategory,
    ],
    enabled: !!props?.data, // Only run if product data exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  

   const CustomPrevArrow = ({ onClick }: any) => (
        <div className="scroll-button left" onClick={onClick}>
          <MdOutlineArrowBackIos size={20} />
        </div>
      );
    
      const CustomNextArrow = ({ onClick }: any) => (
        <div className="scroll-button right" onClick={onClick}>
          <MdOutlineArrowForwardIos size={20} />
        </div>
      );
    
      const settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        speed: 500,
        dots:true,
        arrows: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
          {
            breakpoint: 1440,
            settings: { slidesToShow: 4 },
          },
          {
            breakpoint: 1024,
            settings: { slidesToShow: 4 },
          },
          {
            breakpoint: 768,
            settings: { slidesToShow: 3 },
          },
          {
            breakpoint: 480,
            settings: { slidesToShow: 1 },
          },
        ],
      };

  // Don't render if no related products
  if (!relatedProducts?.data?.length) {
    return null;
  }

  return (
    <div className="mb-5 pt-5">
      <div className="fs-3 fw-bold">Related Products</div>

      {isLoading ? (
        <div className="mt-4 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading related products...</span>
          </div>
        </div>
      ) : (
        <div className="category-scroll-wrapper mt-4">
          <Slider {...settings}>
            {relatedProducts?.data?.map((prod: any, index: number) => (
              <div
                className="px-1 mb-3 card-div"
                style={{ width: "50%" }}
                key={prod.id || index}
              >
                <ProductItem item={prod} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}

export default RelatedProducts;
