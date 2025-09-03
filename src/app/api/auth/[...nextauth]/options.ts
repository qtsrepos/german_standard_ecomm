import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import API from "@/config/API";
import { germanStandardApi } from "@/services/germanStandardApi";

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: "/login",
    signOut: "/signout",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
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
      async authorize(credentials): Promise<any> {
        try {
          // Use the new German Standard API service
          const loginData = {
            loginName: credentials?.email || "", // Map email to loginName
            password: credentials?.password || "",
            entityId: parseInt(credentials?.entityId || "1"),
            channelId: parseInt(credentials?.channelId || "1"),
          };

          const response = await germanStandardApi.login(loginData);

          // Parse user data from the response
          const userData = JSON.parse(response.result.userData)[0];
          const accessToken = response.result.accessToken.replace(/"/g, ''); // Remove quotes
          const refreshToken = response.result.refreshToken.replace(/"/g, ''); // Remove quotes

          return {
            data: {
              id: userData.UserId,
              name: userData.LoginName,
              email: credentials?.email,
              role: userData.Role || "user", // Default to "user" if role not provided
              status: true,
            },
            token: accessToken,
            refreshToken: refreshToken,
            tokenExpiryMin: response.result.tokenExpiryMin,
          };
        } catch (error: any) {
          console.error("German Standard Login Error:", error);
          throw new Error(error.message || "Login Failed. Please check your credentials.");
        }
      },
    }),
    CredentialsProvider<any>({
      id: "google",
      name: "ID Token",
      credentials: {
        idToken: {
          idToken: "idToken",
          type: "text",
        },
      },
      async authorize(credentials): Promise<any> {
        try {
          const response = await axios.post(
            API.BASE_URL + API.LOGIN_GMAIL,
            credentials,
            { headers: { "Content-Type": "application/json" } }
          );
          return response.data;
        } catch (error: any) {
          throw new Error(error?.response?.data?.message || "Login Failed.");
        }
      },
    }),
    CredentialsProvider<any>({
      id: "phone",
      name: "Phone Login",
      credentials: {
        idToken: {
          idToken: "idToken",
          type: "text",
        },
        code: {
          code: "code",
          type: "text",
        },
      },
      async authorize(credentials): Promise<any> {
        try {
          const response = await axios.post(
            API.BASE_URL + API.LOGIN_PHONE,
            credentials,
            { headers: { "Content-Type": "application/json" } }
          );
          return response.data;
        } catch (error: any) {
          throw new Error(error?.response?.data?.message || "Login Failed.");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      //checking if the user is deactivated or not
      if (user?.data?.status) {
        return true;
      }
      return false;
    },

    async jwt({token, user, account, trigger, session }: any) {
      if (user) {
        token.user = user?.data;
        token.token = user?.token;
        token.refreshToken = user?.refreshToken;
        
        // token = user; // Save token to the JWT token
      }
      if (trigger === "update" && session) {
        // Update user data in the token
        token.user = {
          ...token.user,
          ...session.user
        };
      }
      return token;
    },

    async session({ session, token, user }: any) {
      if (token) {
        session.token = token?.token;
        session.refreshToken = token?.refreshToken;
        session.role = token?.user?.role;
        session.type = token?.user?.type;
        session.user = {
          name: token?.user?.name,
          email: token?.user?.email,
          image: token?.user?.image,
          mail_verify: token?.user?.mail_verify,
          phone_verify: token?.user?.phone_verify,
          status: token?.user?.status,
          first_name: token?.user?.first_name,
          last_name: token?.user?.last_name,
          wishlist: token?.user?.wishlist,
          notifications: token?.user?.notifications,
          store_id: token?.user?.store_id,
          user_name: token?.user?.username,
          phone: token?.user?.phone,
          countrycode: token?.user?.countrycode,
          type:token?.user?.type
        };
      }
      return session;
    },
  },
};
