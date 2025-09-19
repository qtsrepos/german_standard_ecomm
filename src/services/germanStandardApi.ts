import axios from "axios";
import API from "@/config/API";
import { getSession } from "next-auth/react";
import { getCustomerIdFromSession } from "@/shared/helpers/jwtUtils";

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

export interface TransactionData {
  TransId: number;
  DocNo: string;
  Date: string;
  Country: number;
  CreatedBy: string;
}

export interface TransactionSummaryResponse {
  status: string;
  statusCode: number;
  message: string;
  result: string; // JSON string containing transaction data and pagination
}

// ===== NEW TRANSACTIONS API TYPES =====

// Order Types
export interface OrderItem {
  transId?: number;
  product: number; // required
  qty: number; // required
  headerId?: number; // default=0
  voucherType?: number; // default=0
  rate?: number;
  unit?: number;
  vat?: number;
  addcharges?: number;
  discount?: number;
  discountAmt?: number;
  discountRemarks?: string;
  remarks?: string;
}

export interface OrderRequest {
  transId: number; // 0 for new order
  date: string; // yyyy-MM-dd format
  country: number;
  be?: number; // Business Entity
  customer?: number;
  deliveryAddress?: string;
  eventName?: string;
  remarks?: string;
  discountType?: number;
  payTerms?: number;
  discountCouponRef?: string;
  discountRef?: string;
  sampleRequestBy?: number;
  deliveryTerms?: string;
  deliveryDate?: string;
  body: OrderItem[];
}

export interface OrderResponse {
  status: string;
  statusCode: number;
  message: string;
  result: number; // transId of created/updated order
}

// Enhanced interface for German Standard insertOrUpdateOrder API response
export interface GermanStandardOrderResponse {
  // Success response format
  success?: boolean;
  result?: number; // Order ID

  // Failure response format
  status?: string; // "Failure"
  statusCode?: number; // 5000
  message?: string; // Error message
}

// Wishlist Types
export interface WishlistRequest {
  transId: number; // 0 for new wishlist item
  product: number;
  quantity: number;
  customer: number;
  remarks?: string;
  be?: number;
}

export interface WishlistResponse {
  status: string;
  statusCode: number;
  message: string;
  result: number; // transId of created/updated wishlist item
}

// Cart Types
export interface CartRequest {
  transId: number; // 0 for new cart item
  date: string; // yyyy-MM-dd format
  customer: number;
  warehouse: number;
  remarks?: string;
  discountType?: number;
  discountCouponRef?: string;
  discountRef?: string;
  sampleRequestedBy?: number;
  product: number;
  qty: number;
  rate: number;
  unit: number;
  totalRate: number;
  addCharges?: number;
  discount?: number;
  discountAmt?: number;
  discountRemarks?: string;
  be?: number;
}

export interface CartResponse {
  status: string;
  statusCode: number;
  message: string;
  result: number; // transId of created/updated cart item
}

// Supporting API Types - Only those used by Swagger APIs
export interface TagListRequest {
  tagId?: number;
  languageId?: number;
  be?: number;
  type?: number;
}

export interface MasterDetailsRequest {
  id: number;
  type: 'customer' | 'product' | 'warehouse';
  be?: number;
}

export interface StockRequest {
  product: number;
  warehouse: number;
  be?: number;
}

export interface ProductRateRequest {
  product: number;
  unit?: number;
  currency?: number;
  account?: number;
  be?: number;
}

export interface ProductListRequest {
  search?: string;
  category?: number;
  subCategory?: number;
  brand?: number;
  type?: number;
  pageNumber?: number;
  pageSize?: number;
  be?: number;
}

export interface SubCategoryRequest {
  category: number; // 0 for nested categories
  be?: number;
}

// New types for Swagger APIs
export interface AddressRequest {
  id?: number;
  customerId: number;
  addressType?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
  be?: number;
}

export interface ScreenRequest {
  userId?: number;
  be?: number;
}

export interface UserActionRequest {
  userId?: number;
  actionId?: number;
  be?: number;
}

// Generic API Response
export interface ApiResponse<T = any> {
  status: string;
  statusCode: number;
  message: string;
  result: T;
}

// German Standard API Service Class - Only Swagger Available APIs
export class GermanStandardApiService {
  private static instance: GermanStandardApiService;
  private baseURL = API.GERMAN_STANDARD_BASE;

  public static getInstance(): GermanStandardApiService {
    if (!GermanStandardApiService.instance) {
      GermanStandardApiService.instance = new GermanStandardApiService();
    }
    return GermanStandardApiService.instance;
  }

  // ✅ PERMANENT FIX: Cache headers to avoid repeated session calls and token corruption
  private cachedHeaders: Record<string, string> | null = null;
  private lastTokenCheck: number = 0;
  private readonly TOKEN_CACHE_DURATION = 30000; // 30 seconds cache

  /**
   * Clear cached headers - call this when tokens are updated
   */
  public clearAuthCache(): void {
    this.cachedHeaders = null;
    this.lastTokenCheck = 0;
    console.log("🧹 German Standard API auth cache cleared");
  }

