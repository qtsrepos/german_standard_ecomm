import "next-auth";

declare module "next-auth" {
  interface Session {
    token?: string;
    refreshToken?: string;
    role?: string;
    type?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mail_verify?: boolean;
      phone_verify?: boolean;
      status?: string;
      first_name?: string;
      last_name?: string;
      wishlist?: any[];
      notifications?: any[];
      store_id?: string;
      user_name?: string;
      phone?: string;
      countrycode?: string;
      type?: string;
    };
  }
} 