import { GET } from "./apicall";
import API from "@/config/API";
import { getValidAccessToken } from "./tokenRefresh";

export interface ProductRate {
  productId: number;
  productName: string;
  unitId: number;
  unitName: string;
  rate: number;
  currencyId: number;
  priceBook: string;
}

export interface Unit {
  Id: number;
  Name: string;
  Code: string;
}

export interface Product {
  Id: number;
  Name: string;
  Code: string;
  Description?: string;
  Image?: string;
  Category?: string;
  ExtraDescription?: string;
}

/**
 * Fetches all product rates from German Standard API
 * @param baseUrl - The base URL for the API
 * @returns Promise<ProductRate[]> - Array of all product rates
 */
export async function getAllProductRates(): Promise<ProductRate[]> {
  try {
    // Get authentication token with enhanced validation
    const token = await getValidAccessToken();

    if (!token) {
      console.error("❌ No valid authentication token available for rate fetching");
      return [];
    }

    console.log("✅ Authentication token obtained for rate fetching, length:", token.length);

    // 1. Get all products
    const productsResponse = await fetch(`${API.GERMAN_STANDARD_PRODUCTS}?category=0&subCategory=0&brand=0&type=0&search=`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!productsResponse.ok) {
      console.error("Failed to fetch products:", productsResponse.status, productsResponse.statusText);
      return [];
    }

    const productsData = await productsResponse.json();
    if (productsData?.status !== "Success" || !productsData.result) {
      console.error("Failed to fetch products:", productsData);
      return [];
    }

    const products: Product[] = JSON.parse(productsData.result).Data || [];

    // 2. Get all units
    const tagListUrl = `${API.GERMAN_STANDARD_TAG_LIST}?be=1`;
    console.log("🔄 Fetching units from:", tagListUrl);
    const unitsResponse = await fetch(tagListUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!unitsResponse.ok) {
      console.error("❌ Failed to fetch units for all product rates:", unitsResponse.status, unitsResponse.statusText);
      return [];
    }

    const unitsData = await unitsResponse.json();
    if (unitsData?.status !== "Success" || !unitsData.result) {
      console.error("❌ Invalid units response for all product rates:", unitsData);
      return [];
    }

    console.log("✅ Units fetched successfully for getAllProductRates");

    const units: Unit[] = JSON.parse(unitsData.result);
    const allRates: ProductRate[] = [];

    // 3. Loop through each product and unit combination
    for (const product of products) {
      for (const unit of units) {
        try {
          const rateResponse = await fetch(`${API.GERMAN_STANDARD_PRODUCT_RATE}?productId=${product.Id}&unitId=${unit.Id}&currency=7&bE=1`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
            signal: AbortSignal.timeout(10000), // 10 second timeout for individual rate requests
          });

          if (rateResponse.ok) {
            const rateData = await rateResponse.json();
            if (rateData?.status === "Success" && rateData.result) {
              const rates = JSON.parse(rateData.result);
              
              // Handle both single rate object and array of rates
              const rateArray = Array.isArray(rates) ? rates : [rates];
              
              rateArray.forEach((rate: any) => {
                if (rate && rate.Rate !== undefined) {
                  const rateData = {
                    productId: product.Id,
                    productName: product.Name,
                    unitId: unit.Id,
                    unitName: unit.Name,
                    rate: rate.Rate,
                    currencyId: rate.iCurrency || 0,
                    priceBook: rate.sPriceBookName || "Default"
                  };
                  allRates.push(rateData);

                  // Log successful rate retrieval for currency ID 7
                  if (rate.iCurrency === 7) {
                    console.log(`✅ Found currency ID 7 rate for product ${product.Id}:`, rateData);
                  }
                }
              });
            }
          }
        } catch (error: any) {
          // Enhanced error logging for rate fetching
          console.log(`❌ Rate fetch failed for product ${product.Id} with unit ${unit.Id}:`, {
            error: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText
          });
        }
      }
    }

    return allRates;
  } catch (error) {
    console.error("Error fetching product rates:", error);
    return [];
  }
}

/**
 * Fetches rates for a specific product
 * @param productId - The product ID
 * @returns Promise<ProductRate[]> - Array of rates for the specific product
 */
