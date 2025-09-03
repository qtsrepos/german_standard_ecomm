import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const FavoritesSlice = createSlice({
  name: "Favorites",
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = Number(action.payload);
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { increment, decrement, setCount, reset } = FavoritesSlice.actions;
export default FavoritesSlice.reducer;