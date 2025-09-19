
import { useEffect, useRef, useState } from "react";
import ProductItem from "../../../../components/productItem/page";
import { MdArrowBack, MdOutlineArrowBackIos, MdOutlineArrowForward, MdOutlineArrowForwardIos } from "react-icons/md";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { usePathname, useRouter } from "next/navigation";
import Slider from "react-slick";
import API from "@/config/API";
import { GET } from "@/util/apicall";
import NoData from "@/components/noData";
import { useSelector } from "react-redux";
import { reduxCategoryItems } from "@/redux/slice/categorySlice";
import { germanStandardApi } from "@/services/germanStandardApi";


function PopularItems(props: any) {
  const [Recent, setRecent] = useState([]);
  const [hasScrollBar, setHasScrollBar] = useState(false);
  const [rightButtonClicked, setRightButtonClicked] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("AllProducts");
  const [CategoryList, setcategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const navigation = useRouter();
  const ref: any = useRef(null);

  // Get categories from Redux
  const categories = useSelector(reduxCategoryItems);

  console.log("PopularItems - Categories from Redux:", categories);

  // Function to handle category filtering
  const handleCategoryFilter = async (categoryId: string, categoryName: string) => {
    try {
      setLoading(true);
      setActiveCategory(categoryName);

      console.log("Filtering products by category:", categoryId, categoryName);

      // Fetch products for the selected category
      const result = await germanStandardApi.getProducts(
        true, // refreshFlag
        1, // page
        10, // pageSize
        parseInt(categoryId) // category
      );

      // Transform products for display
      const transformedProducts = germanStandardApi.transformProductsForDisplay(
        result.products,
        categoryId
      );

      setcategoryList(transformedProducts);
      console.log("Filtered products loaded:", transformedProducts.length);
    } catch (err) {
      console.error("Error filtering products by category:", err);
      // Fallback to showing all products
      setcategoryList(props?.data || []);
    } finally {
      setLoading(false);
    }
  };

  // const getCategory = async () => {
  //   console.log("Home screen loaded");
  //   const url = API.CATEGORY_FEATURED;
  //   try {
  //     const categoryData: any = await GET(url, {});
  //     if (categoryData.status) {
  //       setFavCategories(categoryData.data);
  //     }
  //   } catch (err) {
  //     console.log("Failed to get banners:", err);
  //   }
  // };

  const scroll = (ratio: any) => {
    const currentScrollLeft = ref.current.scrollLeft;
    ref.current.scrollLeft += ratio;

    if (ratio > 0 && !rightButtonClicked) {
      setRightButtonClicked(true);
    }

    if (ratio < 0 && rightButtonClicked && ref.current.scrollLeft <= 0) {
      setRightButtonClicked(false);
    }
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    setIsSmallScreen(screenWidth < 992); // Consider tablet and mobile as small screens

    updateState();
  };

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [Recent]);

  function updateState() {
    const el = ref.current;
    if (el) {
      setHasScrollBar(el.scrollWidth > el.getBoundingClientRect().width + 50);
    }
  }

  const CustomPrevArrow = ({ onClick }: any) => (
    <div className="scroll-button left" onClick={onClick}>
      <MdOutlineArrowBackIos size={20} />
    </div>
  );

  const CustomNextArrow = ({ onClick }: any) => (
    <div className="scroll-button right" onClick={onClick}>
      <MdOutlineArrowForwardIos size={20} />
    </div>
  );

  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 500,
    dots: true,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1440,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3, slidesToScroll: 3, },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2, slidesToScroll: 2, },
      },
    ],
  };
  useEffect(() => {
    setcategoryList(props?.data)
    // getCategory()
  }, [])


  return (
    <div className="container">
      <div className="Horizontal-row">
       <div className="head-div">
  <div className="head-row">
    <div className="Horizontal-Heading1 mt-3">{props?.title}</div>
    <div className={`head-div-btn1 ${pathname.includes('/search')?'d-none':'d-block'}`}>
      <button
        className={`head-btn mx-1 ${activeCategory === "AllProducts" ? "active" : ""}`}
        onClick={() => {
          setActiveCategory("AllProducts");
          setcategoryList(props?.data || []);
        }}
      >
        All Products
      </button>

      {categories?.slice(0, 5).map((item: any, index: number) => (
        <button
          key={index}
          value={item.name}
          className={`head-btn mx-1 ${activeCategory === item.name ? "active" : ""} `}
          onClick={() => {
            handleCategoryFilter(item._id || item.id, item.name);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  </div>
</div>
        {/* <div className="Horizontal-row"> */}
        {/* <div
            className="Horizontal-viewButton"
            onClick={() =>
              navigation.push(
                `/products/view?${props?.type ? `type=${props?.type}` : ""}`
              )
            }
          >
            See More
          </div> */}
        {/* </div> */}
      </div>
      <div style={{ margin: 5 }} />


      <div className="category-scroll-wrapper mt-4">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Filtering products...</span>
            </div>
            <span className="ms-3">Filtering products...</span>
          </div>
        ) : CategoryList?.length === 0 ? (
          <NoData header={"No items Found"} />
        ) : (
          <Slider {...settings} className="slide">
            {Array.isArray(CategoryList) &&
              CategoryList?.map((prod: any, index: number) => (
                <div
                  className="px-1 mb-3 card-div"
                  style={{ width: "50%" }}
                  key={index}
                >
                  <ProductItem item={prod} />
                </div>
              ))}
          </Slider>
        )}
      </div>



      {/* Main content area - switches between vertical/horizontal based on screen size */}
      {/* <div className="Horizontal-Pscroll position-relative">
        {isSmallScreen ? (
          // Mobile and Tablet View - Vertical scrolling with 2 cards per row
          <Row 
            className="row mx-0 gx-2" 
            // style={{
            //   flexWrap: "wrap",
            //   overflowY: "auto",
            //   maxHeight: "calc(100vh - 200px)",
            //   width: "100%"
            // }}
          >
            <Slider {...settings}>
            {Array.isArray(props?.data)
              ? props?.data?.map((prod: any, index: number) => (
                <Col 
                  className="px-1 mb-3" 
                  style={{ width: "50%" }}
                  key={index}
                >
                  <ProductItem item={prod} />
                </Col>
              ))
              : null}
              </Slider>
          </Row>
        ) : (
          // Desktop View - Original horizontal scrolling layout
          <>
            <Row xs={2} md={3} lg={4} xl={5}
              ref={ref} 
            > 
              {Array.isArray(props?.data)
                ? props?.data?.map((prod: any, index: number) => (
                    <Col  className=" p-2 " key={index}>
                      <ProductItem item={prod} />
                    </Col>
                  ))
                : null}
            </Row>
            {/* {hasScrollBar ? (
              <>
                {rightButtonClicked && (
                  <button
                    className="Horizontal-btn1 position-absolute slider-btn-left"
                    onClick={() => scroll(-800)}
                  >
                    <MdArrowBack />
                  </button>
                )}
                <button
                  className="Horizontal-btn2 slider-btn-right position-absolute"
                  onClick={() => scroll(800)}
                >
                  <MdOutlineArrowForward />
                </button>
              </> 
            ) : null}*/}
      {/* </>
        )}
      </div> */}
    </div>
  );
}

export default PopularItems;