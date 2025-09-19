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

  // ENHANCED: Check if we have complete product data passed via URL parameters
  if (searchParams?.productData) {
    try {
      const productData = JSON.parse(decodeURIComponent(searchParams.productData));
      console.log("✅ Found product data in URL params:", productData);

      // Enhanced: Check data source and freshness
      const dataSource = productData.source || 'unknown';
      const fetchedAt = productData.fetchedAt;
      const passedAt = productData.passedAt;

      console.log("📊 Product data metadata:", {
        source: dataSource,
        fetchedAt,
        passedAt,
        hasCurrentStock: !!productData.currentStock,
        hasCurrentRates: !!productData.currentRates,
        hasFullApiData: dataSource === 'german_standard_api'
      });

      // Enhanced: Check if data is fresh (within last 5 minutes for search data)
      const dataAge = fetchedAt ? (Date.now() - new Date(fetchedAt).getTime()) / 1000 / 60 : Infinity;
      const isFreshData = dataAge < 5; // 5 minutes

      console.log(`⏰ Data age: ${dataAge.toFixed(1)} minutes, fresh: ${isFreshData}`);

      // Enhanced standardization with metadata preservation
      const standardizedData = standardizeProductData(productData);

      // Add metadata for optimization decisions
      standardizedData._metadata = {
        source: dataSource,
        fetchedAt,
        passedAt,
        dataAge,
        isFreshData,
        hasCurrentStock: !!productData.currentStock,
        hasCurrentRates: !!productData.currentRates,
        currentStock: productData.currentStock,
        currentRates: productData.currentRates,
        currentBestRate: productData.currentBestRate,
        searchQuery: productData.searchQuery,
        pageInfo: productData.pageInfo
      };

      return standardizedData;
    } catch (error) {
      console.error("❌ Failed to parse product data from URL:", error);
      // Don't fail completely, fall through to other methods
    }
  }

  // Fallback: Check individual parameters
  if (searchParams?.pid && searchParams?.name) {
    const productData = {
      Id: parseInt(searchParams.pid),
      id: parseInt(searchParams.pid),
      Name: searchParams.name,
      name: searchParams.name,
      Description: searchParams.description || '',
      ExtraDescription: searchParams.extraDescription || '',
      Image: searchParams.image || '',
      Code: searchParams.code || ''
    };
    console.log("✅ Constructed product data from individual params:", productData);

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
