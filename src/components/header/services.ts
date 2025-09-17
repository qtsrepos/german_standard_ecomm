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
import { signOut, useSession } from "next-auth/react";
// Removed unused imports and variables

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
  console.log("useTokenExpiration mounted ✅");
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const accessToken = useAppSelector(reduxAccessToken);
  const refreshToken = useAppSelector(reduxRefreshToken);

  // Sync tokens from NextAuth session to Redux if available
  useEffect(() => {
    if (status === "authenticated" && session?.token && session?.refreshToken) {
      // Only update if Redux doesn't have tokens or they're different
      if (!accessToken || !refreshToken || 
          accessToken !== session.token || 
          refreshToken !== session.refreshToken) {
        console.log("Syncing tokens from NextAuth session to Redux");
        dispatch(updateTokens({
          token: session.token,
          refreshToken: session.refreshToken,
        }));
      }
    }
  }, [session?.token, session?.refreshToken, status, dispatch, accessToken, refreshToken]);

  // Check if token is expired and log out if so
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    
    try {
      const decoded: any = jwtDecode(accessToken);
      const currentTime = Date.now();
      const expiryTime = decoded.exp * 1000; // convert to ms
      const timeUntilExpiry = expiryTime - currentTime;

      console.log(
        `⏳ Checking token expiry → now=${currentTime}, exp=${expiryTime}, timeUntilExpiry=${timeUntilExpiry}`
      );
      
      // If already expired, log out immediately
      if (timeUntilExpiry <= 0) {
        console.log("⚠️ Token expired → logging out...");
        handleTokenExpiration();
      }
    } catch (err) {
      console.error("❌ Error decoding token:", err);
      handleTokenExpiration();
    }
  }, [accessToken]);

  const handleTokenExpiration = () => {
    message.warning({
      content: "Your session has expired. Please login again.",
      duration: 2,
      onClose: async () => {
        await signOut({ callbackUrl: "/login" });
        clearReduxData(dispatch);
      },
    });
  };
};
