// First, create a new file called ClientLayout.tsx
// src/components/ClientLayout.tsx
'use client'

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileIcons from "../mobileicons";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const isLoginPage = pathname === "/login" || pathname === "/signin";
  
  return (
    <>
      {/* {!isLoginPage && <Header />} */}
      <Header />
      {children}
      <MobileIcons />
      <Footer />
    </>
  );
}