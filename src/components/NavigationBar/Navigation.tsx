"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage } from "react-icons/fi";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string;
}

interface CartState {
  items: CartItem[];
}

interface RootState {
  Cart: CartState;
}

const MobileNavigation: React.FC = () => {
  const [isCartAnimating, setIsCartAnimating] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session }: any = useSession();
  
  const cart = useSelector((state: RootState) => state.Cart);
  const LocalCart = useSelector((state: any) => state.LocalCart)
  const cartItems = session?.token ? cart.items : LocalCart.items;
//   const wishlistCount = useSelector((state: any) => state.Favorites.count);
//   console.log("wishlistCount", wishlistCount);

  const isActive = (path: string) => pathname === path;

  const styles: { [key: string]: React.CSSProperties } = {
    navigationContainer: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
      boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
      zIndex: 50,
    },
    navigationWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
    },
    navItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      cursor: "pointer",
    },
    icon: {
      fontSize: "24px",
      color: "#333",
    },
    iconLabel: {
      fontSize: "10px",
      marginTop: "4px",
      color: "#333",
    },
    cartIconWrapper: {
      position: "relative",
    },
    cartBadge: {
      position: "absolute",
      top: "-9px",
      right: "-11px",
      backgroundColor: "#ff4d4f",
      color: "white",
      borderRadius: "50%",
      width: "17px",
      height: "17px",
      display: "flex",
      //   alignItems: 'center',
      justifyContent: "center",
      fontSize: "10px",
    },
    wishlist: {
      position: "absolute",
      top: "-9px",
      right: "1px",
      backgroundColor: "#ff4d4f",
      color: "white",
      borderRadius: "50%",
      width: "17px",
      height: "17px",
      display: "flex",
      //   alignItems: 'center',
      justifyContent: "center",
      fontSize: "10px",
    },
  };
  useEffect(() => {
    if (cart.items.length > 0) {
      setIsCartAnimating(true);

      const timer = setTimeout(() => setIsCartAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cart.items.length]);
  return (
    <div style={styles.navigationContainer}>
      <div style={styles.navigationWrapper}>
        {/* Home */}
        <div style={styles.navItem} onClick={() => router.push("/")}>
          <HomeOutlined
            style={{
              ...styles.icon,
              color: isActive("/") ? "#52c41a" : "#333",
            }}
          />
          <span
            style={{
              ...styles.iconLabel,
              color: isActive("/") ? "#52c41a" : "#333",
            }}
          >
            Home
          </span>
        </div>

        {/* Categories */}
        <div style={styles.navItem} onClick={() => router.push("/explore-all")}>
          <AppstoreOutlined
            style={{
              ...styles.icon,
              color: isActive("/explore-all") ? "#52c41a" : "#333",
            }}
          />
          <span
            style={{
              ...styles.iconLabel,
              color: isActive("/explore-all") ? "#52c41a" : "#333",
            }}
          >
            Categories
          </span>
        </div>

        <div
          style={styles.navItem}
          onClick={() => router.push("/user/favorites")}
        >
          <HeartOutlined
            style={{
              ...styles.icon,
              color: isActive("/user/favorites") ? "#52c41a" : "#333",
            }}
          />
          {/* {wishlistCount > 0 && (
            <AnimatePresence>
              <motion.span
                style={styles.wishlist} 
                initial={{ scale: 1 }}
                animate={isCartAnimating ? { scale: [1, 2, 1] } : {}}
              >
              </motion.span>
            </AnimatePresence>
           )}  */}

          <span
            style={{
              ...styles.iconLabel,
              color: isActive("/user/favorites") ? "#52c41a" : "#333",
            }}
          >
            Favourites
          </span>
        </div>
        {/* Account */}
        <div
          style={styles.navItem}
          onClick={() => {
            if (session?.token) {
              router.push("/user/profile");
            } else {
              router.push("/login");
            }
          }}
        >
          <UserAddOutlined
            style={{
              ...styles.icon,
              color: isActive("/user/profile") ? "#52c41a" : "#333",
            }}
          />
          <span
            style={{
              ...styles.iconLabel,
              color: isActive("/user/profile") ? "#52c41a" : "#333",
            }}
          >
            Account
          </span>
        </div>

        {/* Cart */}
        <div style={styles.navItem} onClick={() => router.push("/cart")}>
          <div style={styles.cartIconWrapper}>
            <ShoppingCartOutlined
              style={{
                ...styles.icon,
                color: isActive("/cart") ? "#52c41a" : "#333",
              }}
            />
            {/* Cart Badge Animation */}
            {cartItems.length > 0 && (
              <AnimatePresence>
                <motion.span
                  key={cartItems.length}
                  style={styles.cartBadge}
                  initial={{ scale: 1 }}
                  animate={isCartAnimating ? { scale: [1, 2, 1] } : {}}
                >
                  {cartItems.length}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
          <span
            style={{
              ...styles.iconLabel,
              color: isActive("/cart") ? "#52c41a" : "#333",
            }}
          >
            Cart
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
