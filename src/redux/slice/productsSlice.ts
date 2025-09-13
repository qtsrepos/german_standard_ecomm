import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/redux/createSlices";

interface Product {
  Id: number;
  Name: string | null;
  Code: string | null;
  Description: string | null;
  ExtraDescription: string | null;
  Image: string | null;
  Price?: number;
  OriginalPrice?: number;
  Discount?: number;
  InStock?: boolean;
  Category?: number;
  SubCategory?: number;
  Brand?: number;
  Type?: number;
  Rate?: number;
  Stock?: number;
  Units?: any[];
}

interface ProductFilters {
  search?: string;
  category?: number;
  subCategory?: number;
  brand?: number;
  type?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  categories: any[];
  brands: any[];
  types: any[];
  units: any[];
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  categories: [],
  brands: [],
  types: [],
  units: [],
  filters: {},
  loading: false,
  error: null,
  totalProducts: 0,
  currentPage: 1,
  totalPages: 0,
};

export const ProductsSlice = createAppSlice({
  name: "Products",
  initialState,
  reducers: {
    setLoading: (state: ProductsState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: ProductsState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    storeProducts: (state: ProductsState, action: PayloadAction<{ products: Product[]; totalProducts: number; totalPages: number; currentPage: number }>) => {
      state.products = action.payload.products;
      state.totalProducts = action.payload.totalProducts;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    addProduct: (state: ProductsState, action: PayloadAction<Product>) => {
      const existingIndex = state.products.findIndex(p => p.Id === action.payload.Id);
      if (existingIndex >= 0) {
        state.products[existingIndex] = action.payload;
      } else {
        state.products.push(action.payload);
      }
    },
    setCurrentProduct: (state: ProductsState, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    updateProduct: (state: ProductsState, action: PayloadAction<{ id: number; updates: Partial<Product> }>) => {
      const product = state.products.find(p => p.Id === action.payload.id);
      if (product) {
        Object.assign(product, action.payload.updates);
      }
      if (state.currentProduct?.Id === action.payload.id) {
        Object.assign(state.currentProduct, action.payload.updates);
      }
    },
    setCategories: (state: ProductsState, action: PayloadAction<any[]>) => {
      state.categories = action.payload;
    },
    setBrands: (state: ProductsState, action: PayloadAction<any[]>) => {
      state.brands = action.payload;
    },
    setTypes: (state: ProductsState, action: PayloadAction<any[]>) => {
      state.types = action.payload;
    },
    setUnits: (state: ProductsState, action: PayloadAction<any[]>) => {
      state.units = action.payload;
    },
    setFilters: (state: ProductsState, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state: ProductsState) => {
      state.filters = {};
    },
    clearProducts: (state: ProductsState) => {
      state.products = [];
      state.currentProduct = null;
      state.totalProducts = 0;
      state.currentPage = 1;
      state.totalPages = 0;
      state.error = null;
    },
  },
  selectors: {
    reduxProducts: (products: ProductsState) => products?.products,
    reduxCurrentProduct: (products: ProductsState) => products.currentProduct,
    reduxCategories: (products: ProductsState) => products.categories,
    reduxBrands: (products: ProductsState) => products.brands,
    reduxTypes: (products: ProductsState) => products.types,
    reduxUnits: (products: ProductsState) => products.units,
    reduxFilters: (products: ProductsState) => products.filters,
    reduxProductsLoading: (products: ProductsState) => products.loading,
    reduxProductsError: (products: ProductsState) => products.error,
    reduxTotalProducts: (products: ProductsState) => products.totalProducts,
    reduxCurrentPage: (products: ProductsState) => products.currentPage,
    reduxTotalPages: (products: ProductsState) => products.totalPages,
  },
});

export const { 
  setLoading, 
  setError, 
  storeProducts, 
  addProduct, 
  setCurrentProduct, 
  updateProduct,
  setCategories,
  setBrands,
  setTypes,
  setUnits,
  setFilters,
  clearFilters,
  clearProducts
} = ProductsSlice.actions;

export const { 
  reduxProducts, 
  reduxCurrentProduct, 
  reduxCategories, 
  reduxBrands, 
  reduxTypes, 
  reduxUnits, 
  reduxFilters,
  reduxProductsLoading, 
  reduxProductsError, 
  reduxTotalProducts,
  reduxCurrentPage,
  reduxTotalPages
} = ProductsSlice.selectors;

