"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { TokenRefreshUtil } from "@/util/tokenRefresh";

const TokenRefreshHandler = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Setup automatic token refresh only when user is authenticated
    if (status === "authenticated" && session?.token) {
      console.log("Setting up automatic token refresh...");

      // Setup auto-refresh every 25 minutes (5 minutes before 30-minute expiry)
      TokenRefreshUtil.setupAutoRefresh(25);

      // Also check immediately if token needs refresh
      const checkAndRefresh = async () => {
        if (TokenRefreshUtil.isTokenExpired(session.token)) {
          console.log("Token expired on page load, regenerating...");
          await TokenRefreshUtil.refreshAccessToken();
        }
      };

      checkAndRefresh();
    }
  }, [status, session]);

  // This component doesn't render anything
  return null;
};

export default TokenRefreshHandler;
