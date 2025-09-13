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
          const response = await germanStandardApi.login(loginData);

          // Validate response
          if (response?.status !== "Success" || response?.statusCode !== 2000) {
            throw new Error(response?.message || "Login failed");
          }

          // Parse user data from the response
          const userDataArray: UserData[] = JSON.parse(response.result.userData);
          if (!Array.isArray(userDataArray) || userDataArray.length === 0) {
            throw new Error("Invalid user data received");
          }

          const userData: UserData = userDataArray[0];
          const accessToken = response.result.accessToken.replace(/"/g, '');
          const refreshToken = response.result.refreshToken.replace(/"/g, '');

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
