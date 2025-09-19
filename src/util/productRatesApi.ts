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
    // Get authentication token
    const token = await getValidAccessToken();

    // 1. Get all products
    const productsResponse = await fetch(`${API.GERMAN_STANDARD_PRODUCTS}?category=0&subCategory=0&brand=0&type=0&search=`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
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
          const rateResponse = await fetch(`${API.GERMAN_STANDARD_PRODUCT_RATE}?productId=${product.Id}&unitId=${unit.Id}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
          });

          if (rateResponse.ok) {
            const rateData = await rateResponse.json();
            if (rateData?.status === "Success" && rateData.result) {
              const rates = JSON.parse(rateData.result);
              
              // Handle both single rate object and array of rates
              const rateArray = Array.isArray(rates) ? rates : [rates];
              
              rateArray.forEach((rate: any) => {
                if (rate && rate.Rate !== undefined) {
                  allRates.push({
                    productId: product.Id,
                    productName: product.Name,
                    unitId: unit.Id,
                    unitName: unit.Name,
                    rate: rate.Rate,
                    currencyId: rate.iCurrency || 0,
                    priceBook: rate.sPriceBookName || "Default"
                  });
                }
              });
            }
          }
        } catch (error) {
          // Skip this combination if rate not found or error occurred
          console.log(`No rate found for product ${product.Id} with unit ${unit.Id}`);
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

    // Get authentication token
    console.log(`🔑 [${debugId}] Getting authentication token...`);
    const token = await getValidAccessToken();
    if (!token) {
      console.error(`❌ [${debugId}] No authentication token available`);
      return [];
    }
    console.log(`✅ [${debugId}] Token obtained, length:`, token.length);

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
        const rateUrl = `${API.GERMAN_STANDARD_PRODUCT_RATE}?productId=${productId}&unitId=${unit.Id}`;
        console.log(`💰 [${unitDebugId}] Fetching rate (${i + 1}/${units.length}):`, rateUrl);

        const rateResponse = await fetch(rateUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
                console.log(`✅ [${unitDebugId}] Added rate ${rateIndex + 1}:`, productRate);
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
        console.log(`❌ [${unitDebugId}] Rate fetch error:`, error.message);
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
 * @returns Promise<ProductRate | null> - The best rate or null if no rates found
 */
export async function getBestProductRate(productId: number): Promise<ProductRate | null> {
  const debugId = `BestRate-${productId}-${Date.now()}`;
  console.log(`🏆 [${debugId}] Getting best rate for productId:`, productId);

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

    // Sort by rate and return the lowest
    const sortedRates = rates.sort((a, b) => a.rate - b.rate);
    const bestRate = sortedRates[0];

    console.log(`✅ [${debugId}] Best rate selected:`, {
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