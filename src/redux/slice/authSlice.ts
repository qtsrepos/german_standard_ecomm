import { PayloadAction, ReducerCreators } from "@reduxjs/toolkit";
import { createAppSlice } from "@/redux/createSlices";
interface initialState {
  token: string | null;
  refreshToken: string | null;
  isRefreshing: boolean;
}
const initialState: initialState = {
  token: null,
  refreshToken: null,
  isRefreshing: false,
};
export const AuthSlice = createAppSlice({
  name: "Auth",
  initialState,
  reducers: {
    storeToken: (state: initialState, action: PayloadAction<initialState>) => {
      state.token = action.payload?.token;
      state.refreshToken = action?.payload.refreshToken;
    },
    updateTokens: (state: initialState, action: PayloadAction<{token: string; refreshToken: string}>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setRefreshing: (state: initialState, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    clearToken: (state: initialState) => {
      state.token = null;
      state.refreshToken = null;
      state.isRefreshing = false;
    },
  },
  selectors: {
    reduxRefreshToken: (state: initialState) => state?.refreshToken,
    reduxAccessToken: (state: initialState) => state?.token,
    isRefreshing: (state: initialState) => state?.isRefreshing,
  },
});

export const { storeToken, updateTokens, setRefreshing, clearToken } = AuthSlice.actions;
export const { reduxAccessToken, reduxRefreshToken, isRefreshing } = AuthSlice.selectors;
