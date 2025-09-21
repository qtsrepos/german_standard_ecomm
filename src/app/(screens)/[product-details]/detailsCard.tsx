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
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import {
  localCartItems,
  setLocalCart,
  cartServiceHelpers,
} from "@/redux/slice/localcartSlice";

function DetailsCard(props: any) {  //to-do
  //functionality of cart,buy now,favourite
  //functionality of react slick in image
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session }: any = useSession();
  const dispatch = useDispatch();
  // Use unified LocalCart for all users (both authenticated and non-authenticated)
  const cartItems = useSelector(localCartItems);
  //constant values
  const vid = searchParams.get("vid");
  //states
  const [currentVariant, setCurrentVariant] = useState<any>({});
  const [defaultImage, setDefaultImage] = useState<string>(props?.data?.Image || props?.data?.image);
  const [bestRate, setBestRate] = useState<ProductRate | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);
  const [rateRetryCount, setRateRetryCount] = useState(0);
  const [allRatesData, setAllRatesData] = useState<ProductRate[]>([]);
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

  // ✅ OPTIMIZED: Use embedded stock and rate data from new API response
  useEffect(() => {
    const fetchProductData = async () => {
      const productId = getProductId(props?.data);
      if (!productId) return;

      // ✅ UNIVERSAL EMBEDDED RATE HANDLING: If the details received price/retail_rate, use it immediately
      try {
        const embeddedRateValue = Number(props?.data?.price || props?.data?.retail_rate || 0);
        if (!isNaN(embeddedRateValue) && embeddedRateValue > 0) {
          const finalRateObject: any = {
            rate: embeddedRateValue,
            currencyId: 7, // default GS currency
            unitName: 'Unit',
            priceBook: 'Embedded',
            productId: Number(productId),
            productName: props?.data?.name || props?.data?.Name || 'Product',
            unit: 1,
            unitId: 1,
          };

          setBestRate(finalRateObject);
          setAllRatesData([finalRateObject]);
          setRateError(null); // Suppress any error banner when we have a valid price
          setRatesLoading(false);
          console.log("✅ Using embedded price/retail_rate across all sources:", finalRateObject);
          // We do NOT return here so stock/category logic below can still run
        }
      } catch (e) {
        console.warn("⚠️ Embedded rate detection error:", e);
      }

      console.log("🔍 DetailsCard - Checking for embedded data:", {
        productId,
        hasMetadata: !!props?.data?._metadata,
        source: props?.data?._metadata?.source,
        hasEmbeddedStock: props?.data?.unit !== undefined,
        hasEmbeddedRate: props?.data?.price !== undefined || props?.data?.retail_rate !== undefined,
        stockValue: props?.data?.unit,
        rateValue: props?.data?.price || props?.data?.retail_rate
      });

      // ✅ ENHANCED: Intelligent data source detection for German Standard API
      const isGermanStandardProduct = props?.data?._metadata?.source?.startsWith('german_standard');
      const hasEmbeddedData = props?.data?._metadata?.source === 'german_standard_embedded';
      const hasBasicApiData = props?.data?._metadata?.source === 'german_standard_basic';
      const hasPassedStock = props?.data?._metadata?.hasCurrentStock;
      const hasPassedRates = props?.data?._metadata?.hasCurrentRates;
      const needsStockFetch = props?.data?._metadata?.needsStockFetch && !hasPassedStock;
      const needsRateFetch = props?.data?._metadata?.needsRateFetch && !hasPassedRates;

      console.log("🔍 DetailsCard - Enhanced data source analysis:", {
        isGermanStandardProduct,
        hasEmbeddedData,
        hasBasicApiData,
        hasPassedStock,
        hasPassedRates,
        needsStockFetch,
        needsRateFetch,
        source: props?.data?._metadata?.source,
        passedFrom: props?.data?._metadata?.passedFrom,
        apiCallsMade: props?.data?._metadata?.apiCallsMade,
        stockValue: props?.data?.unit,
        rateValue: props?.data?.price || props?.data?.retail_rate,
        rawDataAvailable: !!props?.data?._metadata?.rawProductData
      });

      // ✅ SMART DATA HANDLING: Use passed data when available, fetch only what's missing
      if (isGermanStandardProduct && (hasPassedStock || hasPassedRates || hasEmbeddedData)) {
        console.log("✅ German Standard product with available data - optimizing API calls!");

        // Handle stock data intelligently
        if (hasPassedStock || hasEmbeddedData) {
          let stockUnit = 0;
          let stockStatus = false;

          if (props?.data?._metadata?.hasEmbeddedStock) {
            // Use embedded stock data
            stockUnit = props.data.unit || props.data._metadata?.stockValue || 0;
            stockStatus = props.data.status || props.data.inStock || (stockUnit > 0);
            console.log("📦 Using embedded stock data:", { unit: stockUnit, status: stockStatus });
          } else if (props?.data?._metadata?.currentStock) {
            // Use passed currentStock data
            stockUnit = props.data._metadata.currentStock.unit || 0;
            stockStatus = props.data._metadata.currentStock.status || false;
            console.log("📦 Using passed stock data:", { unit: stockUnit, status: stockStatus });
          } else if (props?.data?.unit !== undefined && props?.data?.unit !== -1) {
            // Use product's unit data
            stockUnit = props.data.unit;
            stockStatus = props.data.status || props.data.inStock || (stockUnit > 0);
            console.log("📦 Using product unit data:", { unit: stockUnit, status: stockStatus });
          }

          setProductStock({
            unit: stockUnit,
            status: stockStatus
          });
          setStockLoading(false);
        } else if (needsStockFetch) {
          // Need to fetch stock data
          console.log("📦 Stock data needed - will fetch via API");
        }

        // ✅ PRIORITY 1: Handle embedded rate data (available to ALL users)
        if (hasPassedRates || hasEmbeddedData || props?.data?.price > 0 || props?.data?.retail_rate > 0) {
          let rateValue = 0;
          let rateObject = null;

          if (props?.data?._metadata?.hasEmbeddedRate || props?.data?.price > 0 || props?.data?.retail_rate > 0) {
            // Use embedded rate data - available to everyone
            rateValue = props.data.price || props.data.retail_rate || props.data._metadata?.rateValue || 0;
            console.log("💰 Using embedded rate data (available to all users):", rateValue);
          } else if (props?.data?._metadata?.currentBestRate) {
            // Use passed currentBestRate data
            rateObject = props.data._metadata.currentBestRate;
            rateValue = rateObject.rate || 0;
            console.log("💰 Using passed rate data:", rateObject);
          }

          if (rateValue > 0) {
            // Create or use rate object
            const finalRateObject = rateObject || {
              rate: rateValue,
              currencyId: 7, // Assume currency ID 7 for German Standard
              unitName: 'Unit',
              priceBook: 'Standard',
              productId: Number(productId),
              productName: props.data.name || props.data.Name || 'Product',
              unit: 1,
              unitId: 1
            };

            setBestRate(finalRateObject);
            setAllRatesData([finalRateObject]);
            setRateError(null);
            setRatesLoading(false);
            console.log("✅ Rate data set from embedded data (all users):", finalRateObject);

            // Early return - we have the data we need
            return;
          }
        }

        // ✅ PRIORITY 2: Fetch live rates via API (authenticated users only)
        if (session?.token && needsRateFetch) {
          console.log("💰 No embedded rate data - fetching live rates for authenticated user");
          // Continue to legacy API fetching below
        } else if (!session?.token) {
          // ✅ PRIORITY 3: User not authenticated and no embedded data
          const embeddedRateValue = Number(props?.data?.price || props?.data?.retail_rate || 0);
          if (isNaN(embeddedRateValue) || embeddedRateValue <= 0) {
            console.log("🔐 No embedded rate data and user not authenticated");
            setRateError("authentication_required");
            setRatesLoading(false);
          } else {
            console.log("✅ Embedded price present for guest user - suppressing rate error");
          }
          return;
        } else {
          // Has session but no need to fetch rates
          console.log("✅ Authenticated user - no additional rate fetching needed");
          if (!bestRate) {
            setBestRate(null);
            setAllRatesData([]);
            setRateError("no_rates_available");
            setRatesLoading(false);
          }
          return;
        }

      }

      // ✅ FALLBACK: Legacy API calls only when embedded data is not available
      console.log("⚠️ Fallback to legacy API calls - embedded data not available");

      // Legacy stock fetching
      setStockLoading(true);
      try {
        const stockResponse = await germanStandardApi.getStock({
          product: Number(productId),
          warehouse: 2,
          be: 1
        });

        if (stockResponse && Array.isArray(stockResponse) && stockResponse.length > 0) {
          const stockData = stockResponse[0];
          const stockQuantity = stockData.BalQty || 0;
          setProductStock({
            unit: stockQuantity,
            status: stockQuantity > 0
          });
          console.log("✅ Legacy stock data set:", { unit: stockQuantity, status: stockQuantity > 0 });
        } else {
          setProductStock({ unit: 0, status: false });
        }
      } catch (error) {
        console.error("❌ Legacy stock fetch error:", error);
        setProductStock({ unit: 0, status: false });
      } finally {
        setStockLoading(false);
      }

      // Legacy rate fetching
      if (session?.token) {
        await fetchProductRatesWithRetry(Number(productId));
      } else {
        setRateError("authentication_required");
        setRatesLoading(false);
      }
    }

    // Enhanced rate fetching function with retry logic and error handling
    const fetchProductRatesWithRetry = async (productId: number, attempt: number = 1) => {
      const maxRetries = 3;
      setRatesLoading(true);
      setRateError(null);

      try {
        console.log(`🔄 [Attempt ${attempt}/${maxRetries}] Fetching rates for product ${productId}`);

        const rates = await getProductRates(productId);
        console.log("💰 Raw rates response:", rates);

        if (!rates || !Array.isArray(rates)) {
          throw new Error("Invalid rates response format");
        }

        // Store all rates data for debugging
        setAllRatesData(rates);

        if (rates.length === 0) {
          setRateError("no_rates_available");
          setBestRate(null);
          console.log("⚠️ No rates found for product:", productId);
          return;
        }

        console.log("💰 All available rates for product:", rates.map(r => ({
          rate: r.rate,
          currencyId: r.currencyId,
          unitName: r.unitName,
          priceBook: r.priceBook
        })));

        // Enhanced currency ID 7 handling
        const currency7Rates = rates.filter(rate => rate.currencyId === 7);

        if (currency7Rates.length > 0) {
          const bestCurrency7Rate = currency7Rates.sort((a, b) => a.rate - b.rate)[0];
          setBestRate(bestCurrency7Rate);
          setRateError(null);
          console.log("✅ Found currency ID 7 rates:", currency7Rates.length, "Best rate:", bestCurrency7Rate);
        } else {
          // Fallback to any available currency
          const availableCurrencies = Array.from(new Set(rates.map(r => r.currencyId)));
          console.log("⚠️ No currency ID 7 rates found. Available currencies:", availableCurrencies);

          if (rates.length > 0) {
            const fallbackRate = rates.sort((a, b) => a.rate - b.rate)[0];
            setBestRate(fallbackRate);
            setRateError("currency_fallback");
            console.log("✅ Using fallback rate:", fallbackRate);
          } else {
            setBestRate(null);
            setRateError("no_rates_available");
          }
        }

        // Reset retry count on success
        setRateRetryCount(0);

      } catch (error: any) {
        console.error(`❌ [Attempt ${attempt}/${maxRetries}] Rate fetch error:`, {
          message: error.message,
          name: error.name,
          productId,
          attempt
        });

        if (attempt < maxRetries) {
          // Retry with exponential backoff
          const retryDelay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`🔄 Retrying in ${retryDelay}ms...`);

          setRateRetryCount(attempt);
          setTimeout(() => {
            fetchProductRatesWithRetry(productId, attempt + 1);
          }, retryDelay);
          return;
        } else {
          // All retries exhausted
          setRateError("api_error");
          setBestRate(null);
          setRateRetryCount(maxRetries);
          console.error("💥 All retry attempts exhausted for product:", productId);
        }
      } finally {
        if (attempt >= maxRetries || rateError !== "api_error") {
          setRatesLoading(false);
        }
      }
    };

    // Function to fetch category and tag data using German Standard API
    const fetchCategoryData = async () => {
      setCategoryLoading(true);
      try {
        console.log("Fetching categories for product");
        const categories = await germanStandardApi.getCategories(1, 0); // Get all categories

        if (categories && categories.length > 0) {
          // Try to find the category that matches the product's category
          const productCategory = categories.find((cat: any) =>
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

    // Execute both data fetching functions
    fetchProductData();
    fetchCategoryData();
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

  // Helper function to refresh cart data using unified cart service
  const refreshCartFromService = async () => {
    try {
      console.log("🔄 DetailCard: Refreshing cart from unified service...");

      // Enhanced cart service automatically handles migration and validation
      const cartItems = await cartServiceHelpers.getCart();

      // Update unified LocalCart state for ALL users
      dispatch(setLocalCart(cartItems));
      console.log(`✅ DetailCard: Loaded ${cartItems.length} items into unified LocalCart state`);

    } catch (error) {
      console.error("❌ DetailCard: Error refreshing cart:", error);
    }
  };

  const handleAddToCart = async (quantity: number = 1) => {
    try {
      const productId = getProductId(props?.data);
      const rate = bestRate?.rate ?? props?.data?.retail_rate ?? props?.data?.price ?? 0;

      const productData = {
        id: productId,
        productId: productId,
        name: props?.data?.name || props?.data?.Name,
        price: rate,
        image: currentVariant?.image || props?.data?.image || props?.data?.Image,
        unit: productStock?.unit || 999,
        status: props?.data?.status,
        variantId: currentVariant?.id || null,
        category: props?.data?.category,
        code: props?.data?.code || props?.data?.Code,
        description: props?.data?.description || props?.data?.Description,
        availableQuantity: productStock?.unit || 999,
        // Additional variant info
        variantName: currentVariant?.combination?.map((c: any) => c.value).join(' ') || null,
      };

      console.log("🔍 Adding to cart from details page:", {
        productName: productData.name,
        quantity,
        rate,
        isAuthenticated: !!session?.token
      });

      const result = await cartServiceHelpers.addToCart(
        productData,
        quantity,
        {
          source: 'product_details',
          showNotification: true
        }
      );

      if (result.success) {
        // Refresh cart state
        const updatedCart = await cartServiceHelpers.getCart();
        dispatch(setLocalCart(updatedCart));

        // Show success message to user
        message.success({
          content: "Product added to cart successfully!",
          duration: 3,
        });
      }

    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error({
        content: "Failed to add product to cart. Please try again.",
        duration: 3,
      });
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
              rateError={rateError}
              rateRetryCount={rateRetryCount}
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
