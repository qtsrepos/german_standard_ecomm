import axios from "axios";
import API from "@/config/API";
import { getSession } from "next-auth/react";

// Types and Interfaces
export interface LoginRequest {
  loginName: string;
  password: string;
  entityId: number;
  channelId: number;
}

export interface LoginResponse {
  status: string;
  statusCode: number;
  message: string;
  result: {
    userData: string; // JSON string containing user data
    accessToken: string; // JWT token with quotes
    refreshToken: string; // JWT refresh token with quotes
    tokenExpiryMin: number;
  };
}

export interface RefreshTokenResponse {
  status: string;
  statusCode: number;
  message: string;
  result: {
    accessToken: string; // JWT token with quotes
    refreshToken: string; // JWT refresh token with quotes
    tokenExpiryMin: number;
  };
}

export interface CategoryData {
  Id: number;
  Name: string;
  Code: string;
  Description: string;
  Image: string;
  SubCategories: SubCategoryData[];
}

export interface SubCategoryData {
  CategoryId: number;
  Id: number;
  Name: string;
  Code: string;
  Description: string;
  Image: string;
}

export interface ProductData {
  Id: number;
  Name: string | null;
  Code: string | null;
  Description: string | null;
  ExtraDescription: string | null;
  Image: string | null;
}

export interface ProductsResponse {
  status: string;
  statusCode: number;
  message: string;
  result: string; // JSON string containing products data and pagination
}

export interface CategoriesResponse {
  status: string;
  statusCode: number;
  message: string;
  result: string; // JSON string containing categories data
}

// German Standard API Service Class
export class GermanStandardApiService {
  private static instance: GermanStandardApiService;
  private baseURL = API.GERMAN_STANDARD_BASE;

  public static getInstance(): GermanStandardApiService {
    if (!GermanStandardApiService.instance) {
      GermanStandardApiService.instance = new GermanStandardApiService();
    }
    return GermanStandardApiService.instance;
  }

