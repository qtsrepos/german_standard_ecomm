import React from "react";
import "../style.scss";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdOutlineArrowForward } from "react-icons/md";
import CateogreyList from "@/components/header/categoryList";
import { useSelector } from "react-redux";
import { reduxCategoryItems, reduxSubcategoryItems } from "@/redux/slice/categorySlice";

function SubCategoryList(props: any) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Get categories from Redux instead of props
  const categories = useSelector(reduxCategoryItems);
  const subCategories = useSelector(reduxSubcategoryItems);

  console.log("SubCategoryList - Categories from Redux:", categories);
  console.log("SubCategoryList - SubCategories from Redux:", subCategories);

  const checkScroll = () => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scroll = (scrollOffset: number) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });

      // Use setTimeout to check scroll position after animation
      setTimeout(checkScroll, 300);
    }
  };

  useEffect(() => {
    checkScroll(); // Initial check
    window.addEventListener("resize", checkScroll);

    // Add scroll event listener to the container
    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
    }

    return () => {
      window.removeEventListener("resize", checkScroll);
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  // Only render if categories are available
  if (!categories || categories.length === 0) {
    return (
      <div className="container">
        <div className="text-center py-4">
          <div className="text-muted">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="position-relative">
        {/* Navigation arrows */}
        {showLeftArrow && (
          <button className="scroll-button left" onClick={() => scroll(-300)}>
            <MdArrowBack />
          </button>
        )}

        {/* CategoryList component will get data from Redux automatically */}
        <CateogreyList />

        {showRightArrow && (
          <button className="scroll-button right" onClick={() => scroll(300)}>
            <MdOutlineArrowForward />
          </button>
        )}
      </div>
    </div>
  );
}

export default SubCategoryList;
