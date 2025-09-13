import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdOutlineArrowForward } from "react-icons/md";
import React from "react";
import { Col, Row } from "react-bootstrap";
import "./style.scss";
import { IoSpeedometerOutline } from "react-icons/io5";
import ProductItem from "../productItem/page";
import { useRouter } from "next/navigation";

function MultiSearchProductList(props: any) {
  const [hasScrollBar, setHasScrollBar] = useState(false);
  const router = useRouter();
  const ref: any = useRef(null);

  const scroll = (ratio: any) => {
    ref.current.scrollLeft += ratio;
  };

  useEffect(() => {
    updateState();
    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  }, []);

  function updateState() {
    const el = ref.current;
    el && setHasScrollBar(el.scrollWidth > el.getBoundingClientRect().width + 50);
  }

  // Debugging - Check the product count
  // console.log("Total Products:", props?.data?.productList?.length);
  // console.log("Displayed Products:", props?.data?.productList?.slice(0, 10).length);

  return (
    <div className="MultiSearchProductList">
      <div className="MultiSearchProductList-Header">
        <Row className="gy-2">
          <Col sm={5} xs={9} className="d-flex col-12">
            <div
              className="cp"
              onClick={() =>
                router.push(
                  props?.type === "search"
                    ? `/store/${props?.data?.slug}/search?qs=${props?.search}`
                    : `/store/${props?.data?.slug}/categories?cid=${props?.cid}&type=${props?.cname}`
                )
              }
            >
              <img src={props?.data?.logo_upload} className="MultiSearchProductList-img" alt="" />
            </div>
            <div className="MultiSearchProductList-box">
              <div>
                <h6 className="MultiSearchProductList-txt1">{props?.data?.store_name}</h6>
                <div className="MultiSearchProductList-txt3">
                  {props?.data?.business_type} &nbsp;
                  <span className="MultiSearchProductList-txt4">
                    <IoSpeedometerOutline /> &nbsp;Delivery By 9AM
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col sm={1} xs={3}></Col>
        </Row>
      </div>

      <div className="MultiSearchProductList-box3">
        <div className="Horizontal-Pscroll position-relative">
          <Row className="flex-parent mx-0" ref={ref}>
            {Array.isArray(props?.data?.productList)
              ? props?.data?.productList
                  ?.slice(0, 10) // ✅ Ensure only 10 items are displayed
                  .map((prod: any, index: number) => {
                    return (
                      <Col
                        sm="4"
                        md={props?.count ? props?.count : 2}
                        className="pe-0 col-6 lg-25 gy-3"
                        key={index}
                      >
                        <ProductItem item={prod} />
                      </Col>
                    );
                  })
              : null}
          </Row>
        </div>
      </div>

      <Row>
        <Col>
          <div className="MultiSearchProductList-box2">
            <div
              className="MultiSearchProductList-txt2"
              onClick={() =>
                router.push(
                  props?.type === "search"
                    ? `/store/${props?.data?.slug}/search?qs=${props?.search}`
                    : `/store/${props?.data?.slug}/categories?type=${
                        props?.cname
                      } ${props?.cid ? `&cid=${props?.cid}` : ""}${
                        props?.ogcategory ? `&ogCategory=${props?.ogcategory}` : ""
                      }`
                )
              }
            >
              View all{" "}
              {props?.data?.productList?.length > 10 ? "10+ " : props?.data?.productList?.length} items
            </div>

            {hasScrollBar ? (
              <div className="MultiSearchProductList-box">
                <div onClick={() => scroll(-800)}>
                  <MdArrowBack size={20} color="grey" />
                </div>
                <div style={{ marginLeft: 10 }} />
                <div onClick={() => scroll(800)}>
                  <MdOutlineArrowForward size={20} color="grey" />
                </div>
              </div>
            ) : null}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default MultiSearchProductList;