  /**
   * Get authorization headers with Bearer token if available
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "accept": "*/*",
      "Content-Type": "application/json",
    };

    // Only get session on client side
    if (typeof window !== "undefined") {
      try {
        const session: any = await getSession();
        if (session?.token) {
          // Remove quotes from token if present
          const cleanToken = session.token.replace(/"/g, '');
          headers["Authorization"] = `Bearer ${cleanToken}`;
        }
      } catch (error) {
        console.log("Could not get session for auth headers:", error);
      }
    }

    return headers;
  }

  /**
   * Login API - Authenticate user with credentials
   */
  public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        API.GERMAN_STANDARD_LOGIN,
        loginRequest,
        {
          headers: {
            "accept": "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        return response.data;
      } else {
        throw new Error(response.data?.message || "Login failed");
      }
    } catch (error: any) {
      console.error("German Standard Login API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Login failed");
    }
  }

  /**
   * Refresh Token API - Regenerate access and refresh tokens
   */
  public async refreshTokens(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await axios.get<RefreshTokenResponse>(
        API.GERMAN_STANDARD_REFRESH_TOKEN,
        {
          params: {
            refreshToken: refreshToken
          },
          headers: {
            "accept": "text/plain",
            "Authorization": `Bearer ${refreshToken}`,
          },
        }
      );

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        return response.data;
      } else {
        throw new Error(response.data?.message || "Token refresh failed");
      }
    } catch (error: any) {
      console.error("German Standard Refresh Token API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Token refresh failed");
    }
  }

  /**
   * Categories API - Get categories with subcategories
   */
  public async getCategories(be: number = 1, category: number = 1): Promise<CategoryData[]> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${API.GERMAN_STANDARD_CATEGORIES}?be=${be}&category=${category}`;

      console.log("Fetching categories from German Standard API:", url);

      const response = await axios.get<CategoriesResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        // Parse the nested JSON strings in the response
        const parsedResult = JSON.parse(response.data.result);
        
        if (Array.isArray(parsedResult)) {
          // Extract categories from the data field
          const categories: CategoryData[] = [];
          
          for (const item of parsedResult) {
            if (item.data) {
              const parsedCategories = JSON.parse(item.data);
              categories.push(...parsedCategories);
            }
          }
          
          console.log("Successfully fetched categories:", categories.length);
          return categories;
        }
        
        return [];
      } else {
        console.error("Failed to fetch categories:", response.data?.message);
        return [];
      }
    } catch (error: any) {
      console.error("German Standard Categories API Error:", error);
      return [];
    }
  }

  /**
   * Products API - Get products by category and subcategory with pagination
   */
  public async getProducts(
    refreshFlag: boolean = true,
    pageNumber: number = 1,
    pageSize: number = 10,
    category: number,
    subCategory?: number
  ): Promise<{ products: ProductData[]; totalRows: number; totalPages: number }> {
    try {
      const headers = await this.getAuthHeaders();
      
      // Build the URL with query parameters
      let url = `${API.GERMAN_STANDARD_PRODUCTS}?refreshFlag=${refreshFlag}&pageNumber=${pageNumber}&pageSize=${pageSize}&category=${category}`;
      
      if (subCategory !== undefined && subCategory !== null) {
        url += `&subCategory=${subCategory}`;
      }

      console.log("Fetching products from German Standard API:", url);

      const response = await axios.get<ProductsResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        // Parse the nested JSON string in the response
        const parsedResult = JSON.parse(response.data.result);
        
        const products = parsedResult.Data || [];
        const pageSummary = parsedResult.PageSummary?.[0] || { TotalRows: 0, TotalPages: 0 };

        console.log(`Successfully fetched ${products.length} products`);
        
        return {
          products,
          totalRows: pageSummary.TotalRows,
          totalPages: pageSummary.TotalPages
        };
      } else {
        console.error("Failed to fetch products:", response.data?.message);
        return { products: [], totalRows: 0, totalPages: 0 };
      }
    } catch (error: any) {
      console.error("German Standard Products API Error:", error);
      return { products: [], totalRows: 0, totalPages: 0 };
    }
  }

  /**
   * Transform category data for Redux store compatibility
   */
  public transformCategoriesForRedux(categories: CategoryData[]): any[] {
    return categories.map(cat => ({
      _id: cat.Id?.toString() || "0",
      id: cat.Id?.toString() || "0",
      name: cat.Name || "",
      slug: cat.Code?.toLowerCase().replace(/\s+/g, '-') || "",
      image: cat.Image || "/images/no-image.jpg",
      description: cat.Description || "",
      position: 0,
      status: true,
      sub_categories: cat.SubCategories?.map(subCat => ({
        _id: subCat.Id?.toString() || "0",
        id: subCat.Id?.toString() || "0",
        name: subCat.Name || "",
        slug: subCat.Code?.toLowerCase().replace(/\s+/g, '-') || "",
        image: subCat.Image || "/images/no-image.jpg",
        categoryId: subCat.CategoryId || cat.Id,
      })) || []
    }));
  }

  /**
   * Transform product data for component compatibility
   */
  public transformProductsForDisplay(products: ProductData[], categoryId: string, subCategoryId?: string): any[] {
    return products.map(product => ({
      id: product.Id?.toString() || "0",
      _id: product.Id?.toString() || "0",
      name: product.Name || "Unnamed Product",
      slug: product.Code?.toLowerCase().replace(/\s+/g, '-') || "",
      description: product.Description || "",
      extraDescription: product.ExtraDescription || "",
      image: product.Image || "/images/no-image.jpg",
      images: product.Image ? [product.Image] : [],
      // Default values for compatibility with existing components
      price: 0,
      originalPrice: 0,
      discount: 0,
      inStock: true,
      category: categoryId,
      subCategory: subCategoryId || "",
    }));
  }
}

// Export singleton instance
export const germanStandardApi = GermanStandardApiService.getInstance();

// Export individual functions for easier import
export const {
  login: germanStandardLogin,
  refreshTokens: germanStandardRefreshTokens,
  getCategories: germanStandardGetCategories,
  getProducts: germanStandardGetProducts,
  transformCategoriesForRedux: transformCategoriesForRedux,
  transformProductsForDisplay: transformProductsForDisplay,
} = germanStandardApi;