export async function getProductRates(productId: number): Promise<ProductRate[]> {
  const debugId = `Product-${productId}-${Date.now()}`;
  console.log(`🔍 [${debugId}] Starting getProductRates for productId:`, productId, "(type:", typeof productId, ")");

  try {
    // Validate input
    if (!productId || isNaN(productId) || productId <= 0) {
      console.error(`❌ [${debugId}] Invalid productId:`, productId);
      return [];
    }

    // Get authentication token with enhanced validation
    console.log(`🔑 [${debugId}] Getting authentication token...`);
    const token = await getValidAccessToken();
    if (!token) {
      console.error(`❌ [${debugId}] No authentication token available for product rate fetching`);
      return [];
    }
    console.log(`✅ [${debugId}] Token obtained for rate fetching, length:`, token.length, "first 20 chars:", token.substring(0, 20) + "...");

    // Get all units first
    const tagListUrl = `${API.GERMAN_STANDARD_TAG_LIST}?be=1`;
    console.log(`🔄 [${debugId}] Fetching units from:`, tagListUrl);
    const unitsResponse = await fetch(tagListUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    console.log(`📊 [${debugId}] Units API response status:`, unitsResponse.status, unitsResponse.statusText);

    if (!unitsResponse.ok) {
      const errorText = await unitsResponse.text();
      console.error(`❌ [${debugId}] Failed to fetch units:`, {
        status: unitsResponse.status,
        statusText: unitsResponse.statusText,
        errorBody: errorText.substring(0, 200) // Limit error text length
      });
      return [];
    }

    const unitsData = await unitsResponse.json();
    console.log(`📦 [${debugId}] Units response data:`, {
      status: unitsData?.status,
      hasResult: !!unitsData.result,
      resultType: typeof unitsData.result
    });

    if (unitsData?.status !== "Success" || !unitsData.result) {
      console.error(`❌ [${debugId}] Invalid units response:`, unitsData);
      return [];
    }

    const units: Unit[] = JSON.parse(unitsData.result);
    console.log(`✅ [${debugId}] Units parsed successfully, count:`, units.length);
    const productRates: ProductRate[] = [];
    let successfulRates = 0;
    let failedUnits = 0;

    // Loop through each unit for the specific product
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const unitDebugId = `${debugId}-Unit-${unit.Id}`;

      try {
        const rateUrl = `${API.GERMAN_STANDARD_PRODUCT_RATE}?productId=${productId}&unitId=${unit.Id}&currency=7&bE=1`;
        console.log(`💰 [${unitDebugId}] Fetching rate (${i + 1}/${units.length}) with currency ID 7:`, rateUrl);

        const requestHeaders = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const rateResponse = await fetch(rateUrl, {
          method: "GET",
          headers: requestHeaders,
          signal: AbortSignal.timeout(10000), // 10 second timeout for individual rate requests
        });

        console.log(`📈 [${unitDebugId}] Rate API response:`, rateResponse.status, rateResponse.statusText);

        if (rateResponse.ok) {
          const rateData = await rateResponse.json();
          console.log(`📊 [${unitDebugId}] Rate data:`, {
            status: rateData?.status,
            hasResult: !!rateData.result,
            resultType: typeof rateData.result
          });

          if (rateData?.status === "Success" && rateData.result) {
            const rates = JSON.parse(rateData.result);
            console.log(`💲 [${unitDebugId}] Parsed rates:`, rates);

            // Handle both single rate object and array of rates
            const rateArray = Array.isArray(rates) ? rates : [rates];

            rateArray.forEach((rate: any, rateIndex: number) => {
              if (rate && rate.Rate !== undefined) {
                const productRate = {
                  productId: productId,
                  productName: "", // Will be filled from product data
                  unitId: unit.Id,
                  unitName: unit.Name,
                  rate: rate.Rate,
                  currencyId: rate.iCurrency || 0,
                  priceBook: rate.sPriceBookName || "Default"
                };
                productRates.push(productRate);
                successfulRates++;

                // Enhanced logging for currency ID 7
                if (rate.iCurrency === 7) {
                  console.log(`✅ [${unitDebugId}] Currency ID 7 rate found:`, productRate);
                } else {
                  console.log(`ℹ️ [${unitDebugId}] Rate with currency ID ${rate.iCurrency}:`, productRate);
                }
              } else {
                console.warn(`⚠️ [${unitDebugId}] Invalid rate object:`, rate);
              }
            });
          } else {
            console.warn(`⚠️ [${unitDebugId}] Rate API returned failure:`, rateData);
          }
        } else {
          const errorText = await rateResponse.text();
          console.log(`❌ [${unitDebugId}] Rate fetch failed:`, {
            status: rateResponse.status,
            statusText: rateResponse.statusText,
            errorBody: errorText.substring(0, 100)
          });
        }
      } catch (error: any) {
        failedUnits++;
        console.log(`❌ [${unitDebugId}] Rate fetch error:`, {
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          productId: productId,
          unitId: unit.Id
        });
      }
    }

    console.log(`🎯 [${debugId}] Final summary:`, {
      totalUnits: units.length,
      successfulRates,
      failedUnits,
      finalRatesCount: productRates.length
    });

    return productRates;
  } catch (error: any) {
    console.error(`💥 [${debugId}] Critical error in getProductRates:`, {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 300)
    });
    return [];
  }
}

