"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Images from "./_components/images";
import { Rate, Avatar } from "antd";
import Description from "./_components/description";
import Variants from "./_components/variants";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { findVariantWithId } from "./_components/functions";
import { useSession } from "next-auth/react";
import Reviews from "./_components/reviews";
import RelatedProducts from "./_components/relatedProducts";
import veg from "../../../../public/images/veg.png"
import nonveg from "../../../../public/images/non veg.png"
import { FaArrowLeft, FaFacebookF, FaLinkedinIn, FaPinterestP, FaTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { BiBorderAll } from "react-icons/bi";
import AdditionalInfo from "./_components/additionalInfo";
import { log } from "console";

function DetailsCard(props: any) {

  console.log("props", props?.data);
  //to-do
  //functionality of cart,buy now,favourite
  //functionality of react slick in image
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session }: any = useSession();
  //constant values
  const vid = searchParams.get("vid");
  //states
  const [currentVariant, setCurrentVariant] = useState<any>({});
  const [defaultImage, setDefaultImage] = useState<string>(props?.data?.image);
  //functions
  useEffect(() => {
    if (props?.data && props?.data?.productVariant?.length) {
      const variantData = findVariantWithId(props?.data?.productVariant, vid);
      if (!variantData) {
        setDefaultImage(props?.data?.image);
      } else {
        setCurrentVariant(variantData);
        setDefaultImage(variantData?.image || props?.data?.image);
      }
    }
  }, [props?.data, vid]);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const onChangeVariantId = (val: any) => {
    router.replace(pathname + "?" + createQueryString("vid", String(val)), {
      scroll: false,
    });
  };
  const handleBuyNow = (val: any) => {
    if (session?.token) {
    } else {
      try {
        router.push("/login");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };
  const getVariantCurrentName = () => {
    if (!currentVariant || !currentVariant.combination) return "";
    return currentVariant.combination.map((item: any) => item.value).join(" ");
  };
  const stripTags = (html: string) => {
    if (typeof window === "undefined") {
      return html?.replace(/<[^>]*>/g, "") || "";
    }

    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="pt-5">
      <Container>
        <Row className="mb-5">
          <Col sm={6} md={6} xs={12} lg={5}>
            <Images
              coverImage={defaultImage}
              images={props?.data?.productImages}
            />
          </Col>
          <Col md={6} xs={12} lg={7} >
            <h1 className="detail-head">
              {props?.data?.name} {getVariantCurrentName()}
            </h1>
            {/* <div className="mb-3"> {props?.data?.brand?.toUpperCase() ?? ""}</div>
            <div> {props?.data?.description}</div> */}

            {/* <div className="d-flex justify-content-start gap-2 my-3">
              {" "}
              {props?.data?.averageRating ? (
                <div>{Number(props?.data?.averageRating).toFixed(1)}</div>
              ) : null}
              <Rate
                disabled
                allowHalf
                value={Number(props?.data?.averageRating)}
              />
              <div>{`${props?.data?.averageRating || "No"} Ratings`}</div>
            </div> */}
            {/* <div> Seller: {props?.data?.storeDetails?.store_name}</div> */}
            {/* <hr />
            <div><Avatar size={26} src={props?.data?.is_vegetarian ? veg.src : nonveg.src} shape="square"/></div> */}
            <Description
              data={props?.data}
              currentVariant={currentVariant}
              handleBuyNow={handleBuyNow}
            />
            <hr />
            {props?.data?.productVariant?.length > 0 && (
              <>
                <Variants
                  productVariant={props?.data?.productVariant}
                  currentVariant={currentVariant}
                  changeVaraintId={onChangeVariantId}
                />
                <hr />
              </>
            )}
            {/* {props?.data?.specifications ? (
              <div>
                <div className="fs-5 mb-2">More Details</div> */}
            {/* <div
                  style={{
                  fontSize: "8px !important",
                  backgroundColor: "red",
                  }}
                >
                <div
                  style={{
                    fontSize: "inherit",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: props?.data?.specifications,
                  }}
                />
                </div> */}
            {/* <p>{stripTags(props?.data?.specifications)}</p>
                <hr />
              </div>
            ) : (
              ""
            )} */}
            {/* <Reviews data={props?.data} /> */}
            <p><span>SKU:</span> 12514245</p>
            <p><span style={{ fontWeight: 700 }}>Category:</span> Cat Food</p>
            <p><span style={{ fontWeight: 700 }}>Tag:</span> Cat Food</p>
            <p className="d-flex"><span style={{ fontWeight: 700, marginTop: "2px" }}>Share :</span>
              <div className="d-flex gap-2">
                <FaFacebookF className="icons" />
                <FaTwitter className="icons" />
                <IoMdMail className="icons" />
                <FaPinterestP className="icons" />
                <FaLinkedinIn className="icons" />
                <FaTelegramPlane className="icons" />
              </div> </p>
          </Col>
        </Row>
        </Container>
        <AdditionalInfo/>
        <Container>
        <RelatedProducts data={props?.data} />
        </Container>
      
    </div>
  );
}
export default DetailsCard;
