import type { Metadata } from "next";
import "@/styles/App.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import Footer from "@/components/footer";
import Header from "@/components/header";
import AuthProvider from "@/util/authProvider";
import { StoreProvider } from "@/util/storeProvider";
import ReactQueryProvider from "@/util/queryProvider";
import CONFIG from "@/config/configuration";
import MobileIcons from "./mobileicons";
import BottomTab from "@/components/bottomTab";

export const metadata: Metadata = {
  title: CONFIG.NAME,
  description: `Shop for anything with ${CONFIG.NAME}`,
};

const theme = {
  token: {
    fontFamily: "DMSans-Regular",
    colorPrimary: CONFIG.COLOR,
    lineWidth: 1,
    controlOutlineWidth: 0,
    borderRadius: 6,
  },
  components: {
    Button: {
      fontSize: 14,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EK6V7P6NKR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EK6V7P6NKR');
              gtag('config', 'AW-11168946770');
            `,
          }}
        />
        <meta name="google-site-verification" content="BOD9AxLW76nB9a-0zZOoXbBGJItd5s9Sb3PGxqIsscU" />
      </head>
      <body>
        <AuthProvider>
          <ReactQueryProvider>
            <AntdRegistry>
              <ConfigProvider theme={theme}>
                <StoreProvider>
                  <Header />
                  {children}
                  <MobileIcons />
                  <BottomTab />
                  <Footer />
                </StoreProvider>
              </ConfigProvider>
            </AntdRegistry>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}