"use client";
import { useSession } from "next-auth/react";
import {
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaTelegramPlane } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn, FaPinterestP, FaTwitter } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import AdditionalInfo from "./_components/additionalInfo";
import Description from "./_components/description";
import { findVariantWithId } from "./_components/functions";
import Images from "./_components/images";
import RelatedProducts from "./_components/relatedProducts";
import Variants from "./_components/variants";
import { getProductRates, getBestProductRate, ProductRate } from "@/util/productRatesApi";
import API from "@/config/API";
import { POST } from "@/util/apicall";

function DetailsCard(props: any) {  //to-do
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
  const [defaultImage, setDefaultImage] = useState<string>(props?.data?.Image || props?.data?.image);
  const [productRates, setProductRates] = useState<ProductRate[]>([]);
  const [bestRate, setBestRate] = useState<ProductRate | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [productStock, setProductStock] = useState({ unit: 0, status: false });
  const [stockLoading, setStockLoading] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  //functions
  useEffect(() => {
    if (props?.data && props?.data?.productVariant?.length) {
      const variantData = findVariantWithId(props?.data?.productVariant, vid);
      if (!variantData) {
        setDefaultImage(props?.data?.Image || props?.data?.image);
      } else {
        setCurrentVariant(variantData);
        setDefaultImage(variantData?.image || props?.data?.Image || props?.data?.image);
      }
    }
  }, [props?.data, vid]);

  // Fetch product rates and stock data
  useEffect(() => {
    const fetchProductData = async () => {
      const productId = props?.data?.Id;
      if (!productId) return;

      // Fetch product rates
      if (session?.token) {
        setRatesLoading(true);
        try {
          const rates = await getProductRates(productId);
          setProductRates(rates);
          
          // Get the best rate (INR currency - iCurrency=7)
          const inrRates = rates.filter(rate => rate.currencyId === 7);
          const best = inrRates.length > 0 ? inrRates[0] : rates[0];
          setBestRate(best);
        } catch (error) {
          console.error("Error fetching product rates:", error);
        } finally {
          setRatesLoading(false);
        }
      }

      // Fetch stock data
      setStockLoading(true);
      try {
        const stockResponse = await fetch(`${API.GERMAN_STANDARD_STOCK}?productId=${productId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(session?.token && { Authorization: `Bearer ${session.token.replace(/"/g, '')}` }),
          },
        });
        
        const stockData = await stockResponse.json();
        if (stockData?.status === "Success" && stockData.result) {
          const parsedStockData = JSON.parse(stockData.result);
          if (parsedStockData && parsedStockData.length > 0) {
            setProductStock({
              unit: parsedStockData[0].Quantity || 0,
              status: parsedStockData[0].Quantity > 0
            });
          }
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setStockLoading(false);
      }

      // Fetch category and tag data
      // try {
      //   console.log("Fetching categories from:", `${API.GERMAN_STANDARD_CATEGORIES}?category=0`);
      //   const categoryResponse = await fetch(`${API.GERMAN_STANDARD_CATEGORIES}?category=0`, {
      //     method: "GET",
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //       ...(session?.token && { Authorization: `Bearer ${session.token.replace(/"/g, '')}` }),
      //     },
      //   });
      //   
      //   console.log("Category response status:", categoryResponse.status);
      //   
      //   if (categoryResponse.ok) {
      //     const categoryData = await categoryResponse.json();
      //     console.log("Category data:", categoryData);
      //     
      //     if (categoryData?.status === "Success" && categoryData.result) {
      //       const categories = JSON.parse(categoryData.result);
      //       console.log("Parsed categories:", categories);
      //       
      //       // Set category and tag based on product data or first available category
      //       if (categories && categories.length > 0) {
      //         setCategory(categories[0].Name || "Cat Food");
      //         setTag(categories[0].Name || "Cat Food");
      //         console.log("Set category to:", categories[0].Name);
      //       }
      //     }
      //   } else {
      //     console.error("Category API error:", categoryResponse.status, categoryResponse.statusText);
      //   }
      // } catch (error) {
      //   console.error("Error fetching category data:", error);
      //   // Set default values
      //   setCategory("Cat Food");
      //   setTag("Cat Food");
      // }
    };

    fetchProductData();
  }, [props?.data?.Id, session?.token]);
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
      // Implement buy now functionality
      console.log("Buy now clicked");
    } else {
      try {
        router.push("/login");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  const handleAddToCart = async (quantity: number = 1) => {
    if (!session?.token) {
      router.push("/login");
      return;
    }

    try {
      const cartData = {
        product: props?.data?.Id,
        qty: quantity,
        headerId: 0,
        voucherType: 0,
      };

      const response = await POST(API.GERMAN_STANDARD_UPSERT_CART, cartData);
      
      if (response?.status === "Success") {
        console.log("Product added to cart successfully");
        // You can add a notification here
      } else {
        console.error("Failed to add to cart:", response?.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!session?.token) {
      router.push("/login");
      return;
    }

    try {
      const wishlistData = {
        product: props?.data?.Id,
        qty: 1,
        headerId: 0,
        voucherType: 0,
      };

      const response = await POST(API.GERMAN_STANDARD_UPSERT_WISHLIST, wishlistData);
      
      if (response?.status === "Success") {
        console.log("Product added to wishlist successfully");
        // You can add a notification here
      } else {
        console.error("Failed to add to wishlist:", response?.message);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
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
              images={props?.data?.productImages || [props?.data?.Image]}
            />
          </Col>
          <Col md={6} xs={12} lg={7} >
            <h1 className="detail-head">
              {props?.data?.Name || props?.data?.name} {getVariantCurrentName()}
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
              handleAddToCart={handleAddToCart}
              handleAddToWishlist={handleAddToWishlist}
              bestRate={bestRate}
              ratesLoading={ratesLoading}
              productStock={productStock}
              stockLoading={stockLoading}
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
            <p><span>SKU:</span> {props?.data?.Code || "12514245"}</p>
            {/* <p><span style={{ fontWeight: 700 }}>Category:</span> {category || "Cat Food"}</p>
            <p><span style={{ fontWeight: 700 }}>Tag:</span> {tag || "Cat Food"}</p> */}
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
