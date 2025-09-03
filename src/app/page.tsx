import { Metadata } from "next";
import CONFIG from "@/config/configuration";

// import Home from "./(screens)/home/page";
import Login from "./(auth)/login/page";


export const metadata: Metadata = {
  title: CONFIG.NAME,
  description: "German Standard Group  ecommerce home page",
  openGraph: {
    title: CONFIG.NAME,
    description: "start shopping with German Standard Group ..",
    type: "website",
    locale: "en_US",
    siteName: CONFIG.NAME,
  },
};

export default async function page() {
  return <Login />;
}
