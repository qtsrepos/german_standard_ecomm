import API from "@/config/API";
import { GET, POST } from "@/util/apicall";
// import { storeCategory } from "@/redux/slice/categorySlice";
import { storeCart } from "@/redux/slice/cartSlice";
import { useEffect, useState } from "react";
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

  // ✅ FIX: Add debounce and cooldown to prevent excessive token checks
  const [lastTokenCheck, setLastTokenCheck] = useState<number>(0);
  const [tokenCheckInProgress, setTokenCheckInProgress] = useState<boolean>(false);
  const TOKEN_CHECK_COOLDOWN = 30000; // 30 seconds between checks

  // ✅ IMPROVED: Enhanced token synchronization with better validation
  useEffect(() => {
    if (status === "authenticated" && session?.token && session?.refreshToken) {
      // Validate session tokens before syncing
      const sessionToken = session.token;
      const sessionRefreshToken = session.refreshToken;

      // Check if tokens are valid JWT format
      const isValidJWT = (token: string) => {
        try {
          return token && typeof token === 'string' && token.split('.').length === 3;
        } catch {
          return false;
        }
      };

      if (!isValidJWT(sessionToken)) {
        console.warn("⚠️ Invalid session token format, skipping sync");
        return;
      }

      // Only update if Redux doesn't have tokens or they're different
      if (!accessToken || !refreshToken ||
          accessToken !== sessionToken ||
          refreshToken !== sessionRefreshToken) {
        console.log("🔄 Syncing validated tokens from NextAuth session to Redux");
        dispatch(updateTokens({
          token: sessionToken,
          refreshToken: sessionRefreshToken,
        }));
      }
    } else if (status === "unauthenticated" && (accessToken || refreshToken)) {
      // Clear Redux tokens if session is unauthenticated but Redux still has tokens
      console.log("🧹 Clearing Redux tokens for unauthenticated session");
      dispatch(updateTokens({
        token: "",
        refreshToken: "",
      }));
    }
  }, [session?.token, session?.refreshToken, status, dispatch, accessToken, refreshToken]);

  // ✅ IMPROVED: Debounced token expiry check with enhanced error handling
  useEffect(() => {
    if (!accessToken || status !== "authenticated") {
      return;
    }

    // Check if we're already in the process of logging out
    if (localStorage.getItem('logout-in-progress') === 'true') {
      return;
    }

    // ✅ FIX: Implement cooldown to prevent excessive checks
    const now = Date.now();
    if (tokenCheckInProgress || (now - lastTokenCheck < TOKEN_CHECK_COOLDOWN)) {
      console.log("⏸️ Token check skipped - cooldown active");
      return;
    }

    setTokenCheckInProgress(true);
    setLastTokenCheck(now);

    try {
      // Enhanced token validation before decoding
      if (typeof accessToken !== 'string' || !accessToken.trim()) {
        console.warn("⚠️ Invalid token type or empty token");
        setTokenCheckInProgress(false);
        return;
      }

      // Validate JWT format (should have 3 parts)
      const tokenParts = accessToken.split('.');
      if (tokenParts.length !== 3) {
        console.error("❌ Invalid JWT format - token does not have 3 parts:", tokenParts.length);
        setTokenCheckInProgress(false);
        return;
      }

      const decoded: any = jwtDecode(accessToken);
      const currentTime = Date.now();
      const expiryTime = decoded.exp * 1000; // convert to ms
      const timeUntilExpiry = expiryTime - currentTime;

      console.log(
        `⏳ Token expiry check → now=${currentTime}, exp=${expiryTime}, timeUntilExpiry=${Math.round(timeUntilExpiry/1000)}s`
      );

      // ✅ IMPROVED: Extended grace period and better network detection
      const gracePeriod = 2 * 60 * 1000; // 2 minutes to handle network delays and API slowdowns
      const warningPeriod = 10 * 60 * 1000; // 10 minutes warning

      // Only log out if token is expired by more than the grace period
      if (timeUntilExpiry < -gracePeriod) {
        console.log("⚠️ Token expired beyond grace period → logging out...");
        handleTokenExpiration();
      } else if (timeUntilExpiry <= 0) {
        console.log("⚠️ Token expired but within grace period → monitoring...");
        // Set a longer timeout to check again after the grace period
        const timeoutId = setTimeout(() => {
          const newTimeUntilExpiry = (decoded.exp * 1000) - Date.now();
          if (newTimeUntilExpiry < -gracePeriod && status === "authenticated") {
            console.log("⚠️ Grace period expired → logging out...");
            handleTokenExpiration();
          }
        }, gracePeriod + 5000); // Check 5 seconds after grace period ends

        // Cleanup timeout if component unmounts
        return () => clearTimeout(timeoutId);
      } else if (timeUntilExpiry < warningPeriod) {
        // Token expires soon - log but don't take action yet
        console.log(`⏰ Token expires in ${Math.round(timeUntilExpiry/(60*1000))} minutes`);
      }

      setTokenCheckInProgress(false);
    } catch (err) {
      console.error("❌ Error decoding token:", err);
      setTokenCheckInProgress(false);

      // ✅ IMPROVED: Better error differentiation
      if (status === "authenticated" && session?.token) {
        console.log("⚠️ Token decode error with authenticated session - checking session consistency");

        // Check if session token matches Redux token
        if (session.token !== accessToken) {
          console.log("🔄 Session-Redux token mismatch detected, re-syncing...");
          // Re-sync tokens instead of logging out immediately
          dispatch(updateTokens({
            token: session.token,
            refreshToken: session.refreshToken || refreshToken || "",
          }));
        } else {
          // Wait longer before logging out to avoid race conditions
          setTimeout(() => {
            if (status === "authenticated" && tokenCheckInProgress === false) {
              console.log("⚠️ Persistent token decode error → logging out...");
              handleTokenExpiration();
            }
          }, 5000); // 5 second delay
        }
      }
    }
  }, [accessToken, status, lastTokenCheck, tokenCheckInProgress]);

  // ✅ NEW: Session consistency checker
  const checkSessionConsistency = () => {
    if (status === "loading") return true; // Skip checks during loading

    // Check if NextAuth and Redux are in sync
    const hasNextAuthSession = status === "authenticated" && session?.token;
    const hasReduxTokens = accessToken && refreshToken;

    if (hasNextAuthSession && !hasReduxTokens) {
      console.log("🔄 NextAuth has session but Redux missing tokens - syncing...");
      dispatch(updateTokens({
        token: session.token,
        refreshToken: session.refreshToken || "",
      }));
      return true;
    }

    if (!hasNextAuthSession && hasReduxTokens) {
      console.log("🧹 Redux has tokens but NextAuth session missing - clearing Redux...");
      dispatch(updateTokens({
        token: "",
        refreshToken: "",
      }));
      return true;
    }

    // Check for token mismatch
    if (hasNextAuthSession && hasReduxTokens && session.token !== accessToken) {
      console.log("⚠️ Token mismatch detected - prioritizing NextAuth session");
      dispatch(updateTokens({
        token: session.token,
        refreshToken: session.refreshToken || refreshToken,
      }));
      return true;
    }

    return false; // No inconsistencies found
  };

  // ✅ IMPROVED: Enhanced token expiration handler with recovery
  const handleTokenExpiration = () => {
    // Prevent multiple logout calls
    if (localStorage.getItem('logout-in-progress') === 'true') {
      return;
    }

    // Last attempt at session recovery
    const recoverySuccessful = checkSessionConsistency();
    if (recoverySuccessful) {
      console.log("✅ Session recovery attempted - giving one more chance");
      return; // Don't logout if we potentially fixed the issue
    }

    localStorage.setItem('logout-in-progress', 'true');

    message.warning({
      content: "Your session has expired. Please login again.",
      duration: 3, // Slightly longer duration
      onClose: async () => {
        try {
          console.log("🚪 Logging out due to session expiration");
          await signOut({ callbackUrl: "/login" });
          clearReduxData(dispatch);
        } finally {
          localStorage.removeItem('logout-in-progress');
        }
      },
    });
  };

  // ✅ NEW: Recovery check on status changes
  useEffect(() => {
    checkSessionConsistency();
  }, [status]); // Only run when NextAuth status changes
};
