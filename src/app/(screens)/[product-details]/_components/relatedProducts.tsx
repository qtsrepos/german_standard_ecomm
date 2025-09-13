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
import "../style.scss";
type Props = {
  data: any;
};
function RelatedProducts(props: Props) {
  //const
  const setting = useAppSelector(reduxSettings);
  const latLong = useAppSelector(reduxLatLong);
  //function
  const { data: relatedProducts, isLoading } = useQuery({
    queryFn: ({ queryKey }) =>
      GET(API.PRODUCT_SEARCH_NEW_SINGLE, queryKey[1] as object),
    queryKey: [
      "related_product",
      {
        lattitude: latLong.latitude,
        longitude: latLong.longitude,
        take: "10",
        radius: setting.radius,
        subCategory: props?.data?.subCategory,
        exclude: props?.data?._id,
      },
    ],
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

  return (
    <div className="mb-5 pt-5">
      {/* <div>RelatedProducts</div> */}
       <div className="fs-3 fw-bold">{relatedProducts?.data?.length==0?"":"Related Products"}</div>
    
      {isLoading ? null : (
        // <Row className="mt-4">
        //   {relatedProducts?.data?.map((item: any) => (
        //     // <Col md={2}>
        //     <Col xs={6}  md={3} lg={3} xl={3} className="gy-3">
        //       <ProductItem item={item} />
        //     </Col>
        //   ))}
        // </Row>
        <div className="category-scroll-wrapper mt-4">
          <Slider {...settings}>
            {Array.isArray(relatedProducts?.data)
              ? relatedProducts?.data?.map((prod: any, index: number) => (
                <div
                  className="px-1 mb-3 card-div" 
                  style={{ width: "50%" }}
                  key={index}
                >
                  <ProductItem item={prod} />
                </div>
              ))
              : null}
          </Slider>
        </div>
      )}
    </div>
  );
}

export default RelatedProducts;
