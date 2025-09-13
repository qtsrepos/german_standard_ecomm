import axios from "axios";
import API from "@/config/API";
import { getSession } from "next-auth/react";

// Interface for product data
interface Product {
  Id: number;
  Name: string | null;
  Code: string | null;
  Description: string | null;
  ExtraDescription: string | null;
  Image: string | null;
}

interface PageSummary {
  TotalRows: number;
  TotalPages: number;
}

interface ProductsResponse {
  status: string;
  statusCode: number;
  message: string;
  result: string; // This is a stringified JSON
}

interface ProductsResult {
  Data: Product[];
  PageSummary: PageSummary[];
}

/**
 * Fetch products by category and subcategory from German Standard API
 * @param refreshFlag - Whether to refresh the data (default: true)
 * @param pageNumber - Page number for pagination (default: 1)
 * @param pageSize - Number of items per page (default: 10)
 * @param category - Category ID (required)
 * @param subCategory - Subcategory ID (optional)
 * @returns Promise with parsed products data
 */
export const fetchProductsByCategory = async (
  refreshFlag: boolean = true,
  pageNumber: number = 1,
  pageSize: number = 10,
  category: number,
  subCategory?: number
): Promise<{ products: any[]; totalRows: number; totalPages: number }> => {
  try {
    // Get the session to check for token
    const session: any = await getSession();
    const token = session?.token;

    // Build the URL with query parameters
    let url = `${API.GERMAN_STANDARD_PRODUCTS}?refreshFlag=${refreshFlag}&pageNumber=${pageNumber}&pageSize=${pageSize}&category=${category}`;
    
    if (subCategory !== undefined && subCategory !== null) {
      url += `&subCategory=${subCategory}`;
    }

    const headers: any = {
      "accept": "*/*",
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("Fetching products from:", url);
    console.log("Headers:", headers);

    const response = await axios.get<ProductsResponse>(url, { headers });

    if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
      // Parse the nested JSON string in the response
      const parsedResult: ProductsResult = JSON.parse(response.data.result);
      
      // Transform the data to match the existing product structure
      const transformedProducts = parsedResult.Data.map((product: Product) => ({
        id: product.Id?.toString() || "0",
        _id: product.Id?.toString() || "0", // Support both id and _id
        name: product.Name || "Unnamed Product",
        slug: product.Code?.toLowerCase().replace(/\s+/g, '-') || "",
        description: product.Description || "",
        extraDescription: product.ExtraDescription || "",
        image: product.Image || "/images/no-image.jpg",
        images: product.Image ? [product.Image] : [],
        // Add default values for compatibility with existing components
        price: 0,
        originalPrice: 0,
        discount: 0,
        inStock: true,
        category: category.toString(),
        subCategory: subCategory?.toString() || "",
      }));

      const totalRows = parsedResult.PageSummary?.[0]?.TotalRows || 0;
      const totalPages = parsedResult.PageSummary?.[0]?.TotalPages || 0;

      return {
        products: transformedProducts,
        totalRows,
        totalPages
      };
    } else {
      console.error("Failed to fetch products:", response.data?.message);
      return {
        products: [],
        totalRows: 0,
        totalPages: 0
      };
    }
  } catch (error: any) {
    console.error("Error fetching products:", error);
    
    // Return empty array on error to prevent app crash
    return {
      products: [],
      totalRows: 0,
      totalPages: 0
    };
  }
};

/**
 * Transform product data for compatibility with existing components
 */
export const transformProductForDisplay = (product: any) => {
  return {
    ...product,
    // Ensure required fields are present
    id: product.id || product._id,
    _id: product._id || product.id,
    name: product.name || "Unnamed Product",
    image: product.image || product.images?.[0] || "/images/no-image.jpg",
    price: product.price || 0,
    originalPrice: product.originalPrice || product.price || 0,
    inStock: product.inStock !== undefined ? product.inStock : true,
  };
};