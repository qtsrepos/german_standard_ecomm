import { Metadata } from "next";
import React from "react";
import DetailsCard from "./detailsCard";
import API from "@/config/API";
import CONFIG from "@/config/configuration";
import { GET_SERVER } from "@/util/apicall_server";
import './style.scss'

async function fetchData(id: string) {
  console.log("fetchData====>>", id);
  try {
    console.log('Fetching product data for ID:', id);
    
    // Get authentication token from session
    const { getServerSession } = await import("next-auth");
    const { options } = await import("@/app/api/auth/[...nextauth]/options");
    const session: any = await getServerSession(options);
    
    // Use German Standard API to fetch product details
    try {
      // Use direct fetch for German Standard API since it's a full URL
      const response = await fetch(`${API.GERMAN_STANDARD_PRODUCTS}?category=0&subCategory=0&brand=0&type=0&search=${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(session?.token && { Authorization: `Bearer ${session.token.replace(/"/g, '')}` }),
        },
      });
      
      if (!response.ok) {
        console.error("Failed to fetch product:", response.status, response.statusText);
        return null;
      }
      
      const data = await response.json();
      console.log("response====>>", data);
      
      if (data?.status === "Success" && data.result) {
        const products = JSON.parse(data.result);
        // Find the product with matching ID
        const product = products.Data?.find((p: any) => p.Id.toString() === id);
        return product || null;
      }
      
      return null;
    } catch (apiError) {
      console.error("API Error:", apiError);
      return null;
    }
  } catch (err) {
    console.log("Error fetching product data:", err);
    return null;
  }
}

export const generateMetadata = async ({
  searchParams,
}: any): Promise<Metadata> => {
  const data = await fetchData(searchParams?.pid);
  return {
    title: data?.name || "",
    description: data?.description || "",
    openGraph: {
      title: data?.name,
      description: data?.description,
      type: "website",
      locale: "en_US",
      siteName: CONFIG.NAME,
      url: `${CONFIG.WEBSITE}/${searchParams.slug}/?pid=${searchParams?.pid}&review=${searchParams?.review}`,
      images: {
        url: data?.image,
        alt: data?.name,
        width: 575,
        height: 275,
      },
    },
  };
  
};


async function ProductScreen({ searchParams }: any) {
  const data = await fetchData(searchParams?.pid)
  console.log("data====>>", data);
  return <DetailsCard data={data} params={searchParams} />;
}

export default ProductScreen;
