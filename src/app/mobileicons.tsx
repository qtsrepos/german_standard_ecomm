'use client'
import MobileNavigation from '@/components/NavigationBar/Navigation';
import React, { useEffect, useState } from 'react'

const MobileIcons = () => {
    const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const updateScreenSize = () => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  };

  window.addEventListener("resize", updateScreenSize);

  updateScreenSize();

  return () => window.removeEventListener("resize", updateScreenSize);
}, []);
  return (
    <>
      {/* {isMobile ? <MobileNavigation /> : null} */}
    </>
  )
}

export default MobileIcons
