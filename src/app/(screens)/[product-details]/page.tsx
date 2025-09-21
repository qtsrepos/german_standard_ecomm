import { Metadata } from "next";
import React from "react";
import DetailsCard from "./detailsCard";
import API from "@/config/API";
import CONFIG from "@/config/configuration";
import { GET_SERVER } from "@/util/apicall_server";
import { standardizeProductData, ProductDataMetadata } from "./_components/functions";
import './style.scss'

// Enhanced helper function to get product data from URL parameters with data source prioritization
function getProductDataFromParams(searchParams: any) {
  console.log("🔍 Getting product data from params:", searchParams);

  // ✅ ENHANCED: Check if we have complete product data passed via URL parameters or sessionStorage
  if (searchParams?.productData) {
    try {
      const productData = JSON.parse(decodeURIComponent(searchParams.productData));
      console.log("✅ Found product data in URL params:", productData);

      // ✅ NEW: Handle sessionStorage fallback for large data
      if (productData.sessionStorageKey) {
        console.log("🔄 Loading large data from sessionStorage:", productData.sessionStorageKey);
        const storedData = sessionStorage.getItem(productData.sessionStorageKey);
        if (storedData) {
          const fullProductData = JSON.parse(storedData);
          console.log("✅ Retrieved full product data from sessionStorage");
          // Clean up sessionStorage after use
          sessionStorage.removeItem(productData.sessionStorageKey);
          // Use the full data instead of the minimal data
          Object.assign(productData, fullProductData);
        } else {
          console.warn("⚠️ SessionStorage key not found, using minimal data");
        }
      }

      // ✅ ENHANCED: Better detection of embedded data from new API response
      const dataSource = productData._metadata?.source || productData.source || 'unknown';
      const fetchedAt = productData.fetchedAt;
      const passedAt = productData.passedAt;
      const hasEmbeddedData = dataSource === 'german_standard_embedded';
      const hasEmbeddedStock = productData._metadata?.hasEmbeddedStock || (productData.unit !== undefined);
      const hasEmbeddedRate = productData._metadata?.hasEmbeddedRate || (productData.price !== undefined || productData.retail_rate !== undefined);

      console.log("📊 Product data metadata:", {
        source: dataSource,
        fetchedAt,
        passedAt,
        hasEmbeddedData,
        hasEmbeddedStock,
        hasEmbeddedRate,
        hasCurrentStock: !!productData.currentStock || !!productData._metadata?.currentStock,
        hasCurrentRates: !!productData.currentRates || !!productData._metadata?.currentRates,
        hasCurrentBestRate: !!productData.currentBestRate || !!productData._metadata?.currentBestRate,
        stockValue: productData.unit || productData._metadata?.stockValue,
        rateValue: productData.price || productData.retail_rate || productData._metadata?.rateValue,
        passedFrom: productData._metadata?.passedFrom
      });

      // Enhanced: Check if data is fresh (embedded data is always fresh, others within 5 minutes)
      const dataAge = fetchedAt ? (Date.now() - new Date(fetchedAt).getTime()) / 1000 / 60 : 0;
      const isFreshData = hasEmbeddedData || dataAge < 5; // Embedded data is always fresh

      console.log(`⏰ Data freshness: ${hasEmbeddedData ? 'Embedded (always fresh)' : `${dataAge.toFixed(1)} minutes old`}, fresh: ${isFreshData}`);

      // Enhanced standardization with metadata preservation
      const standardizedData = standardizeProductData(productData);

      // ✅ ENHANCED: Add comprehensive metadata for optimization decisions
      standardizedData._metadata = {
        source: dataSource,
        fetchedAt,
        passedAt,
        dataAge,
        isFreshData,
        // ✅ NEW: Enhanced embedded data tracking
        hasEmbeddedData,
        hasEmbeddedStock,
        hasEmbeddedRate,
        stockValue: productData.unit || productData._metadata?.stockValue,
        rateValue: productData.price || productData.retail_rate || productData._metadata?.rateValue,
        passedFrom: productData._metadata?.passedFrom,
        // Legacy current data support
        hasCurrentStock: !!productData.currentStock || !!productData._metadata?.currentStock,
        hasCurrentRates: !!productData.currentRates || !!productData._metadata?.currentRates,
        currentStock: productData.currentStock || productData._metadata?.currentStock,
        currentRates: productData.currentRates || productData._metadata?.currentRates,
        currentBestRate: productData.currentBestRate || productData._metadata?.currentBestRate,
        // Search context (if applicable)
        searchQuery: productData.searchQuery,
        pageInfo: productData.pageInfo,
        // ✅ NEW: Preserve original metadata if it exists
        ...productData._metadata
      };

      return standardizedData;
    } catch (error) {
      console.error("❌ Failed to parse product data from URL:", error);
      // Don't fail completely, fall through to other methods
    }
  }

  // ✅ ENHANCED: Fallback with emergency parameter detection
  if (searchParams?.pid && searchParams?.name) {
    const productData = {
      Id: parseInt(searchParams.pid),
      id: parseInt(searchParams.pid),
      Name: searchParams.name,
      name: searchParams.name,
      Description: searchParams.description || '',
      ExtraDescription: searchParams.extraDescription || '',
      Image: searchParams.image || '',
      Code: searchParams.code || '',

      // ✅ NEW: Handle emergency stock/price data if available
      ...(searchParams.stock && {
        unit: parseInt(searchParams.stock),
        status: parseInt(searchParams.stock) > 0,
        inStock: parseInt(searchParams.stock) > 0
      }),
      ...(searchParams.price && {
        price: parseFloat(searchParams.price),
        retail_rate: parseFloat(searchParams.price)
      }),

      // Add metadata for emergency fallback
      _metadata: {
        source: 'emergency_params',
        hasEmbeddedStock: !!searchParams.stock,
        hasEmbeddedRate: !!searchParams.price,
        stockValue: searchParams.stock ? parseInt(searchParams.stock) : undefined,
        rateValue: searchParams.price ? parseFloat(searchParams.price) : undefined,
        passedFrom: 'emergency_navigation',
        isFreshData: !!(searchParams.stock || searchParams.price)
      }
    };
    console.log("✅ Constructed product data from individual/emergency params:", productData);

    const standardizedData = standardizeProductData(productData);
    standardizedData._metadata = {
      source: 'individual_params',
      isFreshData: false,
      hasCurrentStock: false,
      hasCurrentRates: false
    };

    return standardizedData;
  }

  // Last resort: Return minimal structure with just ID
  if (searchParams?.pid) {
    console.log("⚠️ Only product ID available, creating minimal data structure");
    const minimalData = {
      Id: parseInt(searchParams.pid),
      id: parseInt(searchParams.pid),
      Name: `Product ID: ${searchParams.pid}`,
      name: `Product ID: ${searchParams.pid}`,
      Description: '',
      Image: ''
    };

    const standardizedData = standardizeProductData(minimalData);
    standardizedData._metadata = {
      source: 'minimal_id_only',
      isFreshData: false,
      hasCurrentStock: false,
      hasCurrentRates: false
    };

    return standardizedData;
  }

  console.log("❌ No product data found in parameters");
  return null;
}

