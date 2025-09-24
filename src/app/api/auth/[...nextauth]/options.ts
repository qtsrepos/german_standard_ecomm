/**
 * NextAuth Configuration
 *
 * This file configures NextAuth.js for authentication in the German Standard e-commerce application.
 * It uses the German Standard API for user authentication and creates JWT-based sessions.
 *
 * Features:
 * - Credentials provider for email/password login
 * - Integration with German Standard API
 * - JWT session management
 * - Type-safe user data handling
 * - Proper error handling and validation
 */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { germanStandardApi, LoginRequest } from "@/services/germanStandardApi";
import { TokenRefreshUtil } from "@/util/tokenRefresh";
import API from "@/config/API";

// Type definitions for better type safety
interface UserData {
  UserId: number;
  LoginName: string;
  Role: string;
  [key: string]: any;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  token: string;
  refreshToken: string;
  tokenExpiryMin: number;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: boolean;
  };
}

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: "/login",
    signOut: "/signout",
    error: "/login", // Redirect to login on auth errors
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {
          type: "text",
        },
        password: {
          type: "password",
        },
        entityId: {
          type: "text",
        },
        channelId: {
          type: "text",
        },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          // Validate required credentials
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          // Prepare login data with proper typing
          const loginData: LoginRequest = {
            loginName: credentials.email,
            password: credentials.password,
            entityId: parseInt(credentials.entityId || "1"),
            channelId: parseInt(credentials.channelId || "1"),
          };

          // Call German Standard API
          console.log("🔐 Attempting login with:", {
            loginName: loginData.loginName,
            entityId: loginData.entityId,
            channelId: loginData.channelId,
            baseUrl: API.BASE_URL
          });

          const response = await germanStandardApi.login(loginData);

          console.log("🔐 Login API Response:", {
            status: response?.status,
            statusCode: response?.statusCode,
            message: response?.message,
            hasResult: !!response?.result,
            userDataType: typeof response?.result?.userData
          });

          // Validate response
          if (response?.status !== "Success" || response?.statusCode !== 2000) {
            console.error("❌ Login failed:", response?.message);
            throw new Error(response?.message || "Login failed");
          }

          // Parse user data from the response
          let userDataArray: UserData[];
          try {
            const userDataString = response.result.userData;
            console.log("🔐 User data string:", userDataString.substring(0, 200) + "...");

            if (typeof userDataString === 'string') {
              userDataArray = JSON.parse(userDataString);
            } else {
              userDataArray = userDataString;
            }

            if (!Array.isArray(userDataArray) || userDataArray.length === 0) {
              throw new Error("Invalid user data received");
            }
          } catch (parseError) {
            console.error("❌ Failed to parse user data:", parseError);
            throw new Error("Invalid user data format received from API");
          }

          const userData: UserData = userDataArray[0];
          const accessToken = response.result.accessToken.replace(/"/g, '');
          const refreshToken = response.result.refreshToken.replace(/"/g, '');

          console.log("✅ Login successful for user:", userData.LoginName);

          return {
            id: userData.UserId.toString(),
            name: userData.LoginName,
            email: credentials.email,
            role: userData.Role || "user",
            status: true,
            token: accessToken,
            refreshToken: refreshToken,
            tokenExpiryMin: response.result.tokenExpiryMin,
            data: {
              id: userData.UserId.toString(),
              name: userData.LoginName,
              email: credentials.email,
              role: userData.Role || "user",
              status: true,
            },
          };
        } catch (error: any) {
          console.error("German Standard Login Error:", error);
          throw new Error(error.message || "Login Failed. Please check your credentials.");
        }
      },
    }),
    // CredentialsProvider<any>({
    //   id: "google",
    //   name: "ID Token",
    //   credentials: {
    //     idToken: {
    //       idToken: "idToken",
    //       type: "text",
    //     },
    //   },
    //   async authorize(credentials): Promise<any> {
    //     try {
    //       const response = await axios.post(
    //         API.BASE_URL + API.LOGIN_GMAIL,
    //         credentials,
    //         { headers: { "Content-Type": "application/json" } }
    //       );
    //       return response.data;
    //     } catch (error: any) {
    //       throw new Error(error?.response?.data?.message || "Login Failed.");
    //     }
    //   },
    // }),
    // CredentialsProvider<any>({
    //   id: "phone",
    //   name: "Phone Login",
    //   credentials: {
    //     idToken: {
    //       idToken: "idToken",
    //       type: "text",
    //     },
    //     code: {
    //       code: "code",
    //       type: "text",
    //     },
    //   },
    //   async authorize(credentials): Promise<any> {
    //     try {
    //       const response = await axios.post(
    //         API.BASE_URL + API.LOGIN_PHONE,
    //         credentials,
    //         { headers: { "Content-Type": "application/json" } }
    //       );
    //       return response.data;
    //     } catch (error: any) {
    //       throw new Error(error?.response?.data?.message || "Login Failed.");
    //     }
    //   },
    // }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Check if user is active and has valid data
      if (user?.data?.status && user?.data?.id) {
        return true;
      }
      console.warn("Sign-in rejected: Invalid user data or inactive user");
      return false;
    },

    async jwt({ token, user, account, trigger, session }: any) {
      // Initial login - store user data in token
      if (user) {
        token.user = user.data;
        token.token = user.token;
        token.refreshToken = user.refreshToken;
        token.tokenExpiryMin = user.tokenExpiryMin;
      }

      // Session update - merge new data with existing token
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          ...session.user
        };
      }

      // Check if token needs refresh (only on server-side)
      if (token.token && typeof window === "undefined") {
        const isExpired = TokenRefreshUtil.isTokenExpired(token.token, 5); // 5 min buffer
        if (isExpired && token.refreshToken) {
          try {
            console.log("Token expired, attempting regeneration...");
            const refreshResult = await TokenRefreshUtil.refreshAccessToken();

            if (refreshResult) {
              // Get updated token from Redux store
              const { store } = await import("@/redux/store/store");
              const state = store.getState();
              const newToken = state.Auth?.token;
              const newRefreshToken = state.Auth?.refreshToken;

              if (newToken && newRefreshToken) {
                token.token = newToken;
                token.refreshToken = newRefreshToken;
                console.log("Token regenerated successfully in JWT callback");
              }
            }
          } catch (error) {
            console.error("Token regeneration failed in JWT callback:", error);
            // Token regeneration failed, user will need to login again
            token.error = "RefreshTokenExpired";
          }
        }
      }

      return token;
    },

    async session({ session, token, user }: any) {
      // Populate session with token data
      if (token) {
        session.token = token.token;
        session.refreshToken = token.refreshToken;
        session.role = token.user?.role;
        session.type = token.user?.type;
        session.user = {
          id: token.user?.id,
          name: token.user?.name,
          email: token.user?.email,
          image: token.user?.image,
          role: token.user?.role,
          status: token.user?.status,
          // Extended user properties
          mail_verify: token.user?.mail_verify,
          phone_verify: token.user?.phone_verify,
          first_name: token.user?.first_name,
          last_name: token.user?.last_name,
          wishlist: token.user?.wishlist,
          notifications: token.user?.notifications,
          store_id: token.user?.store_id,
          user_name: token.user?.user_name,
          phone: token.user?.phone,
          countrycode: token.user?.countrycode,
          type: token.user?.type
        };
      }

      return session;
    },
  },
};
