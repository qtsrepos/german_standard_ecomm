export function getAllVaraints(productVariant: any) {
  const variantsMap: any = {};
  productVariant?.forEach((item: any) => {
    item?.combination?.forEach((combo: any) => {
      if (!variantsMap[combo?.variant]) {
        variantsMap[combo?.variant] = new Set();
      }
      variantsMap[combo?.variant].add(combo?.value);
    });
  });
  const result = Object.keys(variantsMap).map((variant) => {
    return {
      variant: variant,
      values: Array.from(variantsMap[variant]),
    };
  });

  return result;
}

export function findVariantWithId(productVariant: any, id: any) {
  const variant = productVariant?.find((item: any) => item?.id == id);
  return variant;
}
export const getCurrentVaraintValue = (
  data: any
): { variant: string; value: string }[] => {
  return data?.combination?.map((item: any) => ({
    variant: item?.variant,
    value: item?.value,
  }));
};

// Enhanced metadata interface for optimization decisions
export interface ProductDataMetadata {
  source: 'german_standard_api' | 'individual_params' | 'minimal_id_only' | 'component_state' | 'unknown';
  fetchedAt?: string;
  passedAt?: string;
  dataAge?: number;
  isFreshData: boolean;
  hasCurrentStock: boolean;
  hasCurrentRates: boolean;
  currentStock?: any;
  currentRates?: any[];
  currentBestRate?: any;
  searchQuery?: string;
  pageInfo?: any;
}

// Enhanced product data standardization interface
export interface StandardizedProduct {
  id: number | string;
  pid: number | string; // For backward compatibility
  Id: number; // German Standard API format
  name: string;
  Name: string; // German Standard API format
  description?: string;
  Description?: string; // German Standard API format
  image?: string;
  Image?: string; // German Standard API format
  code?: string;
  Code?: string; // German Standard API format
  price?: number;
  retail_rate?: number;
  unit?: number;
  productVariant?: any[];
  productImages?: any[];

  // Enhanced: Metadata for optimization decisions
  _metadata?: ProductDataMetadata;

  // Enhanced: Support for additional German Standard API fields
  ExtraDescription?: string;
  extraDescription?: string;

  // Allow any additional properties for extensibility
  [key: string]: any;
}

/**
 * Intelligently determines product status based on available data
 * Handles multiple data sources and provides sensible defaults
 */
export function determineProductStatus(productData: any): boolean {
  // If status is explicitly provided and is boolean, use it
  if (typeof productData.status === 'boolean') {
    return productData.status;
  }

  // If status is explicitly provided as string "true"/"false"
  if (typeof productData.status === 'string') {
    return productData.status.toLowerCase() === 'true';
  }

  // For German Standard API products (they have Id/Name but no status field)
  if ((productData.Id || productData.Name) && productData.status === undefined) {
    // German Standard API returns available products, so default to true
    // But check if there's stock information available
    const hasStock = productData.unit > 0;
    const hasCurrentStock = productData._metadata?.currentStock?.unit > 0;

    // If we have stock information, use it to determine status
    if (productData.unit !== undefined || productData._metadata?.currentStock) {
      return hasStock || hasCurrentStock;
    }

    // If no stock info but product exists in German Standard API, assume available
    return true;
  }

  // For legacy products, check various status indicators
  if (productData.inStock !== undefined) {
    return productData.inStock;
  }

  if (productData.available !== undefined) {
    return productData.available;
  }

  // Check if product has stock (unit > 0 means available)
  if (productData.unit !== undefined) {
    return productData.unit > 0;
  }

  // Default to true if we have basic product information (id, name)
  if (productData.id || productData.Id || productData.name || productData.Name) {
    return true;
  }

  // Last resort: default to false for safety
  return false;
}

/**
 * Enhanced standardizes product data structure to ensure consistent access across components
 * Supports both German Standard API format and legacy formats
 * Now includes metadata preservation and extended field support
 */
export function standardizeProductData(productData: any): StandardizedProduct {
  if (!productData) return {} as StandardizedProduct;

  const id = productData.Id || productData.id || productData.pid;

  const standardized: StandardizedProduct = {
    // IDs - ensure all formats are available
    id: id,
    pid: id,
    Id: Number(id),

    // Names - ensure both formats are available
    name: productData.Name || productData.name || '',
    Name: productData.Name || productData.name || '',

    // Descriptions - enhanced with ExtraDescription support
    description: productData.Description || productData.description || '',
    Description: productData.Description || productData.description || '',
    extraDescription: productData.ExtraDescription || productData.extraDescription || '',
    ExtraDescription: productData.ExtraDescription || productData.extraDescription || '',

    // Images
    image: productData.Image || productData.image || '',
    Image: productData.Image || productData.image || '',

    // Codes
    code: productData.Code || productData.code || '',
    Code: productData.Code || productData.code || '',

    // Pricing
    price: productData.price || 0,
    retail_rate: productData.retail_rate || 0,

    // Stock
    unit: productData.unit || 0,

    // ✅ FIX: Add status field with intelligent determination
    status: determineProductStatus(productData),

    // Variants and Images
    productVariant: productData.productVariant || [],
    productImages: productData.productImages || [],

    // Copy any other existing properties (preserves additional German Standard API fields)
    ...productData
  };

  // Enhanced: Preserve metadata if it exists
  if (productData._metadata) {
    standardized._metadata = productData._metadata;
  }

  return standardized;
}

/**
 * Gets the standardized product ID from any product data format
 */
export function getProductId(productData: any): number | string | null {
  return productData?.Id || productData?.id || productData?.pid || null;
}

/**
 * Gets the standardized product ID from any product data format, ensuring it's not null
 * Throws an error if no valid ID is found
 */
export function getProductIdSafe(productData: any): number {
  const id = getProductId(productData);
  if (!id) {
    throw new Error('No valid product ID found');
  }
  return typeof id === 'string' ? parseInt(id, 10) : id;
}