export const generateMetadata = async ({
  searchParams,
}: any): Promise<Metadata> => {
  const data = getProductDataFromParams(searchParams);
  return {
    title: data?.Name || data?.name || "Product Details",
    description: data?.Description || data?.description || "",
    openGraph: {
      title: data?.Name || data?.name || "Product Details",
      description: data?.Description || data?.description || "",
      type: "website",
      locale: "en_US",
      siteName: CONFIG.NAME,
      url: `${CONFIG.WEBSITE}/${searchParams.slug}/?pid=${searchParams?.pid}&review=${searchParams?.review}`,
      images: (data?.Image || data?.image) ? [{
        url: data.Image || data.image || '',
        alt: data?.Name || data?.name || 'Product Image',
        width: 575,
        height: 275,
      }] : [],
    },
  };
};


async function ProductScreen({ searchParams }: any) {
  console.log("🚀 ProductScreen called with searchParams:", searchParams);

  const data = getProductDataFromParams(searchParams);

  console.log("🎯 ProductScreen FINAL RESULT:", {
    productId: searchParams?.pid,
    hasData: !!data,
    dataName: data?.Name || data?.name,
    dataId: data?.Id || data?.id,
    willShowPNG: !data
  });

  if (!data) {
    console.error("❌ NULL DATA - No product data passed via parameters");
  } else {
    console.log("✅ Data exists - should show product details");
  }

  return <DetailsCard data={data} params={searchParams} />;
}

export default ProductScreen;
