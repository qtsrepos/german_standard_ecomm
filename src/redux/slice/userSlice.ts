import { createSlice } from "@reduxjs/toolkit";
const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    user: {},
    auth: false,
  },
  reducers: {
    login: (state: any, action) => {
      state.user = action.payload;
      state.auth = true;
    },
    logout: (state, action) => {
      state.user = {};
      state.auth = false;
    },
    update: (state: any, action) => {
      state.user.data = action.payload;
    },
  },
});

export const { login, logout, update } = AuthSlice.actions;
export default AuthSlice.reducer;
