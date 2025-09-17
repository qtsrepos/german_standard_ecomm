import { store } from "@/redux/store/store";
import { updateTokens, setRefreshing, clearToken } from "@/redux/slice/authSlice";
import { germanStandardRefreshTokens } from "@/services/germanStandardApi";

/**
 * Utility class for handling token refresh operations
 */
export class TokenRefreshUtil {
  private static refreshPromise: Promise<boolean> | null = null;

  /**
   * Refresh the access token using the refresh token
   * @returns Promise<boolean> - true if refresh was successful, false otherwise
   */
  public static async refreshAccessToken(): Promise<boolean> {
    // If a refresh is already in progress, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      // Clear the promise when done
      this.refreshPromise = null;
    }
  }

  /**
   * Internal method to perform the actual token refresh
   */
  private static async performTokenRefresh(): Promise<boolean> {
    try {
      const state = store.getState();
      const refreshToken = state.Auth?.refreshToken;

      if (!refreshToken) {
        console.warn("No refresh token available");
        return false;
      }

      // Set refreshing state
      store.dispatch(setRefreshing(true));

      // Call the refresh token API
      const response = await germanStandardRefreshTokens(refreshToken);

      if (response.status === "Success" && response.statusCode === 2000) {
        // Update tokens in Redux store
        store.dispatch(updateTokens({
          token: response.result.accessToken,
          refreshToken: response.result.refreshToken
        }));

        console.log("Tokens refreshed successfully");
        return true;
      } else {
        console.error("Token refresh failed:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      
      // If refresh fails, clear tokens and redirect to login
      store.dispatch(clearToken());
      
      // Optionally redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      
      return false;
    } finally {
      // Clear refreshing state
      store.dispatch(setRefreshing(false));
    }
  }

  /**
   * Check if the current access token is expired or about to expire
   * @param token - JWT token to check
   * @param bufferMinutes - Buffer time in minutes before expiry (default: 5)
   * @returns boolean - true if token is expired or about to expire
   */
  public static isTokenExpired(token: string, bufferMinutes: number = 5): boolean {
    try {
      if (!token) return true;

      // Remove quotes if present
      const cleanToken = token.replace(/"/g, '');
      
      // Decode JWT payload (without verification for client-side check)
      const payload = JSON.parse(atob(cleanToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = payload.exp;
      const bufferTime = bufferMinutes * 60; // Convert to seconds

      return currentTime >= (expiryTime - bufferTime);
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return true; // Assume expired if we can't parse
    }
  }

  /**
   * Get the current access token (no refresh logic)
   * @returns Promise<string | null> - current access token or null if not available
   */
  public static async getValidAccessToken(): Promise<string | null> {
    const state = store.getState();
    const accessToken = state.Auth?.token;

    if (!accessToken) {
      return null;
    }

    // Just return the current token - let the API call handle 401 errors
    return accessToken;
  }

  /**
   * Setup automatic token refresh on a timer
   * @param intervalMinutes - Interval in minutes to check for token expiry (default: 10)
   */
  public static setupAutoRefresh(intervalMinutes: number = 10): void {
    if (typeof window === "undefined") return;

    setInterval(async () => {
      const state = store.getState();
      const accessToken = state.Auth?.token;
      const isRefreshing = state.Auth?.isRefreshing;

      // Skip if no token or already refreshing
      if (!accessToken || isRefreshing) {
        return;
      }

      // Check if token needs refresh
      if (this.isTokenExpired(accessToken)) {
        console.log("Auto-refreshing token...");
        await this.refreshAccessToken();
      }
    }, intervalMinutes * 60 * 1000); // Convert to milliseconds
  }
}

// Export convenience functions
export const refreshAccessToken = TokenRefreshUtil.refreshAccessToken;
export const isTokenExpired = TokenRefreshUtil.isTokenExpired;
export const getValidAccessToken = TokenRefreshUtil.getValidAccessToken;
export const setupAutoRefresh = TokenRefreshUtil.setupAutoRefresh;