/**
 * Gets the best rate for a product (lowest rate)
 * @param productId - The product ID
 * @param preferredCurrencyId - Optional preferred currency ID to prioritize
 * @returns Promise<ProductRate | null> - The best rate or null if no rates found
 */
export async function getBestProductRate(productId: number, preferredCurrencyId?: number): Promise<ProductRate | null> {
  const debugId = `BestRate-${productId}-${Date.now()}`;
  console.log(`🏆 [${debugId}] Getting best rate for productId:`, productId, `preferredCurrency:`, preferredCurrencyId);

  try {
    const rates = await getProductRates(productId);
    console.log(`📈 [${debugId}] Received rates count:`, rates.length);

    if (rates.length === 0) {
      console.log(`⚠️ [${debugId}] No rates found for product`);
      return null;
    }

    // Log all rates before sorting
    console.log(`💰 [${debugId}] All rates:`, rates.map(r => ({
      unitName: r.unitName,
      rate: r.rate,
      currencyId: r.currencyId,
      priceBook: r.priceBook
    })));

    // If preferred currency is specified, try to find rates for that currency first
    if (preferredCurrencyId !== undefined) {
      const preferredCurrencyRates = rates.filter(rate => rate.currencyId === preferredCurrencyId);
      if (preferredCurrencyRates.length > 0) {
        const sortedPreferredRates = preferredCurrencyRates.sort((a, b) => a.rate - b.rate);
        const bestPreferredRate = sortedPreferredRates[0];

        console.log(`✅ [${debugId}] Best rate selected (preferred currency ${preferredCurrencyId}):`, {
          unitName: bestPreferredRate.unitName,
          rate: bestPreferredRate.rate,
          currencyId: bestPreferredRate.currencyId,
          priceBook: bestPreferredRate.priceBook
        });

        return bestPreferredRate;
      } else {
        console.log(`⚠️ [${debugId}] No rates found for preferred currency ${preferredCurrencyId}, falling back to all currencies`);
      }
    }

    // Sort by rate and return the lowest (fallback or no preferred currency)
    const sortedRates = rates.sort((a, b) => a.rate - b.rate);
    const bestRate = sortedRates[0];

    console.log(`✅ [${debugId}] Best rate selected (any currency):`, {
      unitName: bestRate.unitName,
      rate: bestRate.rate,
      currencyId: bestRate.currencyId,
      priceBook: bestRate.priceBook
    });

    return bestRate;
  } catch (error: any) {
    console.error(`💥 [${debugId}] Error in getBestProductRate:`, {
      message: error.message,
      name: error.name
    });
    return null;
  }
}

/**
 * Gets the best rate for a product with specific currency ID
 * @param productId - The product ID
 * @param currencyId - The currency ID to filter by
 * @returns Promise<ProductRate | null> - The best rate for the specified currency or null if no rates found
 */
export async function getBestProductRateForCurrency(productId: number, currencyId: number): Promise<ProductRate | null> {
  const debugId = `BestRateCurrency-${productId}-${currencyId}-${Date.now()}`;
  console.log(`🏆 [${debugId}] Getting best rate for productId:`, productId, `currencyId:`, currencyId);

  try {
    const rates = await getProductRates(productId);
    console.log(`📈 [${debugId}] Received rates count:`, rates.length);

    if (rates.length === 0) {
      console.log(`⚠️ [${debugId}] No rates found for product`);
      return null;
    }

    // Filter rates by currency ID
    const currencyRates = rates.filter(rate => rate.currencyId === currencyId);

    if (currencyRates.length === 0) {
      console.log(`⚠️ [${debugId}] No rates found for currency ${currencyId}`);
      return null;
    }

    console.log(`💰 [${debugId}] Currency ${currencyId} rates:`, currencyRates.map(r => ({
      unitName: r.unitName,
      rate: r.rate,
      currencyId: r.currencyId,
      priceBook: r.priceBook
    })));

    // Sort by rate and return the lowest
    const sortedRates = currencyRates.sort((a, b) => a.rate - b.rate);
    const bestRate = sortedRates[0];

    console.log(`✅ [${debugId}] Best rate selected for currency ${currencyId}:`, {
      unitName: bestRate.unitName,
      rate: bestRate.rate,
      currencyId: bestRate.currencyId,
      priceBook: bestRate.priceBook
    });

    return bestRate;
  } catch (error: any) {
    console.error(`💥 [${debugId}] Error in getBestProductRateForCurrency:`, {
      message: error.message,
      name: error.name
    });
    return null;
  }
}