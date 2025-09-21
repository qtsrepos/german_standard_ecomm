import { clearToken } from "@/redux/slice/authSlice";
// Removed legacy cartSlice import

export const clearReduxData = (dispatch: any) => {
  // Removed legacy clearCart dispatch
  dispatch(clearToken());
};
