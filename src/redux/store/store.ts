import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { CartSlice } from "@/redux/slice/cartSlice";
import { SettingsSlice } from "@/redux/slice/settingsSlice";
import { CategorySlice } from "@/redux/slice/categorySlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "@/redux/storage";
import { LocationSlice } from "@/redux/slice/locationSlice";
import { LanguageSlice } from "@/redux/slice/languageSlice";
import { AuthSlice } from "@/redux/slice/authSlice";
import Checkout from "@/app/(screens)/checkout/page";
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";
import { CheckoutSlice } from "@/redux/slice/checkoutSlice";
import { FavoritesSlice } from "../slice/favouriteSlice";
import { LocalCartSlice } from "../slice/localcartSlice";
import { WishlistSlice } from "../slice/wishlistSlice";
import { OrdersSlice } from "../slice/ordersSlice";
import { ProductsSlice } from "../slice/productsSlice";


const rootReducer = combineSlices(
  CartSlice,
  CategorySlice,
  SettingsSlice,
  LocationSlice,
  LanguageSlice,
  AuthSlice,
  CheckoutSlice,
  FavoritesSlice,
  LocalCartSlice,
  WishlistSlice,
  OrdersSlice,
  ProductsSlice
 

);

const persistConfig = {
  key: "nextme-nextjs",
  storage,
  whitelist: ["Cart", "Category", "Settings", "Location", "Language", "Auth","Checkout","LocalCart","Wishlist","Orders","Products"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat();
    },
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

let storeInstance: ReturnType<typeof makeStore> | null = null;

const initializeStore = () => {
  if (!storeInstance) {
    storeInstance = makeStore();
  }
  return storeInstance;
};

const { store, persistor } = initializeStore();

export { store, persistor, initializeStore };

export type AppStore = ReturnType<typeof makeStore>["store"];
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
