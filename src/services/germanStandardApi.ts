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
    category?: number,
    subCategory?: number
  ): Promise<{ products: ProductData[]; totalRows: number; totalPages: number }> {
    try {
      const headers = await this.getAuthHeaders();
      
      // Build the URL with query parameters
      let url = `${API.GERMAN_STANDARD_PRODUCTS}?refreshFlag=${refreshFlag}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
      
      if (category !== undefined && category !== null) {
        url += `&category=${category}`;
      }
      
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

  // ===== ORDERS API METHODS =====

  /**
   * Upsert Order (Insert or Update Order) - matches Swagger /gsgtransaction/upsertorder
   */
  public async upsertOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      console.log("Creating/updating order:", orderRequest);

      const response = await axios.post<OrderResponse>(
        API.GERMAN_STANDARD_UPSERT_ORDER,
        orderRequest,
        { headers }
      );

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Order created/updated successfully:", response.data.result);
        return response.data;
      } else {
        throw new Error(response.data?.message || "Order operation failed");
      }
    } catch (error: any) {
      console.error("German Standard Order API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Order operation failed");
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

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
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

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
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
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_STOCK}?${params.toString()}`;
      console.log("Fetching stock balance:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Stock balance fetched successfully");
        return response.data.result;
      } else {
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
   * Get Product List
   */
  public async getProductList(request: ProductListRequest): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      if (request.search) params.append('search', request.search);
      if (request.category !== undefined) params.append('category', request.category.toString());
      if (request.subCategory !== undefined) params.append('subCategory', request.subCategory.toString());
      if (request.brand !== undefined) params.append('brand', request.brand.toString());
      if (request.type !== undefined) params.append('type', request.type.toString());
      if (request.pageNumber !== undefined) params.append('pageNumber', request.pageNumber.toString());
      if (request.pageSize !== undefined) params.append('pageSize', request.pageSize.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_PRODUCTS}?${params.toString()}`;
      console.log("Fetching product list:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Product list fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch product list");
      }
    } catch (error: any) {
      console.error("German Standard Product List API Error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch product list");
    }
  }

  /**
   * Get Sub Categories - matches Swagger /tag/getsubcategorybycategory
   */
  public async getSubCategories(request: SubCategoryRequest): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const params = new URLSearchParams();
      params.append('category', request.category.toString());
      if (request.be !== undefined) params.append('be', request.be.toString());

      const url = `${API.GERMAN_STANDARD_CATEGORIES}?${params.toString()}`;
      console.log("Fetching subcategories:", url);

      const response = await axios.get<ApiResponse>(url, { headers });

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
        console.log("Subcategories fetched successfully");
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Failed to fetch subcategories");
      }
    } catch (error: any) {
      console.error("German Standard Sub Categories API Error:", error);
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

      if (response.data?.status === "Success" && response.data?.statusCode === 2000) {
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