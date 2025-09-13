import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/redux/createSlices";

interface OrderItem {
  product: number;
  qty: number;
  rate: number;
  unit: number;
  vat?: number;
  addcharges?: number;
  discount?: number;
  discountAmt?: number;
  remarks?: string;
}

interface Order {
  transId: number;
  docNo: string;
  date: string;
  status: string;
  totalAmount: number;
  customer: number;
  deliveryAddress?: string;
  remarks?: string;
  items: OrderItem[];
  details?: any;
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  totalOrders: number;
  currentPage: number;
  totalPages: number;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  totalOrders: 0,
  currentPage: 1,
  totalPages: 0,
};

export const OrdersSlice = createAppSlice({
  name: "Orders",
  initialState,
  reducers: {
    setLoading: (state: OrdersState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: OrdersState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    storeOrders: (state: OrdersState, action: PayloadAction<{ orders: Order[]; totalOrders: number; totalPages: number; currentPage: number }>) => {
      state.orders = action.payload.orders;
      state.totalOrders = action.payload.totalOrders;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    addOrder: (state: OrdersState, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.totalOrders += 1;
    },
    updateOrder: (state: OrdersState, action: PayloadAction<{ transId: number; updates: Partial<Order> }>) => {
      const order = state.orders.find(order => order.transId === action.payload.transId);
      if (order) {
        Object.assign(order, action.payload.updates);
      }
    },
    removeOrder: (state: OrdersState, action: PayloadAction<number>) => {
      state.orders = state.orders.filter(order => order.transId !== action.payload);
      state.totalOrders = Math.max(0, state.totalOrders - 1);
    },
    setCurrentOrder: (state: OrdersState, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearOrders: (state: OrdersState) => {
      state.orders = [];
      state.currentOrder = null;
      state.totalOrders = 0;
      state.currentPage = 1;
      state.totalPages = 0;
      state.error = null;
    },
    updateOrderDetails: (state: OrdersState, action: PayloadAction<{ transId: number; details: any }>) => {
      const order = state.orders.find(order => order.transId === action.payload.transId);
      if (order) {
        order.details = action.payload.details;
      }
      if (state.currentOrder?.transId === action.payload.transId) {
        state.currentOrder.details = action.payload.details;
      }
    },
  },
  selectors: {
    reduxOrders: (orders: OrdersState) => orders?.orders,
    reduxCurrentOrder: (orders: OrdersState) => orders.currentOrder,
    reduxOrdersLoading: (orders: OrdersState) => orders.loading,
    reduxOrdersError: (orders: OrdersState) => orders.error,
    reduxTotalOrders: (orders: OrdersState) => orders.totalOrders,
    reduxCurrentPage: (orders: OrdersState) => orders.currentPage,
    reduxTotalPages: (orders: OrdersState) => orders.totalPages,
  },
});

export const { 
  setLoading, 
  setError, 
  storeOrders, 
  addOrder, 
  updateOrder, 
  removeOrder, 
  setCurrentOrder,
  clearOrders,
  updateOrderDetails
} = OrdersSlice.actions;

export const { 
  reduxOrders, 
  reduxCurrentOrder, 
  reduxOrdersLoading, 
  reduxOrdersError, 
  reduxTotalOrders,
  reduxCurrentPage,
  reduxTotalPages
} = OrdersSlice.selectors;

