import API from "@/config/API";
import { GET, POST } from "@/util/apicall";
// import { storeCategory } from "@/redux/slice/categorySlice";
import { storeCart } from "@/redux/slice/cartSlice";
import { useEffect } from "react";
// import { storeSettings } from "@/redux/slice/settingsSlice";
import { clearReduxData } from "@/lib/clear_redux";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  reduxAccessToken,
  reduxRefreshToken,
  updateTokens,
} from "@/redux/slice/authSlice";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { signOut } from "next-auth/react";
import { germanStandardRefreshTokens } from "@/services/germanStandardApi";
const delay = 10000; //before this time the token will refreshed.

// export const useGetSettings = () => { 
//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         // load site settings
//         const settings: any = await GET(API.SETTINGS);
//         if (settings.status) {
//           dispatch(storeSettings(settings.data));
//         }
//         // load categories
//         let response: any = await GET(API.CATEGORY);
//         if (response?.status) {
//           dispatch(storeCategory(response?.data));
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSettings();
//   // }, [dispatch]);
//   },[])
// };

export const useTokenExpiration = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(reduxAccessToken);
  const refresh = useAppSelector(reduxRefreshToken);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    try {
      const decoded: any = jwtDecode(accessToken);
      let currentDate = new Date();
      
      // Check if token is expired or about to expire (with 10 second buffer)
      const tokenExpiryTime = decoded.exp * 1000;
      const currentTime = currentDate.getTime();
      const timeUntilExpiry = tokenExpiryTime - currentTime;
      
      console.log(`Token expiry check - Current time: ${currentTime}, Token expires: ${tokenExpiryTime}, Time until expiry: ${timeUntilExpiry}ms`);
      
      if (decoded.exp && tokenExpiryTime < currentTime + delay) {
        console.log("Token is expired or about to expire, refreshing...");
        if (!refresh) {
          handleTokenExpiration();
        } else {
          createRefreshToken();
        }
      } else {
        // fetchUser();
        // fetchCartItems();
        
        // Set timer to refresh token 10 seconds before expiry
        if (timeUntilExpiry > delay) {
          console.log(`Setting timer to refresh token in ${timeUntilExpiry - delay}ms`);
          const timer = setTimeout(() => {
            console.log("Timer triggered - refreshing token");
            createRefreshToken();
          }, timeUntilExpiry - delay);

          return () => clearTimeout(timer);
        } else {
          console.log("Token expires too soon, refreshing immediately");
          createRefreshToken();
        }
      }
    } catch (err) {
      console.log("Error in useTokenExpiration:", err);
    }
  }, [accessToken]);

  const createRefreshToken = async () => {
    try {
      if (!refresh) {
        console.log("No refresh token available, logging out");
        handleTokenExpiration();
        return;
      }

      console.log("Attempting to refresh token via German Standard API...");
      const response = await germanStandardRefreshTokens(refresh);
      
      if (response.status === "Success" && response.statusCode === 2000) {
        console.log("Token refresh successful, updating tokens in Redux store");
        message.loading({
          type: "loading",
          content: "Updating User Info..",
          duration: 1,
        });
        dispatch(
          updateTokens({
            token: response.result.accessToken,
            refreshToken: response.result.refreshToken,
          })
        );
        console.log("Tokens refreshed successfully via useTokenExpiration");
      } else {
        console.error("Token refresh failed with response:", response);
        handleTokenExpiration();
      }
    } catch (err) {
      console.error("Token refresh error in useTokenExpiration:", err);
      handleTokenExpiration();
    }
  };

  // const fetchUser = async () => {
  //   const url = API.USER_REFRESH;
  //   try {
  //     const user: any = await GET(url);
  //     if (user?.status && user?.data?.status == true) {
  //       // dispatch(update(user?.data));
  //     } else {
  //       return;
  //     }
  //   } catch (err) {}
  // };

  // const fetchCartItems = async () => {
  //   TODO: Add proper cart API endpoint when available
  //   try {
  //     const url = API.CART_GET_ALL;
  //     const cartItems: any = await GET(url);
  //     if (cartItems.status) {
  //       dispatch(storeCart(cartItems.data));
  //     }
  //   } catch (err) {}
  // };

  const handleTokenExpiration = () => {
    message.warning({
      type: "loading",
      content: "Your Session Has been Expired Please Login Again..",
      duration: 2,
      onClose: async () => {
        await signOut({ callbackUrl: "/" });
        clearReduxData(dispatch);
        // logoutChannel.postMessage("Logout");
      },
    });
  };
};
