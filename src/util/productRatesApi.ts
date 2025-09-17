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
    const unitsResponse = await fetch(API.GERMAN_STANDARD_TAG_LIST, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    });

    if (!unitsResponse.ok) {
      console.error("Failed to fetch units:", unitsResponse.status, unitsResponse.statusText);
      return [];
    }

    const unitsData = await unitsResponse.json();
    if (unitsData?.status !== "Success" || !unitsData.result) {
      console.error("Failed to fetch units:", unitsData);
      return [];
    }

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
  try {
    // Get authentication token
    const token = await getValidAccessToken();
    
    // Get all units first
    const unitsResponse = await fetch(API.GERMAN_STANDARD_TAG_LIST, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    });

    if (!unitsResponse.ok) {
      console.error("Failed to fetch units:", unitsResponse.status, unitsResponse.statusText);
      return [];
    }

    const unitsData = await unitsResponse.json();
    if (unitsData?.status !== "Success" || !unitsData.result) {
      console.error("Failed to fetch units:", unitsData);
      return [];
    }

    const units: Unit[] = JSON.parse(unitsData.result);
    const productRates: ProductRate[] = [];

    // Loop through each unit for the specific product
    for (const unit of units) {
      try {
        const rateResponse = await fetch(`${API.GERMAN_STANDARD_PRODUCT_RATE}?productId=${productId}&unitId=${unit.Id}`, {
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
                productRates.push({
                  productId: productId,
                  productName: "", // Will be filled from product data
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
        // Skip this unit if rate not found
        console.log(`No rate found for product ${productId} with unit ${unit.Id}`);
      }
    }

    return productRates;
  } catch (error) {
    console.error("Error fetching product rates:", error);
    return [];
  }
}

/**
 * Gets the best rate for a product (lowest rate)
 * @param productId - The product ID
 * @returns Promise<ProductRate | null> - The best rate or null if no rates found
 */
export async function getBestProductRate(productId: number): Promise<ProductRate | null> {
  const rates = await getProductRates(productId);
  
  if (rates.length === 0) {
    return null;
  }

  // Sort by rate and return the lowest
  return rates.sort((a, b) => a.rate - b.rate)[0];
}