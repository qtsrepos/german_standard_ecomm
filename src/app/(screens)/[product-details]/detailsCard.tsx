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
import { findVariantWithId, getProductId } from "./_components/functions";
import { getCustomerIdFromSession } from "@/shared/helpers/jwtUtils";
import Images from "./_components/images";
import RelatedProducts from "./_components/relatedProducts";
import Variants from "./_components/variants";
import { getProductRates, getBestProductRate, ProductRate } from "@/util/productRatesApi";
import { germanStandardApi } from "@/services/germanStandardApi";

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
  const [bestRate, setBestRate] = useState<ProductRate | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [productStock, setProductStock] = useState({ unit: 0, status: false });
  const [stockLoading, setStockLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  //functions
  useEffect(() => {
    if (props?.data && props?.data?.productVariant?.length) {
      const variantData = findVariantWithId(props?.data?.productVariant, vid);
      if (!variantData) {
        // Reset to default state when no variant is selected
        setCurrentVariant({});
        setDefaultImage(props?.data?.Image || props?.data?.image);
      } else {
        setCurrentVariant(variantData);
        setDefaultImage(variantData?.image || props?.data?.Image || props?.data?.image);
      }
    } else {
      // Handle products without variants
      setCurrentVariant({});
      setDefaultImage(props?.data?.Image || props?.data?.image);
    }
  }, [props?.data, vid]);

  // Enhanced: Fetch product rates and stock data with passed data optimization
  useEffect(() => {
    const fetchProductData = async () => {
      const productId = getProductId(props?.data);
      if (!productId) return;

      // Enhanced: Check for passed data first to avoid redundant API calls
      const metadata = props?.data?._metadata;
      console.log("🔍 DetailsCard - Checking for passed data:", {
        hasMetadata: !!metadata,
        source: metadata?.source,
        hasCurrentStock: metadata?.hasCurrentStock,
        hasCurrentRates: metadata?.hasCurrentRates,
        isFreshData: metadata?.isFreshData
      });

      // Enhanced: Use passed stock data if available and fresh
      if (metadata?.hasCurrentStock && metadata.isFreshData) {
        console.log("✅ Using passed stock data:", metadata.currentStock);
        setProductStock(metadata.currentStock);
        setStockLoading(false);
      } else {
        // Fallback: Fetch stock data using German Standard API
        setStockLoading(true);
        try {
          console.log("🔍 Fetching stock for product ID:", productId);

          // Use German Standard API service method
          const stockResponse = await germanStandardApi.getStock({
            product: Number(productId),
            warehouse: 2, // Default warehouse - you may need to adjust this
            be: 1
          });

          console.log("📦 Stock API response:", stockResponse);

          if (stockResponse && Array.isArray(stockResponse)) {
            const stockData = stockResponse[0];
            if (stockData) {
              const stockQuantity = stockData.BalQty || 0; // API returns BalQty, not Quantity
              setProductStock({
                unit: stockQuantity,
                status: stockQuantity > 0
              });
              console.log("✅ Stock data set:", { unit: stockQuantity, status: stockQuantity > 0 });
            }
          } else {
            console.warn("⚠️ No stock data received or invalid format");
            setProductStock({ unit: 0, status: false });
          }
        } catch (error) {
          console.error("❌ Error fetching stock data:", error);
          // Set as out of stock on error
          setProductStock({ unit: 0, status: false });
        } finally {
          setStockLoading(false);
        }
      }

      // Enhanced: Use passed rate data if available and fresh
      if (session?.token) {
        if (metadata?.hasCurrentRates && metadata.isFreshData) {
          console.log("✅ Using passed rate data:", metadata.currentRates);
          setBestRate(metadata.currentBestRate || null);
          setRatesLoading(false);
        } else {
          // Fallback: Fetch product rates from API
          setRatesLoading(true);
          try {
            const rates = await getProductRates(Number(productId));

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
      }

      // Fetch category and tag data using German Standard API
      setCategoryLoading(true);
      try {
        console.log("Fetching categories for product");
        const categories = await germanStandardApi.getCategories(1, 0); // Get all categories

        if (categories && categories.length > 0) {
          // Try to find the category that matches the product's category
          const productCategory = categories.find(cat =>
            cat.Id === props?.data?.categoryId ||
            cat.Name === props?.data?.categoryName
          );

          if (productCategory) {
            setCategory(productCategory.Name);
            setTag(productCategory.Name);
            console.log("Set category to:", productCategory.Name);
          } else {
            // Use first available category as fallback
            setCategory(categories[0].Name || "General");
            setTag(categories[0].Name || "General");
            console.log("Set fallback category to:", categories[0].Name);
          }
        } else {
          // Set default values if no categories found
          setCategory("General");
          setTag("General");
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        // Set default values
        setCategory("General");
        setTag("General");
      } finally {
        setCategoryLoading(false);
      }
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
  const handleBuyNow = () => {
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
      // Get customer ID from session token
      const customerId = getCustomerIdFromSession(session);
      if (!customerId) {
        console.error("Unable to get customer ID from session");
        router.push("/login");
        return;
      }

      const productId = getProductId(props?.data);

      // Calculate the proper rate including variant pricing and best rate
      const rate = bestRate?.rate ?? props?.data?.retail_rate ?? props?.data?.price ?? 0;

      const cartRequest = {
        transId: 0, // 0 for new cart item
        date: new Date().toISOString().split('T')[0], // yyyy-MM-dd format
        customer: customerId, // Dynamic customer ID from JWT token
        warehouse: 2, // Configurable warehouse (default: 2)
        product: Number(productId),
        qty: quantity,
        rate: rate,
        unit: 1, // Default unit
        totalRate: rate * quantity,
        be: 1 // Configurable Business Entity (default: 1)
      };

      console.log("🛒 DetailCard: Adding to cart with request:", cartRequest);

      const response = await germanStandardApi.upsertCart(cartRequest);

      console.log("Product added to cart successfully:", response);
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
      // Get customer ID from session token
      const customerId = getCustomerIdFromSession(session);
      if (!customerId) {
        console.error("Unable to get customer ID from session");
        router.push("/login");
        return;
      }

      const productId = getProductId(props?.data);

      const wishlistRequest = {
        transId: 0, // 0 for new wishlist item
        product: Number(productId),
        quantity: 1,
        customer: customerId, // Dynamic customer ID from JWT token
        remarks: "",
        be: 1 // Business Entity
      };

      console.log("💖 DetailCard: Adding to wishlist with request:", wishlistRequest);

      const response = await germanStandardApi.upsertWishlist(wishlistRequest);

      console.log("Product added to wishlist successfully:", response);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };
  const getVariantCurrentName = () => {
    if (!currentVariant || !currentVariant.combination) return "";
    return currentVariant.combination.map((item: any) => item.value).join(" ");
  };

  // Debug logging to understand data flow
  if (process.env.NODE_ENV === 'development') {
    console.log("🔍 DetailCard Debug:", {
      hasData: !!props?.data,
      dataKeys: props?.data ? Object.keys(props?.data) : 'No data',
      productId: props?.params?.pid,
      dataId: props?.data?.Id || props?.data?.id,
      dataName: props?.data?.Name,
      dataname: props?.data?.name,
      fullData: props?.data
    });
  }

  // Only show "Product not found" if we have no product data AND no product ID
  if (!props?.data && !props?.params?.pid) {
    return (
      <div className="pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="alert alert-warning text-center">
                <h3 className="mb-3">Product Not Found</h3>
                <p className="lead">No product information available.</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.href = '/'}
                  >
                    Browse Products
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Smart fallback logic for product information
  const productId = props?.params?.pid;

  // Prioritize actual product name - never show ID if name exists
  const getProductName = () => {
    // Debug what data we have
    console.log("🏷️ Product Name Debug:", {
      hasData: !!props?.data,
      Name: props?.data?.Name,
      name: props?.data?.name,
      productId
    });

    // First priority: Name field (API standard)
    if (props?.data?.Name && props?.data?.Name.trim() !== '') {
      console.log("✅ Using Name field:", props.data.Name);
      return props.data.Name;
    }

    // Second priority: name field (fallback)
    if (props?.data?.name && props?.data?.name.trim() !== '') {
      console.log("✅ Using name field:", props.data.name);
      return props.data.name;
    }

    // If we have data but no name, something is wrong with data structure
    if (props?.data) {
      console.log("⚠️ Have data but no name - showing available fields:", Object.keys(props.data));
      return `Product (ID: ${productId})`;
    }

    // Only show loading if we truly have no data
    console.log("❌ No product data at all");
    return productId ? `Product ID: ${productId}` : 'Product Information Loading...';
  };

  const productName = getProductName();
  const productDescription = props?.data?.Description ||
                           props?.data?.description ||
                           props?.data?.ExtraDescription ||
                           props?.data?.extraDescription;

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
            {/* Product Name Section with Graceful Fallbacks */}
            <h1 className="detail-head mb-3">
              {productName}
              {getVariantCurrentName() && <span className="text-muted"> - {getVariantCurrentName()}</span>}
            </h1>

            {/* Product Description with Fallbacks */}
            {productDescription && (
              <div className="mb-3 text-muted">
                {productDescription}
              </div>
            )}

            {/* User requested to remove loading spinner - only show if absolutely no information */}
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
              data={props?.data || {
                Id: productId,
                Name: productName,
                Description: productDescription,
                status: true // Assume product is available unless we know otherwise
              }}
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
            <p>
              <span style={{ fontWeight: 700 }}>Category:</span>{" "}
              {categoryLoading ? (
                <span className="text-muted">Loading...</span>
              ) : (
                category || "General"
              )}
            </p>
            <p>
              <span style={{ fontWeight: 700 }}>Tag:</span>{" "}
              {categoryLoading ? (
                <span className="text-muted">Loading...</span>
              ) : (
                tag || "General"
              )}
            </p>
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