  /**
   * Get authorization headers with Bearer token if available
   * ✅ FIXED: Uses Redux token instead of session to avoid race conditions
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const now = Date.now();

    // Use cached headers if they're still fresh
    if (this.cachedHeaders && (now - this.lastTokenCheck) < this.TOKEN_CACHE_DURATION) {
      return this.cachedHeaders;
    }

    const headers: Record<string, string> = {
      "accept": "*/*",
      "Content-Type": "application/json",
    };

    // Only get token on client side
    if (typeof window !== "undefined") {
      try {
        // ✅ CRITICAL FIX: Get token from multiple sources to avoid race conditions
        let token = null;

        // Method 1: Try to get token from localStorage (most reliable)
        try {
          const persistedAuth = localStorage.getItem('persist:Auth');
          if (persistedAuth) {
            const authData = JSON.parse(persistedAuth);
            const storedToken = authData.token ? JSON.parse(authData.token) : null;
            if (storedToken && typeof storedToken === 'string' && storedToken !== '""' && storedToken !== 'null') {
              token = storedToken;
              console.log("🔐 German Standard API - Token from localStorage:", {
                hasToken: !!token,
                tokenLength: token?.length,
                source: "localStorage_persist"
              });
            }
          }
        } catch (e) {
          console.log("⚠️ Could not read token from localStorage persist:", e);
        }

        // Method 2: Try to get from Redux store if available
        if (!token) {
          try {
            const store = (window as any).__store__ ||
                         (window as any).__NEXT_REDUX_STORE__ ||
                         (globalThis as any).__store__;

            if (store?.getState) {
              const authState = store.getState()?.Auth;
              if (authState?.token && authState.token !== '""' && authState.token !== 'null') {
                token = authState.token;
                console.log("🔐 German Standard API - Token from Redux store:", {
                  hasToken: !!token,
                  tokenLength: token?.length,
                  source: "Redux_store"
                });
              }
            }
          } catch (e) {
            console.log("⚠️ Could not access Redux store:", e);
          }
        }

        // Method 3: Fallback to session if Redux token not available
        if (!token) {
          try {
            const session: any = await getSession();
            if (session?.token && session.token !== '""' && session.token !== 'null') {
              token = session.token;
              console.log("🔐 German Standard API - Token from session:", {
                hasToken: !!token,
                tokenLength: token?.length,
                source: "NextAuth_session"
              });
            }
          } catch (e) {
            console.log("⚠️ Could not get session:", e);
          }
        }

        if (token && typeof token === 'string') {
          // ✅ SIMPLIFIED: Minimal token processing to avoid corruption
          const cleanToken = token.trim();

          // Basic JWT validation (should have 3 parts separated by dots)
          if (cleanToken.split('.').length === 3) {
            headers["Authorization"] = `Bearer ${cleanToken}`;
            console.log("✅ Authorization header set successfully");
          } else {
            console.warn("⚠️ Invalid JWT format, proceeding without auth");
          }
        } else {
          console.log("ℹ️ No valid token found - proceeding without authentication");
        }
      } catch (error) {
        console.error("❌ Error getting auth headers:", error);
        // Don't throw error - return headers without auth and let API handle 401
        console.log("⚠️ Proceeding without authentication due to error");
      }
    } else {
      console.log("🔧 Server-side execution - no session available");
    }

    // ✅ CACHE HEADERS: Store headers and timestamp for future use
    this.cachedHeaders = headers;
    this.lastTokenCheck = now;

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
   * Updated to match exact API format from catergory_apis.md
   */
  public async getCategories(be: number = 1, category?: number): Promise<CategoryData[]> {
    try {
      // First try with authentication
      let headers: Record<string, string>;
      let authAvailable = false;

      try {
        headers = await this.getAuthHeaders();
        authAvailable = !!headers.Authorization;
        console.log("🔐 getCategories Authentication status:", authAvailable ? "Available" : "Not available");
      } catch (authError) {
        console.log("⚠️ getCategories Authentication failed, trying without auth:", authError);
        headers = {
          "accept": "*/*",
          "Content-Type": "application/json",
        };
      }

      // Use exact API format from the markdown file - only be parameter for broader retrieval
      let url = `${API.GERMAN_STANDARD_CATEGORIES}?be=${be}`;

      // Only add category parameter if explicitly provided (for specific category filtering)
      if (category !== undefined && category !== null) {
        url += `&category=${category}`;
      }

      console.log("🔄 Fetching categories from German Standard API:", url);
      console.log("🔐 Using auth:", authAvailable);

      try {
        const response = await axios.get<CategoriesResponse>(url, { headers });

        if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("🔍 Raw API response structure:", {
          status: response.data.status,
          statusCode: response.data.statusCode,
          resultType: typeof response.data.result,
          resultLength: response.data.result?.length
        });

        // Enhanced parsing of the nested JSON strings in the response
        const parsedResult = JSON.parse(response.data.result);
        console.log("🔍 Parsed result structure:", {
          isArray: Array.isArray(parsedResult),
          length: parsedResult?.length,
          firstItemKeys: parsedResult?.[0] ? Object.keys(parsedResult[0]) : []
        });

        if (Array.isArray(parsedResult)) {
          // Extract categories from the data field
          const categories: CategoryData[] = [];

          for (const item of parsedResult) {
            if (item.data) {
              try {
                const parsedCategories = JSON.parse(item.data);
                if (Array.isArray(parsedCategories)) {
                  categories.push(...parsedCategories);
                  console.log(`✅ Extracted ${parsedCategories.length} categories from data field`);
                }
              } catch (parseError) {
                console.warn("⚠️ Failed to parse nested category data:", parseError);
              }
            } else {
              // Handle direct category objects (if structure varies)
              if (item.Id && item.Name) {
                categories.push(item);
                console.log(`✅ Added direct category: ${item.Name}`);
              }
            }
          }

          console.log("✅ Successfully fetched categories:", {
            totalCategories: categories.length,
            categoryNames: categories.map(cat => cat.Name).slice(0, 5),
            hasSubCategories: categories.some(cat => cat.SubCategories?.length > 0)
          });
          return categories;
        }

        console.warn("⚠️ Unexpected response structure - not an array");
        return [];
      } else {
        console.error("❌ Failed to fetch categories:", response.data?.message);
        return [];
      }
      } catch (apiError: any) {
        // If we get 401 and we were using auth, try without auth
        if (apiError.response?.status === 401 && authAvailable) {
          console.log("🔄 401 error with auth, retrying getCategories without authentication...");

          const unauthHeaders = {
            "accept": "*/*",
            "Content-Type": "application/json",
          };

          const retryResponse = await axios.get<CategoriesResponse>(url, { headers: unauthHeaders });

          if (retryResponse.data?.status === "Success" && retryResponse.data?.statusCode === 2000) {
            console.log("✅ Categories fetched successfully without auth");
            // Parse the nested JSON string in the response (same logic as above)
            const parsedResult = JSON.parse(retryResponse.data.result);

            if (Array.isArray(parsedResult)) {
              const categories: CategoryData[] = [];

              for (const item of parsedResult) {
                if (item.data) {
                  try {
                    const parsedCategories = JSON.parse(item.data);
                    if (Array.isArray(parsedCategories)) {
                      categories.push(...parsedCategories);
                    }
                  } catch (parseError) {
                    console.warn("⚠️ Failed to parse nested category data:", parseError);
                  }
                } else {
                  if (item.Id && item.Name) {
                    categories.push(item);
                  }
                }
              }

              console.log("✅ Categories fetched successfully without auth:", categories.length);
              return categories;
            }
            return [];
          } else {
            throw new Error(retryResponse.data?.message || "Failed to fetch categories");
          }
        } else {
          // Re-throw the original error if it's not a 401 or we already tried without auth
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error("❌ German Standard Categories API Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data,
        url: error.config?.url
      });

      // ✅ IMPROVED: Enhanced error handling with network detection
      const status = error.response?.status;
      const isNetworkError = !error.response && (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK');
      const isTimeoutError = error.code === 'ECONNABORTED' || error.message?.includes('timeout');

      if (status === 401) {
        console.error("🔑 Authentication Error: Token validation failed for categories");
        throw new Error("Authentication required for categories - please verify your login status");
      } else if (status === 403) {
        console.error("🚫 Authorization Error: Access denied for categories");
        throw new Error("Access denied - insufficient permissions for categories");
      } else if (isNetworkError || isTimeoutError) {
        console.error("🌐 Network Error: Connection issue while fetching categories");
        throw new Error("Network connection issue - please check your internet connection");
      } else if (status >= 500) {
        console.error("🔧 Server Error: Backend issue while fetching categories");
        throw new Error("Server temporarily unavailable - please try again later");
      } else {
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch categories");
      }
    }
  }

  /**
   * Products API - Get products by category and subcategory with pagination
   * Enhanced with unauthenticated fallback and be=1 parameter
   */
  public async getProducts(
    refreshFlag: boolean = true,
    pageNumber: number = 1,
    pageSize: number = 10,
    category?: number,
    subCategory?: number
  ): Promise<{ products: ProductData[]; totalRows: number; totalPages: number }> {
    try {
      // First try with authentication
      let headers: Record<string, string>;
      let authAvailable = false;

      try {
        headers = await this.getAuthHeaders();
        authAvailable = !!headers.Authorization;
        console.log("🔐 getProducts Authentication status:", authAvailable ? "Available" : "Not available");
      } catch (authError) {
        console.log("⚠️ getProducts Authentication failed, trying without auth:", authError);
        headers = {
          "accept": "*/*",
          "Content-Type": "application/json",
        };
      }

      // Build the URL with query parameters - ENHANCED: Added be=1 parameter
      let url = `${API.GERMAN_STANDARD_PRODUCTS}?refreshFlag=${refreshFlag}&pageNumber=${pageNumber}&pageSize=${pageSize}&be=1`;

      if (category !== undefined && category !== null) {
        url += `&category=${category}`;
      }

      if (subCategory !== undefined && subCategory !== null) {
        url += `&subCategory=${subCategory}`;
      }

      console.log("🔍 Fetching products from German Standard API:", url);
      console.log("🔐 Using auth:", authAvailable);

      try {
        const response = await axios.get<ProductsResponse>(url, { headers });

        if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
          // Parse the nested JSON string in the response
          const parsedResult = JSON.parse(response.data.result);

          const products = parsedResult.Data || [];
          const pageSummary = parsedResult.PageSummary?.[0] || { TotalRows: 0, TotalPages: 0 };

          console.log(`✅ Successfully fetched ${products.length} products with auth:`, authAvailable);

          return {
            products,
            totalRows: pageSummary.TotalRows,
            totalPages: pageSummary.TotalPages
          };
        } else {
          console.error("❌ API Error Response:", response.data);
          throw new Error(response.data?.message || "Failed to fetch products");
        }
      } catch (apiError: any) {
        // If we get 401 and we were using auth, try without auth
        if (apiError.response?.status === 401 && authAvailable) {
          console.log("🔄 401 error with auth, retrying getProducts without authentication...");

          const unauthHeaders = {
            "accept": "*/*",
            "Content-Type": "application/json",
          };

          const retryResponse = await axios.get<ProductsResponse>(url, { headers: unauthHeaders });

          if (retryResponse.data?.status === "Success" && retryResponse.data?.statusCode === 2000) {
            // Parse the nested JSON string in the response
            const parsedResult = JSON.parse(retryResponse.data.result);

            const products = parsedResult.Data || [];
            const pageSummary = parsedResult.PageSummary?.[0] || { TotalRows: 0, TotalPages: 0 };

            console.log(`✅ Successfully fetched ${products.length} products without auth`);

            return {
              products,
              totalRows: pageSummary.TotalRows,
              totalPages: pageSummary.TotalPages
            };
          } else {
            throw new Error(retryResponse.data?.message || "Failed to fetch products");
          }
        } else {
          // Re-throw the original error if it's not a 401 or we already tried without auth
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error("❌ German Standard Products API Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data
      });
      return { products: [], totalRows: 0, totalPages: 0 };
    }
  }

  /**
   * Transaction Summary API - Get transaction summary with pagination
   */
  public async getTransactionSummary(
    docType: number = 1,
    be: number = 1,
    refreshFlag: boolean = true,
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<{ transactions: TransactionData[]; totalRows: number; totalPages: number }> {
    try {
      let headers;
      try {
        headers = await this.getAuthHeaders();
        console.log("🔍 headers:", headers);
      } catch (err) {
        console.error("❌ getAuthHeaders failed:", err);
        throw err; // rethrow so your outer catch still works
      }
      
      // Build the URL with query parameters
      let url = `${API.GERMAN_STANDARD_TRANSACTION_SUMMARY}?docType=${docType}&be=${be}&refreshFlag=${refreshFlag}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      console.log("Fetching transaction summary from German Standard API:", url);

      const response = await axios.get<TransactionSummaryResponse>(url, { headers });
      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        // Parse the nested JSON string in the response
        const parsedResult = JSON.parse(response.data.result);
        
        const transactions = parsedResult.Data || [];
        const pageSummary = parsedResult.PageSummary?.[0] || { TotalRows: 0, TotalPages: 0 };

        console.log(`Successfully fetched ${transactions.length} transactions`);
        
        return {
          transactions,
          totalRows: pageSummary.TotalRows,
          totalPages: pageSummary.TotalPages
        };
      } else {
        console.error("Failed to fetch transaction summary:", response.data?.message);
        return { transactions: [], totalRows: 0, totalPages: 0 };
      }
    } catch (error: any) {
      console.error("German Standard Transaction Summary API Error:", error);
      return { transactions: [], totalRows: 0, totalPages: 0 };
    }
  }

  /**
   * Transform category data for Redux store compatibility
   * Enhanced with deduplication logic and better fallbacks
   */
  public transformCategoriesForRedux(categories: CategoryData[]): any[] {
    console.log("🔄 Transforming categories for Redux:", {
      inputCount: categories.length,
      sampleCategory: categories[0] ? {
        id: categories[0].Id,
        name: categories[0].Name,
        hasSubCategories: !!categories[0].SubCategories?.length
      } : null
    });

    // Enhanced slug generation with fallbacks
    const generateSlug = (text: string) => {
      return text?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/-+/g, '-') // Replace multiple dashes with single dash
        .trim() || `category-${Date.now()}`;
    };

    // Custom category icon mapping for German Standard categories
    const getCategoryIcon = (categoryName: string, imageUrl: string) => {
      // If valid image URL exists and is not NoImage.jpg, use it
      if (imageUrl && !imageUrl.includes('NoImage.jpg') && imageUrl.trim() !== '') {
        return imageUrl;
      }

      // Custom icon mapping based on category names
      const categoryIconMap: Record<string, string> = {
        // Animal Food Categories
        'animal food': '🐾',
        'pet food': '🐕',
        'dog food': '🐕',
        'cat food': '🐱',
        'bird food': '🐦',
        'fish food': '🐠',

        // Non-Food Categories
        'non-food': '📦',
        'accessories': '🧸',
        'toys': '🎾',
        'health': '💊',
        'medicine': '💊',
        'supplements': '💊',
        'grooming': '✂️',
        'cleaning': '🧽',
        'equipment': '🔧',
        'tools': '🔧',

        // General Categories
        'food': '🍽️',
        'supplies': '📦',
        'care': '❤️',
        'training': '🎓',
        'safety': '🛡️',
        'outdoor': '🌲',
        'indoor': '🏠',

        // Size Categories
        'small animals': '🐹',
        'large animals': '🐎',
        'both': '🐾',

        // Default fallback
        'default': '📋'
      };

      // Try to find matching icon
      const normalizedName = categoryName.toLowerCase().trim();

      // Direct match
      if (categoryIconMap[normalizedName]) {
        return categoryIconMap[normalizedName];
      }

      // Partial match - check if category name contains any keywords
      for (const [keyword, icon] of Object.entries(categoryIconMap)) {
        if (normalizedName.includes(keyword)) {
          return icon;
        }
      }

      // Default fallback
      return categoryIconMap['default'];
    };

    // Step 1: Filter and initially transform categories
    const initialCategories = categories
      .filter(cat => cat && cat.Id && cat.Name && cat.Name.trim() !== '') // Filter out invalid categories
      .map(cat => {
        // Transform subcategories with enhanced validation
        const transformedSubCategories = (cat.SubCategories || [])
          .filter(subCat => subCat && subCat.Id && subCat.Name && subCat.Name.trim() !== '') // Filter out invalid subcategories
          .map(subCat => ({
            _id: subCat.Id?.toString() || "0",
            id: subCat.Id?.toString() || "0",
            name: subCat.Name?.trim() || "",
            slug: generateSlug(subCat.Code || subCat.Name || ""),
            image: getCategoryIcon(subCat.Name || "", subCat.Image || ""),
            description: subCat.Description?.trim() || "",
            categoryId: subCat.CategoryId || cat.Id,
            position: 0,
            status: true,
          }));

        return {
          originalId: cat.Id,
          _id: cat.Id?.toString() || "0",
          id: cat.Id?.toString() || "0",
          name: cat.Name?.trim() || "",
          slug: generateSlug(cat.Code || cat.Name || ""),
          image: getCategoryIcon(cat.Name || "", cat.Image || ""),
          description: cat.Description?.trim() || "",
          position: 0,
          status: true,
          sub_categories: transformedSubCategories
        };
      });

    // Step 2: Deduplicate categories by name
    const categoryMap = new Map<string, any>();
    const duplicatesFound: string[] = [];

    initialCategories.forEach(cat => {
      const categoryKey = cat.name.toLowerCase().trim();

      if (categoryMap.has(categoryKey)) {
        // Found duplicate - merge subcategories
        const existing = categoryMap.get(categoryKey);
        duplicatesFound.push(`${cat.name} (ID: ${cat.originalId})`);

        console.log(`🔄 Merging duplicate category: ${cat.name} (${cat.originalId} -> ${existing.originalId})`);

        // Merge subcategories, avoiding duplicates
        const existingSubCatNames = new Set(existing.sub_categories.map((sub: any) => sub.name.toLowerCase()));
        const newSubCategories = cat.sub_categories.filter((sub: any) =>
          !existingSubCatNames.has(sub.name.toLowerCase())
        );

        existing.sub_categories = [...existing.sub_categories, ...newSubCategories];

        // Keep the lower ID as primary (assuming lower ID = more authoritative)
        if (cat.originalId < existing.originalId) {
          existing._id = cat.id;
          existing.id = cat.id;
          existing.originalId = cat.originalId;
          console.log(`📝 Updated primary ID to ${cat.originalId} for ${cat.name}`);
        }
      } else {
        categoryMap.set(categoryKey, { ...cat });
      }
    });

    // Step 3: Convert map back to array and sort
    const deduplicatedCategories = Array.from(categoryMap.values())
      .sort((a, b) => {
        // Sort by original ID to maintain consistent order
        return a.originalId - b.originalId;
      })
      .map(cat => {
        // Remove the temporary originalId field
        const { originalId, ...finalCategory } = cat;
        return finalCategory;
      });

    console.log("✅ Category transformation and deduplication complete:", {
      inputCount: categories.length,
      outputCount: deduplicatedCategories.length,
      duplicatesRemoved: categories.length - deduplicatedCategories.length,
      duplicatesFound: duplicatesFound,
      totalSubCategories: deduplicatedCategories.reduce((sum, cat) => sum + cat.sub_categories.length, 0),
      categoryNames: deduplicatedCategories.map(cat => cat.name)
    });

    // Log individual category details
    deduplicatedCategories.forEach(cat => {
      console.log(`✅ Final category: ${cat.name} (ID: ${cat.id}, ${cat.sub_categories.length} subcategories)`);
    });

    return deduplicatedCategories;
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
      // ✅ FIX: Add status field - default to true for German Standard products
      // since German Standard API doesn't provide status field, we assume products returned are available
      status: true,
      category: categoryId,
      subCategory: subCategoryId || "",
    }));
  }

  /**
   * Transform transaction data for component compatibility
   */
  public transformTransactionsForDisplay(transactions: TransactionData[]): any[] {
    return transactions.map(transaction => ({
      id: transaction.TransId?.toString() || "0",
      _id: transaction.TransId?.toString() || "0",
      transId: transaction.TransId,
      docNo: transaction.DocNo || "",
      date: transaction.Date || "",
      country: transaction.Country || 0,
      createdBy: transaction.CreatedBy || "",
      // Format date for display
      formattedDate: transaction.Date ? new Date(transaction.Date).toLocaleDateString() : "",
      // Add status based on document type (you can customize this logic)
      status: this.getDocumentStatus(transaction.DocNo),
    }));
  }

  /**
   * Get document status based on document number pattern
   */
  private getDocumentStatus(docNo: string): string {
    if (docNo.startsWith('PUR')) return 'Purchase Order';
    if (docNo.startsWith('ORD')) return 'Order';
    if (docNo.startsWith('RFQ')) return 'Request for Quote';
    return 'Transaction';
  }

  /**
   * Converts cart data to German Standard Order format
   */
  public convertCartToGermanStandardOrder(
    cartData: any,
    addressData: any,
    session: any,
    paymentMethod: string = 'Cash On Delivery'
  ): OrderRequest {
    console.log("🔄 Converting cart to German Standard order format:", {
      cartItems: cartData?.length || 0,
      hasAddress: !!addressData,
      hasSession: !!session
    });

    // Extract customer ID from JWT token
    const customerId = getCustomerIdFromSession(session);
    if (!customerId) {
      throw new Error("Customer ID not found in session - please login again");
    }

    // Prepare order date
    const currentDate = new Date().toISOString().split('T')[0]; // yyyy-MM-dd format

    // Convert cart items to German Standard order items format
    const orderItems: OrderItem[] = cartData.map((cartItem: any, index: number) => {
      const productId = cartItem.productId || cartItem.pid || cartItem.id;
      const quantity = cartItem.quantity || cartItem.qty || 1;
      const price = cartItem.price || cartItem.retail_rate || 0;

      console.log(`📦 Converting cart item ${index + 1}:`, {
        productId,
        quantity,
        price,
        originalItem: cartItem
      });

      return {
        transId: 0, // Always 0 for new order items
        product: Number(productId),
        qty: Number(quantity),
        headerId: 0, // Always 0 as per API docs
        voucherType: 0, // Always 0 as per API docs
        rate: Number(price),
        unit: 1, // Default unit
        vat: 0, // Default VAT - could be enhanced to calculate from settings
        addcharges: 0, // Default additional charges
        discount: 0, // Default discount
        discountAmt: 0, // Default discount amount
        discountRemarks: undefined,
        remarks: cartItem.notes || undefined
      };
    });

    // Prepare delivery address
    let deliveryAddress = '';
    if (addressData) {
      const addressParts = [
        addressData.street || addressData.address_line_1,
        addressData.city,
        addressData.state,
        addressData.postal_code || addressData.zip_code
      ].filter(Boolean);
      deliveryAddress = addressParts.join(', ');
    }

    // Create the German Standard order request
    const orderRequest: OrderRequest = {
      transId: 0, // 0 for new order
      date: currentDate,
      country: 1, // Default country - could be enhanced based on address
      be: 1, // Business Entity ID
      customer: customerId,
      deliveryAddress: deliveryAddress,
      eventName: undefined, // Could be enhanced for special orders
      remarks: `Order placed via web app - Payment: ${paymentMethod}`,
      discountType: 0,
      payTerms: 0,
      discountCouponRef: undefined,
      discountRef: undefined,
      sampleRequestBy: 0,
      deliveryTerms: "Standard delivery",
      deliveryDate: currentDate, // Could be enhanced for future delivery dates
      body: orderItems
    };

    console.log("✅ Converted cart to German Standard order:", {
      orderId: orderRequest.transId,
      customerId: orderRequest.customer,
      itemCount: orderRequest.body.length,
      totalItems: orderRequest.body.reduce((sum, item) => sum + item.qty, 0)
    });

    return orderRequest;
  }

  // ===== ORDERS API METHODS =====

  /**
   * Upsert Order (Insert or Update Order) - Enhanced for German Standard insertOrUpdateOrder API
   */
  public async upsertOrder(orderRequest: OrderRequest): Promise<GermanStandardOrderResponse> {
    try {
      const headers = await this.getAuthHeaders();

      console.log("🔄 Creating/updating order with German Standard API:", {
        endpoint: API.GERMAN_STANDARD_UPSERT_ORDER,
        orderData: {
          transId: orderRequest.transId,
          date: orderRequest.date,
          customer: orderRequest.customer,
          itemCount: orderRequest.body.length
        }
      });

      const response = await axios.post<GermanStandardOrderResponse>(
        API.GERMAN_STANDARD_UPSERT_ORDER,
        orderRequest,
        { headers }
      );

      console.log("📋 Raw German Standard Order API response:", response.data);

      // Handle success response format: {success: true, result: 12345}
      if (response.data?.success === true && response.data?.result) {
        console.log("✅ Order created/updated successfully:", response.data.result);
        return response.data;
      }

      // Handle failure response format: {status: "Failure", statusCode: 5000, message: "...", result: "2035"}
      if (response.data?.status === "Failure") {
        const errorMessage = response.data.message || "Order operation failed";
        console.error("❌ German Standard Order API Failure:", {
          statusCode: response.data.statusCode,
          message: errorMessage,
          result: response.data.result
        });

        // Special handling for "Saved Successfully. But failed Posting to Focus" scenario
        if (errorMessage.includes("Saved Successfully") && errorMessage.includes("failed Posting to Focus")) {
          console.warn("⚠️ Order saved in German Standard but failed to post to Focus system");
          // Return success with warning - order was created but external system integration failed
          return {
            success: true,
            result: typeof response.data.result === 'string'
              ? parseInt(response.data.result)
              : (response.data.result as number) || 0,
            message: errorMessage // Include warning message
          };
        }

        throw new Error(errorMessage);
      }

      // Handle unexpected response format
      console.error("❌ Unexpected response format from German Standard Order API:", response.data);
      throw new Error("Unexpected response format from order API");

    } catch (error: any) {
      console.error("❌ German Standard Order API Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data,
        url: error.config?.url
      });

      // ✅ IMPROVED: Enhanced error handling with better differentiation
      const status = error.response?.status;
      const isNetworkError = !error.response && error.code === 'NETWORK_ERROR';
      const isTimeoutError = error.code === 'ECONNABORTED' || error.message?.includes('timeout');

      if (status === 401) {
        console.error("🔐 Authentication Error: Token validation failed");
        // Don't immediately force logout - let the auth hook handle it
        throw new Error("Authentication required - please check your login status");
      } else if (status === 403) {
        console.error("🚫 Authorization Error: Insufficient permissions");
        throw new Error("Access denied - insufficient permissions for this operation");
      } else if (isNetworkError || isTimeoutError) {
        console.error("🌐 Network Error: Connection issue detected");
        throw new Error("Network connection issue - please check your internet connection");
      } else if (status >= 500) {
        console.error("🔧 Server Error: Backend system issue");
        throw new Error("Server temporarily unavailable - please try again in a few moments");
      } else {
        throw new Error(error.response?.data?.message || error.message || "Operation failed");
      }
    }
  }

  /**
   * Get Transaction Details - matches Swagger /gsgtransaction/gettransactiondetails
   */
  public async getTransactionDetails(transId: number): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${API.GERMAN_STANDARD_TRANSACTION_DETAILS}?transId=${transId}`;

      console.log("Fetching transaction details:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Transaction details fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch transaction details");
      }
    } catch (error: any) {
      console.error("German Standard Transaction Details API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch transaction details");
    }
  }

  /**
   * Delete Transaction - matches Swagger /gsgtransaction/deletetransaction
   */
  public async deleteTransaction(transIds: number[]): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      console.log("Deleting transactions:", transIds);

      const response = await axios.delete<ApiResponse>(
        API.GERMAN_STANDARD_DELETE_TRANSACTION,
        {
          headers,
          data: { transIds }
        }
      );

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Transactions deleted successfully");
        return response.data;
      } else {
        throw new Error(response.data?.message || "Failed to delete transactions");
      }
    } catch (error: any) {
      console.error("German Standard Delete Transaction API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to delete transactions");
    }
  }

  // ===== WISHLIST API METHODS =====

  /**
   * Upsert Wishlist (Insert or Update Wishlist) - matches Swagger /gsgtransaction/upsertwishlist
   */
  public async upsertWishlist(wishlistRequest: WishlistRequest): Promise<WishlistResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      console.log("Creating/updating wishlist item:", wishlistRequest);

      const response = await axios.post<WishlistResponse>(
        API.GERMAN_STANDARD_UPSERT_WISHLIST,
        wishlistRequest,
        { headers }
      );

      if (response.data?.status === "Success" && response.data?.statusCode === 2001) {
        console.log("Wishlist item created/updated successfully:", response.data.result);
        return response.data;
      } else {
        throw new Error(response.data?.message || "Wishlist operation failed");
      }
    } catch (error: any) {
      console.error("German Standard Wishlist API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Wishlist operation failed");
    }
  }

  /**
   * Get Wishlist Summary (using transaction summary with docType=2)
   */
  public async getWishlistSummary(
    be: number = 1,
    refreshFlag: boolean = true,
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<{ transactions: TransactionData[]; totalRows: number; totalPages: number }> {
    return this.getTransactionSummary(2, be, refreshFlag, pageNumber, pageSize, search);
  }

  // ===== CART API METHODS =====

  /**
   * Upsert Cart (Insert or Update Cart) - matches Swagger /gsgtransaction/upsertcart
   */
  public async upsertCart(cartRequest: CartRequest): Promise<CartResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      console.log("Creating/updating cart item:", cartRequest);

      const response = await axios.post<CartResponse>(
        API.GERMAN_STANDARD_UPSERT_CART,
        cartRequest,
        { headers }
      );

      if (response.data?.status === "Success" && response.data?.statusCode === 2001) {
        console.log("Cart item created/updated successfully:", response.data.result);
        return response.data;
      } else {
        throw new Error(response.data?.message || "Cart operation failed");
      }
    } catch (error: any) {
      console.error("German Standard Cart API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Cart operation failed");
    }
  }

  /**
   * Get Cart Summary (using transaction summary with docType=3)
   */
  public async getCartSummary(
    be: number = 1,
    refreshFlag: boolean = true,
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<{ transactions: TransactionData[]; totalRows: number; totalPages: number }> {
    return this.getTransactionSummary(3, be, refreshFlag, pageNumber, pageSize, search);
  }

  // ===== SUPPORTING API METHODS =====

  /**
   * Get Company Details - matches Swagger /login/getcompany
   */
  public async getCompany(): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const url = API.GERMAN_STANDARD_GET_COMPANY;

      console.log("Fetching company details:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Company details fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch company details");
      }
    } catch (error: any) {
      console.error("German Standard Get Company API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch company details");
    }
  }

  /**
   * Get Tag List - matches Swagger /tag/gettaglist
   */
  public async getTagList(request: TagListRequest): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      if (request.tagId !== undefined) params.append('tagId', request.tagId.toString());
      if (request.languageId !== undefined) params.append('languageId', request.languageId.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());
      if (request.type !== undefined) params.append('type', request.type.toString());

      const url = `${API.GERMAN_STANDARD_TAG_LIST}?${params.toString()}`;
      console.log("Fetching tag list:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Tag list fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch tag list");
      }
    } catch (error: any) {
      console.error("German Standard Tag List API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch tag list");
    }
  }

  /**
   * Get Master Details
   */
  public async getMasterDetails(request: MasterDetailsRequest): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      params.append('id', request.id.toString());
      params.append('type', request.type);
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_MASTER_DETAILS}?${params.toString()}`;
      console.log("Fetching master details:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Master details fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch master details");
      }
    } catch (error: any) {
      console.error("German Standard Master Details API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch master details");
    }
  }

  /**
   * Get Stock Balance
   */
  public async getStock(request: StockRequest): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      params.append('product', request.product.toString());
      params.append('warehouse', request.warehouse.toString());
      if (request.be !== undefined) params.append('bE', request.be.toString()); // API expects bE not be

      const url = `${API.GERMAN_STANDARD_STOCK}?${params.toString()}`;
      console.log("Fetching stock balance:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Stock balance fetched successfully");
        console.log("🔍 Raw stock API response:", response.data);

        // Parse the result which is a JSON string
        const parsedResult = JSON.parse(response.data.result);
        console.log("📊 Parsed stock result:", parsedResult);
        return parsedResult;
      } else {
        console.error("Stock API Error Response:", response.data);
        throw new Error(response.data?.message || "Failed to fetch stock balance");
      }
    } catch (error: any) {
      console.error("German Standard Stock API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch stock balance");
    }
  }

  /**
   * Get Product Rate
   */
  public async getProductRate(request: ProductRateRequest): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      params.append('product', request.product.toString());
      if (request.unit !== undefined) params.append('unit', request.unit.toString());
      if (request.currency !== undefined) params.append('currency', request.currency.toString());
      if (request.account !== undefined) params.append('account', request.account.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_PRODUCT_RATE}?${params.toString()}`;
      console.log("Fetching product rate:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Product rate fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch product rate");
      }
    } catch (error: any) {
      console.error("German Standard Product Rate API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch product rate");
    }
  }

  /**
   * Get Product List - Enhanced with unauthenticated fallback
   */
  public async getProductList(request: ProductListRequest): Promise<any> {
    try {
      // First try with authentication
      let headers: Record<string, string>;
      let authAvailable = false;

      try {
        headers = await this.getAuthHeaders();
        authAvailable = !!headers.Authorization;
        console.log("🔐 Authentication status:", authAvailable ? "Available" : "Not available");
      } catch (authError) {
        console.log("⚠️ Authentication failed, trying without auth:", authError);
        headers = {
          "accept": "*/*",
          "Content-Type": "application/json",
        };
      }

      const params = new URLSearchParams();
      if (request.search) params.append('search', request.search);
      if (request.category !== undefined) params.append('category', request.category.toString());
      if (request.subCategory !== undefined) params.append('subCategory', request.subCategory.toString());
      if (request.brand !== undefined) params.append('itemBrand', request.brand.toString()); // API expects itemBrand, not brand
      if (request.type !== undefined) params.append('type', request.type.toString());
      if (request.pageNumber !== undefined) params.append('pageNumber', request.pageNumber.toString());
      if (request.pageSize !== undefined) params.append('pageSize', request.pageSize.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_PRODUCTS}?${params.toString()}`;
      console.log("🔍 Fetching product list:", url);
      console.log("🔐 Using auth:", authAvailable);

      try {
        const response = await axios.get<ApiResponse>(url, { headers });

        if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
          console.log("✅ Product list fetched successfully with auth:", authAvailable);
          console.log("🔍 Raw API response:", response.data);
          return response.data; // Return full response object, not just result
        } else {
          console.error("❌ API Error Response:", response.data);
          throw new Error(response.data?.message || "Failed to fetch product list");
        }
      } catch (apiError: any) {
        // If we get 401 and we were using auth, try without auth
        if (apiError.response?.status === 401 && authAvailable) {
          console.log("🔄 401 error with auth, retrying without authentication...");

          const unauthHeaders = {
            "accept": "*/*",
            "Content-Type": "application/json",
          };

          const retryResponse = await axios.get<ApiResponse>(url, { headers: unauthHeaders });

          if (retryResponse.data?.status === "Success" && retryResponse.data?.statusCode === 2000) {
            console.log("✅ Product list fetched successfully without auth");
            console.log("🔍 Raw API response:", retryResponse.data);
            return retryResponse.data;
          } else {
            throw new Error(retryResponse.data?.message || "Failed to fetch product list");
          }
        } else {
          // Re-throw the original error if it's not a 401 or we already tried without auth
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error("❌ German Standard Product List API Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch product list");
    }
  }

  /**
   * Get Sub Categories - matches Swagger /tag/getsubcategorybycategory
   */
  public async getSubCategories(request: SubCategoryRequest): Promise<any> {
    try {
      // First try with authentication
      let headers: Record<string, string>;
      let authAvailable = false;

      try {
        headers = await this.getAuthHeaders();
        authAvailable = !!headers.Authorization;
        console.log("🔐 getSubCategories Authentication status:", authAvailable ? "Available" : "Not available");
      } catch (authError) {
        console.log("⚠️ getSubCategories Authentication failed, trying without auth:", authError);
        headers = {
          "accept": "*/*",
          "Content-Type": "application/json",
        };
      }

      const params = new URLSearchParams();
      params.append('category', request.category.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_CATEGORIES}?${params.toString()}`;
      console.log("🔄 Fetching subcategories:", url);
      console.log("🔐 Using auth:", authAvailable);

      try {
        const response = await axios.get<ApiResponse>(url, { headers });

        if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
          console.log("✅ Subcategories fetched successfully with auth:", authAvailable);
          return response.data.result;
        } else {
          throw new Error(response.data?.message || "Failed to fetch subcategories");
        }
      } catch (apiError: any) {
        // If we get 401 and we were using auth, try without auth
        if (apiError.response?.status === 401 && authAvailable) {
          console.log("🔄 401 error with auth, retrying getSubCategories without authentication...");

          const unauthHeaders = {
            "accept": "*/*",
            "Content-Type": "application/json",
          };

          const retryResponse = await axios.get<ApiResponse>(url, { headers: unauthHeaders });

          if (retryResponse.data?.status === "Success" && retryResponse.data?.statusCode === 2000) {
            console.log("✅ Subcategories fetched successfully without auth");
            return retryResponse.data.result;
          } else {
            throw new Error(retryResponse.data?.message || "Failed to fetch subcategories");
          }
        } else {
          // Re-throw the original error if it's not a 401 or we already tried without auth
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error("❌ German Standard Sub Categories API Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch subcategories");
    }
  }

  /**
   * Upsert Address - matches Swagger /tag/upsertaddress
   */
  public async upsertAddress(addressRequest: AddressRequest): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      console.log("Creating/updating address:", addressRequest);

      const response = await axios.post<ApiResponse>(
        API.GERMAN_STANDARD_UPSERT_ADDRESS,
        addressRequest,
        { headers }
      );

      if (response.data?.status === "Success" && response.data?.statusCode === 2001) {
        console.log("Address created/updated successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Address operation failed");
      }
    } catch (error: any) {
      console.error("German Standard Upsert Address API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Address operation failed");
    }
  }

  /**
   * Get Address Details - matches Swagger /tag/getaddressdetails
   */
  public async getAddressDetails(request: { customerId?: number; addressId?: number; be?: number }): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      if (request.customerId !== undefined) params.append('customerId', request.customerId.toString());
      if (request.addressId !== undefined) params.append('addressId', request.addressId.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_GET_ADDRESS_DETAILS}?${params.toString()}`;
      console.log("Fetching address details:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Address details fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch address details");
      }
    } catch (error: any) {
      console.error("German Standard Get Address Details API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch address details");
    }
  }

  /**
   * Get Screens - matches Swagger /user/getscreens
   */
  public async getScreens(request: ScreenRequest = {}): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      if (request.userId !== undefined) params.append('userId', request.userId.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_GET_SCREENS}?${params.toString()}`;
      console.log("Fetching screens:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Screens fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch screens");
      }
    } catch (error: any) {
      console.error("German Standard Get Screens API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch screens");
    }
  }

  /**
   * Get User Action - matches Swagger /user/getuseraction
   */
  public async getUserAction(request: UserActionRequest = {}): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      if (request.userId !== undefined) params.append('userId', request.userId.toString());
      if (request.actionId !== undefined) params.append('actionId', request.actionId.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_GET_USER_ACTION}?${params.toString()}`;
      console.log("Fetching user actions:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("User actions fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch user actions");
      }
    } catch (error: any) {
      console.error("German Standard Get User Action API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch user actions");
    }
  }
}

// Export singleton instance
export const germanStandardApi = GermanStandardApiService.getInstance();

// Export individual functions for easier import - Updated to match Swagger APIs
export const {
  login: germanStandardLogin,
  refreshTokens: germanStandardRefreshTokens,
  getCompany: germanStandardGetCompany,
  getCategories: germanStandardGetCategories,
  getProducts: germanStandardGetProducts,
  getTransactionSummary: germanStandardGetTransactionSummary,
  transformCategoriesForRedux: transformCategoriesForRedux,
  transformProductsForDisplay: transformProductsForDisplay,
  transformTransactionsForDisplay: transformTransactionsForDisplay,
  // Transaction APIs (updated method names)
  upsertOrder: germanStandardUpsertOrder,
  getTransactionDetails: germanStandardGetTransactionDetails,
  deleteTransaction: germanStandardDeleteTransaction,
  // Wishlist API (updated method name)
  upsertWishlist: germanStandardUpsertWishlist,
  getWishlistSummary: germanStandardGetWishlistSummary,
  // Cart API (updated method name)
  upsertCart: germanStandardUpsertCart,
  getCartSummary: germanStandardGetCartSummary,
  // Supporting APIs
  getTagList: germanStandardGetTagList,
  getMasterDetails: germanStandardGetMasterDetails,
  getStock: germanStandardGetStock,
  getProductRate: germanStandardGetProductRate,
  getProductList: germanStandardGetProductList,
  getSubCategories: germanStandardGetSubCategories,
  // New APIs from Swagger
  upsertAddress: germanStandardUpsertAddress,
  getAddressDetails: germanStandardGetAddressDetails,
  getScreens: germanStandardGetScreens,
  getUserAction: germanStandardGetUserAction,
} = germanStandardApi;